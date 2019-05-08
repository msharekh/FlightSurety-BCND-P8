
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async () => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            //console.log(error, result);
            // ////debugger;
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });


        // Read transaction getAirlinesAdresses
        // contract.getAirlinesAdresses((error, result) => {
        //     ////debugger;
        //     //console.log(error, result);
        //     updateDDLs("selGetAirlinesAdresses", result, "airline");


        // });



        // Read transaction getPassengers
        /* contract.getPassengersAdresses((error, result) => {
            debugger;
            //console.log(error, result);
            updateDDLs("selGetPassengersAdresses", result, "passenger");

        }); */



        // Read transaction getPassengers
        // contract.getFlights((error, result) => {
        //     debugger;
        //     //console.log(error, result);
        //     updateDDLs("selFlights", result, "flight");

        // });

        // Read transaction getPassengers
        // contract.getInsurances((error, result) => {
        //     //debugger;
        //     //console.log(error, result);

        //     updateDDLs("selInsurances", result, "Insurances");

        // });

        // Read transaction getPassengers
        contract.getBalance((error, result) => {
            //debugger;
            // //console.log(error, result);

            document.getElementById("result-info").innerHTML = result;

        });


    })

    //create airlines without registrations
    // DOM.elid('create-airline').addEventListener('click', () => {
    //     let _address = DOM.elid('airlineAddress').value;
    //     // let _address = "0x18495d2af425d56005812644136bf68282188aea"
    //     let _name = `Airline - ${_address.substr(2, 4)}`
    //     // Write createAirline
    //     contract.createAirline(_address, _name, (v) => {
    //         // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
    //         ////debugger;
    //         //console.log('v', ':	', v);

    //         // Read transaction getAirlinesAdresses
    //         contract.getAirlinesAdresses((error, result) => {
    //             ////debugger;
    //             //console.log(error, result);
    //             updateDDLs("selGetAirlinesAdresses", result, "airline");

    //         });

    //     });
    // })
    // create-airline



    // DOM.elid('create-flight').addEventListener('click', () => {

    //     // address airline,
    //     // string flight,
    //     // uint256 timestamp,
    //     // uint8 statusCode

    //     let flight = DOM.elid('flight').value;
    //     let _airline = document.querySelector("#selGetAirlinesAdresses").value
    //     let timestamp = Math.floor(Date.now() / 1000);
    //     let statusCode = 0;
    //     //debugger;
    //     contract.createFlight(_airline, flight, timestamp, statusCode, ((error, v) => {
    //         // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
    //         //debugger;
    //         //console.log('v', ':	', v);

    //         // Read transaction getPassengers
    //         contract.getFlights((error, result) => {
    //             //debugger;
    //             //console.log(error, result);

    //             updateDDLs("selFlights", result, "flight");

    //         });
    //     }));


    // });

    // createFlight

    // DOM.elid('create-passenger').addEventListener('click', () => {
    //     let _address = DOM.elid('passengerAddress').value;
    //     contract.createPassenger(_address, (v) => {
    //         // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
    //         ////debugger;
    //         //console.log('v', ':	', v);

    //         // Read transaction getPassengers
    //         contract.getPassengersAdresses((error, result) => {
    //             //debugger;
    //             //console.log(error, result);

    //             updateDDLs("selGetPassengersAdresses", result, "passenger");

    //         });

    //     });
    // })
    // createPassenger



    DOM.elid('create-insurance').addEventListener('click', () => {

        debugger;
        // bytes32 flightKey,address passengerAddress,uint price
        let flightKey = document.querySelector("#selFlights").value
        let passengerAddress = document.querySelector("#selGetPassengersAdresses").value
        let price = DOM.elid('price').value;

        //debugger;
        // contract.buy(flightKey, passengerAddress, price, ((error, v) => {
        contract.buy(flightKey, passengerAddress, price, ((error, result1) => {
            // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
            debugger;
            //console.log('v', ':	', v);

            // Read transaction getAirlinesAdresses
            contract.getAirlinesAdresses((error, result) => {
                ////debugger;
                //console.log(error, result);
                updateDDLs("selGetAirlinesAdresses", result, "airline");

            });

            showContactBalanc(contract);


        }));

    });
    DOM.elid('get-testdata').addEventListener('click', () => {
        //STARTCODE
        debugger;
        //AIRLINES
        let airlines = [];
        airlines.push("0x68f48429f451934fd1032ba63be0f72eb10424eb");
        airlines.push("0x18495d2af425d56005812644136bf68282188aea");
        airlines.push("0xc61c9dadd04970bcd7802ecebf758f87b1e35d15");
        airlines.push("0xa513e91f2aaa5ec9b9b4815f44494fb323ae8a08");
        // airlines.push(accounts[4]);
        // airlines.push(accounts[5]);
        // airlines created
        for (let i = 0; i < airlines.length; i++) {

            // .createAirline(airlines[i], { from: airlines[0] });
            // .createAirline(airlines[i]);

            contract.createAirline(airlines[i], (v) => {
                // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
                ////debugger;
                //console.log('v', ':	', v);

                // Read transaction getAirlinesAdresses
                contract.getAirlinesAdresses((error, result) => {
                    ////debugger;
                    //console.log(error, result);
                    updateDDLs("selGetAirlinesAdresses", result, "airline");

                });

            });
        }
        //PASSENGERS
        let passengers = []
        passengers.push("0x5e432600a3a158fbd90e9bce14089d1551b60007")
        passengers.push("0xd1e7d7e8468e83282f5b506bc57cac3c380e38e9")
        passengers.push("0x6de39a2aad3e1aab5e26d272c749224c39643ac9")
        // passengers created
        for (let i = 0; i < passengers.length; i++) {


            contract.createPassenger(airlines[i], (v) => {
                // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
                ////debugger;
                //console.log('v', ':	', v);

                // Read transaction getAirlinesAdresses
                contract.getPassengersAdresses((error, result) => {
                    ////debugger;
                    //console.log(error, result);
                    updateDDLs("selGetPassengersAdresses", result, "passenger");

                });

            });



        }

        //flights of airline 2
        for (let i = 1; i <= 3; i++) {
            contract.createFlight('F00' + i, Math.floor(Date.now() / 1000, 0), airlines[2], (v) => {
                // display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);
                ////debugger;
                //console.log('v', ':	', v);

                // Read transaction getAirlinesAdresses
                contract.getFlights((error, result) => {
                    ////debugger;
                    //console.log(error, result);
                    updateDDLs("selFlights", result, "flights");

                });

            });

        }

    })
    // payInsurance

    // DOM.elid('get-airline').addEventListener('click', () => {
    //     // let _address = DOM.elid('airlineAddress').value;
    //     let _address = document.querySelector("#selGetAirlinesAdresses").value


    //     contract.getAirline(_address, (error, result) => {
    //         // //debugger;
    //         //console.log(error, result);
    //         let html = `    <h3>Information</h3>
    //                         <p>registered:\t\t${result[0]}</p>
    //                         <p>funded:\t\t${result[1]}</p>
    //                         <p>airline Name:\t\t${result[2]}</p>
    //                         <p>airline Address:\t\t${result[3].substr(0, 10)}</p>`
    //         document.getElementById("airline-info").innerHTML = html;



    //     });
    //     // " airline-info"


    // });
    // get-airline


    DOM.elid('get-flight').addEventListener('click', () => {
        // let _address = DOM.elid('airlineAddress').value;
        let _key = document.querySelector("#selFlights").value


        contract.getFlight(_key, (error, result) => {
            // //debugger;
            console.log(error, result);
            //     flights[key].isRegistered, // 0
            // flights[key].statusCode, // 1
            // flights[key].flightName, // 2
            // flights[key].updatedTimestamp,         // 3
            // flights[key].airline, // 4
            // flights[key].isInsured // 5
            let html = `<h3>Information</h3>
                        <p>isRegistered:\t\t${result[0]}</p>
                        <p>statusCode:\t\t${result[1]}</p>
                        <p>flightName:\t\t${result[2]}</p>
                        <p>updatedTimestamp:\t\t${result[3]}</p>
                        <p>airline:\t\t${result[4]}</p>
                        <p>isInsured:\t\t${result[5]}</p>`

            document.getElementById("airline-info").innerHTML = html;
            document.getElementById("flight-number").value = result[1];


        });
        // " airline-info"


    });
    // get-Insurance
    // DOM.elid('get-insurance').addEventListener('click', () => {
    //     // let _address = DOM.elid('airlineAddress').value;
    //     let _key = document.querySelector("#selInsurances").value


    //     contract.getInsurance(_key, (error, result) => {
    //         // //debugger;
    //         //console.log(error, result);
    //         // Insurances[key].price,
    //         //     Insurances[key].flightKey,
    //         //     Insurances[key].passengerAddress,
    //         //     Insurances[key].isClaimed
    //         let html = `< h3 > Information</h3>
    //                     <p>price:\t\t${result[0]}</p>
    //                     <p>flightKey:\t\t${result[1]}</p>
    //                     <p>passengerAddress:\t\t${result[2].substr(0, 10)}</p>
    //                     <p>isClaimed:\t\t${result[3]}</p>`;
    //         document.getElementById("airline-info").innerHTML = html;


    //     });
    //     // " airline-info"


    // });
    // get-flight

    //getInsurance

    // User-submitted transaction
    DOM.elid('submit-oracle').addEventListener('click', () => {
        // let flight = DOM.elid('flight-number').value;
        let flight = document.getElementById("flight-number").value
        let address = document.querySelector("#selGetAirlinesAdresses").value

        // Write transaction
        contract.fetchFlightStatus(address, flight, (error, result) => {
            display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);

            // (flight, callback)
            contract.viewFlightStatus(flight, (error, result) => {
                display('Status', 'result from oracles', [{ label: 'View Flight Status', error: error, value: result }]);
            });
        });
        // uint8 index,
        // address airline,
        // string flight,
        // uint256 timestamp,
        // uint8 statusCode
        let timestamp = Math.floor(Date.now() / 1000);

        contract.submitOracleResponse(result[0], address, flight, timestamp, 10, (error, result) => {

        });
    })

    DOM.elid('refund-passenger').addEventListener('click', () => {
        // let flight = DOM.elid('flight-number').value;
        let flight = document.getElementById("flight-number").value
        let passengerAddress = document.querySelector("#selGetAirlinesPassengers").value
        let amount = 1; // 1 eht

        // Write transaction
        contract.creditInsurees(passengerAddress, flight, amount, (error, result) => {
            display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);


        });
    })
    DOM.elid('withdraw-insurance').addEventListener('click', () => {
        // let flight = DOM.elid('flight-number').value;
        let flight = document.getElementById("flight-number").value
        let passengerAddress = document.querySelector("#selGetAirlinesPassengers").value
        let amount = 1; // 1 eht

        // Write transaction
        contract.withdraw(passengerAddress, flight, amount, (error, result) => {
            display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp }]);


        });
    })

    /************** register airline ***************/
    // DOM.elid('register-airline').addEventListener('click', () => {
    //     // let _airlineName = DOM.elid('airlineName').value;
    //     let _address = document.querySelector("#selGetAirlinesAdresses").value

    //     // Write transaction
    //     contract.registerAirline(_address, (v) => {
    //         ////debugger;
    //         //console.log('_address', ':	', v);
    //     });
    // })
    // register-airline

    /************** fund airline ***************/
    // DOM.elid('fund-airline').addEventListener('click', () => {
    //     let fundValue = DOM.elid('fundValue').value;
    //     let _address = document.querySelector("#selGetAirlinesAdresses").value
    //     //debugger;
    //     // Write transaction
    //     contract.fundAirline(_address, fundValue, (v) => {
    //         ////debugger;
    //         //console.log('_address', ':	', v);
    //     });
    // })
    // fund-airline



})();
function updateDDLs(element, result, type) {
    clearList(element);
    for (let i = 0; i < result.length; i++) {
        //debugger;
        //console.log(`* ${i} - ${result[i]}`);
        showInList(element, result[i], i);
    }
}

function clearList(container) {
    // get reference to select element
    var sel = document.getElementById(container);
    var length = sel.options.length;
    for (var i = 0; i < length; i++) {
        sel.options[i] = null;
    }
}
function showInList(container, txt, idx) {
    // get reference to select element
    var sel = document.getElementById(container);

    // create new option element
    var opt = document.createElement('option');

    // create text node to add to option element (opt)
    let num = parseInt(idx) + 1;
    opt.appendChild(document.createTextNode(`${num}- ${txt.substr(0, 6)}`));

    // set value property of opt
    opt.value = txt;

    // add opt to end of select box (sel)
    sel.appendChild(opt);
}

function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}

function showContactBalanc(contract) {
    contract.getBalance((error, result) => {
        //debugger;
        // //console.log(error, result);

        document.getElementById("result-info").innerHTML = result;

    });
}







