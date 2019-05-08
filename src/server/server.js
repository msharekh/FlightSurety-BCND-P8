import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

const TEST_ORACLES_COUNT = 20;

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);


flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log('.....event....')
  console.log(event)
  console.log('OracleRequest-----------------');
  var result = event.returnValues;
  console.log(result);
  console.log(`\n\nOracle Requested: index: ${result[0]}, flight:  ${result[2]}, timestamp: ${result[3]}`);
  console.log('events methods:')
  console.log(event.methods);

  // if (event === 'OracleRequest') {
  //   console.log(`\n\nOracle Requested: index: ${result.args.index.toNumber()}, flight:  ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}`);
  // } else {
  //   console.log(`\n\nFlight Status Available: flight: ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}, status: ${result.args.status.toNumber() == ON_TIME ? 'ON TIME' : 'DELAYED'}, verified: ${result.args.verified ? 'VERIFIED' : 'UNVERIFIED'}`);
  // }
});






flightSuretyApp.events.OracleReport({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log('.....event....')
  console.log(event)
  console.log('OracleReport-----------------');
  var result = event.returnValues;
});

const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp! --------------------'
  })
})

console.log(flightSuretyApp.methods);

for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
  await flightSuretyApp.methods.registerOracle({ from: accounts[a], value: fee });
  let result = await config.flightSuretyApp.getOracle(accounts[a]);
  console.log(`Oracle registered account${accounts[a]}: ${result[0]} ${result[1]} ${result[2]}`);

}


// flightSuretyApp.methods.isOperational(), (error, contract) => {
//   debugger
//   console.log('airlines:------');
//   console.log(contract);

//   flightSuretyApp.methods.getAirlinesAdresses((error, contract) => {
//   });
// }
console.log('out...');


c('start of code...................');


// async function test() {
//   console.log('hhhhhhh');


// }

// test();

async () => {


  //first register oracles
  // ARRANGE
  let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

  // ACT
  for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
    await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
    let result = await config.flightSuretyApp.getOracle(accounts[a]);
    console.log(`Oracle registered account${accounts[a]}: ${result[0]} ${result[1]} ${result[2]}`);

  }


  //then submit response 
  for (let a = 1; a < TEST_ORACLES_COUNT; a++) {

    // Get oracle information
    let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
    for (let idx = 0; idx < 3; idx++) {

      try {
        // Submit a response...it will only be accepted if there is an Index match
        await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, { from: accounts[a] });

      }
      catch (e) {
        // Enable this when debugging
        console.log('\nError', idx, oracleIndexes[idx].toNumber(), flight, timestamp);
      }

    }
  }

}
// }
// flightSuretyApp.methods.getAirlinesAdresses()((error, result) => {
//   console.log(result);

// })

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


