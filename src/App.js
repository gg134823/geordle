import React from "react";
import styles from "./App.module.scss";
import Game from "./components/game/Game";

function App() {
  
  return (
    <div className={styles.gameContainer}>
      <Game />
    </div>
  );
}

export default App;
