import React from "react";
import {Col} from "react-bootstrap";

function AppealCourt(props) {
    return <Col md={{span: 6, offset: 3}} className='appeal'>
      <h5>On appeal from</h5>
      <ul>{props.appeal_courts.map(court =>
          <li key={court.getAttribute('refersTo')}>{court.textContent}</li>)}
      </ul>
      {props.appeal_judge ? <p>Judge: <a href={props.judge_url}>{props.appeal_judge}</a></p> : ''}
    </Col>;
}

export default AppealCourt;