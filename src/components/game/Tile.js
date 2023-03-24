import React from "react";
import styles from "./Tile.module.scss";

const Tile = (props) => {
  return (
      <div
        className={styles.tile}
        data-state={props.state}
        role="img"
        aria-roledescription="tile"
        aria-live="polite"
        data-animation={props.animation}
        data-testid="tile"
        animation-delay={props.ad}
      >
        {props.letter}
      </div>
  );
};

export default Tile;
