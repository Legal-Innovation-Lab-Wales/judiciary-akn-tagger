import React from "react";

class Judgment extends React.Component {
  render() {
    let elements = [];
    let tblockIndex = 1;

    this.props.judgment.querySelectorAll('tblock, paragraph').forEach(element => {
      if (element.tagName === 'tblock') {
        elements.push(
            <p className='tblock' key={`tblock-${tblockIndex}`}>{element.textContent}</p>
        );
        tblockIndex++;
      } else {
        elements.push(
            <li key={element.querySelector('num').textContent}>
              {element.querySelector('content').textContent}
            </li>
        );
      }
    });

    return (
        <div className='judgment'>
          <h3>Approved Judgment</h3>
          <ol>
            { elements }
          </ol>
        </div>
    )
  }
}

export default Judgment