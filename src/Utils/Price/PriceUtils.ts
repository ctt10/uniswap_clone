//EXTERNAL
import { ethers, BigNumber, Contract, ContractInterface } from "ethers";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import {Token, CurrencyAmount, TradeType, Percent} from "@uniswap/sdk-core";
import bn from "bignumber.js";
//INTERNAL
import { getNetwork, AppProvider } from "../Wallet/WalletUtils";
import { 
	getContractAddressByNetwork, 
	getAbi, 
	connectContractUser, 
	connectContractApp 
} from "../Contracts/ContractUtils";
import { 
	singleSwapQuoter, 
	QuoterABI,
	singleSwapToken,
	UniswapPool, 
	SingleSwapTokenABI,
	IUniswapv3PoolABI,
	SwapMultiHopABI,
} from "../Constants/ContractInfo";
import {
	formatNumberToBig,
	formatBigToString,
} from "../Token/TokenUtils";
import {
	getPoolImmutables, 
	getPoolState,
	getPoolTokens,
} from "../Pools/PoolUtils";
//@Types
import { 
	Immutables, 
	State,
	IToken,
	PoolTokens,
	PoolPriceQuote
} from "../../Models/index";

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })
export function encodePriceSqrt(reserve1:number, reserve0:number):BigNumber {
  return BigNumber.from(
    new bn(reserve1.toString())
      .div(reserve0.toString())
      .sqrt()
      .multipliedBy(new bn(2).pow(96))
      .integerValue(3)
      .toString()
  )
}

//GET PRICE QUOTE DIRECTLY BASED ON TOKENS IN EXISTING POOL
export async function fetchQuote(poolContract:Contract, amountIn:BigNumber):Promise<BigNumber|null> {
	if(!poolContract || !amountIn) return null;

	const network = await getNetwork();
	if(!network) return null;

	//Connect to hard-coded Quoter Address
	const QuoterAddress:string = await getContractAddressByNetwork(singleSwapQuoter, network.name);
	const quoterContract = await connectContractApp(QuoterAddress, QuoterABI);
	if(!quoterContract) return null;

	//GET POOL INFO FOR QUOTE
	const immutables = await getPoolImmutables(poolContract);
	if(!immutables) return null;

	//GET QUOTE
	return await quoterContract.callStatic.quoteExactInputSingle(
		immutables.token0,
		immutables.token1,
		immutables.fee,//fee //must fee be exact?
		amountIn.toString(), 
		0
	)
}

export const swapUpdatePrice = async(
	tokenXContract:Contract, 
	tokenYContract:Contract, 
	inputAmount:number,
	slippageAmount:number,
	walletAddress:string,
	deadline:number,
) => {
	const provider = await AppProvider();
	if(!provider) return null;
	const network = await provider.getNetwork();

	const router = await new AlphaRouter({ chainId: network.chainId, provider: provider})
	const TokenX = new Token(network.chainId, tokenXContract.Address(), tokenXContract.decimals(), tokenXContract.symbol(), tokenXContract.name())
	const TokenY = new Token(network.chainId, tokenYContract.Address(), tokenYContract.decimals(), tokenYContract.symbol(), tokenYContract.name())

	const amountIn:BigNumber|null = await formatNumberToBig(tokenXContract, inputAmount)
	if(!amountIn) return null;
	const currencyAmount = CurrencyAmount.fromRawAmount(TokenX, amountIn.toString());
	
	const route = await router.route(
		currencyAmount,
		TokenY,
		TradeType.EXACT_INPUT,  
		{
		    recipient: walletAddress,
		    slippageTolerance: new Percent(slippageAmount, 100),
		    deadline: Math.floor(Date.now()/1000 + 1800),
		    type: SwapType.SWAP_ROUTER_02,
		 },
	)

	if(!route || !route.methodParameters) return null;
	const transaction = {
		data: route.methodParameters.calldata,
		to: singleSwapToken,
		value: BigNumber.from(route.methodParameters.value),
		from: walletAddress,
		gasPrice: BigNumber.from(route.gasPriceWei),
		gasLimit: ethers.utils.hexlify(1000000)
	}

	const quoteAmountOut = route.quote.toFixed(6);
	console.log("quoteAmountOut",quoteAmountOut);
	const ratio = (inputAmount/Number(quoteAmountOut)).toFixed(3);

	return 
}