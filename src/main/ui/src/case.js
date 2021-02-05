import React from 'react';
import CaseHeader from './case_components/header';
import Court from './case_components/court';
import Parties from './case_components/parties';
import Judgment from "./case_components/judgment";
import {Alert, Col, Container, Row} from "react-bootstrap";
import './case.css';

class Case extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: ''
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id

    fetch(`/xml/case/${id}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'text/xml'
      }
    })
        .then(response => {
          switch (response.status) {
            case 200:
              return response.text();
            case 404:
              throw Error(`No such case law file could be found: [${id}]`)
            case 500:
              throw Error(`An unexpected error occurred when attempting to fetch case law file: [${id}]`);
          }
        })
        .then(data => {
          this.setState({ xml: data });
        })
        .catch(error => {
          this.setState({ error: error.message });
        })
  }

  render() {
    if (this.state.xml) {
      const xml = new DOMParser().parseFromString(this.state.xml, 'text/xml'),
          header = xml.querySelector('header'),
            judgment = xml.querySelector('judgmentBody');

      return (
          <Container>
            <CaseHeader header={ header }/>
            <hr />
            <Court header={ header } />
            <hr />
            <Parties header={ header } />
            <hr />
            <Judgment judgment={ judgment } />
          </Container>
      )
    } else if (this.state.error) {
      return (
          <Container>
            <Row>
              <Col xs='auto'>
                <Alert variant='danger'>{ this.state.error }</Alert>
              </Col>
            </Row>
          </Container>
      )
    } else {
      return <div/>
    }
  }
}

export default Case;