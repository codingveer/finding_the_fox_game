import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./../../styles/ScoreBoard.module.css";

const ScoreBoard = () => {
  const [name, setName] = useState<string>("name");
  const [score, setScore] = useState('finalscore');
  const [rank, setRank] = useState(1);
  const date = new Date().toDateString();

  useEffect(() => {
      // @ts-ignore
      setName(JSON.parse( window?.localStorage.getItem(name) || ' '));
      // @ts-ignore
      setScore(JSON.parse(window?.localStorage.getItem('finalScore')|| ' '));
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