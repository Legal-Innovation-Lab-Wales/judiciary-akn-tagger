import React from "react";
import { useParams } from "react-router-dom";

function Case() {
  let { id } = useParams();

  return (
    <div>
        <h1>Case Page: {id}</h1>
    </div>
  );
}

export default Case;