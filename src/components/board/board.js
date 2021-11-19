import React, { useState, useEffect } from "react";
import styles from "./board.module.css";

import Layout from "../layout/layout";
import Canvas from "../canvas/canvas";

import { dummyLadder, dummSnakes } from "../../utility/dummyObstacle";

const playerColor = ["red", "green", "yellow", "blue"];
const playerShape = ["square", "circle"];
const gameStateDetails = ["not-started", "started", "end"];
const shuffleArray = [0, 1, 2, 3, 4, 5, 6, 7, 9];

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
  offsetLeft: -100,
  offsetTop: -100,
};

const playerDetailsTwo = {
  color: playerColor[0],
  shape: playerShape[0],
  displayNum: 0,
  indexNum: 0,
  rowNum: 0,
  playerId: "shyam",
  offsetLeft: -100,
  offsetTop: -100,
};

const playerDetailsThree = {
  color: playerColor[2],
  shape: playerShape[0],
  displayNum: 0,
  indexNum: 0,
  rowNum: 0,
  playerId: "kalu",
  offsetLeft: -100,
  offsetTop: -100,
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
  const [obstacle, setObstacle] = useState([]);

  const [players, setPlayers] = useState([
    playerDetailsOne,
    playerDetailsTwo,
    // playerDetailsThree,
  ]);
  const [dice, setdice] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(100);
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
    const { boxesAndSnake, onlySnakes } = placeSnake(rowLayout);
    const { obstacleLayout, onlyLadder } = placeLadder(boxesAndSnake);
    setLayout(obstacleLayout);
    console.log("klajcs", onlyLadder);
    setObstacle([...onlyLadder, ...onlySnakes]);
  };

  const diceRoll = () => {
    const diceValue = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    if (gameState === gameStateDetails[0]) {
      setGameState(gameStateDetails[1]);
    }
    console.log("kaljsc diceValue", diceValue);
    setdice(1);
    if (playerTurn === 100) {
      setPlayerTurn(() => 0);
    } else {
      let newPlayerTurn = playerTurn + 1;
      let updatePlayerTurn =
        playerTurn < players.length - 1 ? newPlayerTurn : 0;
      setPlayerTurn(updatePlayerTurn);
    }
  };

  const placeSnake = (rows) => {
    const onlySnakes = [];
    rows.forEach((_, j) => {
      const i = 9 - j;
      // const isEven = i % 2 !== 0;
      if (i > 0) {
        let randomNum = randomNumbers(shuffleArray);
        let head = rows[i][randomNum[0]];

        if (randomNum[1] >= i) {
          randomNum[1] = randomNum[1] - 1;
        }

        let tail = rows[randomNum[1]][randomNum[2]];
        const obstacleId = Math.floor(Date.now() / 1000) + i;
        onlySnakes.push({
          startBox: head,
          endBox: tail,
          color: [randomNum[1], randomNum[2], randomNum[0]],
          obstacleType: "snake",
          obstacleId: obstacleId,
        });
        rows[tail.rowNum][tail.indexNum] = {
          ...tail,
          hasObstacle: true,
          obstacleDetails: {
            type: "snake",
            startBox: head,
            endBox: tail,
            currentBox: "tail",
            color: [randomNum[1], randomNum[2], randomNum[0]],
            obstacleId: obstacleId,
          },
        };
        rows[head.rowNum][head.indexNum] = {
          ...head,
          hasObstacle: true,
          obstacleDetails: {
            type: "snake",
            startBox: head,
            endBox: tail,
            currentBox: "head",
            color: [randomNum[1], randomNum[2], randomNum[0]],
            obstacleId: obstacleId,
          },
        };
      }
    });
    return { onlySnakes, boxesAndSnake: rows };
  };

  const placeLadder = (rows) => {
    const onlyLadder = [];
    rows.forEach((_, i) => {
      if (i < 9) {
        let randomNum = randomNumbers();
        let startingPoint = rows[i][randomNum[0]];
        if (randomNum[1] <= i) {
          randomNum[1] = i + 1;
        }
        let endPoint = rows[randomNum[1]][randomNum[2]];
        if (startingPoint.hasObstacle) {
          let updatedPoint =
            randomNum[0] === 9 || randomNum[0] === 0 ? 8 : randomNum[1] - 1;
          startingPoint = rows[i][updatedPoint];
        }
        if (endPoint.hasObstacle) {
          let updatedPoint =
            randomNum[2] === 9 || randomNum[2] === 0 ? 8 : randomNum[1] - 1;
          endPoint = rows[randomNum[1]][updatedPoint];
        }
        const obstacleId = Math.floor(Date.now() / 1000) + i;

        onlyLadder.push({
          startBox: startingPoint,
          endBox: endPoint,
          color: [randomNum[1], randomNum[2], randomNum[0]],
          obstacleType: "ladder",
          obstacleId: obstacleId,
        });
        rows[startingPoint.rowNum][startingPoint.indexNum] = {
          ...startingPoint,
          hasObstacle: true,
          obstacleDetails: {
            type: "ladder",
            startBox: startingPoint,
            endBox: endPoint,
            currentBox: "head",
            color: [randomNum[1], randomNum[2], randomNum[0]],
            obstacleId: obstacleId,
          },
        };
        rows[endPoint.rowNum][endPoint.indexNum] = {
          ...endPoint,
          hasObstacle: true,
          obstacleDetails: {
            type: "ladder",
            startBox: startingPoint,
            endBox: endPoint,
            currentBox: "tail",
            color: [randomNum[1], randomNum[2], randomNum[0]],
            obstacleId: obstacleId,
          },
        };
      }
    });
    return { onlyLadder: onlyLadder, obstacleLayout: rows };
  };

  function randomNumbers(newShuffled = shuffleArray) {
    let array = [...newShuffled];
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const checkForObstacle = (updatedPlayers) => {
    const currentPlayer = updatedPlayers[playerTurn];
    const boxDetails = layout[currentPlayer.rowNum][currentPlayer.indexNum];

    if (boxDetails.hasObstacle) {
      let finalPosition = boxDetails.obstacleDetails.endBox;
      let updatedValue = {
        ...currentPlayer,
        offsetLeft: finalPosition.offsetLeft,
        offsetTop: finalPosition.offsetTop,
        displayNum: finalPosition.displayNum,
        indexNum: finalPosition.indexNum,
        rowNum: finalPosition.rowNum,
      };
      updatedPlayers[playerTurn] = updatedValue;
      setTimeout(() => {
        setPlayers([...updatedPlayers]);
      }, 1000);
    }
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
          if (index >= diceNum) {
            console.log("Opoi timeOiut 1");
            checkForObstacle(updatedPlayers);
          }
        }, 300 * roll);
      } else {
        let updatedValue = {
          ...currentPlayer,
          offsetLeft: layout[0][roll - 1].offsetLeft,
          offsetTop: layout[0][0].offsetTop,
          displayNum: roll,
          indexNum: layout[0][roll - 1].indexNum,
          rowNum: layout[0][0].rowNum,
        };
        let updatedPlayers = [...players];
        updatedPlayers[playerTurn] = updatedValue;
        setTimeout(() => {
          setPlayers(updatedPlayers);
          if (index >= diceNum) {
            console.log("Opoi timeOiut 2");
            checkForObstacle(updatedPlayers);
          }
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
        <Canvas obstacle={obstacle} height={boardHeight} width={boardWidth} />
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
