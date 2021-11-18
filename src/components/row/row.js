import React from "react";
import styles from "./row.module.css";
import Boxes from "../boxes/boxes";

const Row = (props) => {
  const { rowLayout, boxDimension } = props;
  return (
    <div className={styles.wrapper}>
      {rowLayout.map((box, i) => {
        return <Boxes key={i} box={box} boxDimension={boxDimension} />;
      })}
    </div>
  );
};

export default Row;
