import { ethers, BigNumber, Contract } from "ethers";
import { getNetwork } from "../Wallet/WalletUtils";
import {
	getContractAddressByNetwork, 
	createContractInstance, 
	connectContractUser
} from "../Contracts/ContractUtils";
import { fundContract } from "../Transfer/TransferUtils";
import {
	ERC20ABI,
	IWETHABI,
	singleSwapToken,
	SingleSwapTokenABI,
	swapMultiHop,
} from "../Constants/ContractInfo";
import {
	formatNumberToBig
} from "../Token/TokenUtils";
//@Types
import { IToken } from "../../Models/index";


/**
 * ACTION: SWAP SINGLE TOKENX FOR TOKENY
 * CONNECTS ONLY TO HARD-CODED TOKEN ADDRESSES
 */
export const singleSwap = async (tokenX:IToken, tokenY:IToken, swapAmount:number) => {
	if(tokenX.name==="" || tokenY.name==="" || Number.isNaN(swapAmount)) return null;

	//GET USER ACTIVE NETWORK to find token address on that network 
	const network = await getNetwork();
	if(!network) return null;
	
	//CONFIRM SELECTED TOKEN CONTRACTS EXIST | CAN CONNECT
	const tokenXAddress:string = await getContractAddressByNetwork(tokenX.Network, network.name);
	const tokenYAddress:string = await getContractAddressByNetwork(tokenY.Network, network.name);
	const singleSwapAddress:string = await getContractAddressByNetwork(singleSwapToken, network.name);
	
	//MAKE CONTRACT INSTANCE TO ACCESS FUNCTIONS
	const tokenXContract:Contract|null = await connectContractUser(tokenXAddress, tokenX.Network[0].Abi);
	const swapContract:Contract|null = await connectContractUser(singleSwapAddress, SingleSwapTokenABI);
	if(!tokenXContract || !swapContract) return null; //could not connect

	//Convert number to contract readable
	const amountIn = await formatNumberToBig(tokenXContract, swapAmount);

	//MAKE FUNDS ACCESSIBLE TO SINGLESWAP CONTRACT
	await fundContract(tokenXContract, singleSwapAddress, tokenX.type, amountIn)

    //SWAP
	const txn = await swapContract.swapExactInputSingle(
		tokenXAddress, 
		tokenYAddress, 
		amountIn,
		{ gasLimit: 300000 }
	);
	txn.wait();
	console.log("post - txn", txn);
}

//==================SwapMultiHop==========================
//CONNECTING WITH SwapMultiHop CONTRACT
// export const swapMultiHop = async () => {
// 	try{
// 		const web3modal = new Web3Modal();
// 		const connection = await web3modal.connect();
// 		const provider = new etheres.providers.Web3Provider(connection);
// 		const signer = provider.getSigner();
// 		const contract = fetchSwapMultiHopContract(signer);
// 		return contract;
// 	}catch (error) {
// 		console.log('error', error)
// 	}
// }