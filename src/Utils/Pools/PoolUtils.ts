import { ethers, BigNumber, Contract, ContractInterface } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { encodePriceSqrt, fetchQuote } from "../Price/PriceUtils";
import { formatNumberToBig, formatBigToString } from "../Token/TokenUtils";
import { getNetwork, defaultProvider, AppProvider } from "../Wallet/WalletUtils";
import { getAbi, getContractAddressByNetwork, connectContractUser, connectContractApp } from "../Contracts/ContractUtils";
import { tokenList } from "../Constants/AvailableTokens"
import {
  //ABI
  Uniswapv3FactoryAbi,
  IUniswapv3PoolABI,
  PositionManagerAbi,
  //Contract|Network|Address
  uniswapv3Factory,
  swapRouter,
  NFTdescriptor,
  PositionDescriptor,
  PositionManager,
} from "../Constants/ContractInfo";

//@Types
import { IToken, Immutables, State, PoolTokens, PoolPriceQuote } from "../../Models/index";

// example call
// const usdtUsdc500 = await deployPool(TETHER_ADDRESS, USDC_ADDRESS, 500, encodePriceSqrt(1, 1))
export async function deployPool(tokenX:Token, tokenY:Token, fee:number, tokenXPrice:number, tokenYPrice:number):Promise<string|null> {

  //GET USER PROVIDER, NETWORK, SIGNER
  const provider = defaultProvider();
  const signer = provider ? provider.getSigner():null;
  const network = await getNetwork();
  if(!network || !provider || !signer) return null;

  //CONFIRM SELECTED TOKEN CONTRACTS EXIST | CAN CONNECT
  const PositionManagerAddress:string =await getContractAddressByNetwork(PositionManager, network.name);
  const FactoryAddress:string = await getContractAddressByNetwork(uniswapv3Factory, network.name);
  //MAKE CONTRACT INSTANCE TO ACCESS FUNCTIONS
  const FactoryContract:Contract|null = await connectContractUser(FactoryAddress, Uniswapv3FactoryAbi);
  const PositionManagerContract:Contract|null = await connectContractUser(PositionManagerAddress, PositionManagerAbi);
  if(!PositionManagerContract || !FactoryContract) return null; 

  //NEED A WAY TO DYNAMICALLY GET PRICE
  const price = encodePriceSqrt(tokenXPrice, tokenYPrice)

  //DEPLOY NEW POOL
  await PositionManagerContract.connect(signer).createAndInitializePoolIfNecessary(
    tokenX, tokenY, fee, price, { gasLimit: 5000000 }
  );
  //GET ADDRESS OF NEWLY DEPLOYED POOL
  const poolAddress = await FactoryContract.connect(signer).getPool(
    tokenX, tokenY, fee,
  );

  //TODO: STORE/INDEX POOL ADDRESS FOR UX DISPLAY 
  return poolAddress
}

export async function makeUniPool(immutables:Immutables, state:State, poolTokens:PoolTokens):Promise<Pool> {
  const {fee} = immutables;
  const {sqrtPriceX96, liquidity, tick} = state;
  const {TOKENX, TOKENY} = poolTokens;
  return new Pool(TOKENX, TOKENY, fee, sqrtPriceX96.toString(), liquidity.toString(), tick);
}
  
export async function getUserLiquidity() {

}

export async function getPools() {
  //GET USER PROVIDER, NETWORK, SIGNER
  const provider = defaultProvider();
  const signer = provider ? provider.getSigner():null;
  const network = await getNetwork();
  if(!network || !provider || !signer) return null;

  //CONFIRM SELECTED TOKEN CONTRACTS EXIST | CAN CONNECT
  const PositionManagerAddress:string =await getContractAddressByNetwork(PositionManager, network.name);
  const FactoryAddress:string = await getContractAddressByNetwork(uniswapv3Factory, network.name);
  //MAKE CONTRACT INSTANCE TO ACCESS FUNCTIONS
  const FactoryContract:Contract|null = await connectContractUser(FactoryAddress, Uniswapv3FactoryAbi);
  const PositionManagerContract:Contract|null = await connectContractUser(PositionManagerAddress, PositionManagerAbi);
  if(!PositionManagerContract || !FactoryContract) return null; 

  console.log('FactoryContract', FactoryContract)
  console.log('PositionManagerContract', PositionManagerContract)

  return;
}

////POOLS WILL ONLY BE ABLE TO BE CREATED USING TOKENS THAT ARE APPROVED AND ARE HARD CODED INTO THE APP

/**
 * This approach retrieves price quote by taking a pool Contract Address,
 *   then retrieving a quote using both tokens in pool
 */
export const getPoolPrice = async(poolAddress:string, swapAmount:number):Promise<PoolPriceQuote|null> => {
  
  //GET POOL CONTRACT
  const poolContract:Contract|null = await connectContractApp(poolAddress, IUniswapv3PoolABI)
  if(!poolContract) return null;
  
  //GET POOL TOKENS
  const immutables = await getPoolImmutables(poolContract);
  if(!immutables) return null;

  //GET POOL TOKEN CONTRACT INFO
  const poolTokens = await getPoolTokens(immutables.token0, immutables.token1)
  if(!poolTokens) return null;

  //FORMAT NUMBER TO INPUT TOKEN'S DECIMAL COUNT
  const amountIn = await formatNumberToBig(poolTokens.tokenXContract, swapAmount);

  //GET QUOTE
  const quote = await fetchQuote(poolContract, amountIn);
  console.log('quote', quote)
  if(!quote) return null;

  //FORMAT NUMBER FOR UX
  const quoteAmountOut = await formatBigToString(poolTokens.tokenYContract, quote);
  const priceQuote:PoolPriceQuote = {
    quoteAmountOut,
    tokenXSymbol: poolTokens.tokenXSymbol,
    tokenYSymbol: poolTokens.tokenYSymbol,
  }
  console.log('priceQuote', priceQuote)
  return priceQuote;
}

export async function getPoolImmutables(poolContract:Contract):Promise<Immutables|null> {
    if(!poolContract) return null;
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ])

    const immutables: Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    }
    return immutables
  }

export async function getPoolState(poolContract:Contract):Promise<State|null> {
  if(!poolContract) return null;
  const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])
  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }
  return PoolState
}

/**
 * @returns [address and Abi of both tokens in pool]
 */
export async function getPoolTokens(tokenXAddress:string, tokenYAddress:string): Promise<PoolTokens|null> {
  
  //FETCH ABI FOR DYNAMIC TOKENS
  const tokenXAbi:ContractInterface|null = await getAbi(tokenXAddress)
  const tokenYAbi:ContractInterface|null = await getAbi(tokenYAddress)
  
  if(!tokenXAbi || !tokenYAbi) return null; 
  //CREATE CONTRACT INSTANCES
  const tokenXContract:Contract|null = await connectContractApp(tokenXAddress, tokenXAbi)
  const tokenYContract:Contract|null = await connectContractApp(tokenYAddress, tokenYAbi)
  if(!tokenXContract || !tokenYContract) return null;

  //Extract Token Contract Data
  const [tokenXDecimals, tokenXSymbol, tokenXName]:[number, string, string] = await Promise.all([tokenXContract.decimals(), tokenXContract.symbol(), tokenXContract.name()]);
  const [tokenYDecimals, tokenYSymbol, tokenYName]:[number, string, string] = await Promise.all([tokenYContract.decimals(), tokenYContract.symbol(), tokenYContract.name()]);
  
  //GET USER NETWORK
  const network = await getNetwork();
  if(!network) return null;

  //MAKE UNI TOKENS 
  const TOKENX = new Token(network.chainId, tokenXAddress, tokenXDecimals, tokenXSymbol, tokenXName)
  const TOKENY = new Token(network.chainId, tokenYAddress, tokenYDecimals, tokenYSymbol, tokenYName)

  const poolTokens:PoolTokens = {
      tokenXAddress,
      tokenXAbi,
      tokenXContract,
      tokenXDecimals, 
      tokenXSymbol, 
      tokenXName, 
      tokenYAddress,
      tokenYAbi,
      tokenYContract,
      tokenYDecimals, 
      tokenYSymbol, 
      tokenYName,
      TOKENX,
      TOKENY
  } 

  return poolTokens;
}