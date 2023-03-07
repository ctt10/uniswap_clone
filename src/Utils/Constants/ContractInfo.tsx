import ERC20 from "../../contracts/Abi/Token.json";
import IWETH from "../../contracts/Abi/IWETH.json";
import SingleSwapToken from "../../contracts/Abi/SingleSwapToken.json";
import SwapMultiHop from "../../contracts/Abi/SwapMultiHop.json";
import Liquidity from "../../contracts/Abi/Liquidity.json";
import UserStorageData from "../../contracts/Abi/UserStorageData.json"

//UNISWAP CONTRACT ABI
import IUniswapv3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import Uniswapv3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import NFTDescriptor from "@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json";
import NonFungibleTokenPositionDescriptor from "@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json";
import NonFungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
//@types
import { Contract_Network_Info } from "../../Models/Contract/contract";

//Goerli ERC20
export const ERC20ABI = ERC20.abi;
export const TrashAddress:string = "0xbE304974f2A056E3A6B400c5480DdEaCC9bA76dc";
export const DabloonAddress:string = "0xc2bC9443Ef73f8d7ba3FF5acb7189aB3CD4286AB";
export const EthAddress:string = "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D";
export const WBtcAddress:string = "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05";
export const UniAddress:string = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
export const ChainLinkAddress:string = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
export const MaticAddress:string = "0xA108830A23A9a054FfF4470a8e6292da0886A4D4";
export const USDCAddress:string = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

//Goerli IWETH
export const IWETHABI = IWETH.abi;
export const IWETHBYTES = IWETH.bytecode;
export const IWETHAddress:string = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; //Goerli
export const DaiAddress:string = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"; //Goerli

export const customWeth:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x1875370731C3BEc2DCe3d14277B81669A9050AB8"
}]

//Goerli SingleSwapToken
export const SingleSwapTokenABI = SingleSwapToken.abi;
export const singleSwapToken:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0xACA8D690c9081262d99BEa8c75453948F1D53202"
}];

//Goerli Quoter 
export const QuoterABI = Quoter.abi;
export const singleSwapQuoter:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
}];

//Goerily Liquidity 
export const LiquidityAbi = Liquidity.abi;
export const liquidity:Contract_Network_Info[] =[{
	Name: "goerli",
	ChainId: "5",
	Address: ""
}]

//Goerli Uniswap Pool
// export const IUniswapv3PoolAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
export const IUniswapv3PoolABI = IUniswapv3Pool.abi;
export const IUniswapv3PoolBytes = IUniswapv3Pool.bytecode;
export const UniswapPool:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8" //many pools may exist
}];

//Goerli SWAPMULTIHOP
export const SwapMultiHopABI = SwapMultiHop.abi;
export const QuoterBytes = Quoter.bytecode;
export const swapMultiHop:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x1Aac5De2AB1d5763594e585F1377A27290954F68"
}];

//https://github.com/Uniswap/v3-core/blob/v1.0.0/contracts/UniswapV3Factory.sol
export const Uniswapv3FactoryAbi = Uniswapv3Factory.abi;
export const Uniswapv3FactoryBytes = Uniswapv3Factory.bytecode;
export const uniswapv3Factory:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x20B4dCB801E15Fa01FCC80E752dD4DD322ED3661"
}];

//https://github.com/Uniswap/v3-periphery/blob/main/contracts/SwapRouter.sol
export const SwapRouterAbi = SwapRouter.abi;
export const SwapRouterBytes = SwapRouter.bytecode;
export const swapRouter:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x416aD695204bB066200c79c4B54Df8766a0FbE55"
}];

//https://github.com/Uniswap/v3-periphery/blob/v1.0.0/contracts/libraries/NFTDescriptor.sol
export const NFTDescriptorAbi = NFTDescriptor.abi;
export const NFTDescriptorBytes = NFTDescriptor.bytecode;
export const NFTdescriptor:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: "0x773FF27405f8e94EDe1b21e1271df55D2BBA477d"
}];

//https://github.com/Uniswap/v3-periphery/blob/v1.0.0/contracts/NonfungibleTokenPositionDescriptor.sol
export const PositionDescriptorAbi = NonFungibleTokenPositionDescriptor.abi;
export const PositionDescriptorBytes = NonFungibleTokenPositionDescriptor.bytecode;
export const PositionDescriptor:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: ""
}];
//https://github.com/Uniswap/v3-periphery/blob/main/contracts/NonfungiblePositionManager.sol
export const PositionManagerAbi = NonFungiblePositionManager.abi;
export const PositionManagerBytes = NonFungiblePositionManager.bytecode;
export const PositionManager:Contract_Network_Info[] = [{
	Name: "goerli",
	ChainId: "5",
	Address: ""
}];

export const UserStorageDataAbi = UserStorageData.abi;
export const UserStorageDataBytes = UserStorageData.bytecode;
export const userStorageData:Contract_Network_Info[]=[{
	Name: "goerli",
	ChainId: "5",
	Address: ""
}]