import {ethers, BigNumber, Contract, ContractInterface} from "ethers";
import Contract_Network_Info from "../Contract/contract";
import {IToken} from "../Token/Token";
import {Token} from "uniswap/sdk-core";

export declare interface IPoolContext {
  tokenOne:IToken,
  setTokenOne: React.Dispatch<React.SetStateAction<IToken>>,
  tokenOneAmount: number,
  setTokenOneAmount: React.Dispatch<React.SetStateAction<number>>,
  tokenTwo:IToken,
  setTokenTwo: React.Dispatch<React.SetStateAction<IToken>>,
  tokenTwoAmount: number,
  setTokenTwoAmount: React.Dispatch<React.SetStateAction<number>>,
  activePool:IPool,
  setActivePool: React.Dispatch<React.SetStateAction<IPool>>,
  slippage: number,
  setSlippage: React.Dispatch<React.SetStateAction<number>>,
  deadline: number,
  setDeadline: React.Dispatch<React.SetStateAction<number>>,
  fee: number,
  setFee: React.Dispatch<React.SetStateAction<number>>
}

export declare interface IPool {
  Id: string,
  Address: string,
  tokenX: IToken,
  tokenOneAmount: number,
  tokenY: IToken,
  tokenTwoAmount: number,
  Network: [Contract_Network_Info]
  slippage: number,
  deadline: number,
  fee: number,
}

export declare interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: BigNumber
}

export declare interface State {
  liquidity: BigNumber
  sqrtPriceX96: BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

export declare interface PoolTokens {
  tokenXAddress: string,
  tokenXAbi: ContractInterface,
  tokenXContract: Contract,
  tokenXDecimals:number, 
  tokenXSymbol:string, 
  tokenXName:string,
  tokenYAddress: string,
  tokenYAbi: ContractInterface,
  tokenYContract: Contract,
  tokenYDecimals:number, 
  tokenYSymbol:string,
  tokenYName:string,
  TOKENX: Token,
  TOKENY: Token,
}

