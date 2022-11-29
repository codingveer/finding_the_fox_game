import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./../../styles/ScoreBoard.module.css";

const ScoreBoard = () => {
  const [name, setName] = useState<string>("name");
  const [score, setScore] = useState('finalscore');
  const [rank, setRank] = useState(1);
  const date = new Date().toDateString();

  /*
  1. We’re using the useEffect hook to run a function when the component is mounted.
  2. Inside the function, we’re checking if the localStorage has a value for the name.
  3. If it does, we’re setting the name state to the value of the localStorage.
  4. We’re also checking if the localStorage has a value for the finalScore.
  5. If it does, we’re setting the score state to the value of the localStorage.
  6. We’re also checking if the localStorage has a value for the rank.
  7. If it does, we’re setting the rank state to the value of the localStorage.
  */
  useEffect(() => {
      // @ts-ignore
      if(window?.localStorage.getItem(name)){
        setName(JSON.parse( window?.localStorage.getItem(name) || ' '));
      }
      if(window?.localStorage.getItem(name)){
        // @ts-ignore
        setScore(JSON.parse(window?.localStorage.getItem('finalScore')|| ' '));
      }   
     
    // setRank(JSON.parse(window.localStorage.getItem('rank'));
  }, [])
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h3>Click the Fox! game</h3>
            <h4>SCOREBOARD</h4>
          </div>
          <div >
            <div className={`${styles.tableHeader}`} >
              <div>Rank</div>
              <div>Name</div>
              <div>Date</div>
              <div>Score</div>
            </div>
            <div className={`${styles.tableBody}`} >
              <div>{rank}</div>
              <div>{name}</div>
              <div>{date}</div>
              <div>{score}</div>
            </div>
          </div>
          <div>
            <Link href='/'><button>To Welcome Screen</button></Link>
            <Link href='/startgame'><button>Play !</button></Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ScoreBoard;