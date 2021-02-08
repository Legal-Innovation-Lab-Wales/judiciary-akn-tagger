import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './header.css';

class CaseHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '/',
    }
  }

  componentDidMount() {
    fetch(`/api/case/${this.props.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState(data);
      });
  }

  // It's possible for a hearing date to be a time range of the format X - Y Mon Year.
  formatDate(dates) {
    return dates.length > 1 ? `${dates[0].textContent} - ${dates[1].textContent}` : dates[0].textContent;
  }

  render() {
    const neutral_citation = this.props.header.querySelector('neutralCitation').textContent,
          case_number = this.props.header.querySelector('docNumber').textContent,
          hand_down_date = this.props.header.querySelector('date[refersTo="#hand-downDate"]').textContent,
          hearing_date = this.formatDate(this.props.header.querySelectorAll('date[refersTo="#hearing"]'));

    return (
      <Row>
        <Col>
          <p><strong>Neutral citation number:</strong> {neutral_citation}</p>
          <p><strong>Case Number:</strong> {case_number}</p>
          <p><strong>Hand-down date:</strong> {hand_down_date}</p>
          <p><strong>Hearing date:</strong> {hearing_date}</p>
        </Col>
        <Col xs='auto'>
          <div className='links'>
            <p>Click <a target="_blank" href={this.state.url}>here</a> to see the pdf.</p>
            <p>Click <a target="_blank" href={this.state.url}>here</a> to see the LegalDocML</p>
          </div>
        </Col>
      </Row>
    )
  }
}

export default CaseHeader;