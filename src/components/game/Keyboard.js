import React from "react";
import KeyRow from "./KeyRow";
import styles from "./Keyboard.module.scss";

const Keyboard = (props) => {
  return (
    <div className={styles.keyboard}>
      <div className={styles.row}>
        <KeyRow context={props.context} onUpdate={props.onUpdate} rowNum='0'/>
      </div>
      <div className={styles.row}>
        <KeyRow context={props.context} onUpdate={props.onUpdate} rowNum='1'/>
      </div>
      <div className={styles.row}>
        <KeyRow context={props.context} onUpdate={props.onUpdate} rowNum='2'/>
      </div>
    </div>
  );
};

export default Keyboard;
