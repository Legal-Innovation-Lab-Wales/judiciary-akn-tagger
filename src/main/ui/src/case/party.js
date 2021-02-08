import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './party.css';

function Party(props) {
  const parties_url = `/parties/${props.id}`,
        lawyers_url=`/lawyers/${props.id}`,
        lawyer_key_colon = props.nodes
            .map(node => node.getAttribute('refersTo'))
            .reverse()
            .map(party => party.substr(1)).join(';'),
        lawyer_nodes = Array.from(props.header.querySelectorAll(`lawyer[for="#${lawyer_key_colon}"]`))

  return (
      <Row className='party'>
        <Col>
          <h5>{props.header.querySelector(`role[refersTo="${props.type}"]`).textContent}</h5>
          <ul>
            {props.nodes.map(node =>
              <li key={node.getAttribute('refersTo')}>
                <a target="_blank" href={parties_url}>{node.textContent}</a>
              </li>
            )}
          </ul>
        </Col>
        <Col>
          <h5>Lawyers</h5>
          <ul>
            {lawyer_nodes.map(node =>
              <li key={node.getAttribute('refersTo')}>
                <a target="_blank" href={lawyers_url}>{node.textContent}</a>
              </li>
            )}
          </ul>
        </Col>
      </Row>
  )
}

export default Party;