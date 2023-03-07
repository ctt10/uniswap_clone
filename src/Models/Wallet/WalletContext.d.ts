import {providers} from "ethers";
import {IToken, ILiquidity} from "../Token/Token";

export declare interface IWalletContext {
  	account:string|null,
	userNetwork:providers.Network|null,
	tokenData:IToken[],
	connectWallet:Function,
	liquidityData: ILiquidity[]|null,
}