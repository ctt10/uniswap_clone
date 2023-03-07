import {
	//ERC20 goerli
	TrashAddress,
	DabloonAddress,
	EthAddress,
	WBtcAddress,
	UniAddress,
	ChainLinkAddress,
	MaticAddress,
	USDCAddress,
	//IWETH goerli
	IWETHAddress,
	DaiAddress,
	//ABI
	IWETHABI,
	ERC20ABI,
} from "./ContractInfo";
import { IToken } from "../../Models/Token/Token";
import images from "../../Assets/index";

export const tokenList:IToken[] = [{
	name: "Trash",
	symbol: "RAC",
	type: "ERC20",
	img: images.RaccoonLogo,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: TrashAddress
  	}],
  	balance:0
},{
	name: "Dubloon",
	symbol: "DUB",
	type: "ERC20",
	img: images.Eth,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: DabloonAddress
  	}],
  	balance:0
},{
	name: "Ethereum",
	symbol: "ETH",
	type: "ETH",
	img: images.Eth,
	Network:[{
	    Name: "goerli",
	    Abi: IWETHABI,
	    Address: EthAddress
  	}],
  	balance:0
},{
	name: "Wrapped Bitcoin",
	symbol: "WBTC",
	type: "ERC20",
	img: images.Bitcoin,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: WBtcAddress
  	}],
  	balance:0
},{
	name: "Uniswap",
	symbol: "UNI",
	type: "ERC20",
	img: images.Uniswap,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: UniAddress
  	}],
  	balance:0
},{
	name: "USDC",
	symbol: "USDC",
	type: "ERC20",
	img: images.USDC,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: USDCAddress
  	}],
  	balance:0
},{
	name: "IWETH",
	symbol: "IWETH",
	type: "IWETH",
	img: images.Eth,
	Network:[{
	    Name: "goerli",
	    Abi: IWETHABI,
	    Address: IWETHAddress
  	}],
  	balance:0
},{
	name: "Dai",
	symbol: "Dai",
	type: "ERC20",
	img: images.Dai,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: DaiAddress
  	}],
  	balance:0
},{
	name: "ChainLink",
	symbol: "LINK",
	type: "ERC20",
	img: images.ChainLink,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: ChainLinkAddress
  	}],
  	balance:0
},{
	name: "Matic",
	symbol: "MATIC",
	type: "ERC20",
	img: images.Matic,
	Network:[{
	    Name: "goerli",
	    Abi: ERC20ABI,
	    Address: MaticAddress
  	}],
  	balance:0
}]