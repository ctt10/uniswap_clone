// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;

//This contract contains functions deposit && withdraw
//as implemented in @openzeppelin ERC20Wrapper.sol
interface IWETH {
    //ERC20
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    //ERC20Wrapper
    function deposit() external payable;
    function withdraw(uint) external;
    //EVENTS
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
