import React from "react";
import styles1 from "./Modal.module.scss";
import styles2 from "./Stats.module.scss";
import CloseIcon from "./CloseIcon";

const StatsModal = (props) => {
  // const [stats, setStats] = useState({
  //   avgGuesses: 0,
  //   curStreak: 0,
  //   gamesPlayed: 0,
  //   gamesWon: 0,
  //   hasPlayed: false,
  //   isOnStreak: false,
  //   maxStreak: 0,
  //   winPercentage: 0,
  //   guesses: {
  //     1: 0,
  //     2: 0,
  //     3: 0,
  //     4: 0,
  //     5: 0,
  //     6: 0,
  //     fail: 0,
  //   },
  //   dayOffset: 0,
  //   version: 0,
  // });
  // const testGuesses = {
  //   1: 3,
  //   2: 25,
  //   3: 199,
  //   4: 95,
  //   5: 45,
  //   6: 0,
  //   fail: 0,
  // };

  const barWidth = [
    [22, "22%"],
    [75, "75%"],
    [55, "55%"],
    [27, "27%"],
    [99, "100%"],
    [0, "7%"],
  ];
  let maxGuesses = 0;
  for (let i = 1; i < 7; i++) {
    maxGuesses =
      props.stats.guesses[i] > maxGuesses ? props.stats.guesses[i] : maxGuesses;
  }
  for (let i = 1; i < 7; i++) {
    barWidth[i - 1][0] = props.stats.guesses[i];
    let percentValue = 100 * (barWidth[i - 1][0] / maxGuesses);
    percentValue = percentValue > 7 ? percentValue : 7;
    barWidth[i - 1][1] =
      percentValue.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) + "%";
  }

  return (
    <div className={`${styles1.modalOverlay}`} onClick={props.onConfirm}>
      <div
        className={`${styles1.content} ${styles1.testExtraWidth} ${styles1.noPadding}`}
      >
        <button
          className={styles1.closeIcon}
          type="button"
          onClick={props.onConfirm}
        >
          <CloseIcon />
        </button>
        <div className={`${styles2.gameStats} ${styles2.testGameStats}`}>
          <h1 className={`${styles2.statisticsHeading}`}>Statistics</h1>
          <div className={styles2.statistics}>
            <div className={styles2.statisticContainer}>
              <div className={styles2.statistic}>{props.stats.gamesPlayed}</div>
              <div className={styles2.label}>Played</div>
            </div>
            <div className={styles2.statisticContainer}>
              <div className={styles2.statistic}>{props.stats.winPercentage}</div>
              <div className={styles2.label}>Win %</div>
            </div>
            <div className={styles2.statisticContainer}>
              <div className={styles2.statistic}>{props.stats.curStreak}</div>
              <div className={styles2.label}>Current Streak</div>
            </div>
            <div className={styles2.statisticContainer}>
              <div className={styles2.statistic}>{props.stats.maxStreak}</div>
              <div className={styles2.label}>Max Streak</div>
            </div>
          </div>
          <div className={styles2.statsBtnLeft}>
            <h1>Guess Distribution</h1>
          </div>
          <div className={styles2.guessDistribution}>
            {barWidth.map((width, guessNum) => (
              <div key={guessNum} className={styles2.graphContainer}>
                <div className={styles2.guess}>{guessNum + 1}</div>
                <div className={styles2.graph}>
                  <div
                    className={`${styles2.graphBar} ${styles2.alignRight}`}
                    style={{ width: `${width[1]}` }}
                  >
                    <div className={styles2.numGuesses}>{width[0]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles2.statsBtnLeft}>
            <h2>Failures: {props.stats.guesses.fail}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
