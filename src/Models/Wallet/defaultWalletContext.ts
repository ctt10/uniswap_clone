import {IWalletContext} from "./WalletContext";
import {defaultToken} from "../Token/defaultToken";
import {defaultNetwork} from "../Network/defaultNetwork";
import {defaultLiquidity} from "../Liquidity/defaultLiquidity";

/**
 * This servers as a base model
 *  to describe/display a token in app
 */
export const defaultWalletContext:IWalletContext = {
  	account:"",
	userNetwork: defaultNetwork,
	tokenData:[defaultToken],
	connectWallet: async():Promise<void>=>{},
	liquidityData: [defaultLiquidity],
}