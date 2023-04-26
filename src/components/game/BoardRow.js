import React from "react";
import Tile from "./Tile";
import styles from "./BoardRow.module.scss";
//import BoardContext from "../../store/board-context";

const BoardRow = (props) => {
  const columns = [0, 1, 2, 3, 4];
  const classList = `${styles["row"]} ${
    props.context.rowInvalid[props.row] ? styles["invalid"] : ""
  }`;

  return (
    <div className={classList} role="group" aria-label="Row 1">
      {columns.map((col) => (
        <div
          className={`${styles[props.context.winRow === props.row ? "win" : ""]}`}
          style={{animationDelay: `${col * 100}ms`}}
          key={"anni" + col}
        >
          <Tile
            letter={props.context.boardLetters[props.row][col]}
            state={props.context.boardStates[props.row][col]}
            animation={props.context.boardAnimation[props.row][col]}
            ad={`${col * 250}ms`}
            key={col}
          />
        </div>
      ))}
    </div>
  );
};

export default BoardRow;
