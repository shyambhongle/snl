import React from "react";
import styles from "./controller.module.css";

import PlayerInfo from "../playerInfo/playerInfo";
import Dice from "../dice/dice";

function Controller(props) {
  const {
    diceRoll,
    socket,
    playerTurn,
    allPlayers,
    roomDetails,
    diceValue,
    myId,
  } = props;
  const currentDetails = allPlayers[playerTurn];
  console.log("Main Conreoller", currentDetails, myId);

  return (
    <div className={styles.ctrlWrapper}>
      <PlayerInfo
        reverse={true}
        isActive={"master" === currentDetails.playerType}
        currentDetails={currentDetails}
      />
      <Dice
        roll={diceRoll}
        socket={socket}
        roomDetails={roomDetails}
        diceValue={diceValue}
        myid={myId}
        currentDetails={currentDetails}
      />
      <PlayerInfo
        isActive={"player" === currentDetails.playerType}
        currentDetails={currentDetails}
      />
    </div>
  );
}

export default Controller;
