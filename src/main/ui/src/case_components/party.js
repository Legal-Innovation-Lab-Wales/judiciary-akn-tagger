import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './party.css';

class Party extends React.Component {
  render() {
    let type = this.props.header.querySelector(`role[refersTo='${this.props.type}']`).textContent;

    const lawyer_key = this.props.nodes
        .map(node => node.getAttribute('refersTo'))
        .reverse()
        .map(party => party.substr(1)).join(';');

    const lawyer_nodes = [];
    this.props.header.querySelectorAll(`lawyer[for='#${lawyer_key}']`).forEach(node => lawyer_nodes.push(node));

    return (
        <Row className='party'>
          <Col>
            <h5>{ type }</h5>
            <ul>
              { this.props.nodes.map(node => <li key={node.getAttribute('refersTo')}><a href='/'>{node.textContent}</a></li>) }
            </ul>
          </Col>
          <Col>
            <h5>Lawyers</h5>
            <ul>
              { lawyer_nodes.map(node => <li key={node.getAttribute('refersTo')}><a href='/'>{node.textContent}</a></li> ) }
            </ul>
          </Col>
        </Row>
    )
  }
}

export default Party