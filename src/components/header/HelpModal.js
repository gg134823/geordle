import React from "react";
import styles1 from "./Modal.module.scss";
import styles2 from "./Help.module.scss";
import styles3 from "../game/Tile.module.scss";
import CloseIcon from "./CloseIcon";

const HelpModal = (props) => {
  return (
    <div
      className={`${styles1.modalOverlay} ${styles1.paddingTop}`}
      onClick={props.onConfirm}
    >
      <div
        className={`${styles1.content} ${styles1.testExtraWidth} ${styles1.extraPadding}`}
      >
        <h1 className={`${styles1.heading} ${styles1.newHeading}`}>
          How To Play
        </h1>
        <button
          className={styles1.closeIcon}
          type="button"
          onClick={props.onConfirm}
        >
          <CloseIcon />
        </button>
        <h2 className={styles2.subheading}>Guess the word in 6 attempts.</h2>
        <section className={styles2.help}>
          <ul className={styles2.instructions}>
            <li>Each guess must be a 5 letter word</li>
            <li>
              The colour of the tiles will change to show how close your guess
              was to the word.
            </li>
          </ul>
          <div className={styles2.examples}>
            <p>
              <strong>Example:</strong>
            </p>
            <p>(Assuming the correct word is GREAT and your guess is GUAGE)</p>
            <div className={styles2.example}>
              <div className={styles2.tileContainer}>
                <div
                  className={`${styles3.tile} ${styles3.small}`}
                  data-state="correct"
                  data-testid="tile"
                >
                  g
                </div>
                <div
                  className={`${styles3.tile} ${styles3.small}`}
                  data-state="absent"
                  data-testid="tile"
                >
                  u
                </div>
                <div
                  className={`${styles3.tile} ${styles3.small}`}
                  data-state="present"
                  data-testid="tile"
                >
                  a
                </div>
                <div
                  className={`${styles3.tile} ${styles3.small}`}
                  data-state="absent"
                  data-testid="tile"
                >
                  g
                </div>
                <div
                  className={`${styles3.tile} ${styles3.small}`}
                  data-state="present"
                  data-testid="tile"
                >
                  e
                </div>
              </div>
              <br />
              <p>
                The first <strong>G</strong> is in the word and in the correct
                spot.
              </p>
              <p>
                The <strong>A</strong> and <strong>E</strong> are in the word
                but in the wrong spot.
              </p>
              <p>
                The <strong>U</strong> and the second <strong>G</strong> are not
                in the word.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpModal;
