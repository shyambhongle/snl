import React, { useState, useEffect } from "react";
import styles from "./board.module.css";

import SideBar from "../sidebar/sidebar";
import Row from "../row/row";
import Player from "../player/player";
import Canvas from "../canvas/canvas";

const Board = () => {
  const boardWidth = window.innerWidth - 300;
  const boardHeight = window.innerHeight;
  const shuffleArray = [0, 1, 2, 3, 4, 5, 6, 7, 9];

  let defaultPlayerDetails1 = {
    position: {
      top: 0,
      left: 0,
    },
    currentBox: 0,
    boxDetails: {},
    shape: "circle",
    color: "green",
  };

  let defaultPlayerDetails2 = {
    position: {
      top: 0,
      left: 0,
    },
    currentBox: 0,
    boxDetails: {},
    shape: "square",
    color: "red",
  };

  const [rowDetails, setRowDetails] = useState([]);
  const [playerDetails, setPlayerDetails] = useState([
    defaultPlayerDetails1,
    defaultPlayerDetails2,
  ]);
  const [obstacle, setObstacle] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(0);

  const boxesInRow = 10;

  useEffect(() => {
    genrateBoard();
  }, []);

  const genrateBoard = async () => {
    let boxNum = 1;
    const rows = [];
    for (let i = 0; i < 10; i++) {
      let boxes = [];
      let displayNum = boxNum;
      for (let j = 0; j < boxesInRow; j++) {
        let boxData = {
          displayNum: i % 2 === 0 ? displayNum : displayNum + (boxesInRow - 1),
          indexNum: j,
          row: i,
          isSnake: false,
          isLadder: false,
          color: [],
          dimension: {},
        };

        const boxDimension = setBoxPixel(boxData);
        boxData.dimension = boxDimension;
        i % 2 === 0 ? displayNum++ : displayNum--;
        boxes.push(boxData);
      }
      rows.push(boxes);
      boxNum += 10;
    }
    const { newRows, tempSnake } = placeSnake(rows);
    const { allObstacle, updateROw } = placeLadder(newRows, tempSnake);
    console.log("khalsc updateROw", updateROw);
    console.log("allObstacle updateROw", allObstacle);

    setRowDetails(updateROw);
    setObstacle(allObstacle);
  };

  const placeSnake = (rows) => {
    const tempSnake = [];
    rows.forEach((_, i) => {
      if (i !== 9 && i % 2 !== 0) {
        let randomNum = shuffle(shuffleArray);
        let tail = rows[i][randomNum[0]];
        if (randomNum[1] <= i) {
          randomNum[1] = i + 1;
        }
        let mouth = rows[randomNum[1]][randomNum[2]];
        tempSnake.push({
          startNum: `${mouth.displayNum}`,
          endNum: `${tail.displayNum}`,
          start: mouth,
          end: tail,
          color: [randomNum[1], randomNum[2], randomNum[0]],
          obstacleType: "snake",
        });
        rows[tail.row][tail.indexNum] = {
          ...tail,
          isSnake: true,
          color: [randomNum[1], randomNum[2], randomNum[0]],
        };
        rows[mouth.row][mouth.indexNum] = {
          ...mouth,
          isSnake: true,
          color: [randomNum[1], randomNum[2], randomNum[0]],
        };
      }
    });

    return { tempSnake, newRows: rows };
  };

  const placeLadder = (rows, sankes) => {
    const tempLadder = [];
    rows.forEach((_, i) => {
      if (i !== 9 && i % 2 === 0) {
        let randomNum = shuffle(shuffleArray);
        let startingPoint = rows[i][randomNum[0]];
        if (randomNum[1] <= i) {
          randomNum[1] = i + 1;
        }
        let endPoint = rows[randomNum[1]][randomNum[2]];
        if (startingPoint.isSnake) {
          let updatedPoint =
            randomNum[0] === 9 || randomNum[0] === 0 ? 8 : randomNum[1] - 1;
          startingPoint = rows[i][updatedPoint];
          if (startingPoint.isSnake) {
            startingPoint = rows[i][5];
          }
        }
        if (endPoint.isSnake) {
          let updatedPoint =
            randomNum[2] === 9 || randomNum[2] === 0 ? 8 : randomNum[1] - 1;
          endPoint = rows[randomNum[1]][updatedPoint];
          if (endPoint.isSnake) {
            endPoint = rows[i][5];
          }
        }
        tempLadder.push({
          startNum: `${startingPoint.displayNum}`,
          endNum: `${endPoint.displayNum}`,
          start: startingPoint,
          end: endPoint,
          color: [randomNum[1], randomNum[2], randomNum[0]],
          obstacleType: "ladder",
        });
        rows[startingPoint.row][startingPoint.indexNum] = {
          ...startingPoint,
          isLadder: true,
          color: [randomNum[1], randomNum[2], randomNum[0]],
        };
        rows[endPoint.row][endPoint.indexNum] = {
          ...endPoint,
          isLadder: true,
          color: [randomNum[1], randomNum[2], randomNum[0]],
        };
      }
    });
    return { allObstacle: [...sankes, ...tempLadder], updateROw: rows };
  };

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const setBoxPixel = (boxData) => {
    const boxWidth = boardWidth / 10 - 10;
    const boxHeight = boardHeight / 10 - 10;
    let offsetLeft = boxWidth * (boxData.indexNum + 1) - boxData.indexNum * 0.8;
    let offsetTop = boxHeight * (boxData.row + 1) + boxData.row * 10;
    const offsetTopCorrection = boardHeight - offsetTop;
    return {
      width: boxWidth,
      height: boxHeight,
      offsetLeft,
      offsetTop: offsetTopCorrection,
    };
  };

  const playerMoment = (rollNum) => {
    const updatedValue = rowCheck(rollNum);
    setPlayerDetails(updatedValue);
  };

  const rowCheck = (rollNum) => {
    const currentPlayer = playerDetails[playerTurn];
    const { boxDetails } = currentPlayer;
    if (boxDetails.displayNum) {
      let newDisplayNum = boxDetails.displayNum + rollNum;
      let currentRow = boxDetails.row;
      const isEven = currentRow % 2 === 0;
      if (isEven && boxDetails.indexNum + rollNum > 9) {
        currentRow += 1;
      }
      if (!isEven && boxDetails.indexNum - rollNum < 0) {
        currentRow += 1;
      }
      let updateDetails = rowDetails[currentRow].filter((boxes) => {
        return boxes.displayNum === newDisplayNum;
      });
      let updatedValue = {
        ...currentPlayer,
        currentBox: newDisplayNum,
        boxDetails: updateDetails[0],
      };
      let players = [...playerDetails];
      players[playerTurn] = updatedValue;
      return players;
    } else {
      let updatedValue = {
        ...currentPlayer,
        currentBox: rollNum,
        boxDetails: { ...rowDetails[0][0] },
      };
      let players = [...playerDetails];
      players[playerTurn] = updatedValue;
      return players;
    }
  };

  const diceRoll = () => {
    const rollNum = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    playerMoment(rollNum);
    let currentPlayer = playerTurn + 1;
    if (currentPlayer >= playerDetails.length) currentPlayer = 0;
    setPlayerTurn(currentPlayer);
  };

  return (
    <div className={styles.Container}>
      <SideBar roll={diceRoll} genrateBoard={genrateBoard} />
      <div className={styles.Wrapper}>
        {rowDetails.map((singleRow, i) => {
          return <Row rowDetails={singleRow} key={i} />;
        })}
        {playerDetails.map((player, i) => (
          <Player key={i} player={player} index={i} playerTurn={playerTurn} />
        ))}
        {/* {obstacle.map((details, i) => (
          <Obstacle obstacleDetails={details} key={i} index={i} />
        ))} */}
        <Canvas width={boardWidth} height={boardHeight} obstacle={obstacle} />
      </div>
    </div>
  );
};

export default Board;
