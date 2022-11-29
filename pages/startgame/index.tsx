import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "./../../components/utility/useStorage/";
import { after } from "underscore";
import { fetchData } from "./../../components/utility/fetchData";
import { cacheImages } from "../../components/utility/prerender";
import UserStats from "../../components/UserStats";
import fox_loading from '../../public/static/images/fox_loading.gif'
type IProps = { data: string[] };
let imageStore: any = [];
let timeInterval: ReturnType<typeof setInterval>;
let timeIntervalFetch: ReturnType<typeof setInterval>;

function ImagesComp(props: IProps) {
  const [showAllImagesOnBoard, setShowAllImagesOnBoard] = useState(false);
  const score = useRef(0);
  const [imageToRender, setImageToRender] = useState<string[]>([]);
  const router = useRouter();
  const queryData: any = router.query;
  let initialRender = useRef(true);
  const [finalScore, setFinalScore] = useLocalStorage("finalScore", "0");

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
  /*
  1. We’re importing the updateImageStore function from the imageStore.ts file.
  2. We’re creating a new variable called newImagesUrlFetched and assigning it to the result of the imageUrlFetched function.
  3. We’re using the spread operator to add the newImagesUrlFetched array to the imageStore array.
  4. We’re exporting the updateImageStore function.
  */
  const updateImageStore = (newImagesUrlFetched: string[]) => {
    imageStore = [...imageStore, ...newImagesUrlFetched];
  };

  /*
  It sets the imageStore to the data that is passed in from the props.
  */
  const startGameInit = () => {
    if (Object.keys(queryData).length) {
      let ImageUrlFromQuery: string[] = Object.values(queryData);
      updateImageStore(ImageUrlFromQuery);
      updateReFetchedImage();
      cacheImages(ImageUrlFromQuery);
    }
    if (props.data) {
      updateImageStore(props.data);
      updateReFetchedImage();
      cacheImages(props.data);
      refetchData();
    }
    if (!imageStore.length) {
      refetchData();
    }
    //setImageToRender(imageStore.splice(0,9))
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
  1. We’re using the useEffect hook to set an interval of 30 seconds.
  2. We’re using the useEffect hook to clear the interval when the component unmounts.
  3. We’re using the useEffect hook to set the router to redirect to the scoreboard page after 30 seconds.
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
  1. We’re using the useEffect hook to set an interval that will call the refetchData function every 300 milliseconds.
  2. We’re using the useEffect hook to clear the interval when the component unmounts.
  */
  useEffect(() => {
    timeIntervalFetch = setInterval(() => {
      refetchData();
    }, 1000);
    return () => {
      clearInterval(timeIntervalFetch);
    };
  }, []);

  /*
  1. It’s using the useEffect hook to call the fetchImages function every time the imageToRender state changes.
  2. It’s using the useEffect hook to clear the timeIntervalFetch if imageStore length is more than 600.
  */
  useEffect(() => {
    if (imageStore.length > 600) {
      clearInterval(timeIntervalFetch);
    }
  }, [imageToRender]);

  /*
  1. We’re setting the showAllImagesOnBoard to false.
  2. We’re setting the clickedFox to true if the url contains the word “fox”.
  3. We’re setting the incrementScore to the current score + 1 if the clickedFox is true.
  4. We’re setting the decrementScore to the current score - 1 if the clickedFox is false.
  5. We’re setting the finalScore to the incrementScore or decrementScore.
  6. We’re updating the reFetchedImage to the current image.
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
    //refetchData()
    updateReFetchedImage();
  };

  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr', paddingBottom:'10px'}}>
            <div>Score:{score.current}</div>
            <UserStats />
          </div>
          <>
            <div
              style={{
                display: showAllImagesOnBoard ? "none" : "block",
                position: "absolute",
                top: "35%",
                left: "45%",
              }}
            >
              <Image src={fox_loading} width="200" height="200" alt="loading" />
            </div>
            <div
              style={{
                visibility: showAllImagesOnBoard ? "visible" : "hidden",
                display: "grid",
                gridTemplateColumns: "150px 150px 150px",
              }}
            >
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
  // Call an external API endpoint to get image urls data.
  const data = (await fetchData()) || [];
  //const urls = await res.json()

  // By returning { props: { data } }, the ImagesComp component
  // will receive `data` as a prop at build time
  return {
    props: {
      data,
    },
    //revalidate: 1
  };
}
export default ImagesComp;
