import React, { useEffect, useRef, useState } from "react";
import styles from "./canvas.module.css";

function Canvas(props) {
  const canvasRef = useRef();
  const [context, setContext] = useState();
  const obstacles = props.obstacle;
  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        setContext(renderCtx);
      }
    }

    // Draw a circle
    if (context) {
      obstacles.forEach((obstacle) => {
        const { startBox, endBox, color, obstacleType } = obstacle;
        context.strokeStyle = obstacleType === "snake" ? "red" : "blue";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(startBox.offsetLeft, startBox.offsetTop);
        context.lineTo(endBox.offsetLeft, endBox.offsetTop);
        context.stroke();
      });
      // context.beginPath();
      // context.rect(20, 20, 150, 100);
      // context.stroke();
    }
  }, [context, obstacles]);
  return (
    <div className={styles.canvasConatiner}>
      <canvas
        id="canvas"
        ref={canvasRef}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
}

export default Canvas;
