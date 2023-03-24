import React from "react";

import classes from "./ErrorModal.module.css";

//   Not Used

const ErrorModal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <div className={`${classes.card} ${classes.modal}`}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <button
            className={classes.button}
            type={props.type || "button"}
            onClick={props.onClick}
          >
            {props.buttonMsg}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ErrorModal;
