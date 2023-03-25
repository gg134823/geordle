import React, { useState, useEffect } from "react";
import styles from "../../App.module.scss";
import ErrorModal from "../UI/ErrorModal";
import HelpModal from "../header/HelpModal";
import StatsModal from "../header/StatsModal";
import Board from "./Board";
import KeyBoard from "./Keyboard";
import Header from "../header/Header";
import wordleWords from "./wordleWords";

const Game = (props) => {
  const statsVersion = "v1.00";
  const now = new Date();
  const dayOffset = Math.floor(now / 8.64e7) - 19430;
  const wordOffset = (dayOffset * 168) % 5377;
  const todaysWord = wordleWords[wordOffset];

  const [ctxState, setCtxState] = useState(true);
  const [error, setError] = useState();
  const [boardContext, setBoardContext] = useState({
    dayOffset: 0,
    currentRow: 0,
    currentCol: 0,
    rowInvalid: [false, false, false, false, false, false],
    gameOver: false,
    winner: false,
    winRow: -1,
    boardLetters: [[], [], [], [], [], []],
    boardStates: [
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
    ],
    boardAnimation: [
      ["idle", "idle", "idle", "idle", "idle"],
      ["idle", "idle", "idle", "idle", "idle"],
      ["idle", "idle", "idle", "idle", "idle"],
      ["idle", "idle", "idle", "idle", "idle"],
      ["idle", "idle", "idle", "idle", "idle"],
      ["idle", "idle", "idle", "idle", "idle"],
    ],
    keyStates: {
      a: "tbd",
      b: "tbd",
      c: "tbd",
      d: "tbd",
      e: "tbd",
      f: "tbd",
      g: "tbd",
      h: "tbd",
      i: "tbd",
      j: "tbd",
      k: "tbd",
      l: "tbd",
      m: "tbd",
      n: "tbd",
      o: "tbd",
      p: "tbd",
      q: "tbd",
      r: "tbd",
      s: "tbd",
      t: "tbd",
      u: "tbd",
      v: "tbd",
      w: "tbd",
      x: "tbd",
      y: "tbd",
      z: "tbd",
    },
  });

  const [stats, setStats] = useState({
    avgGuesses: 0,
    curStreak: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    hasPlayed: false,
    isOnStreak: false,
    maxStreak: 0,
    winPercentage: 0,
    guesses: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      fail: 0,
    },
    dayOffset: 0,
    version: 0,
  });

  const winningQuotes = [
    "Lucky !!!",
    "Nice !!!",
    "Impressive",
    "Not bad",
    "Good effort",
    "That was close",
  ];

  const [DispHelp, setDispHelp] = useState();
  const [DispStats, setDispStats] = useState();

  const closeModal = () => {
    setDispHelp(null);
    setDispStats(null);
  };

  const modalHandler = (event) => {
    if (event.target.id === "help") {
      setDispHelp(1);
    } else if (event.target.id === "stats") {
      setDispStats(1);
    }
  };

  const calcStats = (stats, ctx) => {
    stats.gamesPlayed++;
    stats.hasPlayed = true;
    stats.version = statsVersion;
    stats.dayOffset = ctx.dayOffset;
    if (!ctx.winner) {
      stats.curStreak = 0;
      stats.isOnStreak = false;
      stats.guesses.fail++;
    } else {
      stats.curStreak++;
      stats.guesses[ctx.currentRow]++;
      if (stats.curStreak > stats.maxStreak) {
        stats.isOnStreak = true;
        stats.maxStreak = stats.curStreak;
      }
      stats.gamesWon++;
    }
    stats.winPercentage = (
      100 *
      ((stats.gamesPlayed - stats.guesses.fail) / stats.gamesPlayed)
    ).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    setStats(stats);
  };

  const displayWordForLosers = (ctx) => {
    if (ctx.currentRow > 5 && !ctx.winner) {
      setError(todaysWord);
      setTimeout(() => {
        setError(null);
      }, 3500);
    }
  };

  const updateContextHandler = (newContext, action) => {
    // check a couple of things before updating the state
    if (action === "STORE_STATE") {
      if (newContext.gameOver) {
        //only store stats at the end of game (once)
        // set statistics and save
        calcStats(stats, newContext);
        localStorage.setItem("geordleStats", JSON.stringify(stats));
        // clear the GameOver flag
        newContext.gameOver = false;
      }
      displayWordForLosers(newContext);
      localStorage.setItem("geordleGame", JSON.stringify(newContext));
    } else if (action === "INVALID_WORD") {
      setError("Not in word list");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } else if (action === "WINNER") {
      setError(winningQuotes[newContext.currentRow - 1]);
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
    // Update the state
    setBoardContext(newContext);
    setCtxState((prevState) => {
      return !prevState;
    });
  };

  useEffect(() => {
    const storedGame = JSON.parse(localStorage.getItem("geordleGame"));
    if (storedGame && dayOffset === storedGame.dayOffset) {
      // we have a saved state for today
      setBoardContext(storedGame);
      displayWordForLosers(storedGame);
    } else {
      localStorage.removeItem("geordleGame");
      boardContext.dayOffset = dayOffset;
      setBoardContext(boardContext);
    }

    const storedStats = JSON.parse(localStorage.getItem("geordleStats"));

    if (storedStats && statsVersion == storedStats.version) {
      // we have good stats
      // note: at this point the stats were saved on a previous day so
      //       storedStats.dayOffset will always be at least one day older than
      //       the current dayOffset
      //       So if the user played yesterday: dayOffset == storedStats.dayOffset + 1
      if (+dayOffset > +storedStats.dayOffset + 1) {
        // streak is over
        storedStats.curStreak = 0;
        storedStats.isOnStreak = false;
      }
      setStats(storedStats);
    } else {
      // stored stats are not good so use the starting stats and remove
      // anything stored
      localStorage.removeItem("geordleStats");
      stats.dayOffset = dayOffset;
      setStats(stats);
    }
  }, []);

  // ---------------------------------------------------------------------------

  const rattleRow = (ctx, row, delay) => {
    setTimeout(() => {
      ctx.rowInvalid[row] = true;
      updateContextHandler(ctx);
    }, delay);
    setTimeout(() => {
      // after rattling, clear flag and put up invalid word dialog
      ctx.rowInvalid[row] = false;
      updateContextHandler(ctx, "INVALID_WORD");
    }, +delay + 600);
  };

  const bounceLetters = (ctx, row, delay) => {
    setTimeout(() => {
      ctx.winRow = row;
      updateContextHandler(ctx);
    }, delay);
    setTimeout(() => {
      ctx.winRow = -1;
      updateContextHandler(ctx, "WINNER");
    }, +delay + 1200);
  };

  const setRowState = (ctx, row, col, ltr, bstate, lstate) => {
    setTimeout(() => {
      ctx.boardStates[row][col] = bstate;
      ctx.keyStates[ltr] = lstate;
      updateContextHandler(ctx);
    }, col * 250 + 300);
  };

  const ClickHandler = (event) => {
    event.preventDefault();
    const ctx = boardContext;
    if (ctx.currentRow < 6 && !ctx.winner) {
      if (event.target.id === "enter") {
        if (ctx.currentCol === 5) {
          let curGuess = ctx.boardLetters[ctx.currentRow].join("");
          // check to see if it is a valid word
          if (wordleWords.includes(curGuess)) {
            if (!curGuess.localeCompare(todaysWord)) {
              // winner
              ctx.winner = true;
              ctx.gameOver = true;
            }
            let temFoundLetter = {
              a: null,
            };
            // figure out letter states
            let todayLetters = todaysWord.split("");
            let workingGuess = curGuess.split("");
            for (let i = 0; i < 5; i++) {
              if (todayLetters[i] === workingGuess[i]) {
                // right letter in right position
                setRowState(
                  ctx,
                  ctx.currentRow,
                  i,
                  workingGuess[i],
                  "correct",
                  "correct"
                );
                temFoundLetter[workingGuess[i]] = "correct";
                todayLetters[i] = ""; // nulled out so this is skipped in next check
                workingGuess[i] = "";
              }
            }
            for (let i = 0; i < 5; i++) {
              if (workingGuess[i]) {
                // skip letters that are in right place
                let ind = todayLetters.findIndex((x) => x === workingGuess[i]);
                if (ind >= 0) {
                  // letter is found in word but in wrong place
                  temFoundLetter[workingGuess[i]] =
                    temFoundLetter[workingGuess[i]] != "correct" &&
                    ctx.keyStates[workingGuess[i]] != "correct"
                      ? "present"
                      : "correct";
                  setRowState(
                    ctx,
                    ctx.currentRow,
                    i,
                    workingGuess[i],
                    "present",
                    temFoundLetter[workingGuess[i]]
                  );
                  todayLetters[ind] = "";
                } else {
                  setRowState(
                    ctx,
                    ctx.currentRow,
                    i,
                    workingGuess[i],
                    "absent",
                    temFoundLetter[workingGuess[i]] != "correct"
                      ? temFoundLetter[workingGuess[i]] != "present"
                        ? "absent"
                        : "present"
                      : "correct"
                  );
                }
              }
              ctx.boardAnimation[ctx.currentRow][i] = "flip-out";
            }
            if (ctx.winner) {
              bounceLetters(ctx, ctx.currentRow, 1200);
            }
            ctx.currentCol = 0;
            ctx.currentRow++;
            if (ctx.currentRow == 6) {
              ctx.gameOver = true;
            }
            setTimeout(() => {
              updateContextHandler(ctx, "STORE_STATE");
            }, 1500);
          } else {
            // not a valid word - Just shake the word and display a message
            rattleRow(ctx, ctx.currentRow, 0);
          }
        }
      } else if (event.target.id === "bs") {
        if (ctx.currentCol > 0) {
          ctx.currentCol--;
          ctx.boardLetters[ctx.currentRow][ctx.currentCol] = "";
          ctx.boardStates[ctx.currentRow][ctx.currentCol] = "empty";
          updateContextHandler(ctx);
        }
      } else {
        if (ctx.currentCol < 5) {
          ctx.boardLetters[ctx.currentRow][ctx.currentCol] = event.target.id;
          ctx.boardStates[ctx.currentRow][ctx.currentCol] = "tbd";
          ctx.currentCol++;
          updateContextHandler(ctx);
        }
      }
    }
  };

  return (
    <>
      {DispHelp && <HelpModal onConfirm={closeModal} />}
      {DispStats && <StatsModal stats={stats} onConfirm={closeModal} />}
      <div className={styles.game}>
        <Header onDisplayModal={modalHandler} />
        {error && <ErrorModal message={error} />}
        <Board context={boardContext} />
        <KeyBoard context={boardContext} onUpdate={ClickHandler} />
      </div>
    </>
  );
};

export default Game;
