import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import useLocalStorage from "../../components/hooks/useStorage/";
import { cacheImages } from "../../components/prerender";
import { fetchData } from "../../utils/fetchData";


const Home: NextPage = (props: any) => {
  // Similar to useState but first args is key to the value in local storage.
  const [name, setName] = useLocalStorage("name", "");
  const [editPlayerNameInput, setEditPlayerNameInput] = useState(true);

  /*
    Run the cacheImages function and clear player name when the component is mounted.
  */
  useEffect(() => {
    if (props?.data) {
      cacheImages(props.data);
    }
    setName("");
  }, []);

  /*
  1. We’re setting the editPlayerNameInput state to false if the name is not empty and
      set to true if the name is empty.
  */
  const handleBlur = () => {
    name !== "" ? setEditPlayerNameInput(false) : setEditPlayerNameInput(true);
  };
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h2>Click the Fox🦊!</h2>
          </div>
          {editPlayerNameInput ? (
            <>
              <div>
                <label htmlFor="name">
                  Name:
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e: { target: { value: string | ((val: string) => string); }; }) => setName(e.target.value)}
                    onBlur={handleBlur}
                  />
                </label>
              </div>
              <div>
                <button
                  style={{
                    border: "1px solid #60af56",
                    background: "#fff",
                    color: "#333"
                  }}
                >
                  Play !
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className={`${styles.editPlayerNameInputName}`}
                onClick={() => { setEditPlayerNameInput(true) }}
              >
                Hello {name}
              </div>
              <div>
                <Link
                  href={{
                    pathname: "/startgame",
                    query: { ...props.data },
                  }}
                  as={`/startgame`}
                >
                  <button>
                    Play !
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const data = (await fetchData()) || [];
  return {
    props: {
      data,
    },
  };
}
export default Home;
