import React from "react";
import styles from "./obstacle.module.css";

const Obstacle = (props) => {
  const { start, end, color, obstacleType } = props.obstacleDetails;
  console.log(
    props.index === 1
      ? `${Math.ceil(start.dimension.offsetLeft)},${Math.ceil(
          start.dimension.offsetTop
        )}, ${Math.ceil(end.dimension.offsetLeft)},${Math.ceil(
          end.dimension.offsetTop
        )},`
      : ""
  );
  console.log(props.index === 1 ? props.obstacleDetails : "");
  return (
    <div className={styles.Container}>
      {props.index === 1 && (
        <svg>
          <line x1="" y1="0" x2="810" y2="476" stroke="green" />
        </svg>
      )}
    </div>
  );
};

export default Obstacle;
