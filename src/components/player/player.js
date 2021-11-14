import React from "react";
import styles from "./player.module.css";

const Player = () => {
  const shape = "square";
  const color = "blue";
  return (
    <div className={styles.Container}>
      <div className={`${styles[shape]} ${styles[color]}`}></div>
    </div>
  );
};

export default Player;
