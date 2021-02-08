import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './judgment.css';

class Judgment extends React.Component {
  render() {
    let elements = [];
    let tblock_index = 1;

    this.props.judgment.querySelectorAll('tblock, paragraph').forEach(element => {
      if (element.tagName === 'tblock') {
        elements.push(
            <p className='tblock' key={`tblock-${tblock_index}`}>{element.textContent}</p>
        );
        tblock_index++;
      } else {
        elements.push(
            <li key={element.querySelector('num').textContent}>
              {element.querySelector('content').textContent}
            </li>
        );
      }
    });

    return (
        <Row>
          <Col className='judgment'>
            <h3>Approved Judgment</h3>
            <ol>
              { elements }
            </ol>
          </Col>
        </Row>
    )
  }
}

export default Judgment