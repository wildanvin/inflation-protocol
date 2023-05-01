//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*

There will be a factory that will create the MonthlyCPI each month using chainlink automation
They will be created the 21 of each month
The 28th  prices will be revealed. And the CPI will be calculated

DONE:

There needs to be a genesis month to start

function to commit the prices

funcnction when the prices are revealed 

fucntion calculate CPI with the average prices. it will compare with the previous month


PENDING:

fucntion if your revealed value is in the range with the mean. you get tolens proportionally 
to the honest participants and the inflation rate

TOKEN

There are 21 trillion dollars circulating: 21_000_000_000

Advantages:
Decentralized, trust to the people, results are delivered each month, no trust in third parties, transparent
Could be integrated in other defi protocols

We can make the factory the erc-20 

*/


//Consumer Pirce Index
contract MonthlyCPI {

    struct RevealededPrice {
        uint price0;
        uint price1;
        uint price2;
        uint price3;
    }

    mapping (address => bytes32) public commitment;
    mapping (address => RevealededPrice) public revealedPrice;
    mapping (address => bool) public userRevealed;
    address[] public revealedUsers;
    uint public price0Avg = 12  * 10**16;  //$0.12 for 1 kw-hour
    uint public price1Avg = 129 * 10**16;  //$1.29 for 1 liter of gas
    uint public price2Avg = 128 * 10**16;  //$1.28 for 1 liter of milk
    uint public price3Avg = 65  * 10**18;  //$65   for Internet 8 mbps (1 month)
    // data from: https://www.expatistan.com/cost-of-living/new-york-city at May2022
    uint timeAtDeploy;
    bool computeAvgCalled = false;
    
    modifier notRevealed {
        require (!userRevealed[msg.sender], "Already revealed");
        _;
    }

    modifier onlyOnce {
        require (!computeAvgCalled, "Already computed");
        _;
    }

    modifier onlyInCommitPeriod {
        require (block.timestamp <= timeAtDeploy + 3 days ,"Not time for commit");
        _;
    }

    modifier onlyInRevealPeriod {
        require (block.timestamp >= timeAtDeploy + 3 days && block.timestamp <= timeAtDeploy + 6 days,"Not time for reveal");
        _;
    }

    modifier onlyAfter6Days {
        require (block.timestamp >= timeAtDeploy + 6 days ,"Not time for average");
        _;
    }

    constructor () {
        timeAtDeploy = block.timestamp;
    }


    //The client app should implement:
    //keccak256(abi.encodePacked(price1, price2, price3, price4))
    function commit (bytes32 _commitment) public onlyInCommitPeriod {
        require (commitment[msg.sender] == 0,"Already commited");
        commitment[msg.sender] = _commitment;
    }

    function reveal (uint _price0, uint _price1, uint _price2, uint _price3) public notRevealed onlyInRevealPeriod {
        //require (keccak256(abi.encodePacked(_price0, _price1 , _price2, _price3)) == commitment[msg.sender], "Incorrect commit");
    
        //Do the average
        /*
        if (firstReveal == 0){
            price0Avg = _price0;
            price1Avg = _price1;
            price2Avg = _price2;
            price3Avg = _price3;
            firstReveal++;
        } else {
            price0Avg = (price0Avg + _price0)/2;
            price1Avg = (price1Avg + _price1)/2;
            price2Avg = (price2Avg + _price2)/2;
            price3Avg = (price3Avg + _price3)/2;
        }
        */

        //Save the commit in mapping
        revealedPrice[msg.sender] = RevealededPrice({price0: _price0, price1: _price1, price2: _price2, price3: _price3});
        revealedUsers.push(msg.sender);
        userRevealed[msg.sender] = true;
    }

    function computeAvg () public onlyAfter6Days onlyOnce returns (uint, uint, uint, uint) {
        // require call only after 28 og each month
        uint totalParticipants = revealedUsers.length;
        require(totalParticipants > 0, "No participants :(");
        
        uint price0Sum;
        uint price1Sum;
        uint price2Sum;
        uint price3Sum;

          for (uint i = 0; i < totalParticipants; i++) {

            price0Sum += revealedPrice[revealedUsers[i]].price0;
            price1Sum += revealedPrice[revealedUsers[i]].price1;
            price2Sum += revealedPrice[revealedUsers[i]].price2;
            price3Sum += revealedPrice[revealedUsers[i]].price3;

        }
        price0Avg = price0Sum/totalParticipants;
        price1Avg = price1Sum/totalParticipants;
        price2Avg = price2Sum/totalParticipants;
        price3Avg = price3Sum/totalParticipants;

        computeAvgCalled = true;

        return (price0Avg, price1Avg, price2Avg, price3Avg);

    }

    

    function claimReward () public{
        // calculate 

    }   

    function calculateHonestUser () public {

    }

    function testing (uint _price0, uint _price1 , uint _price2, uint _price3) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_price0, _price1 , _price2, _price3));

    }

    
}


contract CommitReveal {
    address public player1;
    address public player2;
    bytes32 public commitment;
    uint256 public player1Choice;
    uint256 public player2Choice;
    bool public revealed;
    
    constructor(address _player2, bytes32 _commitment) payable {
        require(msg.value == 1 ether, "Each player must send 1 ether to play");
        player1 = msg.sender;
        player2 = _player2;
        commitment = _commitment;
    }
    
    function reveal(uint256 _choice, bytes32 _secret) public {
        require(msg.sender == player1 || msg.sender == player2, "You are not authorized to reveal");
        require(keccak256(abi.encodePacked(_choice, _secret)) == commitment, "Invalid commitment");
        require(!revealed, "Already revealed");
        
        if (msg.sender == player1) {
            player1Choice = _choice;
        } else {
            player2Choice = _choice;
        }
        /*
        if (player1Choice != 0 && player2Choice != 0) {
            revealed = true;
            if (player1Choice == player2Choice) {
                player1.transfer(address(this).balance);
            } else if (player1Choice == 1 && player2Choice == 2) {
                player2.transfer(address(this).balance);
            } else if (player1Choice == 2 && player2Choice == 1) {
                player1.transfer(address(this).balance);
            } else if (player1Choice == 1 && player2Choice == 3) {
                player1.transfer(address(this).balance);
            } else if (player1Choice == 3 && player2Choice == 1) {
                player2.transfer(address(this).balance);
            } else if (player1Choice == 2 && player2Choice == 3) {
                player2.transfer(address(this).balance);
            } else {
                player1.transfer(address(this).balance);
            }
        }
        */
    }
}
