import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        // this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url));

        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];

            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
        let self = this;
        //TODO: TO CONFIGURE flightSuretyData.isOperational
        //DONE
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    getBalance(callback) {
        let self = this;
        debugger;

        //TODO: TO CONFIGURE flightSuretyData.getAirlinesAdresses

        self.flightSuretyApp.methods
            .getBalance()
            .call({ from: self.owner }, callback);

    }

    /* ##########################################
                    Airline
        ########################################## */
    // bool,uint256,string,address
    createAirline(_address, callback) {
        let self = this;
        ////debugger;
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .createAirline(_address)
            .send({ from: self.owner, gas: 5555555 }, (error, result) => {
                callback(_address);
            });
        // .registerAirline.call(_airlineAddress, callback(_airlineAddress));
        //callback(_address);
    }

    getAirline(_address, callback) {
        let self = this;
        //debugger;
        self.flightSuretyApp.methods
            .getAirline(_address)
            .call({ from: self.owner }, callback);
        // .send({ from: self.owner }, (error, result) => {
        //     callback(result);
        // });
        //     .call({ from: self.owner }, callback);
        // callback();
    }



    /********** **********Flight********* ********** */

    // flight,airline,timestamp,statusCode
    createFlight(flight, timestamp, airline, callback) {
        let self = this;
        //debugger;
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .createFlight(flight, timestamp, airline)
            .send({ from: self.owner, gas: 5555555 }, (error, result) => {
                callback(flight);
            });
        // .registerAirline.call(_airlineAddress, callback(_airlineAddress));
        //callback(_address);
    }


    getFlight(_key, callback) {
        let self = this;
        //debugger;
        self.flightSuretyApp.methods
            .getFlight(_key)
            .call({ from: self.owner }, callback);
        // .send({ from: self.owner }, (error, result) => {
        //     callback(result);
        // });
        //     .call({ from: self.owner }, callback);
        // callback();
    }

    /********** ********** Airline ********* ********** */

    getAirlinesAdresses(callback) {
        let self = this;
        ////debugger;

        //TODO: TO CONFIGURE flightSuretyData.getAirlinesAdresses

        self.flightSuretyApp.methods
            .getAirlinesAdresses()
            .call({ from: self.owner }, callback);

    }


    registerAirline(_address, callback) {
        let self = this;
        ////debugger;
        self.flightSuretyApp.methods
            .registerAirline(_address)
            .send({ from: self.owner, gas: 5555555 }, (error, result) => {
                callback(_address);
            });

    }



    // flight,airline,timestamp,statusCode
    // , { from: passenger, value: web3.utils.toWei("1", "ether") }
    buy(flightKey, passengerAddress, price, callback) {
        let self = this;
        debugger;
        // {'value': 6000000000000000000}
        // window.web3.toWei(1, 'ether')
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .buy(flightKey)
            .send({ from: passengerAddress, gas: 5555555, value: window.web3.toWei("1", "ether") }, (error, result) => {
                debugger
                callback(error, flightKey);
            });
    }

    /**
     * function creditInsurees
     (      
         address _address,
         string flight,
         uint256 refundAmount,
         uint256 timestamp
        )
        payable
     external
     {
        bytes32 flightKey = keccak256(abi.encodePacked(flight, timestamp));
        flights[flightKey].statusCode = STATUS_CODE_REFUNDED;
        flights[flightKey].isRefunded = true;
        flights[flightKey].refundAmount = msg.value;

        flightSuretyData.creditInsurees(_address);
     }
     * @param {*} callback 
     */
    creditInsurees(passengerAddress, flight, amount, callback) {
        let self = this;

        //if  flight is delayed due to airline fault, passenger receives credit of 1.5X the amount they paid


        let payload = {
            airline: passengerAddress,
            amount: 1.5 * amount,
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }

        debugger;
        // {'value': 6000000000000000000}
        // window.web3.toWei(1, 'ether')
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .creditInsurees(passengerAddress, flight, amount)
            .send({ from: payload.airline, gas: 5555555, value: window.web3.toWei(payload.amount, "ether") }, (error, result) => {
                debugger
                callback(error, flight);
            });
    }

    withdraw(passengerAddress, flight, amount, callback) {
        let self = this;

        //if  flight is delayed due to airline fault, passenger receives credit of 1.5X the amount they paid


        let payload = {
            airline: passengerAddress,
            amount: amount,
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }

        debugger;
        // {'value': 6000000000000000000}
        // window.web3.toWei(1, 'ether')
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .withdraw(passengerAddress, flight, amount)
            .send({ from: msg.sender, gas: 5555555, value: window.web3.toWei(payload.amount, "ether") }, (error, result) => {
                debugger
                callback(error, flight);
            });
    }

    getFlights(callback) {
        let self = this;
        debugger;

        //TODO: TO CONFIGURE flightSuretyData.getAirlinesAdresses

        self.flightSuretyApp.methods
            .getFlights()
            .call({ from: self.owner }, callback);

    }

    // getInsurances(callback) {
    //     let self = this;
    //     debugger;

    //     //TODO: TO CONFIGURE flightSuretyData.getAirlinesAdresses

    //     self.flightSuretyApp.methods
    //         .getInsurances()
    //         .call({ from: self.owner }, callback);

    // }




    // getInsurance(_key, callback) {
    //     let self = this;
    //     //debugger;
    //     self.flightSuretyApp.methods
    //         .getInsurance(_key)
    //         .call({ from: self.owner }, callback);
    //     // .send({ from: self.owner }, (error, result) => {
    //     //     callback(result);
    //     // });
    //     //     .call({ from: self.owner }, callback);
    //     // callback();
    // }

    /* ##########################################
                    Pasenger
        ########################################## */

    createPassenger(_address, callback) {
        let self = this;
        //debugger;
        self.flightSuretyApp.methods
            // .registerAirline(v1, { from: self.owner });
            .createPassenger(_address)
            .send({ from: self.owner, gas: 5555555 }, (error, result) => {
                callback(_address);
            });
        // .registerAirline.call(_airlineAddress, callback(_airlineAddress));
        //callback(_address);
    }

    getPassengersAdresses(callback) {

        let self = this;
        ////debugger;

        //TODO: TO CONFIGURE flightSuretyData.getAirlinesAdresses

        self.flightSuretyApp.methods
            .getPassengersAdresses()
            .call({ from: self.owner }, callback);

    }


    // fundAirline(_address, fundValue, callback) {
    //     let self = this;
    //     ////debugger;
    //     self.flightSuretyApp.methods
    //         .fundAirline(_address, fundValue)
    //         .send({ from: self.owner, gas: 5555555, value: fundValue }, (error, result) => {
    //             callback(_address);
    //         });

    // }

    fetchFlightStatus(address, flight, callback) {
        let self = this;
        //TODO: TO CONFIGURE flightSuretyData.fetchFlightStatus

        let payload = {
            airline: address,
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }

    viewFlightStatus(flight, callback) {
        let self = this;
        //TODO: TO CONFIGURE flightSuretyData.fetchFlightStatus

        let payload = {

            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .viewFlightStatus(payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, result);
            });
    }
}