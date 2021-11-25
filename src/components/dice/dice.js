import React, { useEffect, useRef, useState } from "react";
import styles from "./dice.module.css";

import Dice from "react-dice-roll";
const DiceSound = require("../../assets/roll.wav");

const DiceBox = (props) => {
  const diceRef = useRef();

  const { roll, socket, roomDetails } = props;
  const [diceCheat, setdiceCheat] = useState(0);
  useEffect(() => {
    socket.on("dice-roll", ({ diceValue }) => {
      if (roomDetails.roomId !== socket.id) {
        setdiceCheat(() => diceValue);
        diceRef.current.rollDice();
      }
    });
    return () => {
      socket.off("dice-roll");
    };
  }, []);

  const rollMyDice = (value) => {
    if (roomDetails.roomId === socket.id) {
      socket.emit("dice-move", {
        diceValue: value,
        roomId: roomDetails.roomId,
      });
    }
    setdiceCheat(0);
    roll(value);
  };

  return (
    <div className={styles.container}>
      <Dice
        size={50}
        cheatValue={diceCheat}
        ref={diceRef}
        onRoll={rollMyDice}
        sound="https://sounds-mp3.com//mp3/0004526.mp3"
      />
    </div>
  );
};

export default DiceBox;
