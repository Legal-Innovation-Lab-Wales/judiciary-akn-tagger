import React from 'react';
import {Card} from 'react-bootstrap';
import './summary.css';

class Summary extends React.Component {
  render() {
    return (
      <Card className='case'>
        <Card.Body>
            <a target="_blank" href={`/case/${this.props.case.file}`}>{ this.props.case.file.replaceAll('_', ' ') }</a>
        </Card.Body>
      </Card>
    )
  }
}

export default Summary;