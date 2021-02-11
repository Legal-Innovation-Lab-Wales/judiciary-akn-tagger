import React from 'react';
import {Col, Row} from 'react-bootstrap';
import './header.css';

class CaseHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pdf_url: '/',
      legal_doc_ml_url: `/xml/case/${this.props.id}`
    }
  }

  componentDidMount() {
    fetch(`/api/case/${this.props.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          pdf_url: data.url,
          legal_doc_ml_url: `/xml/case/${this.props.id}`
        });
      });
  }

  getText(selector) {
    const node = this.props.header.querySelector(selector);
    return !node ? 'N/A' : node.textContent;
  }

  // It's possible for a hearing date to be a time range of the format X - Y Mon Year.
  formatDate(dates) {
    return dates.length === 0 ? 'N/A' :
            dates.length > 1 ? `${dates[0].textContent} - ${dates[1].textContent}` : dates[0].textContent;
  }

  render() {
    const neutral_citation = this.getText('neutralCitation'),
          case_number = this.getText('docNumber'),
          hand_down_date = this.getText('date[refersTo="#hand-downDate"]'),
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
            <p>Click <a href={this.state.pdf_url}>here</a> to see the pdf.</p>
            <p>Click <a href={this.state.legal_doc_ml_url}>here</a> to see the LegalDocML</p>
          </div>
        </Col>
      </Row>
    )
  }
}

export default CaseHeader;