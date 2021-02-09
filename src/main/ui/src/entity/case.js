import React from 'react';
import './case.css';

function Case(props) {
  return <a href={`/case/${props.case}`}>{props.case.replaceAll('_', ' ')}</a>
}

export default Case;