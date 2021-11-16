import React from "react";
import styles from "./player.module.css";

const Player = (props) => {
  const { player, playerTurn, index } = props;
  const shape = "square";
  const { boxDetails } = player;
  console.log("klajsc", boxDetails);
  return (
    <>
      {boxDetails.dimension && (
        <div
          className={styles.Container}
          style={{
            top: boxDetails.dimension.offsetTop,
            left: boxDetails.dimension.offsetLeft + 300,
          }}
        >
          <div
            className={`${styles[shape]}`}
            style={{ backgroundColor: `${player.color}` }}
          ></div>
        </div>
      )}
    </>
  );
};

export default Player;
