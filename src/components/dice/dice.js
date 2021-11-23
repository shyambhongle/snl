import React, { useEffect, useRef, useState } from "react";
import styles from "./dice.module.css";

import Dice from "react-dice-roll";
const DiceSound = require("../../assets/roll.wav");

const DiceBox = (props) => {
  const diceRef = useRef();

  const { roll, socket } = props;
  const [diceCheat, setdiceCheat] = useState(0);
  useEffect(() => {
    socket.on("dice-roll", (data) => {
      console.log("SCK dice-roll called", data);
      setdiceCheat(() => data);
      diceRef.current.rollDice();
    });
    return () => {
      socket.off("dice-roll");
    };
  }, []);

  const rollMyDice = (value) => {
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
