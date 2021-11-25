import React, { useEffect, useState } from "react";
import styles from "./player.module.css";

const initialState = {
  offsetLeft: -100,
  offsetTop: -300,
};

const Player = (props) => {
  const { allPlayers, playerTurn, playerDetails } = props;

  const [playerPosition, setplayerPosition] = useState(initialState);

  useEffect(() => {
    if (
      allPlayers[playerTurn] &&
      allPlayers[playerTurn].playerId === playerDetails.playerId
    ) {
      console.log("Inside kk", playerDetails);
      setplayerPosition(() => {
        return {
          offsetLeft: playerDetails.offsetLeft,
          offsetTop: playerDetails.offsetTop,
        };
      });
    }
  }, [props.playerDetails]);

  return (
    <div
      className={styles.playerWrapper}
      style={{
        left: playerPosition.offsetLeft,
        top: playerPosition.offsetTop,
        backgroundColor: playerDetails.color,
        borderRadius: playerDetails.shape === "square" ? "0px" : "50px",
      }}
    ></div>
  );
};

export default Player;
