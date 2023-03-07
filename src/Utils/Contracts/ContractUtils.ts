import { ethers, providers, BigNumber, Contract, ContractInterface} from "ethers";
import { defaultProvider, AppProvider, getNetwork } from "../Wallet/WalletUtils";
import { fundContract } from "../Transfer/TransferUtils";
import {
	ERC20ABI,
	IWETHABI,
} from "../Constants/ContractInfo";
import axios from "axios";
//@Types
import { Contract_Network_Info, Token } from "../../Models/index";

/**
 * GET CONTRACT FOR USER'S CONNECTED NETWORK
 * **USED FOR STATIC CONTRACTS LIKE ACCEPTED TOKENS || SWAP CONTRACT
 */ 
export const getContractAddressByNetwork = async(el:Contract_Network_Info[], network:string):Promise<string> => {
	const ContractInfo:Contract_Network_Info[] = el.filter((nestEl:Contract_Network_Info)=> (
		nestEl.Name === network
	))
	if(ContractInfo.length<1) return ""; //network not supported
	return ContractInfo[0].Address;
}

export const getAbi = async(address:string):Promise<ContractInterface|null>=> {
	const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey="${process.env.ETHERSCAN_API_KEY}"`
	try{
		const res = await axios.get(url);
		const abi:ContractInterface = JSON.parse(res.data.result);
		return abi;
	}catch(error){
		console.log("Etherscan Request failed", error)
		return null;
	}
}

//CREATE INSTANCE OF ANY CONTRACT TO ACCESS FUNCTIONS
export const createContractInstance = (
	Address:string, 
	Abi:ContractInterface, 
	signerOrProvider:providers.Web3Provider|providers.JsonRpcProvider
) => 
	new ethers.Contract(Address, Abi, signerOrProvider);

//USER PROVIDER CONNECTING TO CONTRACT (i.e. metamask) 
export const connectContractUser = async(Address:string, Abi:ContractInterface):Promise<Contract|null> => {
	try{
		const provider:ethers.providers.Web3Provider|null = await defaultProvider();
		if(!provider) return null;
		const contract = createContractInstance(Address, Abi, provider);
		return contract;
	}catch (error) {
		console.log('error', error)
		return null;
	}
}

//APP PROVIDER CONNECTING FOR PRICE QUOTES (i.e. JSONRpcProvider)
export const connectContractApp = async(Address:string, Abi:ContractInterface):Promise<Contract|null> => {
	try{
		const provider:ethers.providers.JsonRpcProvider|null = await AppProvider();
		if(!provider) return null;
		const contract = createContractInstance(Address, Abi, provider);
		return contract;
	}catch (error) {
		console.log('error', error)
		return null;
	}
}