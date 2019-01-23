import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HexagonalMesh from './HexagonalMesh';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HexagonalMesh sideLen={10} center={{x: 50, y: 50}} g={{
          "a": {
            2: "b"
          },
          "b": {
            5: "a",
            2: "c"
          },
          "c": {
            5: "b",
            1: "d"
          },
          "d": {
            4: "c"
          }
        }} />
      </div>
    );
  }
}

export default App;
