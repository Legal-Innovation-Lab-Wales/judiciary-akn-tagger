import React from 'react';
import Judge from './judge';

class Court extends React.Component {
  render() {
    const organizationParent = this.props.header.querySelector('organization').parentNode,
          allElements = organizationParent.querySelectorAll('*'),
          main_courts = [], appeal_courts = [];

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
      appeal = <div className='appeal'>
        <h4>On appeal from:</h4>
        <ul>
          { appeal_courts.map(court => <li key={court.getAttribute('refersTo')}>{court.textContent}</li>)}
        </ul>
        { appeal_judge ? <p>Judge: {appeal_judge} </p> : ''}
      </div>
    }

    return (
        <div className='court'>
          <div className='main'>
            <h4>Court: </h4>
            <ul>
              { main_courts.map(court => <li key={court.getAttribute('refersTo')}>{court.textContent}</li>)}
            </ul>
          </div>
          <Judge header={this.props.header} />
          { appeal }
        </div>
    )
  }
}

export default Court;