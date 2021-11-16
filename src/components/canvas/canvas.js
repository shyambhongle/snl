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
        const { start, end, color, obstacleType } = obstacle;
        context.strokeStyle = obstacleType === "snake" ? "red" : "blue";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(start.dimension.offsetLeft, start.dimension.offsetTop);
        context.lineTo(end.dimension.offsetLeft, end.dimension.offsetTop);
        context.stroke();
      });
      // context.beginPath();
      // context.rect(20, 20, 150, 100);
      // context.stroke();
    }
  }, [context, obstacles]);
  return (
    <div className={styles.Container}>
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
