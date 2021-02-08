import React from 'react';
import Party from './party';
import {Col, Row} from 'react-bootstrap';

function Parties(props) {
  const parties = {};

  props.header.querySelectorAll('party').forEach(party_node => {
    const party_type = party_node.getAttribute('as');
    if (!parties[party_type]) parties[party_type] = [];
    parties[party_type].push(party_node);
  });

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h4>Parties</h4>
          </Col>
        </Row>
        {Object.keys(parties).map(party_type =>
          <Party key={party_type} header={props.header} type={party_type} nodes={parties[party_type]} id={props.id}/>
        )}
      </Col>
    </Row>
  )
}

export default Parties;