// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*study ERC20 contract
 write an ERC20 contract
 write an ERC20 contract with special feature to burn 10% of the transfer on the total supply for every transfer of token
 or from your balance as charges
 */

contract Piggeth {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    mapping(address => uint256) public savings;


    event SavingSuccessful(address indexed user, uint256 indexed amount);

    function deposit() external payable {
        require(msg.sender != address(0), "wrong EOA");
        require(msg.value > 0, "Can't save zero value");

        savings[msg.sender] = savings[msg.sender] + msg.value;

        emit SavingSuccessful(msg.sender, msg.value);
    }

    function withdraw() external {
        uint256 _userSavings = savings[msg.sender];
        require(msg.sender != address(0), "wrong EOA");
        require(_userSavings > 0, "You do not have any savings");

        savings[msg.sender] -= _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

    function withdraw1(uint _amount) external {
        uint256 _userSavings = savings[msg.sender];
        require(msg.sender != address(0), "wrong EOA");
        require(_amount > 0, "Cannot withdraw zero value");
        require(_userSavings > _amount, "Withdraw cannot be more than balance");

        _userSavings = _userSavings - _amount;
        savings[msg.sender] = _userSavings;

        payable(msg.sender).transfer(_amount);
    }

    function checkSavings(address _user) external view returns (uint256) {
        return savings[_user];
    }

    function sendOutSaving(address _receiver, uint256 _amount) external {
        require(_amount > 0, "cannot send zero value");
        require(savings[msg.sender] >= _amount);
        require(msg.sender != address(0), "no zero address call");

        savings[msg.sender] -= _amount;

        payable(_receiver).transfer(_amount);
    }

    function checkContractBal() external view returns (uint256) {
        return address(this).balance;
    }
}