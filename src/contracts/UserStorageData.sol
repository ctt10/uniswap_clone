// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

contract UserStorageData{
	struct TransactionStruct{
		address caller;
		address poolAddress;
		address tokenAddress0;
		address tokenAddress1;
	}

	TransactionStruct[] transactions;

	function addToChain(
		address poolAddress, 
		address tokenAddress0, 
		address tokenAddress1
	) public {
		transactions.push(TransactionStruct(msg.sender, poolAddress, tokenAddress0, tokenAddress1));
	}

	function getAllTransactions() public view returns (TransactionStruct[] memory){
		return transactions;
	} 
}