import React from 'react';
import Judge from './judge';
import {Col, Row} from 'react-bootstrap';
import './court.css';

class Court extends React.Component {
  render() {
    const organizationParent = this.props.header.querySelector('organization').parentNode,
          allElements = organizationParent.querySelectorAll('*'),
          main_courts = [], appeal_courts = [],
          court_url = `/courts/${this.props.id}`, judge_url = `/judges/${this.props.id}`;

    let is_main_court = true, appeal_judge = '';

    for (let i = 0; i < allElements.length; i++) {
        const childNode = allElements[i];

        if (childNode.tagName === 'organization') {
          if (is_main_court) {
            main_courts.push(childNode);
          } else {
            appeal_courts.push(childNode);
          }
        }

        if (is_main_court && childNode.nextSibling &&
            childNode.nextSibling.textContent.toLowerCase().trim().indexOf('on appeal') > -1) {
          is_main_court = false;
        }

        if ((childNode.nextElementSibling && childNode.nextElementSibling.tagName === 'judge')){
          if (!is_main_court) {
            appeal_judge = childNode.nextElementSibling.textContent;
          }

          break;
        }
    }

    let appeal = '';

    if (appeal_courts.length > 0) {
      appeal = <Col md={{ span: 6, offset: 3 }} className='appeal'>
        <h5>On appeal from</h5>
        <ul>
          { appeal_courts.map(court =>
              <li key={court.getAttribute('refersTo')}>{court.textContent}</li>
          )}
        </ul>
        { appeal_judge ? <p>Judge: <a target="_blank" href={judge_url}>{appeal_judge}</a></p> : ''}
      </Col>
    }

    return (
        <Row className='court'>
          <Col>
            <Row>
              <Col>
                <h4>Court</h4>
                <ul>
                  { main_courts.map(court =>
                    <li key={court.getAttribute('refersTo')}>
                      <a target="_blank" href={court_url}>{court.textContent}</a>
                    </li>
                  )}
                </ul>
              </Col>
              <Col>
                <Judge header={ this.props.header } id={ this.props.id }/>
              </Col>
            </Row>
            <Row>
                { appeal }
            </Row>
          </Col>
        </Row>
    )
  }
}

export default Court;