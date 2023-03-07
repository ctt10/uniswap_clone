import {ISwapContext} from "./Swap";
import {defaultToken} from "../Token/defaultToken";
import {Percent} from "@uniswap/sdk-core";

export const defaultSwapContext:ISwapContext = {
	tokenOne: defaultToken,
  	setTokenOne: () => {},
  	tokenTwo: defaultToken,
  	setTokenTwo:() => {},
  	slippageTolerance: new Percent(0, 100),
  	setSlippageTolerance:() => {},
  	deadline:0,
  	setDeadline:() => {},
  	swapAmount:0,
	setSwapAmount:() => {},
	expectedOutput:"",
	setExpectedOutput:() => {},
  	getQuote: async() => {},
  	getPoolPrice: async() => {},
  	singleSwap: async() => {},
}