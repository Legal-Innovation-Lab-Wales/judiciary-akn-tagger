import React from "react";
import {Col, Container, Row, Button} from "react-bootstrap";
import "./home.css";

function Home() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col className="home" xs={12} md={10}>
          <h1 className="text-center">AKN Judiciary Demo</h1>
          <h5 className="text-center">
            The AKN Judiciary demo has been developed as part of a collaboration partnership between the&nbsp;
            <a href="https://legaltech.wales">Legal Innovation Lab Wales</a> and&nbsp;
            <a href="https://www.readcontract.com">ReadContract</a>.
          </h5>
          <p>
            The demo aims at promoting the use of standard XML formats for the legal domain such as&nbsp;
            <a href="https://www.oasis-open.org/committees/legaldocml">LegalDocML</a> and&nbsp;
            <a href="https://www.w3.org/OWL">Web Ontology Language (OWL)</a>.
            These standards are at the basis of explainable Artificial Intelligence
            technologies and are likely to be seen frequently in the near-future of LegalTech.
          </p>
          <p>
            Similar to what has already done by&nbsp;
            <a href="https://www.legislation.gov.uk">legislation.gov.uk</a>,
            which published all UK legislation in LegalDocML
            (<a href="http://www.legislation.gov.uk/projects/drafting-tool#Technologychoices">see here</a>),
            we crawled one hundred case law files from the&nbsp;
            <a href="https://www.judiciary.uk/">Courts and Tribunal Judiciary</a> and tagged them in LegalDocML
            while recognizing dates, parties, judges and other named entities.
          </p>
          <p>
            <a href="https://www.readcontract.com">ReadContract</a> has been used to extract the text
            and the structural information (titles, paragraphs, indexes, etc.) from the input PDF files.
            The tagging in LegalDocML has been done via the&nbsp;
            <a href="http://www.liviorobaldo.com/sdftagger.html">SDFTagger Java library</a>,
            available under GNU/LGPL license. Named entities have been collected and stored within an OWL knowledge
            graph, which guides the navigation.
          </p>
          <h5>You can view the annotated files and navigate through there connections at the button below </h5>
          <div className="text-center mb-3"><Button size="lg" href="/list" variant="outline-primary">Demo</Button>{' '}</div>

          <p>
            The source code of this demo is available here on&nbsp;
            <a href="https://github.com/Legal-Innovation-Lab-Wales/judiciary-akn-tagger">GitHub</a> under the&nbsp;
            <a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html">GNU LGPL-2.1 License</a>
          </p>
          <p>
            Please contact Livio Robaldo
            (<a href="mailto:livio.robaldo@swansea.ac.uk">livio.robaldo@swansea.ac.uk</a>) for further information
            or if you are  interested in running research collaborations with the&nbsp;
            <a href="https://legaltech.wales">Legal Innovation Lab Wales</a> aimed at addressing similar
            legal information extraction and management use cases.
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;