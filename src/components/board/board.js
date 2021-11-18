import React, { useState, useEffect } from "react";
import styles from "./board.module.css";

import Layout from "../layout/layout";

const playerColor = ["red", "green", "yellow", "blue"];
const playerShape = ["square", "circle"];
const gameStateDetails = ["not-started", "started", "end"];

// const singleBoxDetails = {
//   offsetLeft: 0,
//   offsetTop: 0,
//   displayNum: 0,
//   indexNum: 0,
//   rowNum: 0,
//   hasObstacle: false,
//   obstacleDetails: {},
// };

const playerDetailsOne = {
  color: playerColor[1],
  shape: playerShape[1],
  displayNum: 0,
  indexNum: 0,
  rowNum: 0,
  playerId: "ram",
};

const playerDetailsTwo = {
  color: playerColor[0],
  shape: playerShape[0],
  displayNum: 0,
  indexNum: 0,
  rowNum: 0,
  playerId: "shyam",
};

const Board = () => {
  const boardHeight = window.innerHeight - 200;
  const boardWidth = window.innerWidth;
  const totalRows = 10;
  const boxesInRows = 10;
  const boxDimension = {
    height: boardHeight / totalRows,
    width: boardWidth / boxesInRows,
  };
  const [layout, setLayout] = useState([]);
  const [players, setPlayers] = useState([playerDetailsOne, playerDetailsTwo]);
  const [dice, setdice] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [gameState, setGameState] = useState(gameStateDetails[0]);

  useEffect(() => {
    genrateBoxes();
  }, []);

  useEffect(() => {
    playerMovement();
  }, [playerTurn]);

  const genrateBoxes = () => {
    const rowLayout = [];
    let boxNum = 1;
    for (let i = 0; i < totalRows; i++) {
      const boxLayout = [];
      let displayNum = boxNum;
      for (let j = 0; j < boxesInRows; j++) {
        let boxDetails = {
          offsetLeft: 0,
          offsetTop: 0,
          displayNum: i % 2 === 0 ? displayNum : displayNum + (boxesInRows - 1),
          indexNum: j,
          rowNum: i,
          hasObstacle: false,
          obstacleDetails: {},
        };
        const dimension = setBoxPixel(boxDetails);
        i % 2 === 0 ? displayNum++ : displayNum--;
        boxLayout.push({ ...boxDetails, ...dimension });
      }
      boxNum += 10;
      rowLayout.push(boxLayout);
    }
    setLayout(rowLayout);
  };

  const diceRoll = () => {
    const diceValue = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    if (gameState === gameStateDetails[0]) {
      setGameState(gameStateDetails[1]);
    }
    console.log("kaljsc diceValue", diceValue);
    setdice(1);
    setPlayerTurn((playerTurn) => {
      playerTurn += 1;
      let updateTurn = playerTurn === players.length ? 0 : playerTurn;
      return updateTurn;
    });
  };

  const playerMovement = (diceNum = dice) => {
    let roll = 1;
    for (let index = 1; index <= diceNum; index++) {
      const currentPlayer = players[playerTurn];
      if (currentPlayer.displayNum) {
        let newDisplayNum = currentPlayer.displayNum + roll;
        let currentRow = currentPlayer.rowNum;
        const isEven = currentRow % 2 === 0;
        if (isEven && currentPlayer.indexNum + roll > 9) {
          currentRow += 1;
        }
        if (!isEven && currentPlayer.indexNum - roll < 0) {
          currentRow += 1;
        }
        let updateDetails = layout[currentRow].filter((boxes) => {
          return boxes.displayNum === newDisplayNum;
        });
        let updatedValue = {
          ...currentPlayer,
          offsetLeft: updateDetails[0].offsetLeft,
          offsetTop: updateDetails[0].offsetTop,
          displayNum: newDisplayNum,
          indexNum: updateDetails[0].indexNum,
          rowNum: updateDetails[0].rowNum,
        };
        let updatedPlayers = [...players];
        updatedPlayers[playerTurn] = updatedValue;
        setTimeout(() => {
          setPlayers(updatedPlayers);
        }, 300 * roll);
      } else {
        let updatedValue = {
          ...currentPlayer,
          offsetLeft: layout[0][roll].offsetLeft,
          offsetTop: layout[0][roll].offsetTop,
          displayNum: roll,
          indexNum: layout[0][roll].indexNum - 1,
          rowNum: layout[0][roll].rowNum,
        };
        let updatedPlayers = [...players];
        updatedPlayers[playerTurn] = updatedValue;
        setTimeout(() => {
          setPlayers(updatedPlayers);
        }, 300 * roll);
      }
      roll++;
    }
  };

  const setBoxPixel = (boxData) => {
    const boxWidth = boxDimension.width;
    const boxHeight = boxDimension.height;
    let offsetLeft = boxWidth * boxData.indexNum;
    let offsetTop = boxHeight * (boxData.rowNum + 1);
    const offsetTopCorrection = boardHeight - offsetTop;
    return {
      offsetLeft,
      offsetTop: offsetTopCorrection,
    };
  };

  return (
    <div className={styles.boardContainer}>
      <div
        className={styles.board}
        style={{ height: `${boardHeight}px`, width: `${boardWidth}px` }}
      >
        <Layout
          layout={layout}
          boxDimension={boxDimension}
          players={players}
          playerTurn={playerTurn}
          gameState={gameState}
        />
      </div>
      <div className={styles.dashBoard}>
        <button onClick={diceRoll}>Roll</button>
      </div>
    </div>
  );
};

export default Board;
