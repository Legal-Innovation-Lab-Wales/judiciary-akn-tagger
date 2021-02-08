import React from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import Summary from '../link_components/summary';

class Link extends React.Component {
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
        .then(response => response.json())
        .then(data => {
          this.setState({ data: data });
        });
  }

  render() {
    return (
        <Container>
          { this.state.data.map(item => <Summary key={encodeURIComponent(item.name)} data={item}/>) }
        </Container>
    )
  }
}

export default Link;