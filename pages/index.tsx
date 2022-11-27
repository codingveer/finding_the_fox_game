import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useLocalStorage from "./../components/utility/useStorage/index";
import fetchData from '../components/utility/fetchData';
import { url } from "inspector";
const Home: NextPage = ({ urls }) => {
  // Similar to useState but first args is key to the value in local storage.
  const [name, setName] = useLocalStorage("name", "veeresh");
  console.log(urls, 'urls')
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h3>Click the Fox! game</h3>
          </div>
          <div>
            <label htmlFor="name">
              Name:
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <Link href={'/startgame'}><button>Play !</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const urls = await fetchData()
  //const urls = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      urls,
    },
  }
}
export default Home;
