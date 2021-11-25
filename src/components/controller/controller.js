import React from "react";
import styles from "./controller.module.css";

import PlayerInfo from "../playerInfo/playerInfo";
import Dice from "../dice/dice";

function Controller(props) {
  const { diceRoll, socket, playerTurn, allPlayers, roomDetails, diceValue } =
    props;
  console.log("khac", allPlayers, playerTurn);
  const hasPlayers = allPlayers.length
    ? allPlayers[playerTurn].playerId
    : false;
  return (
    <div className={styles.ctrlWrapper}>
      <PlayerInfo reverse={true} isActive={socket.id === hasPlayers} />
      <Dice
        roll={diceRoll}
        socket={socket}
        roomDetails={roomDetails}
        diceValue={diceValue}
      />
      <PlayerInfo isActive={socket.id === hasPlayers} />
    </div>
  );
}

export default Controller;
