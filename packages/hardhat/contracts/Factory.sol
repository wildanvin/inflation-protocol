//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MonthlyCPI.sol";

contract FactoryCPI {

     struct Percentages {
        int price0;
        int price1;
        int price2;
        int price3;
        int total;
    }

    MonthlyCPI[] public cpis;
    Percentages[] public percentages;
    uint counter;

   

    constructor () {
        //Genesis Month
        MonthlyCPI cpi = new MonthlyCPI();
        cpis.push(cpi);
        counter++;
    }

    function createMonthlyCPI () public {
        MonthlyCPI cpi = new MonthlyCPI();
        cpis.push(cpi);
        counter++;
    }

    function _genesis () internal {

    }

    function calculateCPI () public {

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

    function test (uint _a, uint _b) public pure returns(int) {
        return (int(_a)-int(_b));

    }

}