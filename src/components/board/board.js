import React, { useState, useEffect } from "react";
import styles from "./board.module.css";

import SideBar from "../sidebar/sidebar";
import Row from "../row/row";
import Player from "../player/player";
const Board = () => {
  const [rowDetails, setRowDetails] = useState([]);
  let defaultPlayerDetails = {
    position: {
      top: 0,
      left: 0,
    },
    currentBox: 1,
    boxDetails: {},
  };
  const [playerDetails, setPlayerDetails] = useState(defaultPlayerDetails);

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
          obstacleId: "",
          color: [],
        };
        i % 2 === 0 ? displayNum++ : displayNum--;
        boxes.push(boxData);
      }
      rows.push(boxes);
      boxNum += 10;
    }
    const { newRows } = await placeSnake(rows);
    const { updateROw } = await placeLadder(newRows);
    setRowDetails(updateROw);
    console.log("All rows", updateROw);
  };

  const placeSnake = async (rows) => {
    const tempSnake = [];
    await rows.forEach((row, i) => {
      if (i > 0) {
        let randomNum = shuffle();
        let tail = rows[i][randomNum[0]];
        if (randomNum[1] <= i) {
          randomNum[1] = i + Math.floor(Math.random() * (8 - i - 1 + 1)) + 1;
        }
        let mouth = rows[randomNum[1]][randomNum[2]];
        tempSnake.push({
          start: mouth,
          end: tail,
          color: [randomNum[1], randomNum[2], randomNum[0]],
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

  const placeLadder = async (rows) => {
    const tempLadder = [];
    await rows.forEach((row, i) => {
      if (i < 9) {
        let randomNum = shuffle();
        let startingPoint = rows[i][randomNum[0]];
        if (randomNum[1] <= i) {
          randomNum[1] = i + Math.floor(Math.random() * (8 - i - 1 + 1)) + 1;
        }
        let endPoint = rows[randomNum[1]][randomNum[2]];
        if (startingPoint.isSnake) {
          let updatedPoint = randomNum[0] === 9 ? 8 : randomNum[1] - 1;
          startingPoint = rows[i][updatedPoint];
        }
        if (endPoint.isSnake) {
          let updatedPoint = randomNum[2] === 9 ? 8 : randomNum[1] - 1;
          endPoint = rows[randomNum[1]][updatedPoint];
        }
        tempLadder.push({
          start: startingPoint,
          end: endPoint,
          color: [randomNum[1], randomNum[2], randomNum[0]],
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
    return { tempLadder, updateROw: rows };
  };

  function shuffle() {
    let array = [0, 1, 2, 3, 4, 5, 6, 7, 9];
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
    return [array[0], array[1], array[2]];
  }

  const playerMoment = (rollNum) => {
    const updatedValue = rowCheck(rollNum);
    setPlayerDetails(updatedValue);
  };

  const rowCheck = (rollNum) => {
    const { boxDetails } = playerDetails;
    if (boxDetails.displayNum) {
      let newDisplayNum = boxDetails.displayNum + rollNum;
      let currentRow = boxDetails.row;
      const isEven = currentRow % 2 === 0;
      let moveUp = false;

      if (isEven && boxDetails.indexNum + rollNum > 9) {
        currentRow += 1;
        moveUp = true;
      }
      if (!isEven && boxDetails.indexNum - rollNum < 0) {
        currentRow += 1;
        moveUp = true;
      }
      let updateDetails = rowDetails[currentRow].filter((boxes) => {
        return boxes.displayNum === newDisplayNum;
      });
      let updatedValue = {
        ...playerDetails,
        position: {
          left: (updateDetails[0].indexNum + 1) * 100,
          top: moveUp
            ? playerDetails.position.top + 60
            : playerDetails.position.top,
        },
        currentBox: newDisplayNum,
        boxDetails: updateDetails[0],
      };
      return updatedValue;
    } else {
      let updatedValue = {
        ...playerDetails,
        position: {
          left: 100 * rollNum,
          top: 0,
        },
        currentBox: rollNum,
        boxDetails: {
          displayNum: rollNum,
          indexNum: rollNum - 1,
          row: 0,
        },
      };
      return updatedValue;
    }
  };

  const diceRoll = () => {
    const rollNum = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    playerMoment(rollNum);
  };

  return (
    <div className={styles.Container}>
      <SideBar roll={diceRoll} genrateBoard={genrateBoard} />
      <div className={styles.Wrapper}>
        {rowDetails.map((singleRow, i) => {
          return (
            <Row
              rowDetails={singleRow}
              key={i}
              currentBox={playerDetails.currentBox}
            />
          );
        })}
        <Player />
      </div>
    </div>
  );
};

export default Board;
