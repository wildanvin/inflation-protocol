//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MonthlyCPI.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title FactoryCPI contract
/// @author wildanvin
/// @notice This contract will create MonthlyCPI.sol every month 
/// @notice The percentage array is where the inlfation percentages change will be stored
contract FactoryCPI is ERC20 {

    constructor() ERC20("InfCOL", "ICOP") {
        _mint(0xDead0000371e0a9EC309d84586dE645a6897E613, 1000 * 10 ** decimals());

        //Genesis Month
        MonthlyCPI cpi = new MonthlyCPI(address(this));
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
    
    /// @notice This counter variable is important because it allows us to be in the right month for performing calculations
    uint public counter;

    modifier onlyOnceAMonth {
        require (block.timestamp >= MonthlyCPI(cpis[counter]).timeAtDeploy() + 28 days, "Only 1 per month");
        _;
    }

    modifier onlyAfterCommitReveal {
        require (block.timestamp >= MonthlyCPI(cpis[counter]).timeAtDeploy() + 6 days, "Wait for commit-reveal");
        _;
    }

    /// @notice This function should be called the 15th of each month by Chainlink Automation
    function createMonthlyCPI () public onlyOnceAMonth {
        MonthlyCPI cpi = new MonthlyCPI(address(this));
        cpis.push(cpi);
        counter++;
    }

    /// @notice This is the function that should be called the 21th of each month. After the commit-reveal period (6 days)
    /// @notice The percentages are multiplied by 100000 before dividing to don't lose precision
    function calculateCPI () public onlyAfterCommitReveal{

        int price0Old = int(MonthlyCPI(cpis[counter - 1]).price0Avg());
        int price1Old = int(MonthlyCPI(cpis[counter - 1]).price1Avg());
        int price2Old = int(MonthlyCPI(cpis[counter - 1]).price2Avg());
        int price3Old = int(MonthlyCPI(cpis[counter - 1]).price3Avg());

        (uint price0New, uint price1New, uint price2New, uint price3New) = MonthlyCPI(cpis[counter]).computeAvg();

        int percentage0 = ((int(price0New) - price0Old)*100000)/price0Old;
        int percentage1 = ((int(price1New) - price1Old)*100000)/price1Old;
        int percentage2 = ((int(price2New) - price2Old)*100000)/price2Old;
        int percentage3 = ((int(price3New) - price3Old)*100000)/price3Old;

        int total = (percentage0 + percentage1 + percentage2 + percentage3)/4;

        percentages.push(Percentages(percentage0, percentage1, percentage2, percentage3, total));
    }

    /// @notice This function allows an honest user to claim a reward
    /// @notice We divide inflation by 100000 to get the "actual" inflation percentage
    function claimReward () public onlyAfterCommitReveal{
        
        require(MonthlyCPI(cpis[counter]).userRevealed(msg.sender), "User hasn't revealed");
        require(MonthlyCPI(cpis[counter]).rewardClaimed(msg.sender) == false, "Already claimed");

        require(_verifyRevealedAnswers(), "Wrong answers submitted");

        int inflation = percentages[counter - 1].total;
        if ( inflation > 0) {
            uint totalParticipants = MonthlyCPI(cpis[counter]).getTotalParticipants();
            uint reward = (uint(inflation) * totalSupply())/(totalParticipants*100000);
            MonthlyCPI(cpis[counter]).setReward(msg.sender);
            _mint(msg.sender, uint(reward));
        }
    } 

    /// @notice This function returns true if the prices revealed by the user are in +10% or -10% range 
    function _verifyRevealedAnswers() view internal returns(bool) {
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

    /// @notice Function helper to get a positive value in a substraction. Similar to an absolute value in math. Seems to work fine 
    function _positiveSubstraction (uint a, uint b) internal pure returns (uint){
        if (a < b){
            return (b-a);
        } else {
            return (a-b);
        }  
    }

    function getCPIsArray () public view returns (MonthlyCPI[] memory){
        return cpis;
    }

    function getPercentagesArray () public view returns (Percentages[] memory){
        return percentages;
    }
}