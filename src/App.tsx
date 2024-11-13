import React from 'react';
import './App.scss';
import Header from "./view/component/Header";
import {Provider} from "react-redux";
import store from "./redux";
import Board from "./view/component/Board";
import GameMap from "./view/component/GameMap";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <Board />
        <GameMap/>
      </div>
    </Provider>
  );
}

export default App;
