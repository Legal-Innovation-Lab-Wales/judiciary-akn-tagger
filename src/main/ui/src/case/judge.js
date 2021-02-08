import React from 'react';
import './judge.css'

function Judge(props) {
  const judges = [];

  // Check if this judge node belongs to the before section of the DOM.
  props.header.querySelectorAll('judge').forEach(judge_node => {
    if (judge_node.parentNode.textContent.trim().toLowerCase().indexOf('before') > -1) judges.push(judge_node);
  });

  return (
    <div className='judges'>
      <h4>Judges</h4>
      <ul>
        {judges.map(judge =>
          <li key={judge.getAttribute('refersTo')}>
            <a target="_blank" href={props.judge_url}>{judge.textContent}</a>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Judge;