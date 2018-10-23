import React from 'react';
import ReactDOM from 'react-dom';
import './style_james.css';
import axios from 'axios';
import mongodb from 'mongodb';

const restify = require('restify');
const MongoClient = require('mongodb').MongoClient;
const jsSHA = require('jssha');
const Passport = require('passport');
const PassportHTTPBearer = require('passport-http-bearer');
const uuidv3 = require('uuid/v3');
const errs = require('restify-errors');
const restify_cors = require('restify-cors-middleware')

const UUID_NAMESPACE = "353ac1c0-cab3-11e8-9211-4f01514d4e40";

class App extends React.Component {
  constructor(params) {
    super(params);
    this.state = { clients: [] };
  };

  componentDidMount() {
    const user = 'lazymeercat116';
    const password = 'hottest';

    const hmac = new jsSHA('SHA-256', 'TEXT');
    hmac.setHMACKey(password, 'TEXT');
    hmac.update(user);
    hmac.update(Date.now().toString(36).substring(0, 4));

    const token = `${hmac.getHMAC('HEX')}%${user}`;

    const api = axios.create({
      baseURL: 'http://45.77.58.134:8080',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    (async () => {
      const res = await api.get('/clients');
      const accounts = await api.get(`/accounts/${res.data[0]._id}`)
      this.setState({clients: res.data});
      console.log(accounts);
    })();
  };

  render() {
    return <ul>
      {this.state.clients.map(x =>
        <li key={x._id}>
          {`${x.first} ${x.last} - ${x.id}`}
        </li>
      )}
    </ul>;
  }
}

ReactDOM.render(<App />, document.getElementById('render-element'));
