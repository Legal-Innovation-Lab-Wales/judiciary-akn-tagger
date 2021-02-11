import React from "react";

function Lawyer(props) {
  const node = props.node;
  let lawyer_type = props.node.getAttribute('as').replace('#', '');
  lawyer_type = `${lawyer_type.substr(0, 1).toUpperCase()}${lawyer_type.substr(1)}`;

  return (
    <li><a href={props.url}>{node.textContent}</a> {`(${lawyer_type})`}</li>
  )
}

export default Lawyer;