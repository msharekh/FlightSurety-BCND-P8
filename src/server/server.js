import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);


flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})

c('start of code...................');

flightSuretyApp.methods.getAirlinesAdresses()((error, result) => {
  console.log(result);

})

// c(flightSuretyApp.methods)
// contract('Oracles', async (accounts) => {
//   // c(accounts[0])
//   // flightSuretyApp.methods.registerOracle({ from: accounts[a], value: fee });
//   console.log('xxxxx');

// });
// contract();
c('end of code...................');

function c(txt) {
  console.log(txt);

}

export default app;


