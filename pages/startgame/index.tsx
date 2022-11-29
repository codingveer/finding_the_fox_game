import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "./../../components/utility/useStorage/";
import { after } from "underscore";
import foxLoading from "./../../images/fox_loading.gif";
import { fetchData } from "./../../components/utility/fetchData";
import { cacheImages } from "./../../components/utility/prerender";
import UserStats from '../../components/UserStats';

type IProps = {data: string[]};
let imageStore: any = [];
let timeInterval: ReturnType<typeof setInterval>;
let timeIntervalFetch: ReturnType<typeof setInterval>;

function ImagesComp(props:IProps) {
  const [showAllImagesOnBoard, setShowAllImagesOnBoard] = useState(false);
  const score = useRef(0);
  const [imageToRender, setImageToRender] = useState<string[]>([]);
  const router = useRouter();
  const queryData: any = router.query;
  let initialRender = useRef(true);
  const [finalScore, setFinalScore]= useLocalStorage('finalScore','0');

  const refetchData = async() => {
    let getData:string[] = await fetchData() || [];
      imageStore = [...imageStore, ...getData];
      cacheImages(getData);
    }
  const updateReFetchedImage = ()=>{
    let geNexBatchImages =imageStore.splice(0, 9);
    setImageToRender(geNexBatchImages);  
  }
  const updateImageStore = (newImagesUrlFetched:string[])=>{
    imageStore = [...imageStore, ...newImagesUrlFetched];
  }
  const startGameInit = () => {
    if (Object.keys(queryData).length) {
       let ImageUrlFromQuery:string[]= Object.values(queryData)
        updateImageStore(ImageUrlFromQuery);
        updateReFetchedImage()
        cacheImages(ImageUrlFromQuery);
    } 
    if(props.data) {
      updateImageStore(props.data);
      updateReFetchedImage()
      cacheImages(props.data);   
      refetchData(); 
    }
    if(!imageStore.length){
      refetchData();
    }
    //setImageToRender(imageStore.splice(0,9))
    
  };

  const onComplete = after(imageToRender.length, (index:number) => {
    setShowAllImagesOnBoard(true);
  });
 
  
  useEffect(() => {
    if (initialRender.current) {
      startGameInit();    
    }
    return () => {
      initialRender.current = false;
    };
  }, []);

  useEffect(()=>{
    timeInterval = setInterval(() => {
      router.push("/scoreboard");
    }, 30000);
    return () => {
      clearInterval(timeInterval);
    }
  },[]);
  useEffect(()=>{
    timeIntervalFetch = setInterval(() => {
      refetchData()
    }, 300);
    return () => {
      clearInterval(timeIntervalFetch);
    }
  },[]);
  
  useEffect(()=>{
    console.log(imageStore.length)
    if(imageStore.length > 600){
      clearInterval(timeIntervalFetch);
    }
  },[imageToRender])

  const onClickAnyImage = async (index: number, url: string) => {
    setShowAllImagesOnBoard(false)
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
  }
  
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div>
          <div>
          <div>Score:{score.current}</div>
              <UserStats/>
          </div>
          <>
            <div
              style={{
                display: showAllImagesOnBoard ? "none" : "block",
                position: "absolute",
                top: "25%",
                left: "40%",
              }}
            >
              <Image src={foxLoading} width="300" height="300" alt="loading" />
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
                    onLoad={(e)=>onComplete(e)}
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
export async function getServerSideProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const data = (await fetchData()) || [];
  //const urls = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data,
    },
    //revalidate: 1
  };
}
export default ImagesComp;
