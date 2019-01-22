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
            0: "b"
          },
          "b": {}
        }} />
      </div>
    );
  }
}

export default App;
