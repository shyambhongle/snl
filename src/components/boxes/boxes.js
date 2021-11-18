import React from "react";
import styles from "./boxes.module.css";

const Boxes = (props) => {
  const { box, boxDimension } = props;
  return (
    <div
      style={{
        height: boxDimension.height,
        width: boxDimension.width,
        position: "relative",
        backgroundColor:
          box.rowNum % 2 === 0
            ? box.indexNum % 2 === 0
              ? "black"
              : "white"
            : box.indexNum % 2 === 0
            ? "white"
            : "black",
      }}
    >
      <span
        style={{
          color:
            box.rowNum % 2 === 0
              ? box.indexNum % 2 === 0
                ? "white"
                : "black"
              : box.indexNum % 2 === 0
              ? "black"
              : "white",
          fontSize: 12,
        }}
      >
        {box.displayNum}
      </span>
      <span
        style={{
          color: box.rowNum % 2 === 0 ? "red" : "red",

          fontSize: 12,
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        {box.indexNum}
      </span>
    </div>
  );
};

export default Boxes;
