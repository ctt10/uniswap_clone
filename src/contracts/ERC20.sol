// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {   
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_){
        uint256 initialSupply = 100000 * 10 ** decimals();
        _mint(msg.sender, initialSupply);
    }
}