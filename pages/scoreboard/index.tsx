import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./ScoreBoard.module.css";
import { userScores } from "./../../data/score";

type IProps = {
  name: string,
  date: string,
  score: number,
  rank?: number
}

let userScoreSorted: IProps[] = [];
const ScoreBoard = () => {
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  /*
     we’re checking if the localStorage has a value for the name,finalScore
     If it does, we’re setting the name state to the value of the localStorage.
  */
  useEffect(() => {
    getScore()
  }, []);

  const getScore = () => {
    let currentUser = [];
    const date = new Date().toDateString();
    const name = JSON.parse(window?.localStorage.getItem('name') || 'You')
    const score = +JSON.parse(window?.localStorage.getItem('finalScore') || '0');
    currentUser = [{ name, date, score }];

    userScoreSorted = [...userScores, ...currentUser];
    userScoreSorted = userScoreSorted.sort((a, b) => b.score - a.score);
    setShowScoreBoard(true)
    console.log(userScoreSorted, 'currentUser')
  }
  return (
    <div className="imageContainer">
      <div className="boardContainer">
        <div className={`${styles.welcomeBoardContainer}`}>
          <div>
            <h4>SCOREBOARD</h4>
          </div>
          <div>
            <div className={`${styles.tableHeader}`}>
              <div>Rank</div>
              <div>Name</div>
              <div>Date</div>
              <div>Score</div>
            </div>
            <div >
              {showScoreBoard && userScoreSorted.map((user, rank: number) => {
                return (
                  <section key={`${user.name}`} className={`${styles.tableBody}`} >
                    <div>{rank + 1}</div>
                    <div>{user.name}</div>
                    <div>{user.date}</div>
                    <div>{user.score}</div>
                  </section>
                )
              })}

            </div>
          </div>
          <div className={`${styles.buttons}`}>
            <Link href="/">
              {" "}
              <button className={`${styles.home}`}> Home</button>
            </Link>
            <Link href="/startgame">
              <button className={`${styles.play}`}>Play !</button>
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ScoreBoard;
