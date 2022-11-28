import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "./../../components/utility/useStorage/";
import { after } from "underscore";
import foxLoading from './../../images/fox_loading.gif';
import { fetchData, shuffleArray } from './../../components/utility/fetchData';
import { cacheImages } from './../../components/utility/prerender';
let imageStore: any = [];
function ImagesComp(props) {
  const [finalScore, setFinalScore] = useLocalStorage('finalscore', '0');
  const [loading, setLoading] = useState(true);
  const [imageToRender, setimageToRender] = useState<string[]>([]);
  let imageUrls: string | string[] | undefined = [];
  let initialRender = useRef(true);
  const router = useRouter();
  const queryData: any = router.query;
  const updateImageStore = async () => {
    const data: any = await fetchData();
    const shuffledata = shuffleArray(data);
    imageStore = [...imageStore, ...shuffledata];
    cacheImages(data);
  }
  useEffect(() => {
    console.log(Object.values(queryData), '------data----');
    if (initialRender.current) {
      if (Object.keys(queryData).length) {
       // alert('here1')
        console.log('--where-is---this--data----');
        const shuffledata = shuffleArray(Object.values(queryData));
        setimageToRender(shuffledata);
        cacheImages(shuffledata);
      } else if (props.data) {
        //console.log(props.data);
        const shuffledata = shuffleArray(props.data)
        imageStore = [...imageStore, ...shuffledata];
        setimageToRender(shuffledata);
        cacheImages(props.data)
        updateImageStore();
      } 
    };

    return () => {
      initialRender.current = false;
    };
  }, []);


  const [display, setDisplay] = useState(false);
  const [displayBlock, setDisplayBlock] = useState("block");
  const score = useRef(0);
  const onComplete = after(imageToRender.length, () => {
    setDisplay(true);
    setDisplayBlock("none")
    //console.log("loaded");
    setLoading(false);
  });
  const onloadImage = async (index: number, url: string) => {
    //const getData = await fetchData() || [];
    setimageToRender(shuffleArray(imageStore.splice(0, 9)));
    const clickedFox = url.includes("fox");
    if (clickedFox) {
      let incrementScore = score.current++;
      setFinalScore(incrementScore.toString())
    } else {
      let decrementScore = score.current++;
      setFinalScore(decrementScore.toString());
    }
    //alert(index);
    setDisplay(false);
    setDisplayBlock("block")
    setLoading(true);
    //console.log(index, "index");

    let getData = await fetchData() || [];
    getData = shuffleArray(getData);
    imageStore = [...imageStore, ...getData];
    console.log(imageStore, 'image store after click')
    cacheImages(getData);
  };
  const [countDownTimer, setCountDownTimer] = useState(30);
  useEffect(() => {
    const timer = setInterval(() => {
      router.push('/scoreboard');
    }, 30000);
    return () => clearInterval(timer)
  }, []);
    useEffect(() => {
      let countDownTimerId: any = '';
      if (countDownTimer > 0) {
        clearTimeout(countDownTimerId);
      }
        countDownTimerId = setTimeout(() => {
          setCountDownTimer((prev) => prev - 1)
        }, 30000);
      
    return () => clearTimeout(countDownTimerId)
  }, [])
  // const onLoad = (index) => {
  //   if (index === urls.length - 1) {
  //     //alert('2')
  //     setLoading(false);
  //     setDisplay("visible")
  //     console.log("loaded");
  //   }
  // };
  // if (loading) {
  //   return (
  //     <div><Image src={foxLoading} width="300" height="300" /></div>
  //   )
  // } else {

  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div>
          <div>Score:{score.current}</div>
          <div>Time Remaing: {countDownTimer}</div>
          <>
            <div style={{ display: displayBlock, position: "absolute", top: "25%", left: "40%" }}>
              <Image src={foxLoading} width="300" height="300" alt="loading" />
            </div>
            <div style={{ visibility: display ? 'visible' : 'hidden', display: 'grid', gridTemplateColumns: '150px 150px 150px' }}>
              {imageToRender.map((url: any, index: number) => (
                <div className="grid-item" key={url}>
                  <Image
                    src={url}
                    onLoad={() => onComplete()}
                    //onLoad={() => onLoad(index)}
                    alt={''}
                    //  onLoadingComplete={onComplete}
                    //onError={onComplete}
                    width="150"
                    height="150"
                    onClick={() => onloadImage(index, url)}
                  />
                </div>
              ))}
            </div></>

        </div>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const data = await fetchData() || [];
  //const urls = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data,
    },
    //revalidate: 1
  }

}
export default ImagesComp;