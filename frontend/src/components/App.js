import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminUpload from './components/AdminUpload';
import CertificateSearch from './components/CertificateSearch';
import "../App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/admin" component={AdminUpload} />
          <Route path="/search" component={CertificateSearch} />
          <Route path="/" exact component={() => <h1>Welcome to Certificate Verification System</h1>} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
