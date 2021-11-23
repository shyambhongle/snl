import React from "react";
import styles from "./controller.module.css";

import PlayerInfo from "../playerInfo/playerInfo";
import Dice from "../dice/dice";

function Controller(props) {
  const { diceRoll, socket } = props;
  return (
    <div className={styles.ctrlWrapper}>
      <PlayerInfo reverse={true} />
      <Dice roll={diceRoll} socket={socket} />
      <PlayerInfo />
    </div>
  );
}

export default Controller;
