
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
        let balance = await web3.eth.getBalance("0x68f48429f45193

        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });
    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/


    // ==============> (((  1  ))) <==============
    it(`1...(multiparty) has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });


    // ==============> (((  2  ))) <==============
    it(`2...(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            // if this line fail this meand accessDenied = true;
            await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

    });

    // ==============> (((  3  ))) <==============
    it(`3...(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
        let balance = await web3.eth.getBalance(config.flightSuretyApp.address)
        console.log(`Owner account: ${config.flightSuretyApp.address}      balance: ${balance}`);

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            // if this line fail this meand accessDenied = true;
            await config.flightSuretyData.setOperatingStatus(false);
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);
    });

    // ==============> (((  4  ))) <==============
    it(`4...(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        let currentStatus;
        currentStatus = await config.flightSuretyData.isOperational();
        console.log('currentStatus1', ':	', currentStatus);

        //this will set operational  = false 
        await config.flightSuretyData.setOperatingStatus(false);

        currentStatus = await config.flightSuretyData.isOperational();
        console.log('currentStatus1', ':	', currentStatus);

        let reverted = false; //this mean transaction will pass
        try {
            await config.flightSuretyData.testFunction();
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        currentStatus = await config.flightSuretyData.isOperational();
        console.log('currentStatus2', ':	', currentStatus);



    });

    // ==============> (((  5  ))) <==============
    it('5...(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

        // ARRANGE
        let newAirline = accounts[2];
        console.log(`config.firstAirline:${config.firstAirline} is registering new Airline: ${newAirline}`);

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, { from: config.firstAirline });
        }
        catch (e) {

        }
        // let result = await config.flightSuretyData.isAirline.call(newAirline);

        // // ASSERT
        // assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

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
