import React, { useEffect, useRef, useState } from "react";
import styles from "./canvas.module.css";

function Canvas(props) {
  const { setBoxDetails, totalBoxes } = props;
  const canvasRef = useRef();
  const [context, setContext] = useState();
  const [boardProperties, setBoardProperties] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        setContext(renderCtx);
      }
    }
    if (context) {
      let boardDetails = {
        width: canvasRef.current.offsetHeight,
        height: canvasRef.current.offsetWidth,
      };
      setBoardProperties(boardDetails);
      genrateBoxes();
    }
  }, [context]);

  const genrateBoxes = () => {};

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
