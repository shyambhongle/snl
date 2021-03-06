import React, { useState, useEffect } from "react";
import styles from "./board.module.css";
import io from "socket.io-client";

import Layout from "../layout/layout";
import Controller from "../controller/controller";
import Timer from "../timerSpace/timer";
import CreateRoom from "../createRoom/createRoom";
import background from "../../assets/board.jpeg";

import MuteIcon from "../../assets/no-sound.png";
import UnMuteIcon from "../../assets/sound.png";
import SoundBG from "../../assets/back.mp3";

import { dummyLadder, dummySnakes } from "../../utility/dummyObstacle";

var socket = io("http://192.168.0.104:5000/", {
  transports: ["websocket"],
});

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

const Board = () => {
  const boardHeight = window.screen.height * 0.7;
  const boardWidth = window.screen.width - 10;
  const totalRows = 10;
  const boxesInRows = 10;
  const boxDimension = {
    height: boardHeight / totalRows,
    width: boardWidth / boxesInRows,
  };
  const [layout, setLayout] = useState([]);
  const [obstacle, setObstacle] = useState([]);
  const [players, setPlayers] = useState([]);
  const [roomDetails, setroomDetails] = useState({});
  const [myId, setmyId] = useState("");
  const [dice, setdice] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [gameState, setGameState] = useState(gameStateDetails[0]);

  useEffect(() => {
    genrateBoxes();
    setmyId(Math.floor(100000 + Math.random() * 900000));
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
    setObstacle([...onlySnakes, ...onlyLadder]);
  };

  const diceRoll = (diceValue) => {
    console.log("kaljsc diceValue", diceValue);
    setdice(diceValue);
    let newPlayerTurn = playerTurn + 1;
    if (newPlayerTurn === 2) {
      newPlayerTurn = 0;
    }
    setPlayerTurn(newPlayerTurn);
  };

  const placeSnake = (rows) => {
    const onlySnakes = [];
    let i = 0;

    rows.forEach((_, j) => {
      if (j < 9 && j % 2 === 0) {
        let randomNum = randomNumbers(shuffleArray);
        const snakeObstacle = dummySnakes[i];
        let head =
          rows[snakeObstacle.start.rowNum][snakeObstacle.start.indexNum];
        let tail = rows[snakeObstacle.end.rowNum][snakeObstacle.end.indexNum];
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
        i++;
      }
    });
    return { onlySnakes, boxesAndSnake: rows };
  };

  const placeLadder = (rows) => {
    const onlyLadder = [];
    let j = 0;
    rows.forEach((_, i) => {
      if (i < 9 && i % 2 === 0) {
        let randomNum = randomNumbers();
        const ladderObstacle = dummyLadder[j];
        let startingPoint =
          rows[ladderObstacle.start.rowNum][ladderObstacle.start.indexNum];
        // if (randomNum[1] <= i) {
        //   randomNum[1] = i + 1;
        // }
        // let endPoint = rows[randomNum[1]][randomNum[2]];
        // if (startingPoint.hasObstacle) {
        //   let updatedPoint =
        //     randomNum[0] === 9 || randomNum[0] === 0 ? 8 : randomNum[1] - 1;
        //   startingPoint = rows[i][updatedPoint];
        // }
        // if (endPoint.hasObstacle) {
        //   let updatedPoint =
        //     randomNum[2] === 9 || randomNum[2] === 0 ? 8 : randomNum[1] - 1;
        //   endPoint = rows[randomNum[1]][updatedPoint];
        // }
        let endPoint =
          rows[ladderObstacle.end.rowNum][ladderObstacle.end.indexNum];
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
        j++;
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
    console.log("boxDetails.hasObstacle", boxDetails);
    if (
      boxDetails.hasObstacle &&
      boxDetails.obstacleDetails.currentBox === "head"
    ) {
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
      }, 300);
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

  const startGame = (roomDetails) => {
    setroomDetails(roomDetails);
    setPlayers(roomDetails.players);
    setGameState(gameStateDetails[1]);
  };

  return (
    <>
      {gameState === gameStateDetails[0] ? (
        <CreateRoom
          startGame={startGame}
          roomDetails={roomDetails}
          socket={socket}
          myId={myId}
        />
      ) : (
        <div
          className={styles.boardContainer}
          style={{ backgroundImage: `url(${background})` }}
        >
          <div
            className={styles.board}
            style={{ height: `${boardHeight}px`, width: `${boardWidth}px` }}
          >
            <div className={styles.header}>
              {/* <img src={MuteIcon} alt="sound" className={styles.soundIcon} /> */}
            </div>
            <Layout
              layout={layout}
              boxDimension={boxDimension}
              players={players}
              playerTurn={playerTurn}
              gameState={gameState}
              boardWidth={boardWidth}
              boardHeight={boardHeight}
              obstacle={obstacle}
              socket={socket}
            />
          </div>
          <div className={styles.dashBoard}>
            <Timer />
            <Controller
              diceRoll={diceRoll}
              socket={socket}
              allPlayers={players}
              playerTurn={playerTurn}
              roomDetails={roomDetails}
              diceValue={dice}
              myId={myId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
