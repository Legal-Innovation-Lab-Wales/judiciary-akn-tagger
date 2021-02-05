import React from "react";
import {Col, Row} from "react-bootstrap";

class Judgment extends React.Component {
  render() {
    let elements = [];
    let tblockIndex = 1;

    this.props.judgment.querySelectorAll('tblock, paragraph').forEach(element => {
      if (element.tagName === 'tblock') {
        elements.push(
            <p className='tblock' key={`tblock-${tblockIndex}`}>{element.textContent}</p>
        );
        tblockIndex++;
      } else {
        elements.push(
            <li key={element.querySelector('num').textContent}>
              {element.querySelector('content').textContent}
            </li>
        );
      }
    });

    return (
        <Row className='judgment'>
          <Col>
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