import { ethers, Contract, Network } from "ethers";
import { Token, BigintIsh } from '@uniswap/sdk-core';
import { Pool, Position, nearestUsableTick } from '@uniswap/v3-sdk'
import { getAbi, getContractAddressByNetwork, connectContractUser, connectContractApp} from "../Contracts/ContractUtils";
import { getNetwork, AppProvider, defaultProvider } from "../Wallet/WalletUtils";
import { makeUniPool, getPoolImmutables, getPoolState, getPoolTokens } from "../Pools/PoolUtils";
import {
  IUniswapv3PoolABI,
  PositionDescriptorAbi,
  PositionDescriptorBytes,
  PositionDescriptor,
  PositionManagerAbi,
  PositionManagerBytes,
  PositionManager,
  UserStorageDataAbi,
  UserStorageDataBytes,
  userStorageData,
} from "../Constants/ContractInfo";
import { tokenList } from "../Constants/AvailableTokens";
//@types
import {IToken, State, Immutables, ILiquidity} from "../../Models/index";

/**
 * @prarams POOL_POSITION {string} | address
 * //TODO: DOES THIS ALREADY MAKE SURE THE AMOUNTS OF EACH TOKEN IN THE POSITION IS CORRECT??
 */
async function addLiquidity(poolAddress:string, positionSize:number) {   

  //Get User's Network FOR CONTRACT CONNECTION
  const network = await getNetwork();
  if(!network) return null; 

  //INSTANTIATE POOL && MANAGER
  const PositionManagerAddress:string = await getContractAddressByNetwork(PositionManager, network.name);
  const PositionManagerContract:Contract|null = await connectContractApp(PositionManagerAddress, PositionManagerAbi);
  const poolContract:Contract|null = await connectContractApp(poolAddress, IUniswapv3PoolABI);
  if(!poolContract||!PositionManagerContract) return null;
  
  //GET TOKENS FROM POOL
  const [token0, token1]:[string,string] = await Promise.all([poolContract.token0(), poolContract.token1()]) ;
  const poolTokens = await getPoolTokens(token0, token1);
  if(!poolTokens) return null;

  //GET POOL DATA
  const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)])
  if(!immutables || !state) return null; 
  //MAKE POOL INSTANCE
  const POOL = await makeUniPool(immutables, state, poolTokens);
  //CONSTRUCT POSITION
  const [tickLower, tickUpper, LIQUIDITY, position] = makePosition(immutables, state, positionSize, POOL); 

  //INSTANTIATE USER PROVIDERS | GET SIGNERS && ADDRESSES
  const provider = defaultProvider(); //APP OWNS FACTORY && POOLS
  if(!provider) return null;
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress(); 
  
  //MAKE PARAMS FOR POSITION CONTRACT CALL
  const { amount0: amount0Desired, amount1: amount1Desired} = position.mintAmounts
  const params = {
    token0: immutables.token0,
    token1: immutables.token1,
    fee: immutables.fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: userAddress,
    deadline: Math.floor(Date.now() / 1000) + (60 * 1)
  }

  //TODO: DYNAMIC APPROVE AMOUNT
  //HAVE TO DETERMINE THE RATIO OF EACH COINconnectContractUser BASED ON THE AMOUNT OF TOKEN1's "positionSize" 
  const {tokenXContract, tokenYContract}= poolTokens;
  const tx1 = await tokenXContract.connect(signer).approve(PositionManagerAddress, ethers.utils.parseEther(amount0Desired.toString()));
  await tx1.wait()
  const tx2 = await tokenYContract.connect(signer).approve(PositionManagerAddress, ethers.utils.parseEther(amount1Desired.toString()));  
  await tx2.wait()
  const tx3 = await PositionManagerContract.connect(signer).mint(params, { gasLimit: '1000000' })
  await tx3.wait()

  console.log('done')
}

export async function getUserLiquidity(
  userNetwork:Network, 
  liquidityData:unknown,
): Promise<void|null> {
  const network = await getNetwork();
  if(!network) return null;

  // const userStorageContract = await connectContractUser(userStorageData[0].Address, UserStorageDataAbi);
  // if(!userStorageContract) return null;

  // const userLiquidity = await userStorageContract.getAllTransactions()
  // userLiquidity.map(async(el:unknown, i:number) => {
  //   liquidityData = await checkLiquidity(
  //     el.poolAddress
  //   );
  // });
  
  // console.log('userLiquidity', userLiquidity)
  return;
}

export async function checkLiquidity(poolAddress:string) {
  
  const network = await getNetwork();
  if(!network) return null;

  const poolContract = await connectContractUser(poolAddress, IUniswapv3PoolABI);
  if(!poolContract) return null;
  const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)])
  if(!immutables || !state) return null;
  
  //getPoolData
  const poolTokens = await getPoolTokens(immutables.token0, immutables.token1);
  if(!poolTokens) return null;
  
  const { //Destructure poolTokens
    tokenXDecimals, tokenXSymbol, tokenXName, 
    tokenYDecimals, tokenYSymbol, tokenYName, 
    TOKENX, TOKENY
  } = poolTokens;
  
  //MAKE POOL INSTANCE
  const {fee} = immutables;
  const {sqrtPriceX96, liquidity, tick} = state;
  const POOL = new Pool(TOKENX, TOKENY, fee, sqrtPriceX96.toString(), liquidity.toString(), tick);
  // console.log('poolData', POOL);

  return {
    factory:immutables.factory,
    token0:immutables.token0,
    token1:immutables.token1,
    fee:immutables.fee,
    tickSpacing:immutables.tickSpacing,
    maxLiquidityPerTick:immutables.maxLiquidityPerTick,
    liquidity: state.liquidity,
    sqrtPriceX96: state.sqrtPriceX96,
    tick: state.tick,
    observationIndex: state.observationIndex,
    observationCardinality: state.observationCardinality,
    observationCardinalityNext: state.observationCardinalityNext,
    feeProtocol: state.feeProtocol,
    unlocked: state.unlocked,
    POOL
  }
}

function makePosition(immutables:Immutables, slot:State, positionSize:number, pool:Pool):[number, number, BigintIsh, Position] {
    const tickLower = nearestUsableTick(slot.tick, immutables.tickSpacing) - immutables.tickSpacing * 2 //what if 100?
    const tickUpper = nearestUsableTick(slot.tick, immutables.tickSpacing) + immutables.tickSpacing * 2 //what if 100?
    const liquidityAmount = positionSize.toString();
    const LIQUIDITY:BigintIsh = ethers.utils.parseEther(liquidityAmount).toString();
    const position = new Position({pool, liquidity:LIQUIDITY, tickLower, tickUpper})

    return [
       tickLower,
       tickUpper,
       LIQUIDITY,
       position
    ]
}