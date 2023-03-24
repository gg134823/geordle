import React from "react";
import BoardRow from "./BoardRow";
import styles from "./Board.module.scss";

const Board = (props) => {
  const guesses = ["0", "1", "2", "3", "4", "5"];

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {guesses.map((guess) => (
          <BoardRow context={props.context} row={guess} key={guess} />
        ))}
      </div>
    </div>
  );
};

export default Board;
