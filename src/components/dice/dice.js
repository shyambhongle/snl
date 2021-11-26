import React, { useEffect, useRef, useState } from "react";
import styles from "./dice.module.css";

import Dice from "react-dice-roll";
const DiceSound = require("../../assets/roll.wav");

const DiceBox = (props) => {
  const diceRef = useRef();

  const { roll, socket, roomDetails, currentDetails, myid } = props;
  const [diceCheat, setdiceCheat] = useState(0);
  useEffect(() => {
    console.log("Roll Dice moved");
    socket.on("dice-roll", ({ diceValue }) => {
      setdiceCheat(() => diceValue);
      diceRef.current.rollDice();
    });
    return () => {
      socket.off("dice-roll");
    };
  }, []);

  const rollMyDice = (value) => {
    socket.emit("dice-move", {
      diceValue: value,
      roomId: roomDetails.roomId,
    });
    setdiceCheat(0);
    roll(value);
  };

  const rollAltDice = (value) => {
    console.log("rollAltDice", value);
    setdiceCheat(0);
    roll(value);
  };

  return (
    <div className={styles.container}>
      <Dice
        size={50}
        cheatValue={diceCheat}
        ref={diceRef}
        onRoll={diceCheat === 0 ? rollMyDice : rollAltDice}
        sound="https://sounds-mp3.com//mp3/0004526.mp3"
      />
    </div>
  );
};

export default DiceBox;
