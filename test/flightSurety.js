var Test = require("../config/testConfig.js");
var BigNumber = require("bignumber.js");
var Web3 = require("web3");
/* let testAddresses = [
    "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2", //0
    "0xF014343BDFFbED8660A9d8721deC985126f189F3", //1
    "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9", //2
    "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4", //3
    "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86", //4
    "0x6b85cc8f612d5457d49775439335f83e12b8cfde", //5
    "0xcbd22ff1ded1423fbc24a7af2148745878800024", //6
    "0xc257274276a4e539741ca11b590b9447b26a8051", //7
    "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"  //8
]; */
// Available Accounts
// ======================================================
// Airlines:
// (0) 0x68f48429f451934fd1032ba63be0f72eb10424eb (~100 ETH)
// (1) 0x18495d2af425d56005812644136bf68282188aea (~100 ETH)
// (2) 0xc61c9dadd04970bcd7802ecebf758f87b1e35d15 (~100 ETH)
// (3) 0xa513e91f2aaa5ec9b9b4815f44494fb323ae8a08 (~100 ETH)
// (4) 0xd64f959e7f9060e034c0fc9d61c5bc0b71e0d38c (~100 ETH)
// Passengers:
// (5) 0x5e432600a3a158fbd90e9bce14089d1551b60007 (~100 ETH)
// (6) 0xd1e7d7e8468e83282f5b506bc57cac3c380e38e9 (~100 ETH)
// (7) 0x6de39a2aad3e1aab5e26d272c749224c39643ac9 (~100 ETH)
// (8) 0xf29001bf5449022cdc7111e2f18d99395f61819c (~100 ETH)
// (9) 0xfbedee2f31462596681a486e6e91f4cf00c69f1f (~100 ETH)
contract("Flight Surety Tests", async accounts => {
  var config;
  var web3;
  const TEST_ORACLES_COUNT = 10;

  before("setup contract", async () => {
    config = await Test.Config(accounts);
    web3 = new Web3(Web3.givenProvider);
    // let balance = await web3.eth.getBalance(config.flightSuretyApp.address)
    // let balance = await web3.eth.getBalance(config.testAddresses[1])
    let balance = await web3.eth.getBalance(
      "0x68f48429f451934fd1032ba63be0f72eb10424eb"
    );
    await config.flightSuretyData.authorizeCaller(
      config.flightSuretyApp.address
    );

    // Watch contract events
    const ON_TIME = 10;
    let events = config.flightSuretyApp.allEvents();

    // console.log('events', ':	', events);
    // console.log(events);
    // events.watch((error, result) => {
    //     if (result.event === 'OracleRequest') {
    //         console.log(`\n\nOracle Requested: index: ${result.args.index.toNumber()}, flight:  ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}`);
    //     } else {
    //         console.log(`\n\nFlight Status Available: flight: ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}, status: ${result.args.status.toNumber() == ON_TIME ? 'ON TIME' : 'DELAYED'}, verified: ${result.args.verified ? 'VERIFIED' : 'UNVERIFIED'}`);
    //     }
    // });

    // // Past events
    // events.get((error, logs) => { });
  });
  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  // ==============> (((  1  ))) <==============
  it(`1...(multiparty) has correct initial isOperational() value`, async function() {
    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  // ==============> (((  2  ))) <==============
  it(`2...(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function() {
    // Ensure that access is denied for non-Contract Owner account
    let accessDenied = false;
    try {
      // if this line fail this meand accessDenied = true;
      await config.flightSuretyData.setOperatingStatus(false, {
        from: config.testAddresses[2]
      });
    } catch (e) {
      accessDenied = true;
    }
    assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
  });

  // ==============> (((  3  ))) <==============
  it(`3...(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function() {
    let balance = await web3.eth.getBalance(config.flightSuretyApp.address);
    console.log(
      `Owner account: ${
        config.flightSuretyApp.address
      }      balance: ${balance}`
    );
    // Ensure that access is allowed for Contract Owner account
    let accessDenied = false;
    try {
      // if this line fail this meand accessDenied = true;
      await config.flightSuretyData.setOperatingStatus(false);
    } catch (e) {
      accessDenied = true;
    }
    assert.equal(
      accessDenied,
      false,
      "Access not restricted to Contract Owner"
    );
    // Set it back for other tests to work
    await config.flightSuretyData.setOperatingStatus(true);
  });

  // ==============> (((  4  ))) <==============
  it(`4...(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function() {
    let currentStatus;
    currentStatus = await config.flightSuretyData.isOperational();
    console.log("currentStatus1", ":	", currentStatus);
    //this will set operational  = false
    await config.flightSuretyData.setOperatingStatus(false);
    currentStatus = await config.flightSuretyData.isOperational();
    console.log("currentStatus1", ":	", currentStatus);
    let reverted = false; //this mean transaction will pass
    try {
      await config.flightSuretyData.testFunction();
    } catch (e) {
      reverted = true;
    }
    assert.equal(reverted, true, "Access not blocked for requireIsOperational");
    currentStatus = await config.flightSuretyData.isOperational();
    console.log("currentStatus2", ":	", currentStatus);
  });

  it("pre 5...(airline) First airline is registered when contract is deployed.", async () => {
    let contractOwner = "0x68f48429f451934fd1032ba63be0f72eb10424eb";
    airlineInfo = await config.flightSuretyData.getAirline(contractOwner);
    let logs = {
      isRegistered: airlineInfo[0],
      isFunded: airlineInfo[1],
      airlineAddress: airlineInfo[2]
    };
    console.table(logs);
  });

  // ==============> (((  5  ))) <==============
  it("5...(airline) cannot register an Airline using registerAirline() if it is not funded", async () => {
    // ARRANGE
    let newAirline = accounts[2];
    let airlineInfo;
    await config.flightSuretyData.createAirline(newAirline, {
      from: config.firstAirline
    });
    // ACT
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {
        from: config.firstAirline
      });
    } catch (e) {}
    airlineInfo = await config.flightSuretyData.getAirline(newAirline);
    let logs = {
      isRegistered: airlineInfo[0],
      isFunded: airlineInfo[1],
      airlineAddress: airlineInfo[2]
    };
    // console.table(logs);
    let result = await config.flightSuretyData.isAirline.call(newAirline);
    // ASSERT
    assert.equal(
      result,
      false,
      "Airline should not be able to register another airline if it hasn't provided funding"
    );
  });

  it("6...(airline) can register an Airline using registerAirline() if it is funded", async () => {
    // ARRANGE
    let contractOwner; //config.flightSuretyApp.address;
    //balanaces
    let dataContract_balance1;
    let dataContract_balance2;
    let appContract_balance1;
    let appContract_balance2;
    let newAirline_balance1;
    let newAirline_balance2;
    let logs;
    let airlineInfo;
    let newAirline;
    let contractAddress;
    contractOwner = accounts[0];
    newAirline = accounts[1]; //airline1
    // newAirline = accounts[2]; //airline2
    //contract addresses
    dataContractAddress = await config.flightSuretyData.getContractAddress();
    appContractAddress = await config.flightSuretyApp.getContractAddress();
    //balances
    newAirline_balance1 = await web3.eth.getBalance(newAirline);
    dataContract_balance1 = await web3.eth.getBalance(dataContractAddress);
    appContract_balance1 = await web3.eth.getBalance(appContractAddress);
    let airlineCount = await config.flightSuretyData.getAirlineCount();
    console.log("airlineCount", ":	", airlineCount.toNumber());
    //creating
    await config.flightSuretyData.createAirline(newAirline, {
      from: contractOwner
    });

    // ACT
    try {
      //funding
      await config.flightSuretyApp.fund({
        from: newAirline,
        value: web3.utils.toWei("10", "ether")
      });
      //registering
      await config.flightSuretyApp.registerAirline(newAirline, {
        from: contractOwner
      });
    } catch (e) {}
    //balances
    newAirline_balance2 = await web3.eth.getBalance(newAirline);
    dataContract_balance2 = await web3.eth.getBalance(dataContractAddress);
    appContract_balance2 = await web3.eth.getBalance(appContractAddress);

    //-----------------airlineInfo
    airlineInfo = await config.flightSuretyData.getAirline(newAirline);
    logs = {
      newAirline_balance1: newAirline_balance1,
      newAirline_balance2: newAirline_balance2,
      dataContract_balance1: dataContract_balance1,
      dataContract_balance2: dataContract_balance2,
      appContract_balance1: appContract_balance1,
      appContract_balance2: appContract_balance2,
      isRegistered: airlineInfo[0],
      isFunded: airlineInfo[1],
      airlineAddress: airlineInfo[2],
      voteCount: airlineInfo[3].toNumber()
    };
    // console.table(logs);
    //---------------------
    let result = await config.flightSuretyData.isAirline(newAirline);
    // ASSERT
    assert.equal(
      result,
      true,
      "Airline should not be able to register another airline if it hasn't provided funding"
    );
  });

  //   it("TEST ...  TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...", async () => {

  //   });

  it("7...(Multiparty Consensus)--Only existing airline may register a new airline until there are at least four airlines registered  ", async () => {
    // ARRANGE
    // Airlines:
    // (0) 0x68f48429f451934fd1032ba63be0f72eb10424eb (~100 ETH)
    // (1) 0x18495d2af425d56005812644136bf68282188aea (~100 ETH)
    // (2) 0xc61c9dadd04970bcd7802ecebf758f87b1e35d15 (~100 ETH)
    // (3) 0xa513e91f2aaa5ec9b9b4815f44494fb323ae8a08 (~100 ETH)
    // (4) 0xd64f959e7f9060e034c0fc9d61c5bc0b71e0d38c (~100 ETH)
    //only registered airline can register new airline
    let airlines = [];
    let balance;
    let registerResult;
    let airlineCount;
    let chResult;
    let creatorAirline;
    let regAirlineCount;
    let votedAirline;
    let lastReg;
    let voteCount;
    let minVotes;
    airlines.push(accounts[0]);
    airlines.push(accounts[1]);
    airlines.push(accounts[2]);
    airlines.push(accounts[3]);
    airlines.push(accounts[4]);
    airlines.push(accounts[5]);
    airlines.push(accounts[6]);
    airlines.push(accounts[7]);
    airlines.push(accounts[8]);
    airlines.push(accounts[9]);
    airlines.push(accounts[10]);
    creatorAirline = airlines[1];
    //check if it is registered
    chResult = await config.flightSuretyData.isAirline(creatorAirline);
    console.log("creator Airline registered", ":	", chResult);
    airlineCount = await config.flightSuretyData.getAirlineCount();
    console.log(
      "airline Count before should be 3",
      ":	",
      airlineCount.toNumber()
    );
    // creating
    for (let i = 3; i < 9; i++) {
      await config.flightSuretyData.createAirline(airlines[i], {
        from: creatorAirline
      });
    }
    // but is not registed yet, so it is not allowed to register new airlines[3]
    airlineCount = await config.flightSuretyData.getAirlineCount();
    console.log(
      "airline Count after should be 9",
      ":	",
      airlineCount.toNumber()
    );

    // funding
    for (let i = 2; i < airlineCount.toNumber(); i++) {
      await config.flightSuretyApp.fund({
        from: airlines[i],
        value: web3.utils.toWei("10", "ether")
      });
    }
    regAirlineCount = await config.flightSuretyApp.getRegisteredAirlineCount();
    console.log("reg airline Count", ":	", regAirlineCount.toNumber());

    // registering before voting
    for (let i = 2; i <= airlineCount.toNumber(); i++) {
      try {
        await config.flightSuretyApp.registerAirline(airlines[i], {
          from: creatorAirline
        });
        airlineInfo = await config.flightSuretyData.getAirline(airlines[i]);
        balance = await web3.eth.getBalance(airlines[i]);
        logs = {
          airline: `A airline ${i}: ${airlines[0]}`,
          isRegistered: airlineInfo[0],
          isFunded: airlineInfo[1],
          airlineAddress: airlineInfo[2],
          voteCount: airlineInfo[3].toNumber(),
          votes: airlineInfo[4].toString(),
          balance: balance
        };
      } catch (error) {}
    }
    // console.table(logs);

    regAirlineCount = await config.flightSuretyApp.getRegisteredAirlineCount();
    console.log(
      "reg airline Count before voting should be 4",
      ":	",
      regAirlineCount.toNumber()
    );

    //voting 5th Airline
    votedAirline = airlines[4];
    await config.flightSuretyApp.voteAirline(votedAirline, {
      from: airlines[2]
    });
    // await config.flightSuretyApp.voteAirline(votedAirline, { from: airlines[3] })
    // await config.flightSuretyApp.voteAirline(votedAirline, { from: airlines[4] })
    // await config.flightSuretyApp.voteAirline(votedAirline, { from: airlines[5] })
    // await config.flightSuretyApp.voteAirline(votedAirline, { from: airlines[5] })

    minVotes = await config.flightSuretyApp.getMinVotes(votedAirline);
    console.log("minVotes", ":	", minVotes.toNumber());

    voteCount = await config.flightSuretyData.getVoteCount(votedAirline);
    console.log("voteCount", ":	", voteCount.toNumber());

    // registering
    try {
      await config.flightSuretyApp.registerAirline(votedAirline, {
        from: creatorAirline
      });
    } catch (error) {}
    airlineInfo = await config.flightSuretyData.getAirline(votedAirline);
    balance = await web3.eth.getBalance(votedAirline);
    logs = {
      airline: `A airline 5: ${votedAirline}`,
      isRegistered: airlineInfo[0],
      isFunded: airlineInfo[1],
      airlineAddress: airlineInfo[2],
      voteCount: airlineInfo[3].toNumber(),
      votes: airlineInfo[4].toString(),
      balance: balance
    };

    regAirlineCount = await config.flightSuretyApp.getRegisteredAirlineCount();
    console.log(
      "reg airline Count after voting should be 5",
      ":	",
      regAirlineCount.toNumber()
    );

    console.table(logs);

    result = await config.flightSuretyData.isAirline(votedAirline);
    // ASSERT
    assert.equal(
      result,
      false,
      "Airline should not be able to register another airline if it is not existing airline"
    );
  });

  it("8...Passengers can choose from a fixed list of flight, passengers may pay up to 1 ether for purchasing flight insurance.  ", async () => {
    let airlines = [];
    airlines.push(accounts[0]);
    airlines.push(accounts[1]);
    airlines.push(accounts[2]);
    airlines.push(accounts[3]);
    airlines.push(accounts[4]);
    airlines.push(accounts[5]);
    // airlines created
    for (let i = 0; i < airlines.length; i++) {
      await config.flightSuretyData.createAirline(airlines[i], {
        from: airlines[1]
      });
    }
    //passengers
    let passengers = [];
    passengers.push(accounts[5]);
    passengers.push(accounts[6]);
    passengers.push(accounts[7]);
    // passengers created
    for (let i = 0; i < passengers.length; i++) {
      await config.flightSuretyApp.createPassenger(passengers[i]);
    }
    console.log("passengers:");
    console.log(await config.flightSuretyApp.getPassengersAdresses());
    //flights of airline 2
    for (let i = 1; i <= 3; i++) {
      await config.flightSuretyApp.createFlight(
        "F00" + i,
        Math.floor(Date.now() / 1000, 0),
        airlines[2]
      );
    }
    let flights = await config.flightSuretyApp.getFlights();
    // purchasing flights
    let passenger = passengers[1];
    let flight = flights[1];
    console.log("balance 1", ":	", await web3.eth.getBalance(passenger));
    //to purchase flight passenger should send 1 eth
    await config.flightSuretyApp.buy(flight, {
      from: passenger,
      value: web3.utils.toWei("1", "ether")
    });
    flightInfo = await config.flightSuretyApp.getFlight(flight);
    // bool isRegistered;
    // uint8 statusCode;
    // string flightName;
    // uint256 updatedTimestamp;
    // address airline;
    // bool isInsured;
    logs = {
      isRegistered: flightInfo[0],
      statusCode: flightInfo[1],
      flightName: flightInfo[2],
      updatedTimestamp: flightInfo[3],
      airline: flightInfo[4],
      isInsured: flightInfo[5]
    };
    console.table(logs);
    console.log("balance 1", ":	", await web3.eth.getBalance(passenger));
  });
  it("9...can register oracles", async () => {
    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      await config.flightSuretyApp.registerOracle({
        from: accounts[a],
        value: fee
      });
      let result = await config.flightSuretyApp.getOracle(accounts[a]);
      console.log(
        `Oracle registered account${accounts[a]}: ${result[0]} ${result[1]} ${
          result[2]
        }`
      );
    }
  });

  it("10....can request flight status", async () => {
    // ARRANGE
    let flight = "ND1309"; // Course number
    let timestamp = Math.floor(Date.now() / 1000);

    // Submit a request for oracles to get status information for a flight
    await config.flightSuretyApp.fetchFlightStatus(
      accounts[0],
      flight,
      timestamp
    );

    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      // For a real contract, we would not want to have this capability
      // so oracles can remain secret (at least to the extent one doesn't look
      // in the blockchain data)
      let oracleIndexes = await config.flightSuretyApp.getOracle(accounts[a]);
      for (let idx = 0; idx < 3; idx++) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.flightSuretyApp.submitOracleResponse(
            oracleIndexes[idx],
            accounts[0],
            flight,
            timestamp,
            10,
            { from: accounts[a] }
          );

          // Check to see if flight status is available
          // Only useful while debugging since flight status is not hydrated until a
          // required threshold of oracles submit a response

          let flightStatus = await config.flightSuretyApp.viewFlightStatus(
            flight,
            timestamp
          );
          console.log(
            "\nPost",
            idx,
            oracleIndexes[idx].toNumber(),
            flight,
            timestamp,
            flightStatus
          );
        } catch (e) {
          // Enable this when debugging
          console.log(
            "\nError",
            idx,
            oracleIndexes[idx].toNumber(),
            flight,
            timestamp
          );
        }
      }
    }
  });

  it("11....when flight is late it will credit insuree", async () => {
    //  when status is late
    let status = 20; //STATUS_CODE_LATE_AIRLINE = 20;
    let dc;
    let ac;
    let a;
    let p;

    dc = await config.flightSuretyData.getContractAddress();
    ac = await config.flightSuretyApp.getContractAddress();

    a = accounts[1];
    p = accounts[8];

    let c_bal;
    let p_bal;

    console.log("a 1", ":	", await web3.eth.getBalance(a));
    console.log("dc_bal 1", ":	", await web3.eth.getBalance(dc));
    console.log("ac_bal 1", ":	", await web3.eth.getBalance(ac));
    console.log("p 1", ":	", await web3.eth.getBalance(p));

    // calculate 1.5 amount
    // using creditInsurees

    let payload = {
      passenger: p,
      amount: web3.utils.toWei("3", "ether"),
      flight: "flight X",
      timestamp: Math.floor(Date.now() / 1000)
    };

    await config.flightSuretyApp.creditInsurees(
      payload.passenger,
      payload.flight,
      payload.amount,
      payload.timestamp,
      { value: web3.utils.toWei("1.5", "ether") }
    );

    console.log("a 2", ":	", await web3.eth.getBalance(a));
    console.log("dc_bal 2", ":	", await web3.eth.getBalance(dc));
    console.log("ac_bal 2", ":	", await web3.eth.getBalance(ac));
    console.log("p 2", ":	", await web3.eth.getBalance(p));
  });

  /*
        it('TEST ...  TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...TEST ...', async () => {
            // let airlines = [];
            // airlines.push(accounts[0]);
            // airlines.push(accounts[1]);
            // airlines.push(accounts[2]);
            // airlines.push(accounts[3]);
            // airlines.push(accounts[4]);
            // airlines.push(accounts[5]);
            // for (let i = 0; i < airlines.length; i++) {
            //     // airlines created 
            //     await config.flightSuretyData.createAirline(airlines[i], { from: airlines[1] });
            // }
            // //passengers
            // let passengers = []
            // passengers.push(accounts[5])
            // passengers.push(accounts[6])
            // passengers.push(accounts[7])
            // for (let i = 0; i < passengers.length; i++) {
            //     await config.flightSuretyApp.createPassenger(passengers[i])
            // }
            // console.log('passengers:');
            // console.log(await config.flightSuretyApp.getPassengersAdresses());
            // //flights of airline 2
            // for (let i = 1; i <= 3; i++) {
            //     await config.flightSuretyApp.createFlight('F00' + i, Math.floor(Date.now() / 1000, 0), airlines[2])
            // }
            // console.log('flights:');
            // // console.log(await config.flightSuretyApp.getFlights());
            // let flights = await config.flightSuretyApp.getFlights();
            // for (let i = 0; i < flights.length; i++) {
            //     console.log(await config.flightSuretyApp.getFlight(flights[i]));
            // }
            // // purchasing flights
            // let passenger = passengers[1];
            // let flight = flights[1];
            // //to purchase flight passenger should send 1 eth
            // await config.flightSuretyApp.buy(flight, { from: passenger, value: web3.utils.toWei("1", "ether") });
            // flightInfo = await config.flightSuretyApp.getFlight(flight)
            // // when flight status changed 
            // //flights of airline 2
            // // address airline,
            // // string flight,
            // // uint256 timestamp    
            // // let status = await config.flightSuretyApp.fetchFlightStatus(airlines[1], "F00XYZ", Math.floor(Date.now() / 1000, 0))
    
            // // let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();
    
            // // for (let a = 1; a < 10; a++) {
            // //     await config.flightSuretyApp.registerOracle({ from: accounts[0], value: fee });
            // // }
    
    
    
    
    
            // // ARRANGE
            // flight = 'F000XYZ'; // Course number
            // let timestamp = Math.floor(Date.now() / 1000);
    
            // // Submit a request for oracles to get status information for a flight
            // await config.flightSuretyApp.fetchFlightStatus(accounts[0], flight, timestamp);
    
            // // ACT
    
            // // Since the Index assigned to each test account is opaque by design
            // // loop through all the accounts and for each account, all its Indexes (indices?)
            // // and submit a response. The contract will reject a submission if it was
            // // not requested so while sub-optimal, it's a good test of that feature
    
            // for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
    
            //     // Get oracle information
            //     // For a real contract, we would not want to have this capability
            //     // so oracles can remain secret (at least to the extent one doesn't look
            //     // in the blockchain data)
    
            //     await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
    
            //     let oracleIndexes = await config.flightSuretyApp.getOracle(accounts[a]);
    
            //     console.log(`Oracle registered account${accounts[a]}: ${result[0]} ${result[1]} ${result[2]}`);
    
            //     for (let idx = 0; idx < 3; idx++) {
    
            //         try {
            //             // Submit a response...it will only be accepted if there is an Index match
            //             await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], flight, timestamp, 10, { from: accounts[a] });
    
            //             // Check to see if flight status is available
            //             // Only useful while debugging since flight status is not hydrated until a 
            //             // required threshold of oracles submit a response
            //             let flightStatus = await config.flightSuretyApp.viewFlightStatus(flight, timestamp);
            //             // console.log(1111);
            //             console.log('\nPost', idx, oracleIndexes[idx].toNumber(), flight, timestamp, flightStatus);
            //             // console.log(2222);
            //         }
            //         catch (e) {
            //             // Enable this when debugging
            //             // console.log('\nError', idx, oracleIndexes[idx].toNumber(), flight, timestamp);
            //         }
    
            //     }
            // }
    
            // let airlines = [];
            // airlines.push(accounts[0]);
            // airlines.push(accounts[1]);
            // airlines.push(accounts[2]);
            // airlines.push(accounts[3]);
            // airlines.push(accounts[4]);
            // airlines.push(accounts[5]);
            // // airlines created
            // for (let i = 0; i < airlines.length; i++) {
    
            //     await config.flightSuretyData.createAirline(airlines[i], { from: airlines[1] });
            // }
            // //passengers
            // let passengers = []
            // passengers.push(accounts[5])
            // passengers.push(accounts[6])
            // passengers.push(accounts[7])
            // // passengers created
            // for (let i = 0; i < passengers.length; i++) {
            //     await config.flightSuretyApp.createPassenger(passengers[i])
            // }
            // console.log('passengers:');
            // console.log(await config.flightSuretyApp.getPassengersAdresses());
            // //flights of airline 2
            // for (let i = 1; i <= 3; i++) {
            //     await config.flightSuretyApp.createFlight('F00' + i, Math.floor(Date.now() / 1000, 0), airlines[2])
            // }
            // let flights = await config.flightSuretyApp.getFlights();
            // // purchasing flights
            // let passenger = passengers[1];
            // let flight = flights[1];
            // console.log('balance 1', ':	', await web3.eth.getBalance(passenger));
            // //to purchase flight passenger should send 1 eth
            // await config.flightSuretyApp.buy(flight, { from: passenger, value: web3.utils.toWei("1", "ether") });
            // flightInfo = await config.flightSuretyApp.getFlight(flight)
            // // bool isRegistered;
            // // uint8 statusCode;
            // // string flightName;
            // // uint256 updatedTimestamp;        
            // // address airline;
            // // bool isInsured;
            // logs = {
            //     isRegistered: flightInfo[0],
            //     statusCode: flightInfo[1],
            //     flightName: flightInfo[2],
            //     updatedTimestamp: flightInfo[3],
            //     airline: flightInfo[4],
            //     isInsured: flightInfo[5]
            // }
            // console.table(logs);
            // console.log('balance 1', ':	', await web3.eth.getBalance(passenger));
        });
        /* START COMMENT  
            ////----------------------
           // ==============> (((  6  ))) <==============
        
           // ==============> (((  8  ))) <==============
           // 8...passengers can buy insurance
           // ==============> (((  9  ))) <==============
           // 9...passenger get paid 1.5X what they paid if flight delayed (CODE 20)
           // ==============> (((  10  ))) <==============
           // 10...passengers can withdraw the ether that they were credited!
            */
});
