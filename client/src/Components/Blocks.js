import React, { Component } from 'react';

class Blocks extends Component {
  state = {
    blocks: []
  };

  componentDidMount() {
    fetch('http://localhost:3000/api/blocks')
      .then(response => response.json())
      .then(json => this.setState({ blocks: json }));
  }

  renderBlocks = () => {
    const { blocks } = this.state;
    const toReturn = blocks.map(block => {
      return (
        <div key={block.hash}
          className="Block"
        >
          <div>{block.hash}</div>
        </div>
      )
    })

    return toReturn;
  }

  render() {
    return (
      <div>
        <h3>Blocks</h3>
        <div>{this.renderBlocks()}</div>
      </div>
    )
  }
}

export default Blocks;
