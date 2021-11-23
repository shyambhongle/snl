import React from "react";
import styles from "./createRoom.module.css";

const CreateRoom = () => {
  return (
    <div className={styles.container}>
      <span className={styles.headerNote}>Create Room</span>
      <div className={styles.playerDetails}>
        <div className={styles.singlePlayers}>
          <div className={styles.profile}></div>
          <div className={styles.name}>Rambo</div>
        </div>
        <span className={styles.vsText}>Vs</span>
        <div className={styles.singlePlayers}>
          {1 > 2 && (
            <>
              <div className={styles.addPlayer}></div>
              <div className={styles.name}>?</div>
            </>
          )}
          <div className={styles.profile}></div>
          <div className={styles.name}>Marco</div>
        </div>
      </div>
      {1 > 2 && (
        <span className={styles.infoNote}>Share the link to other player.</span>
      )}
      <span className={styles.gameNote}>Game Starts in 3s</span>
    </div>
  );
};

export default CreateRoom;
