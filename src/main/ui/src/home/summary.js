import React from 'react';
import {Card} from 'react-bootstrap';
import './summary.css';

function Summary(props) {
  return (
    <Card className='case'>
      <Card.Body>
          <a href={`/case/${props.case.file}`}>{props.case.file.replaceAll('_', ' ')}</a>
      </Card.Body>
    </Card>
  )
}

export default Summary;