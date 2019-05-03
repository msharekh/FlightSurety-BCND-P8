
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var Web3 = require('web3');

contract('Flight Surety Tests', async (accounts) => {

    var config;
    var web3;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        web3 = new Web3(Web3.givenProvider);
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    // ==============> (((  1  ))) <==============
    it(`(multiparty) has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    /*

    

    // ==============> (((  2  ))) <==============
    it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

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
    it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

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

    });

    // ==============> (((  4  ))) <==============
    it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false; //this mean transaction will pass
        try {
            await config.flightSurety.setTestingMode(true);
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);

    });

    // ==============> (((  5  ))) <==============
    it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

        // ARRANGE
        let newAirline = accounts[2];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, { from: config.firstAirline });
        }
        catch (e) {

        }
        let result = await config.flightSuretyData.isAirline.call(newAirline);

        // ASSERT
        assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

    });
    
     

    ////----------------------

    // ==============> (((  6  ))) <==============
    //  perform multi-party concensus mechnaism for registering above 4 flights - no multivote results in failure

    // ==============> (((  7  ))) <==============
    //  perform multi-party concensus mechnaism for registering above 4 flights - trying multivote works

    // ==============> (((  8  ))) <==============
    // passengers can buy insurance

    // ==============> (((  9  ))) <==============
    // passenger get paid 1.5X what they paid if flight delayed (CODE 20)

    // ==============> (((  10  ))) <==============
    // passengers can withdraw the ether that they were credited!

     */
});
