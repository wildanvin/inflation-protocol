//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MonthlyCPI.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FactoryCPI is ERC20 {

    constructor() ERC20("InfCOL", "ICOP") {
        _mint(0xDead0000371e0a9EC309d84586dE645a6897E613, 3000000000 * 10 ** decimals());

        //Genesis Month
        MonthlyCPI cpi = new MonthlyCPI();
        cpis.push(cpi);
    }

    struct Percentages {
        int price0;
        int price1;
        int price2;
        int price3;
        int total;
    }

    MonthlyCPI[] public cpis;
    Percentages[] public percentages;
    uint public counter;

    modifier onlyOnceAMonth {
        require (block.timestamp >= MonthlyCPI(cpis[counter]).timeAtDeploy() + 28 days, "Only 1 per month");
        _;
    }

    modifier onlyAfterCommitReveal {
        require (block.timestamp >= MonthlyCPI(cpis[counter]).timeAtDeploy() + 6 days, "Wait for commit-reveal");
        _;
    }

    // This function should be called the 15th of each month
    function createMonthlyCPI () public onlyOnceAMonth {
        MonthlyCPI cpi = new MonthlyCPI();
        cpis.push(cpi);
        counter++;
    }

    // This is the function that should be called the 21th of each month
    // After 6 days: 3 days of commit period and 3 days of reveal period 
    function calculateCPI () public onlyAfterCommitReveal{

        int price0Old = int(MonthlyCPI(cpis[counter - 1]).price0Avg());
        int price1Old = int(MonthlyCPI(cpis[counter - 1]).price1Avg());
        int price2Old = int(MonthlyCPI(cpis[counter - 1]).price2Avg());
        int price3Old = int(MonthlyCPI(cpis[counter - 1]).price3Avg());

        (uint price0New, uint price1New, uint price2New, uint price3New) = MonthlyCPI(cpis[counter]).computeAvg();

        int percentage0 = (int(price0New) - price0Old)/price0Old;
        int percentage1 = (int(price1New) - price1Old)/price1Old;
        int percentage2 = (int(price2New) - price2Old)/price2Old;
        int percentage3 = (int(price3New) - price3Old)/price3Old;

        int total = (percentage0 + percentage1 + percentage2 + percentage3)/4;

        percentages.push(Percentages(percentage0, percentage1, percentage2, percentage3, total));
    }

    function claimReward () public onlyAfterCommitReveal{
        
        require(MonthlyCPI(cpis[counter]).userRevealed(msg.sender));
        require(_verifyRevealedAnswers(), "Wrong answers submitted");

        int inflation = percentages[counter].total;
        if ( inflation > 0) {
            uint totalParticipants = MonthlyCPI(cpis[counter]).getTotalParticipants();
            uint reward = (uint(inflation) * totalSupply())/totalParticipants;
            _mint(msg.sender, uint(reward));
        }
    } 

    function _verifyRevealedAnswers() view internal returns(bool) {
        //RevealedPrice memory prices =  MonthlyCPI(cpis[counter]).revealedPrice(msg.sender);
        // RevealedPrice memory revealed =  MonthlyCPI(cpis[counter]).getRevealedPrices(msg.sender);
        (uint price0Reveal, uint price1Reveal, uint price2Reveal, uint price3Reveal) = MonthlyCPI(cpis[counter]).getRevealedPrices(msg.sender);

        (uint price0Avg, uint price1Avg, uint price2Avg, uint price3Avg) = MonthlyCPI(cpis[counter]).getAvgPrices();

        uint threshold0 = (price0Avg*10)/100;
        uint threshold1 = (price1Avg*10)/100;
        uint threshold2 = (price2Avg*10)/100;
        uint threshold3 = (price3Avg*10)/100;

        if (
            _positiveSubstraction(price0Avg,price0Reveal) <= threshold0 &&
            _positiveSubstraction(price1Avg,price1Reveal) <= threshold1 &&
            _positiveSubstraction(price2Avg,price2Reveal) <= threshold2 &&
            _positiveSubstraction(price3Avg,price3Reveal) <= threshold3
            )
        {
            return true;
        }else {
            return false;
        }

    }

    /// @notice function helper to get a positive value in a substraction. Similar to an absolute value in math. Seems to work fine 
    function _positiveSubstraction (uint a, uint b) internal pure returns (uint){
        if (a < b){
            return (b-a);
        } else {
            return (a-b);
        }  
    }
}