import React from 'react';
import './case.css';

class Case extends React.Component {
  render() {
    return (
        <a href={`/case/${this.props.case}`}>{ this.props.case.replaceAll('_', ' ') }</a>
    )
  }
}

export default Case;