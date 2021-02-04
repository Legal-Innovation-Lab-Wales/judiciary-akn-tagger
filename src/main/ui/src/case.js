import React from "react";
import CaseHeader from "./case_components/header";
import Court from "./case_components/court";

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
    let headerEl, courtEl;

    if (this.state.xml) {
      const xml = new DOMParser().parseFromString(this.state.xml, "text/xml"),
            header = xml.querySelector('header');

      headerEl = <CaseHeader header={ header }/>
      courtEl = <Court header={ header } />
    }

    return (
      <div className="case">
        { headerEl }
        <hr />
        { courtEl }
        <hr />
      </div>
    )
  }
}

export default Case;