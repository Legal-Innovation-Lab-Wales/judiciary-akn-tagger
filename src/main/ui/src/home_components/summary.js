import React from 'react';
import {Card} from 'react-bootstrap';

class Summary extends React.Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title><a href={`/case/${this.props.case.file}`}>{ this.props.case.file.replaceAll('_', ' ') }</a></Card.Title>
        </Card.Body>
      </Card>
    )
  }
}

export default Summary;