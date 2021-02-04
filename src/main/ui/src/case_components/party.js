import React from 'react';

class Party extends React.Component {
  render() {
    let type = this.props.header.querySelector(`role[refersTo="${this.props.type}"]`).textContent;

    const lawyer_key = this.props.nodes
        .map(node => node.getAttribute('refersTo'))
        .reverse()
        .map(party => party.substr(1)).join(';');

    const lawyer_nodes = [];
    this.props.header.querySelectorAll(`lawyer[for="#${lawyer_key}"]`).forEach(node => lawyer_nodes.push(node));

    return (
        <div className='party'>
          <div className='persons'>
            <h4>{ type }</h4>
            <ul>
              { this.props.nodes.map(node => <li key={node.getAttribute('refersTo')}>{node.textContent}</li>) }
            </ul>
          </div>
          <div className='lawyers'>
            <h4>Lawyers</h4>
            <ul>
              { lawyer_nodes.map(node => <li key={node.getAttribute('refersTo')}>{node.textContent}</li> ) }
            </ul>
          </div>
        </div>
    )
  }
}

export default Party