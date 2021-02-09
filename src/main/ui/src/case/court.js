import React from 'react';
import Judge from './judge';
import {Col, Row} from 'react-bootstrap';
import './court.css';
import AppealCourt from "./appeal_court";

class Court extends React.Component {
  getCourts() {
    const organization_parent = this.props.header.querySelector('organization').parentNode,
          all_elements = organization_parent.querySelectorAll('*'),
          main_courts = [],
          appeal_courts = [];

    let is_main_court = true, appeal_judge = '';

    for (let i = 0; i < all_elements.length; i++) {
      const child_node = all_elements[i];

      if (child_node.tagName === 'organization') {
        if (is_main_court) {
          main_courts.push(child_node);
        } else {
          appeal_courts.push(child_node);
        }
      }

      if (is_main_court && child_node.nextSibling &&
          child_node.nextSibling.textContent.toLowerCase().trim().indexOf('on appeal') > -1) {
        is_main_court = false;
      }

      if ((child_node.nextElementSibling && child_node.nextElementSibling.tagName === 'judge')){
        if (!is_main_court) {
          appeal_judge = child_node.nextElementSibling.textContent;
        }

        break;
      }
    }

    return [main_courts, appeal_courts, appeal_judge];
  }

  render() {
    const [main_courts, appeal_courts, appeal_judge] = this.getCourts(),
          court_url = `/courts/${this.props.id}`,
          judge_url = `/judges/${this.props.id}`;

    let appeal = '';

    if (appeal_courts.length > 0) {
      appeal = <AppealCourt appeal_courts={appeal_courts} appeal_judge={appeal_judge} judge_url={judge_url} />
    }

    return (
      <Row className='court'>
        <Col>
          <Row>
            <Col>
              <h4>Court</h4>
              <ul>
                {main_courts.map(court =>
                  <li key={court.getAttribute('refersTo')}>
                    <a href={court_url}>{court.textContent}</a>
                  </li>
                )}
              </ul>
            </Col>
            <Col>
              <Judge header={this.props.header} id={this.props.id} judge_url={judge_url}/>
            </Col>
          </Row>
          <Row>
            {appeal}
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Court;