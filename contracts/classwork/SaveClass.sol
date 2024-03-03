// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/classwork/IClass.sol";

contract SaveClass {

    address private savingToken;
    address private owner;

    mapping(address => uint256) private savingsToken;
    mapping(address => uint256) public savingsETH;

    event SavingSuccessful(address sender, uint256 amount);
    event WithdrawSuccessful(address receiver, uint256 amount);

    constructor(address _savingToken) {
        savingToken = _savingToken;
        owner = msg.sender;
    }

    function deposit(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't save zero value");
        require(IClass(savingToken).balanceOf(msg.sender) >= _amount, "not enough token");

        require(IClass(savingToken).transferFrom(msg.sender, address(this), _amount), "failed to transfer");

        savingsToken[msg.sender] += _amount;

        emit SavingSuccessful(msg.sender, _amount);

    }

    function getSavingToken() external view returns(address){
        return savingToken;
    }
    function getOwner() external view returns(address){
        return owner;
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(_amount > 0, "can't withdraw zero value");

        uint256 _userSaving = savingsToken[msg.sender];

        require(_userSaving >= _amount, "insufficient funds");

        savingsToken[msg.sender] = savingsToken[msg.sender] - _amount;

        require(IClass(savingToken).transfer(msg.sender, _amount), "failed to withdraw");

        emit WithdrawSuccessful(msg.sender, _amount);
    }

    function checkUserBalance(address _user) external view returns (uint256) {
        return savingsToken[_user];
    }

    function checkContractBalance() external view returns(uint256) {
        return IClass(savingToken).balanceOf(address(this));
    }





     function depositETH() external payable {
        require(msg.sender != address(0), "wrong EOA");
        require(msg.value > 0, "Can't save zero value");

        savingsETH[msg.sender] = savingsETH[msg.sender] + msg.value;

        emit SavingSuccessful(msg.sender, msg.value);
    }

    function withdrawETH() external {
        uint256 _userSavings = savingsETH[msg.sender];
        require(msg.sender != address(0), "wrong EOA");
        require(_userSavings > 0, "You do not have any savings");

        savingsETH[msg.sender] -= _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

     function checkSavingsETH(address _user) external view returns (uint256) {
        return savingsETH[_user];
    }

    function checkContractBalETH() external view returns (uint256) {
        return address(this).balance;
    }
}