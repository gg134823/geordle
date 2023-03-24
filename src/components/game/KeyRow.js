import React from "react";
import styles from "./Key.module.scss";
import BackSpaceIcon from "./BackSpaceIcon";

const KeyRow = (props) => {
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "bs"],
  ];

  return (
    <>
      {props.rowNum == 1 && <div className={styles.half} />}
      {rows[props.rowNum].map((letter) => (
        <button
          className={`${styles.key} 
            ${letter === "enter" && styles.oneAndAHalf}
            ${letter === "bs" && styles.oneAndAHalf} `}
          data-state={props.context.keyStates[letter]}
          type="button"
          id={letter}
          key={letter}
          onClick={props.onUpdate}
        >
          {letter != "bs" ? letter : <BackSpaceIcon />}
        </button>
      ))}
      {props.rowNum == 1 && <div className={styles.half} />}
    </>
  );
};

export default KeyRow;
