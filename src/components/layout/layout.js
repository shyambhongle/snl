import React from "react";
import styles from "./layout.module.css";

import Row from "../row/row";
import Players from "../playersCanvas/playersCanvas";

const gameStateDetails = ["not-started", "started", "end"];

const Layout = (props) => {
  const { layout, boxDimension, players, playerTurn, gameState } = props;
  return (
    <div className={styles.container}>
      {layout.map((rowLayout, i) => (
        <Row rowLayout={rowLayout} key={i} boxDimension={boxDimension} />
      ))}
      {gameState === gameStateDetails[1] && (
        <Players players={players} playerTurn={playerTurn} layout={layout} />
      )}
    </div>
  );
};

export default Layout;
