//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Consumer Pirce Index
contract MonthlyCPI {

    struct RevealedPrice {
        uint price0;
        uint price1;
        uint price2;
        uint price3;
    }

    mapping (address => bytes32) public commitment;
    mapping (address => RevealedPrice) public revealedPrice;
    mapping (address => bool) public userRevealed;
    mapping (address => bool) public rewardClaimed;

    address[] public revealedUsers;
    address public factoryAddress;

    //Genesis month prices:
    uint public price0Avg = 700  * 10**18;  //$700 colombian pesos for 1 kw-hour
    uint public price1Avg = 3100 * 10**18;  //$3100 comlombian pesos for 1 liter of gas
    uint public price2Avg = 4600 * 10**18;  //$4600 colombian pesos for 1 liter of milk
    uint public price3Avg = 75000  * 10**18;  //$75000 colombian pesos for Internet 10 mbps upload speed (1 month)
    uint public timeAtDeploy;

    modifier notRevealed {
        require (!userRevealed[msg.sender], "Already revealed");
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

    modifier onlyFactory {
        require (msg.sender == factoryAddress, "Not Factory");
        _;
    }

    constructor (address _factoryAddress) {
        timeAtDeploy = block.timestamp;
        factoryAddress = _factoryAddress;
    }


    //The client app should implement:
    //keccak256(abi.encodePacked(price1, price2, price3, price4))
    function commit (bytes32 _commitment) public onlyInCommitPeriod {
        require (commitment[msg.sender] == 0,"Already commited");
        commitment[msg.sender] = _commitment;
    }

    function reveal (uint _price0, uint _price1, uint _price2, uint _price3) public notRevealed onlyInRevealPeriod {
        require (keccak256(abi.encodePacked(_price0, _price1 , _price2, _price3)) == commitment[msg.sender], "Incorrect commit");
    
        //Save the commit in mapping
        revealedPrice[msg.sender] = RevealedPrice({price0: _price0, price1: _price1, price2: _price2, price3: _price3});
        revealedUsers.push(msg.sender);
        userRevealed[msg.sender] = true;
    }

    function computeAvg () public returns (uint, uint, uint, uint) {
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

        return (price0Avg, price1Avg, price2Avg, price3Avg);
    }  

    function setReward(address _claimer) public onlyFactory {
        rewardClaimed[_claimer] = true;
    }

    function testHash (uint _price0, uint _price1 , uint _price2, uint _price3) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_price0, _price1 , _price2, _price3));
    }

    function getRevealedPrices (address _address) external view returns (uint, uint, uint, uint)  {

        uint v0 = revealedPrice[_address].price0;
        uint v1 = revealedPrice[_address].price1;
        uint v2 = revealedPrice[_address].price2;
        uint v3 = revealedPrice[_address].price3;

        return (v0, v1, v2, v3);
    }

    function getAvgPrices () external view returns (uint, uint, uint, uint)  {
        return (price0Avg, price1Avg, price2Avg, price3Avg);
    }

    function getTotalParticipants () public view returns (uint) {
        return revealedUsers.length;
    }
}

