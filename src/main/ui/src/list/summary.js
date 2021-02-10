import React from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import './summary.css';

function Summary(props) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const hand_down_date = new Date(props.case.hand_down_date);

  return (
    <Card className='case'>
      <a href={`/case/${props.case.file}`}>
        <Card.Body>
          <Row>
            <Col>{props.case.file.replaceAll('_', ' ')}</Col>
            <Col className='hand-down-date'>{hand_down_date.toLocaleDateString('en-GB', options)}</Col>
          </Row>
        </Card.Body>
      </a>
    </Card>
  )
}

export default Summary;