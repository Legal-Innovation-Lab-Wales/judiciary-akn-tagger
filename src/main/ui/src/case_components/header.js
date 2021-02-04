import React from 'react';

class CaseHeader extends React.Component {
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
        <div className='header'>
          <p>Neutral citation number: {neutral_citation}</p>
          <p>Case Number: {case_number}</p>
          <p>Hand-down date: {hand_down_date}</p>
          <p>Hearing date: {hearing_date}</p>
        </div>
    )
  }
}

export default CaseHeader;