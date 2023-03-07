import {Contract, BigNumber} from "ethers";
import {checkWalletConnected} from "../Wallet/WalletUtils";
//NOT_TESTED================================================
//Deposit tokens in contract before SWAP || LIQUIDITY
export const fundContract = async(tokenContract:Contract, recipientAddress:string, tokenType:string, value:BigNumber) => {	
	switch(tokenType){
		case "ETH":
		case "IWETH":
			return await depositETH(tokenContract, recipientAddress, value);
			break;
		case "ERC20":
			return await depositERC20(tokenContract, recipientAddress, value);
			break;
		default:
			console.error('Unsupported Token Type')
			break;
	}
}

/**
 * @params {tokenContract} ETH/IWETH contract instance
 * @params {recipientAddress} | Contract to access User's Eth [Swap|Liquidity]
 * @params {value} amount of Eth to deposit
 */
async function depositETH (tokenContract:Contract, recipientAddress:string, value:BigNumber){
	//deposit token to TOKENX contract,
    await tokenContract.deposit({ value });
    //approve singleSwapToken for deposited amount
    await tokenContract.approve(recipientAddress, value); //approve this contract to spend
}

/** 
 * DEPOSIT TOKEN IN CONTRACT FOR USE
 * @params {tokenContract} | ERC20 contract instance
 */
async function depositERC20(tokenContract:Contract, recipientAddress:string, value:BigNumber) {
	const account:string = await checkWalletConnected();
    return await tokenContract.connect(account).transfer(recipientAddress, value) //transfers to this contract
} //transfer from connected account to recipientAddress