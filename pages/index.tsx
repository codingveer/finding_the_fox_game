import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useLocalStorage from "./../components/utility/useStorage/index";
import { cacheImages } from '../components/utility/prerender';
import {fetchData} from '../components/utility/fetchData';

import { useEffect, useState } from "react";
const Home: NextPage = (props: any) => {
  // Similar to useState but first args is key to the value in local storage.
  const [name, setName] = useLocalStorage('name','');
  const [editPlayerNameInput, setEditPlayerNameInput]=useState(true);
  
  /*
  1. It’s using the cacheImages function to cache the images.
  2. It’s using the useEffect hook to run the cacheImages function when the component is mounted.
  3. It’s using the setEditPlayerNameInput function to set the editPlayerNameInput to true.
  4. It’s using the editPlayer function to set the editPlayerNameInput to false.
  */
  useEffect(() => {
    setName("");
    
  }, []);

  /*
  1. It’s using the cacheImages function to cache the images.
  2. It’s using the useEffect hook to run the cacheImages function when the data changes.
  */
  useEffect(()=>{
    cacheImages(props.data)
  },[props.data]);

  
  const editPlayer  = () =>{
    setEditPlayerNameInput(true)
  }
  const handleBlur = (e) =>{
    console.log(e.target.value,'name');
    (name!=="" ) ?setEditPlayerNameInput(false) :setEditPlayerNameInput(true)
  }
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h2>Click the Fox! game</h2>
          </div>
          {editPlayerNameInput ? <div>
            <label htmlFor="name">
              Name:
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>setName(e.target.value)}
                onBlur={handleBlur}
              />
            </label>
          </div>
          :<div className={`${styles.editPlayerNameInputName}`} onClick={editPlayer}>Hello {name}</div>
          }
          {editPlayerNameInput ?<div>
            <button style={{background:'',border:'1px solid #60af56', color:'#333'}}>Play !</button>
          </div>
          :<div>
            <Link href={{
              pathname: '/startgame',
              query: { ...props.data }
            }}
            as={`/startgame`}>
              <button style={{background:`${editPlayerNameInput ? '': '#60af56'}`}}>Play !</button>
            </Link>
          </div>}
        </div>
      </div>
    </div>
  );
};

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
export default Home;
