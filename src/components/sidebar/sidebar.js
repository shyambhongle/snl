import React from "react";
import styles from "./sidebar.module.css";

const SideBar = (props) => {
  return (
    <div className={styles.Container}>
      <div className={styles.DiceBtn}>
        <button onClick={props.roll}>Roll</button>
        <button onClick={props.genrateBoard}>genrateBoard</button>
      </div>
    </div>
  );
};

export default SideBar;
