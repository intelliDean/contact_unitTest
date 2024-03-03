// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library NumLib {

    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }

    function subtract(uint a, uint b) internal pure returns (uint) {
        if (a > b) return a - b;
        else revert("a cannot be less than b");
    }

    function find(uint[] memory arr, uint num) internal pure returns (uint) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == num) {
                return i;
            }
        }
        revert("Could not be found");
    }
}
