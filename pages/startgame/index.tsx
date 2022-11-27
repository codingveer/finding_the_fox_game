import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useLocalStorage from "./../../components/utility/useStorage/";
import { after } from "underscore";
import foxLoading from './../../images/fox_loading.gif';
import fetchData from './../../components/utility/fetchData';

function ImagesComp() {
  const [finalScore, setFinalScore] = useLocalStorage('finalscore', '0');
  const [loading, setLoading] = useState(true);
  const [imageToRender, setimageToRender] = useState<string[]>([]);
  let imageUrls: string | null[] = [];
  let initialRender = useRef(true);


  useEffect(() => {
    if (initialRender.current) {
      fetchData();
    };

    return () => {
      initialRender.current = false;
    };
  }, []);


  const [display, setDisplay] = useState("hidden");
  const [displayBlock, setDisplayBlock] = useState("block");
  const score = useRef(0);
  const onComplete = after(imageToRender.length, () => {
    setDisplay("visible");
    setDisplayBlock("none")
    console.log("loaded");
    setLoading(false);
  });
  const onloadImage = (index, url) => {
    const clickedFox = url.includes("fox");
    if (clickedFox) {
      //alert('Found Fox');
      let incrementScore = score.current++;
      setFinalScore(incrementScore.toString())
      //  alert(score.current);
    } else {
      let decrementScore = score.current++;
      setFinalScore(decrementScore.toString());
      //alert(score.current);
      //setScore(score => score--)
    }
    //alert(index);
    setDisplay("hidden");
    setDisplayBlock("block")
    setLoading(true);
    //console.log(index, "index");
    fetchData();
  };
  const router = useRouter()
  useEffect(() => {
    const timer = setInterval(() => {
      router.push('/scoreboard');
    }, 30000);
    return () => clearInterval(timer)
  }, []);
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
          Score:{score.current} Time Remaing

          <>
            <div style={{ display: displayBlock, position: "absolute", top: "25%", left: "40%" }}>
              <Image src={foxLoading} width="300" height="300" />
            </div>

            <div style={{ visibility: display, display: 'grid', gridTemplateColumns: '150px 150px 150px' }}>
              {imageToRender.map((url, index) => (
                <div className="grid-item" key={url}>
                  <Image
                    src={url}
                    onloadImage={() => <div><Image src={foxLoading} width="300" height="300" /></div>}
                    //onLoad={() => onLoad(index)}
                    onLoadingComplete={onComplete}
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

export default ImagesComp;