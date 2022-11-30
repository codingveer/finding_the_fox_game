import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "../../components/hooks/useStorage";
import { after } from "underscore";
import { fetchData } from "../../utils/fetchData";
import { cacheImages } from "../../components/prerender";
import UserStats from "../../components/UserStats";
import fox_loading from "../../public/static/images/fox_loading.gif";
import styles from '../../styles/StartGame.module.css'

type url ={
  message?:string,
  image?:string,
  url?:string
}
type IProps = { data: string[] };
let imageStore:string[] = [];

let timeInterval: ReturnType<typeof setInterval>;
let timeIntervalFetch: ReturnType<typeof setInterval>;

function ImagesComp(props: IProps) {
  const [showAllImagesOnBoard, setShowAllImagesOnBoard] = useState(false);
  const score = useRef(0);
  const [imageToRender, setImageToRender] = useState<string[]>([]);
  const router = useRouter();
  const queryData = router.query;
  let initialRender = useRef(true);
  const [finalScore, setFinalScore] = useLocalStorage("finalScore", "0");
  const ImageUrlFromQuery:any = Object.values(queryData);

  /*
  1. It’s fetching the data from the API.
  2. It’s storing the data in the imageStore.
  3. It’s caching the data in the cache.
  */
  const refetchData = async () => {
    let getData: string[] = (await fetchData()) || [];
    imageStore = [...imageStore, ...getData];
    cacheImages(getData);
  };
  /*
  It fetches the next batch of images from the imageStore and sets the imageToRender to the next batch of images.
  */
  const updateReFetchedImage = () => {
    let geNexBatchImages = imageStore.splice(0, 9);
    setImageToRender(geNexBatchImages);
  };
 
  const updateImageStore = (newImagesUrlFetched: string[]) => {
    imageStore = [...imageStore, ...newImagesUrlFetched];
  };

  /*
  It sets the imageStore to the data that is passed in from the props.
  */
  const startGameInit = () => {
    if (ImageUrlFromQuery?.length) {
      updateImageStore(ImageUrlFromQuery);
      cacheImages(ImageUrlFromQuery);
    }
    if (props?.data) {
      updateImageStore(props.data);
      cacheImages(props.data);
    }
    if (!props.data && !ImageUrlFromQuery.length) {
      refetchData();
    }
    updateReFetchedImage();
  };

  /*
  1. It’s using the after function to call the onComplete function after the imageToRender array has been fully rendered.
  2. The after function takes two arguments: the number of items to wait for and a callback function.
  3. The callback function is called after the number of items specified in the first argument have been rendered.
  4. In this case, the callback function is called after all the images have been rendered.
  5. The callback function sets the showAllImagesOnBoard variable to true.
  6. This will make the images visible on the board.
  */
  const onComplete = after(imageToRender.length, (index: number) => {
    setShowAllImagesOnBoard(true);
  });

  /*
  1. It’s using the useEffect hook to run the startGameInit function only once.
   */
  useEffect(() => {
    if (initialRender.current) {
      startGameInit();
    }
    return () => {
      initialRender.current = false;
    };
  }, []);

  /*
     set an interval of 30 seconds and clear the interval when the component unmounts 
     and redirect to the scoreboard page.
  */
  useEffect(() => {
    timeInterval = setInterval(() => {
      router.push("/scoreboard");
    }, 30000);
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  /*
    Set an interval that will call the refetchData function every 500 milliseconds 
    so that we can prefetch images needs to be served.
  */
  useEffect(() => {
    timeIntervalFetch = setInterval(() => {
      refetchData();
    }, 500);
    return () => {
      clearInterval(timeIntervalFetch);
    };
  }, []);

  /*
     clear the timeIntervalFetch if cache imageStore length is more than 1000.
  */
  useEffect(() => {
    if (imageStore.length > 1000) {
      clearInterval(timeIntervalFetch);
    }
  }, [imageToRender]);

  /*
     We’re updating url contains the word “fox” to increase current score or else decrease score
     also reFetchedImage if cached image is empty.
  */
  const onClickAnyImage = async (index: number, url: string) => {
    setShowAllImagesOnBoard(false);
    const clickedFox = url.includes("fox");
    if (clickedFox) {
      let incrementScore = score.current++;
      setFinalScore(incrementScore.toString());
    } else {
      let decrementScore = score.current--;
      setFinalScore(decrementScore.toString());
    }
    if (imageStore.length <= 9) {
      refetchData();
    }
    updateReFetchedImage();
  };

  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div>
          <div className={`${styles.userStats}`}>
            <div>Score:{score.current}</div>
            <UserStats />
          </div>
          <>
            <div
              className={`${styles.loadingFox} ${showAllImagesOnBoard ? styles.none : styles.block}`}>
              <Image
                src={fox_loading}
                unoptimized={true}
                width="200"
                height="200"
                alt="loading"
              />
            </div>
            <div className={`${styles.gameBoard} ${showAllImagesOnBoard ? styles.visible : styles.hidden}`}>
              {imageToRender.map((url: any, index: number) => (
                <div className="grid-item" key={url}>
                  <Image
                    src={url}
                    onLoad={(e) => onComplete(e)}
                    alt={""}
                    width="150"
                    height="150"
                    onClick={() => onClickAnyImage(index, url)}
                  />
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const data = (await fetchData()) || [];
  return {
    props: {
      data,
    },
  };
}
export default ImagesComp;
