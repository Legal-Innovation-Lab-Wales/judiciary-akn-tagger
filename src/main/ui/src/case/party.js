import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './party.css';
import Lawyer from "./lawyer";

function Party(props) {
  const parties_url = `/parties/${props.id}`,
        lawyers_url=`/lawyers/${props.id}`,
        lawyer_nodes = [];

  // Find all of the lawyers linked to the party members.
  props.nodes.forEach(party_node => {
    const key = party_node.getAttribute('refersTo');
    let query_selector = `lawyer[for="${key}"]`;

    // If a lawyer has multiple parties then they need to be searched either at start of list or within the list.
    if (props.nodes.length > 1) {
      query_selector += `,lawyer[for*=";${key.replace('#', '')};"]`
    }

    props.header.querySelectorAll(query_selector).forEach(lawyer_node => {
      // Add the lawyer to array if missing.
      if (lawyer_nodes.indexOf(lawyer_node) === -1) lawyer_nodes.push(lawyer_node)
    });
  });

  return (
      <Row className='party'>
        <Col>
          <h5>{props.header.querySelector(`role[refersTo="${props.type}"]`).textContent}</h5>
          <ul>
            {props.nodes.map(node =>
              <li key={node.getAttribute('refersTo')}>
                {node.textContent}
              </li>
            )}
          </ul>
        </Col>
        <Col>
          <h5>Lawyers</h5>
          <ul>
            {lawyer_nodes.map(node => <Lawyer key={node.getAttribute('refersTo')} node={node} url={lawyers_url}/>)}
          </ul>
        </Col>
      </Row>
  )
}

export default Party;