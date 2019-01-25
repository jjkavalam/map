import React, { Component } from 'react';

import './App.css';
import HexagonalMesh from './HexagonalMesh';
import { Cell } from './Model';

type State = {
  cells: Array<Cell>
};

class App extends Component<{}, State> {
  
  constructor(props) {
    super(props);
    this.state = { 
      cells : [
        new Cell("a", {2: "b"}),
        new Cell("b", {5: "a", 2: "c"}),
        new Cell("c", {5: "b", 1: "d"}),
        new Cell("d", {4: "c"})
        ]
    };
  }

  render() {
    return (
      <div className="App">
        <HexagonalMesh sideLen={10} center={{x: 50, y: 50}} cells={this.state.cells} />
      </div>
    );
  }
}

export default App;
