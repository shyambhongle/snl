import React from "react";
import styles from "./playerInfo.module.css";

const PlayerInfo = (props) => {
  const { reverse } = props;
  return (
    <div
      className={styles.container}
      style={{ flexDirection: reverse ? "row-reverse" : "row" }}
    >
      <div className={styles.playerProp}>
        <div className={styles.playerPropInfo}></div>
      </div>
      <div className={styles.playerNameWrap}>
        <div className={styles.playerName}>Shyam</div>
      </div>
    </div>
  );
};

export default PlayerInfo;
