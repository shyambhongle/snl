import React from "react";
import styles from "./playersCanvas.module.css";

import Player from "../player/player";

const PlayersCanvas = (props) => {
  const { players, playerTurn } = props;
  return (
    <div className={styles.container}>
      {players.map((player, i) => {
        return (
          <Player
            playerDetails={player}
            key={i}
            playerTurn={playerTurn}
            allPlayers={players}
          />
        );
      })}
    </div>
  );
};

export default PlayersCanvas;
