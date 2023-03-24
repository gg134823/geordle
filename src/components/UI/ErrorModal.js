import React from 'react';

import classes from './ErrorModal.module.css';

const ErrorModal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <div className={`${classes.card} ${classes.modal}`}>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
