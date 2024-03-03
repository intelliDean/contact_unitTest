// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./NumLib.sol";

contract UseLib {

    //this links any array of uint to all the functions in NumLib library
    using NumLib for uint[];

    uint[] arr = [3, 5, 1, 6, 8, 4, 9, 5];

    function addNums(uint a, uint b) external pure returns (uint) {
        //this calls the add function in the NumLib library
        return NumLib.add(a, b);
    }

    function subtractNums(uint a, uint b) external pure returns (uint) {
        //this calls the subtract function in the NumLib library
        return NumLib.subtract(a, b);
    }

    function findNum(uint[] memory array, uint num) external pure returns (uint) {
        //the array variable is used to call the find function in the NumLib library
        //since uint[] is linked to all the functions in the NumLib library
        return array.find(num);
    }

    function findNum2(uint num) external view returns (uint) {
        //this used the arr state variable to call the find function in the NumLib library
        return arr.find(num);
    }
}
