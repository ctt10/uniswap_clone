import { ethers, providers, BigNumber, Contract } from "ethers";
//Internal
import { tokenList } from "../Constants/AvailableTokens";
//Smart Contract
import {ERC20ABI, IWETHABI} from "../Constants/ContractInfo";
import {getContractAddressByNetwork, connectContractUser} from "../Contracts/ContractUtils";

//Types
import { IToken } from "../../Models/index";

/**
 * @parmas {provider} | object??
 * @params {network} | string
 * @params {tokenData} | useState<Token[]>
 */
//GET USERS BALANCE OF ALL SUPPORTED TOKENS 
export const getUserTokenBalance = async(
	provider: providers.Web3Provider,
	account:string, //Connected Address
	network:providers.Network, //Connected Network Name
	tokenData:IToken[]
):Promise<void> => {	
	//GET TOKEN BALANCES
	tokenList.map(async(el:IToken) => {
		//Get contract, 
		const contractAddress = await getContractAddressByNetwork(el.Network, network.name);
		if(!contractAddress) return;
		const tokenContract:Contract|null = await connectContractUser(
			contractAddress, 
			el.type==="ERC20"? ERC20ABI: IWETHABI
		);
		if(!tokenContract) return null;;

		//return human readable balance for each token
		const tokenValue:number = await convertTokenBalance(account, provider, tokenContract, el.symbol, el.type);

		//CREATE LIST TOKENDATA | prevent duplicate add token
		if(!tokenData.some(el => el.Network[0].Address === contractAddress)){
			tokenData.push({
				name: el.name,
				symbol: el.symbol,
				type: el.type,
				img: el.img,
				Network:[{
					Name: network.name,
					Address: contractAddress,
				}],
				balance: tokenValue
			});
		}
	});
}

//CONVERT BALANCE TO READABLE NUMBER
export const convertTokenBalance = async(
	account:string, //Connected Address
	provider:ethers.providers.Web3Provider,
	contract:Contract,
	tokenSymbol:string, //ex. "Eth"
	tokenType:string //"ERC20"||"IWETH"
):Promise<number> => {
	if(!account || !provider || !contract || !tokenSymbol || !tokenType) {
		console.error('Unable to fetch balance')
		return 0;
	}
	
	let balance:BigNumber, convertedBal:string, tokenValue:string;
	switch(tokenSymbol){
		case 'ETH': //Chain native eth token
			balance = await provider.getBalance(account);
			convertedBal = BigNumber.from(balance).toString();
			tokenValue = formatEtherDisplayValue(convertedBal);
			break;
		default:
			//Get && Convert User Token Balance
			balance = await contract.balanceOf(account)
			convertedBal = BigNumber.from(balance).toString();
			tokenValue = 
				tokenType==="IWETH" 
				? formatEtherDisplayValue(convertedBal)
				: tokenType==="ERC20" 
				? await formatERC20DisplayValue(contract, convertedBal)
				: "0"
			break;
	}
	return parseFloat(tokenValue);
}

export function formatEtherDisplayValue(value:string):string {
	return parseFloat(
		ethers.utils.formatEther(value)
		).toFixed(6)
}

//DISPLAY TOKENS IN UX
export async function formatERC20DisplayValue(tokenContract:Contract, value:string):Promise<string> {
	const decimals = await tokenContract.decimals();
	return (parseFloat(value) / 10 ** decimals).toFixed(6)
}

export async function formatNumberToBig(tokenContract:Contract, value:number):Promise<BigNumber> {
	const decimals = await tokenContract.decimals();
	return ethers.utils.parseUnits(value.toString(), decimals);
}

export async function formatBigToString(tokenContract:Contract, value:BigNumber):Promise<string>{
	const decimals = await tokenContract.decimals();
	return ethers.utils.formatUnits(value, decimals);
}