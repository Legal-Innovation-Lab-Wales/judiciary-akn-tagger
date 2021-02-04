import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Case from "./case";
import Home from "./home";

function App() {
  return (
    <Router>
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/case/:id" children={<Case />} />
            <Route path="*">
              <Redirect to="/" />
            </Route>
        </Switch>
    </Router>
  );
}

export default App;
