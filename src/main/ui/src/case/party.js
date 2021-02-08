import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './party.css';

class Party extends React.Component {
  render() {
    let type = this.props.header.querySelector(`role[refersTo='${this.props.type}']`).textContent;

    const lawyer_key_colon = this.props.nodes
        .map(node => node.getAttribute('refersTo'))
        .reverse()
        .map(party => party.substr(1)).join(';');

    const lawyer_nodes = [];
    this.props.header.querySelectorAll(`lawyer[for='#${lawyer_key_colon}']`)
        .forEach(node => lawyer_nodes.push(node));

    const parties_url = `/parties/${this.props.id}`, lawyers_url=`/lawyers/${this.props.id}`;

    return (
        <Row className='party'>
          <Col>
            <h5>{ type }</h5>
            <ul>
              { this.props.nodes.map(node =>
                  <li key={node.getAttribute('refersTo')}>
                    <a target="_blank" href={parties_url}>{node.textContent}</a>
                  </li>
              ) }
            </ul>
          </Col>
          <Col>
            <h5>Lawyers</h5>
            <ul>
              { lawyer_nodes.map(node =>
                  <li key={node.getAttribute('refersTo')}>
                    <a target="_blank" href={lawyers_url}>{node.textContent}</a>
                  </li>
              ) }
            </ul>
          </Col>
        </Row>
    )
  }
}

export default Party