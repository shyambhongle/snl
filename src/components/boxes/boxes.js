import React from "react";
import styles from "./boxes.module.css";

const Boxes = (props) => {
  const { boxDetails } = props;
  return (
    <div
      className={styles.Container}
      style={{
        backgroundColor:
          props.currentBox === props.boxDetails.displayNum
            ? "red"
            : boxDetails.color.length
            ? `rgb(${boxDetails.color[0] * 23},${boxDetails.color[1] * 23},${
                boxDetails.color[2] * 23
              })`
            : "gray",
      }}
    >
      <span>{props.boxDetails.displayNum}</span>
    </div>
  );
};

export default Boxes;
