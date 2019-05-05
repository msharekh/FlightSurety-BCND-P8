var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var Web3 = require('web3');
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
contract('Flight Surety Tests', async (accounts) => {
    var config;
    var web3;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        web3 = new Web3(Web3.givenProvider);
        // let balance = await web3.eth.getBalance(config.flightSuretyApp.address)
        // let balance = await web3.eth.getBalance(config.testAddresses[1])
        let balance = await web3.eth.getBalance("0x68f48429f451934fd1032ba63be0f72eb10424eb")
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });
    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/
    // // ==============> (((  1  ))) <==============
    // it(`1...(multiparty) has correct initial isOperational() value`, async function () {
    //     // Get operating status
    //     let status = await config.flightSuretyData.isOperational.call();
    //     assert.equal(status, true, "Incorrect initial operating status value");
    // });
    // // ==============> (((  2  ))) <==============
    // it(`2...(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {
    //     // Ensure that access is denied for non-Contract Owner account
    //     let accessDenied = false;
    //     try {
    //         // if this line fail this meand accessDenied = true;
    //         await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
    //     }
    //     catch (e) {
    //         accessDenied = true;
    //     }
    //     assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
    // });
    // // ==============> (((  3  ))) <==============
    // it(`3...(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
    //     let balance = await web3.eth.getBalance(config.flightSuretyApp.address)
    //     console.log(`Owner account: ${config.flightSuretyApp.address}      balance: ${balance}`);
    //     // Ensure that access is allowed for Contract Owner account
    //     let accessDenied = false;
    //     try {
    //         // if this line fail this meand accessDenied = true;
    //         await config.flightSuretyData.setOperatingStatus(false);
    //     }
    //     catch (e) {
    //         accessDenied = true;
    //     }
    //     assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
    //     // Set it back for other tests to work
    //     await config.flightSuretyData.setOperatingStatus(true);
    // });
    // // ==============> (((  4  ))) <==============
    // it(`4...(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {
    //     let currentStatus;
    //     currentStatus = await config.flightSuretyData.isOperational();
    //     console.log('currentStatus1', ':	', currentStatus);
    //     //this will set operational  = false 
    //     await config.flightSuretyData.setOperatingStatus(false);
    //     currentStatus = await config.flightSuretyData.isOperational();
    //     console.log('currentStatus1', ':	', currentStatus);
    //     let reverted = false; //this mean transaction will pass
    //     try {
    //         await config.flightSuretyData.testFunction();
    //     }
    //     catch (e) {
    //         reverted = true;
    //     }
    //     assert.equal(reverted, true, "Access not blocked for requireIsOperational");
    //     currentStatus = await config.flightSuretyData.isOperational();
    //     console.log('currentStatus2', ':	', currentStatus);
    // });
    // it('pre 5...(airline) First airline is registered when contract is deployed.', async () => {
    //     let contractOwner = "0x68f48429f451934fd1032ba63be0f72eb10424eb";
    //     airlineInfo = await config.flightSuretyData.getAirline(contractOwner);
    //     let logs = {
    //         isRegistered: airlineInfo[0],
    //         isFunded: airlineInfo[1],
    //         airlineAddress: airlineInfo[2],
    //     }
    //     console.table(logs);
    // });
    // // ==============> (((  5  ))) <==============
    // it('5...(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    //     // ARRANGE
    //     let newAirline = accounts[2];
    //     let airlineInfo;
    //     await config.flightSuretyData.createAirline(newAirline, { from: config.firstAirline });
    //     // ACT
    //     try {
    //         await config.flightSuretyApp.registerAirline(newAirline, { from: config.firstAirline });
    //     }
    //     catch (e) {
    //     }
    //     airlineInfo = await config.flightSuretyData.getAirline(newAirline);
    //     let result = await config.flightSuretyData.isAirline.call(newAirline);
    //     // // ASSERT
    //     assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");
    //     let logs = {
    //         isRegistered: airlineInfo[0],
    //         isFunded: airlineInfo[1],
    //         airlineAddress: airlineInfo[2],
    //         isAirline: result
    //     }
    //     console.table(logs);
    // });
    it('6...(airline) can register an Airline using registerAirline() if it is funded', async () => {
        // ARRANGE
        let contractOwner  //config.flightSuretyApp.address;
        let dataContract_balance1
        let dataContract_balance2
        let appContract_balance1
        let appContract_balance2
        let logs;
        let airlineInfo;
        let newAirline
        let newAirline_balance1;
        let newAirline_balance2;
        let contractAddress;
        contractOwner = accounts[0] //config.flightSuretyApp.address;
        newAirline = accounts[1]; //airline1
        // newAirline = accounts[2]; //airline2
        //contract addresses
        dataContractAddress = await config.flightSuretyData.getContractAddress()
        appContractAddress = await config.flightSuretyApp.getContractAddress()
        //balances
        newAirline_balance1 = await web3.eth.getBalance(newAirline)
        dataContract_balance1 = await web3.eth.getBalance(dataContractAddress)
        appContract_balance1 = await web3.eth.getBalance(appContractAddress)
        let add = await config.flightSuretyData.getSentAddress({ from: newAirline })
        console.log('add', ':	', add);

        let airlineCount = await config.flightSuretyData.getAirlineCount();
        console.log('airlineCount', ':	', airlineCount.toNumber());

        //creating 
        await config.flightSuretyData.createAirline(newAirline, { from: contractOwner });
        // ACT
        try {
            //funding
            await config.flightSuretyApp.fund({ from: newAirline, value: web3.utils.toWei("3", "ether") });
            //registering
            await config.flightSuretyApp.registerAirline(newAirline, { from: contractOwner });
        }
        catch (e) {
        }
        //balances
        newAirline_balance2 = await web3.eth.getBalance(newAirline)
        dataContract_balance2 = await web3.eth.getBalance(dataContractAddress)
        appContract_balance2 = await web3.eth.getBalance(appContractAddress)
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
        }
        console.table(logs);
        let result = await config.flightSuretyData.isAirline(newAirline);
        // // ASSERT
        assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");
    });
    it('7...(Multiparty Consensus)--Only existing airline may register a new airline until there are at least four airlines registered  ', async () => {
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
        airlines.push(accounts[0]);
        airlines.push(accounts[1]);
        airlines.push(accounts[2]);
        airlines.push(accounts[3]);
        airlines.push(accounts[4]);
        airlines.push(accounts[5]);
        // airlines only created 
        await config.flightSuretyData.createAirline(airlines[2], { from: airlines[1] });
        await config.flightSuretyData.createAirline(airlines[3], { from: airlines[1] });
        await config.flightSuretyData.createAirline(airlines[4], { from: airlines[1] });
        await config.flightSuretyData.createAirline(airlines[5], { from: airlines[1] });
        //voting 
        // console.log('airlines[2] vote result', ':	', await config.flightSuretyApp.voteAirline(airlines[2], { from: airlines[0] }));
        // await config.flightSuretyApp.voteAirline(airlines[2], { from: airline0 })
        // await config.flightSuretyApp.voteAirline(airlines[2], { from: airlines[1] })
        // await config.flightSuretyApp.voteAirline(airlines[3], { from: airline0 })
        // await config.flightSuretyApp.voteAirline(airlines[3], { from: airlines[1] })
        // await config.flightSuretyApp.voteAirline(airlines[3], { from: airlines[2] })
        // but is not registed yet, so it is not allowed to register new airlines[3]
        let airlineCount = await config.flightSuretyData.getAirlineCount();
        console.log('airlineCount', ':	', airlineCount.toNumber());


        // for (let i = 0; i < airlineCount.toNumber(); i++) {
        //     airlineInfo = await config.flightSuretyData.getAirline(airlines[i]);

        //     balance = await web3.eth.getBalance(airlines[i])
        //     logs = {
        //         airline: `A airline ${i}: ${airlines[0]}`,
        //         isRegistered: airlineInfo[0],
        //         isFunded: airlineInfo[1],
        //         airlineAddress: airlineInfo[2],
        //         voteCount: airlineInfo[3].toNumber(),
        //         votes: airlineInfo[4].toString(),
        //         balance: balance
        //     }
        //     console.table(logs);
        // }

        // for (let i = 2; i < airlineCount.toNumber(); i++) {
        //     //funding
        //     await config.flightSuretyApp.fund({ from: airlines[i], value: web3.utils.toWei("3", "ether") });
        // }

        //voting
        // for (let i = 0; i < 4; i++) {
        //     await config.flightSuretyApp.voteAirline(airlines[4], { from: airlines[i] })
        // }

        airlineInfo = await config.flightSuretyData.getAirline(airlines[4]);
        console.log('votes1: airlineInfo[4]', ':	', `: ${airlineInfo[4].toString()}`);

        await config.flightSuretyApp.voteAirline(airlines[4], { from: airlines[2] })
        // await config.flightSuretyApp.voteAirline(airlines[4], { from: airlines[2] })

        airlineInfo = await config.flightSuretyData.getAirline(airlines[4]);
        console.log('votes2: airlineInfo[4]', ':	', `: ${airlineInfo[4].toString()}`);


        // for (let i = 2; i < airlineCount.toNumber(); i++) {
        //     //registering
        //     await config.flightSuretyApp.registerAirline(airlines[i], { from: airlines[1] });

        // }

        for (let i = 0; i < airlineCount.toNumber(); i++) {
            airlineInfo = await config.flightSuretyData.getAirline(airlines[i]);

            balance = await web3.eth.getBalance(airlines[i])
            logs = {
                airline: `B airline ${i}: ${airlines[i]}`,
                isRegistered: airlineInfo[0],
                isFunded: airlineInfo[1],
                airlineAddress: airlineInfo[2],
                voteCount: airlineInfo[3].toNumber(),
                votes: airlineInfo[4].toString(),
                needVotes: airlineInfo[5],
                balance: balance
            }
            console.table(logs);
        }
        // logs = {
        //     airline0: airline0,
        //     isRegistered: airlineInfo[0],
        //     isFunded: airlineInfo[1],
        //     airlineAddress: airlineInfo[2],
        //     voteCount: airlineInfo[3].toNumber(),
        //     votes: airlineInfo[4].toString()
        // }
        // console.table(logs);
        // airlineInfo = await config.flightSuretyData.getAirline(airlines[1]);
        // logs = {
        //     airline1: airlines[1],
        //     isRegistered: airlineInfo[0],
        //     isFunded: airlineInfo[1],
        //     airlineAddress: airlineInfo[2],
        //     voteCount: airlineInfo[3].toNumber(),
        //     votes: airlineInfo[4].toString()
        // }
        // console.table(logs);
        // airlineInfo = await config.flightSuretyData.getAirline(airlines[2]);
        // logs = {
        //     airline2: airlines[2],
        //     isRegistered: airlineInfo[0],
        //     isFunded: airlineInfo[1],
        //     airlineAddress: airlineInfo[2],
        //     voteCount: airlineInfo[3].toNumber(),
        //     votes: airlineInfo[4].toString()
        // }
        // console.table(logs);
        // airlineInfo = await config.flightSuretyData.getAirline(airlines[3]);
        // logs = {
        //     airline3: airlines[3],
        //     isRegistered: airlineInfo[0],
        //     isFunded: airlineInfo[1],
        //     airlineAddress: airlineInfo[2],
        //     voteCount: airlineInfo[3].toNumber(),
        //     votes: airlineInfo[4].toString()
        // }
        // console.table(logs);
        // try {
        //     await config.flightSuretyApp.registerAirline(airlines[3], { from: airlines[2] });
        // } catch (error) {
        // }
        // result = await config.flightSuretyData.isAirline(airlines[3]);
        // // // ASSERT
        // assert.equal(result, false, "Airline should not be able to register another airline if it is not existing airline");
    });
    /* START COMMENT  
            ////----------------------
           // ==============> (((  6  ))) <==============
           //  6...perform multi-party concensus mechnaism for registering above 4 flights - no multivote results in failure
           // ==============> (((  7  ))) <==============
           //  7...perform multi-party concensus mechnaism for registering above 4 flights - trying multivote works
           // ==============> (((  8  ))) <==============
           // 8...passengers can buy insurance
           // ==============> (((  9  ))) <==============
           // 9...passenger get paid 1.5X what they paid if flight delayed (CODE 20)
           // ==============> (((  10  ))) <==============
           // 10...passengers can withdraw the ether that they were credited!
            */
});
