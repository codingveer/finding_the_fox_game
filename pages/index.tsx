import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useLocalStorage from "./../components/utility/useStorage/index";
import { cacheImages } from '../components/utility/prerender';
import {fetchData} from '../components/utility/fetchData';

import { useEffect, useState } from "react";
const Home: NextPage = (props: any) => {
  // Similar to useState but first args is key to the value in local storage.
  const [name, setName] = useLocalStorage("name", " ");
  const [player, setPlayer]=useState(true);
  
  useEffect(() => {
    window.localStorage.setItem("name", " ");
    cacheImages(props.data)
  }, []);
  const editPlayer  = () =>{
    setPlayer(true)
  }
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h3>Click the Fox! game</h3>
          </div>
          {player ? <div>
            <label htmlFor="name">
              Name:
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>setName(e.target.value)}
                onBlur={() =>setPlayer(false)}
              />
            </label>
          </div>
          :<div onClick={editPlayer}>Hello {name}</div>
          }
          {player ?<div>
            <button >Play !</button>
          </div>
          :<div>
            <Link href={{
              pathname: '/startgame',
              query: { ...props.data }
            }}>
              <button style={{background:`${player ? '': 'yellow'}`}}>Play !</button>
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
