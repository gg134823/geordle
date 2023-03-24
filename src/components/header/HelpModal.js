import React from "react";
import styles1 from "./Modal.module.scss";
import styles2 from "./Help.module.scss";
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
        </section>
      </div>
    </div>
  );
};

export default HelpModal;
