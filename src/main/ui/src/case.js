import React from 'react';
import CaseHeader from './case_components/header';
import Court from './case_components/court';
import Parties from './case_components/parties';
import Judgment from "./case_components/judgment";
import {Container} from "react-bootstrap";

class Case extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: ''
    }
  }

  componentDidMount() {
    fetch('/xml/case/' + this.props.match.params.id, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/xml'
      }
    })
        .then(response => response.text())
        .then(data => {
          this.setState({ xml: data });
        })
        .catch(error => {
          console.error(error);
        })
  }

  render() {
    let header, court, parties, judgment;

    if (this.state.xml) {
      const xml = new DOMParser().parseFromString(this.state.xml, 'text/xml'),
            header_node = xml.querySelector('header'),
            judgment_body = xml.querySelector('judgmentBody');

      header = <CaseHeader header={ header_node }/>
      court = <Court header={ header_node } />
      parties = <Parties header={ header_node } />
      judgment = <Judgment judgment={ judgment_body } />
    }

    return (
      <Container>
        { header }
        <hr />
        { court }
        <hr />
        { parties }
        <hr />
        { judgment }
      </Container>
    )
  }
}

export default Case;