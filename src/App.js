import React, { useEffect, useState } from "react";
import "./App.css";

import Board from "./components/board/board";
import SplashScreen from "./components/splashScreen/spalshScreen";

function App() {
  const [splashScreen, setSplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplashScreen(false);
    }, 500);
  }, []);

  return (
    <div className="App">{splashScreen ? <SplashScreen /> : <Board />}</div>
  );
}

export default App;
