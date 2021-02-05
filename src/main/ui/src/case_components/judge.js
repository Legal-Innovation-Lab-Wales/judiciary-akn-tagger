import React from 'react';

class Judge extends React.Component {
  render() {
    const all_judge_nodes = this.props.header.querySelectorAll('judge'),
          judges = [];

    // Check if this judge node belongs to the Before: ... section of the DOM.
    all_judge_nodes.forEach(judge_node => {
      if (judge_node.parentNode.textContent.trim().toLowerCase().indexOf('before:') > -1) {
        judges.push(judge_node);
      }
    });

    return (
        <div className='judges'>
          <h4>Judges:</h4>
          <ul>
            {judges.map(judge => <li key={judge.getAttribute('refer')}>{judge.textContent}</li>)}
          </ul>
        </div>
    )
  }
}

export default Judge;