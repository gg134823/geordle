import React from "react";

const BoardContext = React.createContext({
  currentRow: 0,
  currentCol: 0,
  boardLetters: [["W", "O", "R", "D", "S"], [], [], [], [], []],
  boardStates: [
    ["correct", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["present", "empty", "empty", "empty", "empty"],
    ["absent", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty"],
  ],
});

export default BoardContext;
