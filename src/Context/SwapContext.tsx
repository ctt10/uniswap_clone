import React, { useState, useEffect, createContext } from "react";
import {ethers} from "ethers";
import {Token, CurrencyAmount, TradeType, Percent} from "@uniswap/sdk-core"; 
import {
	createContractInstance
} from "../Utils/Contracts/ContractUtils";
import {
	getPoolPrice,
	getPoolImmutables,
	getPoolState,
} from "../Utils/Pools/PoolUtils";
import {
	swapUpdatePrice,
} from "../Utils/Price/PriceUtils";

//@Types
import { 
	defaultToken, IToken,
	defaultSwapContext, ISwapContext
}  from "../Models/index";
import {
	singleSwap
} from "../Utils/Swap/SwapUtils";

/**
 * This goal of object serves as a global state manager 
 *     for a singed in user
 */
export const SwapContext = createContext<ISwapContext>(defaultSwapContext);

export const SwapContextProvider = ({ children }) => {
	if(!children) return null;

	//TOKEN 1
	const [tokenOne, setTokenOne] = useState<IToken>(defaultSwapContext.tokenOne);
	//TOKEN 2
	const [tokenTwo, setTokenTwo] = useState<IToken>(defaultSwapContext.tokenTwo);
	//TRADE OPTIONS
	const [slippageTolerance, setSlippageTolerance]= useState<Percent>(defaultSwapContext.slippageTolerance);
	const [deadline, setDeadline]= useState<number>(defaultSwapContext.deadline);
	const [swapAmount, setSwapAmount] = useState<number>(defaultSwapContext.swapAmount);
	const [expectedOutput, setExpectedOutput] = useState<string>(defaultSwapContext.expectedOutput);


	const getQuote = async():Promise<void> => {
		//TODO: useQuery;

		return;


		//TODO: USE SELECTED TOKENS TO QUERY POOLS??
		//TODO: USE POOL TO SET SELECTED TOKENS??



		// const quote = await getPoolPrice(tokenOne, tokenTwo, Number(swapAmount))
		// if(!quote) return setExpectedOutput("0")
		// setExpectedOutput(quote.toString());
	};

	//STATE
	 // getPoolImmutables().then((result)=> {
	 //   console.log("result",result);
	 // });

	// getPoolState().then((result)=> {
  	//   console.log("result",result);
  	// });
	
	// const singleSwap();

	return(
		<SwapContext.Provider
			value={{
				tokenOne,
				setTokenOne,
				tokenTwo,
				setTokenTwo,
				slippageTolerance,
				setSlippageTolerance,
				deadline,
				setDeadline,
				swapAmount,
				setSwapAmount,
				expectedOutput,
				setExpectedOutput,
				getQuote,
				getPoolPrice,
				singleSwap
			}}
		>
			{children}
		</SwapContext.Provider>
		)

}