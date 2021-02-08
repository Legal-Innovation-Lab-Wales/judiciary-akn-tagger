import React from 'react';
import {Accordion, Card} from 'react-bootstrap';
import Case from './case';
import './summary.css';

class Summary extends React.Component {
  render() {
    const id = encodeURIComponent(this.props.data.name);

    return (
        <Accordion key={id}>
          <Card>
            <Accordion.Toggle as={Card.Header} variant='link' eventKey={id}>
              {this.props.data.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={id}>
              <div className='cases'>
                <ul>
                  { this.props.data.cases.map(item => <li><Case key={`${id}_${item}`} case={item} /></li>) }
                </ul>
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    )
  }
}

export default Summary;