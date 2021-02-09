import React from 'react';
import {Breadcrumb, BreadcrumbItem, Col, Container, Row} from 'react-bootstrap';
import Summary from './summary';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    fetch('/api/cases', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json'
      }
    })
        .then(response => response.json())
        .then(data => {
          this.setState({data: data});
        })
        .catch(error => {
          console.error(error);
        })
  }

  render() {
    return (
        <Container>
          <Row>
            <Col>
              <Breadcrumb>
                <Breadcrumb.Item href="/" active>Index</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Row>
            <Col>{this.state.data.map(item => <Summary key={item.file} case={item}/>)}</Col>
          </Row>
        </Container>
    )
  }
}

export default Home;