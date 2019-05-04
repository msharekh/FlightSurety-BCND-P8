pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                 // Account used to deploy contract
    bool private operational = true;               // Blocks all state changes throughout the contract if false
    
    // CONSTANTS
    uint8 private constant AUTHORIZED = 1;
    uint8 private constant NOT_AUTHORIZED = 0;
                         

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // 1 = Authorized
    // 2 = NotAuthorized
    mapping(address => uint256) authorizedCallers;

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;

        airlines[contractOwner].isRegistered = true;
        airlines[contractOwner].isFunded = true;
        airlines[contractOwner].airlineAddress = contractOwner;
        
        airlinesAdresses.push(contractOwner);

        airlineCount=airlineCount+1;

    }

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
        require(operational, "Contract is currently not operational");
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

    
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function authorizeCaller(address _address) external{
        authorizedCallers[_address]=AUTHORIZED;
    }

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

    function testFunction()
                            public 
                            requireIsOperational
                            view 
                            returns(uint) 
    {
        return 123;
    }
    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }
    function getContractAddress() public view returns(address){
        return address(this);
    }
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    /* mappings */
    mapping(address => Airline) private airlines;

    /* structs */
    struct Airline {
        bool isRegistered;
        bool isFunded;
        address airlineAddress;
    }

    /* Variables */
    uint256 public airlineCount;
    address[] airlinesAdresses;


    function createAirline
                            (  
                                address _address
                            )
                            external                              
    {
        airlines[_address].isRegistered = false;
        airlines[_address].isFunded = false;
        airlines[_address].airlineAddress=_address;

        airlinesAdresses.push(_address);

    }

    function getAirline
                    (
                        address _address
                    )
                    external
                    view                     
                    returns (bool,bool,address)
    {
       
        return  
            (
                airlines[_address].isRegistered,
                airlines[_address].isFunded,
                airlines[_address].airlineAddress
            );
        
    }

    function getAirlineCount()  external view returns (uint256)
    {
        return airlineCount;
    }

    function getAirlinesAdresses() external view returns (address[]) {
         return airlinesAdresses;
    }


    function isAirline
                    (
                        address _address
                    )
                    external
                    view                     
                    returns (bool)
    {
        return airlines[_address].isRegistered;
        
    }

    modifier requireIsFunded(address _address) {
        require(airlines[_address].isFunded, "this airline is not funded");
        _;
    }
   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (
                                address _address     
                            )
                            requireIsFunded(_address)
                            external      
                            returns ( bool resutl)                      
    {
        airlines[_address].isRegistered=true;
        airlineCount.add(1);

        return airlines[_address].isRegistered;
    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                            )
                            public
                            payable
                            
    {
        require(msg.value>=2000000000000000000, "Airline does not have engough fund");
             
        airlines[msg.sender].isFunded=true;
         
     }

    function getSentAddress() external view returns(address) {
        return msg.sender;
    }
 
     

    

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}

