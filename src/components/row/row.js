import React from "react";
import styles from "./row.module.css";
import Boxes from "../boxes/boxes";

const Row = (props) => {
  const { rowDetails } = props;
  return (
    <div className={styles.Container}>
      {rowDetails.map((boxes) => (
        <Boxes
          boxDetails={boxes}
          key={boxes.displayNum}
          currentBox={props.currentBox}
        />
      ))}
    </div>
  );
};

export default Row;
