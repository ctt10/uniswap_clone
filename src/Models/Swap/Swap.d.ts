import {Token, CurrencyAmount, TradeType, Percent} from "@uniswap/sdk-core";
import {BigNumber} from "ethers";
import {IToken} from "../Token/Token";
import React from "react";

export declare interface ISwapContext {
  tokenOne: IToken,
  setTokenOne: React.Dispatch<React.SetStateAction<IToken>>,
  tokenTwo: IToken,
  setTokenTwo:React.Dispatch<React.SetStateAction<IToken>>,
  slippageTolerance:Percent,
  setSlippageTolerance:React.Dispatch<React.SetStateAction<Percent>>,
  deadline:number,
  setDeadline:React.Dispatch<React.SetStateAction<number>>,
  swapAmount:number,
  setSwapAmount:React.Dispatch<React.SetStateAction<number>>,
  expectedOutput:string,
  setExpectedOutput:React.Dispatch<React.SetStateAction<string>>,
  getQuote: Function,
  getPoolPrice: Function,
  singleSwap: Function,
}

export type SwapRoute = {
  quote: CurrencyAmount
  quoteGasAdjusted: CurrencyAmount
  estimatedGasUsed: BigNumber
  estimatedGasUsedQuoteToken: CurrencyAmount
  estimatedGasUsedUSD: CurrencyAmount
  gasPriceWei: BigNumber
  trade: Trade<Currency, Currency, TradeType>
  route: RouteWithValidQuote[]
  blockNumber: BigNumber
  methodParameters?: MethodParameters
}