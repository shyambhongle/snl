import React from "react";
import styles from "./layout.module.css";

import Row from "../row/row";
import PlayersCanvas from "../playersCanvas/playersCanvas";
import Canvas from "../canvas/canvas";

const gameStateDetails = ["not-started", "started", "end"];

const Layout = (props) => {
  const {
    layout,
    boxDimension,
    players,
    playerTurn,
    gameState,
    obstacle,
    boardHeight,
    boardWidth,
  } = props;
  return (
    <div className={styles.container}>
      <Canvas obstacle={obstacle} height={boardHeight} width={boardWidth} />
      {layout.map((rowLayout, i) => (
        <Row rowLayout={rowLayout} key={i} boxDimension={boxDimension} />
      ))}
      {gameState === gameStateDetails[1] && (
        <PlayersCanvas
          players={players}
          playerTurn={playerTurn}
          layout={layout}
        />
      )}
    </div>
  );
};

export default Layout;
