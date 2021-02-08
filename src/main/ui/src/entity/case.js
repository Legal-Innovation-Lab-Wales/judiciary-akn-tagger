import React from 'react';
import './case.css';

function Case(props) {
  return <a target="_blank" href={`/case/${props.case}`}>{props.case.replaceAll('_', ' ')}</a>
}

export default Case;