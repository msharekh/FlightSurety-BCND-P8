pragma solidity ^0.4.24;
// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)
    FlightSuretyData flightSuretyData;
    uint256 public registeredAirlineCount;
    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    uint8 private constant STATUS_CODE_REFUNDED = 60;

    uint8 private constant AIRLINE_COUNT_ACCEPTED_WITHOUT_VOTING = 4;
    address private contractOwner;          // Account used to deploy contract
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.
    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    
    modifier requireIsOperational() 
    {
         // Modify to call data contract's status
         require(true, "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }
    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    function getBalance() public returns(uint){
        return address(this).balance;
    }
    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/
    /**
    * @dev Contract constructor
    *
    */
    constructor
    (
        address dataAddress
        ) 
    public 
    {
        contractOwner = msg.sender;
        flightSuretyData= FlightSuretyData(dataAddress);
        registeredAirlineCount = registeredAirlineCount+1;
    }
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    function isOperational() 
    public 
    pure 
    returns(bool) 
    {
        return true;  // Modify to call data contract's status
    }
    function getContractAddress() public view returns(address){
        return address(this);
    }
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    /* .....................................................................*/
    /* .............................. Airlines ..............................
    /* .....................................................................*/
    function createAirline 
    (  
        address _address
        // string _airlineName
        ) requireIsOperational
    requireContractOwner
    external{
            // flightSuretyData.createAirline(_address,_airlineName);
            flightSuretyData.createAirline(_address);

        }
        function getAirlinesAdresses() external view returns (address[]){
            return flightSuretyData.getAirlinesAdresses();
        }
   /**
    * @dev Add an airline to the registration queue
    *
    */   
    function registerAirline
    ( 
        address _address  
    )
        requireIsOperational
        external   
        // view                         
        // returns(bool success, uint256 votes)
        {
        // success=false;
        // votes=0;
        // only if number of airlines is <=4
        if (registeredAirlineCount < AIRLINE_COUNT_ACCEPTED_WITHOUT_VOTING) {
            flightSuretyData.setNeedVotesStatus(_address,false);

            //allow to egister
            flightSuretyData.registerAirline(_address);
            registeredAirlineCount = registeredAirlineCount+1;
        } 
        if (registeredAirlineCount >= AIRLINE_COUNT_ACCEPTED_WITHOUT_VOTING) {
            flightSuretyData.setNeedVotesStatus(_address,true);
            
            // dont allow to register
            // If the total of votes in favor is greater than 
            // the 50% of the number of register airlines, then 
            // the airline is register. 
            // If not the airline is rejected.
            // get the number of airlines, 4 , registeredAirlineCount
            // get the number of votes,3 voteCount
            uint8 voteCount;
            voteCount = flightSuretyData.getVoteCount( _address);
            
            uint minVotes;            
            minVotes =  registeredAirlineCount / 2;

                if (voteCount >= minVotes){
                // if (voteCount > 0){
                    flightSuretyData.registerAirline(_address);
                    registeredAirlineCount = registeredAirlineCount + 1;
                    flightSuretyData.setNeedVotesStatus(_address,false);
                }
            }
        // return (success, votes);
    }
    function getMinVotes(address _address)  external view returns(uint minVotes){
        // uint voteCount;
        // voteCount = flightSuretyData.getVoteCount( _address);
         
        minVotes =  registeredAirlineCount/2;
        return minVotes;
    }
    function fund
    (   
        )
    requireIsOperational
    public
    payable
    {
         // require(msg.value>= 2000000000000000000, "Airline does not have engough fund");
        require(msg.value>= 10 ether , "Airline does not have engough fund");
        //this is transfering fund from airline to contract app then to data
        flightSuretyData.fund.value(msg.value)(msg.sender);     
        // flightSuretyData.call.value(msg.value);  
    }
    function voteAirline(                                
        address _address
        ) 
    external
                // view 
                {
                    var currentVotes = flightSuretyData.getVotes(_address);
                    for (uint8 index = 0; index < currentVotes.length; index++) {
            // uint countDuplicates ;
            // if (currentVotes[index] == tx.origin) {
            //     countDuplicates++;
            // }  
            //  require(countDuplicates>1,"This Airline votes before");
        }
        //otherwise
        flightSuretyData.voteAirline(_address);
    }
    function testVoteAirline(                                
        address _address
        ) 
    external
    view 
    returns(bool result,uint8 countDuplicates,address duplicateVote)
    {
        result = true;
        countDuplicates = 0;
        var currentVotes = flightSuretyData.getVotes(_address);
        for (uint8 index = 0; index < currentVotes.length; index++) {
           require(currentVotes[index]==tx.origin,"This Airline votes before");
           result=false;
           countDuplicates=1;
           duplicateVote =currentVotes[index];
       }
       return (result,countDuplicates,duplicateVote);
   }
   function getRegisteredAirlineCount() external view returns(uint256) {
    return registeredAirlineCount;
}
/* .....................................................................*/
    /* .............................. Passengers ............................
    /* .....................................................................*/
    /* mappings */
    mapping(address => Passenger) private passengers;
    address[] passengersAdresses;
    /* structs */
    struct Passenger {
        bool isFunded;
        address passengerAddress;
        bool isReFunded;
        uint256 refundAmount;
    }
    function createPassenger
    (  
        address _address 
        )
    external                              
    {
        passengers[_address].passengerAddress=_address;
        passengersAdresses.push(_address);
    }
    function getPassengersAdresses() external view returns (address[]) {
       return passengersAdresses;
   }

 /**
     *  @dev Credits payouts to insurees
     */
     function creditInsurees
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

        // flightSuretyData.creditInsurees(_address);

                        _address.transfer(msg.value);   

    }

     


    function withdraw
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
        
        flightSuretyData.withdraw(_address,refundAmount);
    }
    
    /* .....................................................................*/
    /* .............................. Flights ..............................
    /* .....................................................................*/
    /* Variables */
    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        string flightName;
        uint256 updatedTimestamp;        
        address airline;
        bool isInsured;
        bool hasStatus;
        uint8 status;
        bool isRefunded;
        uint256 refundAmount;
    }
    mapping(bytes32 => Flight) private flights;
    uint256 public flightsCount;
    bytes32[] flightsList;
    function createFlight
    (                                  
        string flightName,
        uint256 updatedTimestamp,      
        address airline 
        )
    external                              
    {
        bytes32 key = keccak256(abi.encodePacked(airline, updatedTimestamp)); 
        flights[key].isRegistered=false;
        flights[key].flightName=flightName;
        flights[key].statusCode=STATUS_CODE_UNKNOWN;
        flights[key].updatedTimestamp=updatedTimestamp;
        flights[key].airline=airline;
        flights[key].isInsured=false;
        flightsCount += 1;
        flightsList.push(key);
    }
    function getFlights() external view returns (bytes32[]) {
       return flightsList;
   }
    // function getInsuredFlights() external view returns (bytes32[]) {
    //     bytes32[] allflights = this.getFlights();
    //     bytes32[] insuredFlights;
    //     Flight isInsured;
    //     for (var i = 0; i < allflights.length; i++) {
    //         isInsured = this.getFlight(allflights[i]).isInsured;
    //         // if () {
    //         //     insuredFlights.push(allflights[i]);
    //         // }  
    //     }
    // return insuredFlights;
    // }
    function getFlight(bytes32 key) external view 
    returns(
            bool, // 0
            uint8, // 1
            string, // 2
            uint256,        // 3
            address, // 4
            bool // 5
            )   
    {
        return(
        flights[key].isRegistered, // 0
        flights[key].statusCode, // 1
        flights[key].flightName, // 2
        flights[key].updatedTimestamp,         // 3
        flights[key].airline, // 4
        flights[key].isInsured // 5
        );
    }

/*  returns(
    bool, // 0
    uint8, // 1
    string, // 2
    uint256,   // 3
    address, // 4
    bool, // 5
    uint8 // 6
    )   
 {
    return(
        flights[key].isRegistered, // 0
        flights[key].statusCode, // 1
        flights[key].flightName, // 2
        flights[key].updatedTimestamp, // 3
        flights[key].airline, // 4
        flights[key].isInsured, // 5
        flights[key].status // 6
        );
}
*/
// contract.fetchFlightStatus(flight, (error, result) => {
//                 display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
//             });
/* .....................................................................*/
    /* .............................. Insurances ..............................
    /* .....................................................................*/
    /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
    (      
        bytes32 key                    
        )
    external
    payable
    {
        flights[key].isRegistered = true;
        flights[key].isInsured = true;
    }

   /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight
    (
        )
    external
    pure
    {
    }
   /**
    * @dev Called after oracle has updated flight status
    *
    */  
    function processFlightStatus
    (
        address airline,
        string memory flight,
        uint256 timestamp,
        uint8 statusCode
        )
    internal
    {
        //this will set status to flight
        bytes32 flightKey = keccak256(abi.encodePacked(flight, timestamp));
        flights[flightKey].statusCode = statusCode;
    }
    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus    //when button pressed , take 1-airline address and 2-flight name and 3-timestapm
    (
        address airline,
        string flight,
        uint256 timestamp                            
        )
    external
    {
        uint8 index = getRandomIndex(msg.sender);  //get random index [1-3]
        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); //

        oracleResponses[key] = ResponseInfo({
            requester: msg.sender,
            isOpen: true
            });
        emit OracleRequest(index, airline, flight, timestamp);
    } 
// region ORACLE MANAGEMENT
    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    
    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;
    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;
    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }
    // Track all registered oracles
    mapping(address => Oracle) private oracles;
    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
                                                    }
    // Track all oracle responses 
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;
    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);
    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);
    // Register an oracle with the contract
    function registerOracle
    (
        )
    external
    payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");
        uint8[3] memory indexes = generateIndexes(msg.sender); // generate 3 numbers of indexes    
        oracles[msg.sender] = Oracle({
            isRegistered: true,
            indexes: indexes
            });
    }
    function getOracle(
        address account
        ) external view returns(uint8[3]){

        return oracles[account].indexes;
    }
    function getMyIndexes
    (
        )
    view
    external
    returns(uint8[3])
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }
    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse
    (
        uint8 index,
        address airline,
        string flight,
        uint256 timestamp,
        uint8 statusCode
        )
    external
    {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");
        oracleResponses[key].responses[statusCode].push(msg.sender);
        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {
            emit FlightStatusInfo(airline, flight, timestamp, statusCode);
            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }
    function getFlightKey
    (
        address airline,
        string flight,
        uint256 timestamp
        )
    pure
    internal
    returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }
    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
    (                       
        address account         
        )
    internal
    returns(uint8[3])
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }
        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }
        return indexes;
    }
    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
    (
        address account
        )
    internal
    returns (uint8)
    {
        uint8 maxValue = 10;
        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);
        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }
        return random;
    }
    // Query the status of any flight
    function viewFlightStatus
    (
        string flight,
        uint256 timestamp
        )
    external
    view
    returns(uint8)
    {

        bytes32 flightKey = keccak256(abi.encodePacked(flight, timestamp));
        require(flights[flightKey].hasStatus, "Flight status not available");
        return flights[flightKey].status;
    }
// endregion
}   
contract FlightSuretyData{
    function registerAirline ( address _address )  external;
    function fund ( address _address ) public payable;
    function getVoteCount (address _address ) external  view  returns (uint8);
    function voteAirline( address _address) external;
    function getVotes(address _address) external view returns (address[]);
    function setNeedVotesStatus(address _address,bool status) external;
    function createAirline
    (  
        address _address/* ,
        string _airlineName */
        )
    external;
    function getAirlinesAdresses() external view returns (address[]);
    function creditInsurees
    (      
       address insuree
       
       )
    external
    payable;
    function withdraw
    (      
       address insuree,
       uint256 refundAmount
       )
    external
    payable;
}
// flightSuretyApp
// ^\s*