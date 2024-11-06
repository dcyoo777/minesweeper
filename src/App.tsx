import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Header from "./view/component/Header";
import {Provider} from "react-redux";
import store from "./redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
      </div>
    </Provider>
  );
}

export default App;
