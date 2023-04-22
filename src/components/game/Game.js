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
  let timeInhours = now / 3600000 - 4; // New word at midnight GMT - 4
  const dayOffset = Math.floor(timeInhours / 24) - 19430;

  const wordOffset = (dayOffset * 168) % 5209;
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

  // ---------------------------------------------------------------------------
  // On startup, check for a stored game in progress and also check for
  // stored statistics.
  // This should only run once. (note: it runs twice in dev because React.StrictMode
  // is set but that does not matter)
  // ---------------------------------------------------------------------------

  const updateContext = (newContext, action) => {
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
      }, 1000);
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

  // ---------------------------------------------------------------------------
  // On startup, check for a stored game in progress and also check for
  // stored statistics.
  // This should only run once. (note: it runs twice in dev because React.StrictMode
  // is set but that does not matter)
  // ---------------------------------------------------------------------------

  useEffect(() => {

    // check for stored game in progres:
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

    // check for stored stats:
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
  // rattleRow()
  // when an invalid word is entered, shake the letters by setting a the
  // invalid flag for the row to true (after a delay to wait for the letters
  // to finish flipping). Also, set a timer to clear the invalid flag and
  // display a dialog after the shake is finished.
  // ---------------------------------------------------------------------------

  const rattleRow = (ctx, row, delay) => {
    setTimeout(() => {
      ctx.rowInvalid[row] = true;
      updateContext(ctx);
    }, delay);
    setTimeout(() => {
      // after rattling, clear flag and put up invalid word dialog
      ctx.rowInvalid[row] = false;
      updateContext(ctx, "INVALID_WORD");
    }, +delay + 600);
  };

  // ---------------------------------------------------------------------------
  // bounceLetters()
  // on win,  set a timer to bounce the letters after a delay to wait
  // for the letters to all flip. Also set a timer to then clear the
  // winning state and display a winning dialog
  // ---------------------------------------------------------------------------

  const bounceLetters = (ctx, row, delay) => {
    setTimeout(() => {
      ctx.winRow = row;
      updateContext(ctx);
    }, delay);
    setTimeout(() => {
      ctx.winRow = -1;
      updateContext(ctx, "WINNER");
    }, +delay + 1200);
  };

  // ---------------------------------------------------------------------------
  // setLetterState()
  // When changing the state of a row letters, delay the update of each letter
  // based on the column number so that the new state is not reflected before
  // the flip completes.
  // ---------------------------------------------------------------------------

  const setLetterState = (ctx, row, col, ltr, bstate, lstate) => {
    setTimeout(() => {
      ctx.boardStates[row][col] = bstate;
      ctx.keyStates[ltr] = lstate;
      updateContext(ctx);
    }, col * 250 + 300);
  };

  const processEnterKey = (ctx) => {
    if (ctx.currentCol === 5) {
      let curGuess = ctx.boardLetters[ctx.currentRow].join("");
      // check to see if it is a valid word
      if (!wordleWords.includes(curGuess)) {
        // not a valid word - Just shake the word and display a message
        rattleRow(ctx, ctx.currentRow, 0);
      } else {
        if (!curGuess.localeCompare(todaysWord)) {
          // winner
          ctx.winner = true;
          ctx.gameOver = true;
        }
        let temKeyStates = {
          a: null,
        };
        // figure out letter states
        let todaysLetters = todaysWord.split("");
        let workingGuess = curGuess.split("");
        for (let i = 0; i < 5; i++) {
          if (todaysLetters[i] === workingGuess[i]) {
            // right letter in right position
            setLetterState(
              ctx,
              ctx.currentRow,
              i,
              workingGuess[i],
              "correct",
              "correct"
            );
            temKeyStates[workingGuess[i]] = "correct";
            todaysLetters[i] = ""; // nulled out so this is skipped in next check
            workingGuess[i] = "";
          }
        }
        for (let i = 0; i < 5; i++) {
          if (workingGuess[i]) {
            // skip letters that are in right place
            let ind = todaysLetters.findIndex((x) => x === workingGuess[i]);
            if (ind >= 0) {
              // letter is found in word but in wrong place
              temKeyStates[workingGuess[i]] =
                temKeyStates[workingGuess[i]] != "correct" &&
                ctx.keyStates[workingGuess[i]] != "correct"
                  ? "present"
                  : "correct";
              setLetterState(
                ctx,
                ctx.currentRow,
                i,
                workingGuess[i],
                "present",
                temKeyStates[workingGuess[i]]
              );
              todaysLetters[ind] = "";
            } else {
              setLetterState(
                ctx,
                ctx.currentRow,
                i,
                workingGuess[i],
                "absent",
                temKeyStates[workingGuess[i]] != "correct"
                  ? temKeyStates[workingGuess[i]] != "present"
                    ? "absent"
                    : "present"
                  : "correct"
              );
            }
          }
          ctx.boardAnimation[ctx.currentRow][i] = "flip-out";
          if (ctx.currentRow > 0 && ctx.currentRow < 5) {
            ctx.boardAnimation[ctx.currentRow - 1][i] = "idle";
          }
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
          updateContext(ctx, "STORE_STATE");
        }, 1500);
      }
    }
  };

  // Process clicks on the app keyboard
  const ClickHandler = (event) => {
    event.preventDefault();
    processKey(event.target.id);
  };

  // Process key presses on the keyboard of the device
  const KeyDownHandler = (event) => {
    event.preventDefault();
    const validLetters = "qwertyuiopasdfghjklzxcvbnm".split("");
    validLetters.push("Entry", "Backspace");
    if (validLetters.includes(event.key)) {
      processKey(event.key);
    }
  };

  // process the keyed input from either source
  const processKey = (keyCode) => {
    console.log(keyCode);
    const ctx = boardContext;
    if (ctx.currentRow < 6 && !ctx.winner) {
      if (keyCode === "Enter") {
        processEnterKey(ctx);
      } else if (keyCode === "Backspace") {
        if (ctx.currentCol > 0) {
          ctx.currentCol--;
          ctx.boardLetters[ctx.currentRow][ctx.currentCol] = "";
          ctx.boardStates[ctx.currentRow][ctx.currentCol] = "empty";
          updateContext(ctx);
        }
      } else {
        if (ctx.currentCol < 5) {
          ctx.boardLetters[ctx.currentRow][ctx.currentCol] = keyCode;
          ctx.boardStates[ctx.currentRow][ctx.currentCol] = "tbd";
          ctx.currentCol++;
          updateContext(ctx);
        }
      }
    }
  };

  return (
    <>
      {DispHelp && <HelpModal onConfirm={closeModal} />}
      {DispStats && <StatsModal stats={stats} onConfirm={closeModal} />}
      <div className={styles.game} tabIndex={-1} onKeyDown={KeyDownHandler}>
        <Header onDisplayModal={modalHandler} />
        {error && <ErrorModal message={error} />}
        <Board context={boardContext} onKeyDown={ClickHandler} />
        <KeyBoard context={boardContext} onUpdate={ClickHandler} />
      </div>
    </>
  );
};

export default Game;
