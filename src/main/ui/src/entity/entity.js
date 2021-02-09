import React from 'react';
import {Alert, Breadcrumb, Col, Container, Row} from 'react-bootstrap';
import Summary from './summary';

class Entity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const entity = this.props.match.params.entity;

    fetch(`/api/${entity}/${id}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    })
        .then(response => {
          switch (response.status) {
            case 200:
              return response.json();
            case 404:
              throw Error(`No such [${entity}] could be found for case law file [${id}]`)
            default:
              throw Error(`An unexpected error occurred when attempting to fetch [${entity}] for case law file [${id}]`);
          }
        })
        .then(data => {
          this.setState({data: data});
        })
        .catch(error => {
          this.setState({error: error.message});
        })
  }

  render() {
    const id = this.props.match.params.id;
    const entity = this.props.match.params.entity;

    if (this.state.error) {
      return <Alert variant='danger'>{this.state.error}</Alert>
    } else {
      return (
          <Container>
            <Row>
              <Col>
                <Breadcrumb>
                  <Breadcrumb.Item href='/'>Index</Breadcrumb.Item>
                  <Breadcrumb.Item href={`/case/${id}`}>{id}</Breadcrumb.Item>
                  <Breadcrumb.Item href={`/${entity}/${id}`}>{entity}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            {this.state.data.map(item => <Summary key={encodeURIComponent(item.name)} data={item}/>)}
          </Container>
      )
    }
  }
}

export default Entity;