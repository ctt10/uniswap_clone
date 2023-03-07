import React, {useState, useContext, Context} from "react"
import {SearchToken} from "@/Components";
import Style from "./TokenPopup.module.scss"
import Popup from "reactjs-popup";
import {WalletContext} from "@/Context/WalletContext";
import {PoolContext} from "@/Context/PoolContext";
import {SwapContext} from "@/Context/SwapContext";

//@types
import {
	IWalletContext,
	IPoolContext, 
	ISwapContext, defaultSwapContext,
	IToken, defaultToken
} from "../../Models/index";

declare interface ComponentProps {
	context: string,
	openToken: boolean,
	setOpenToken: React.Dispatch<React.SetStateAction<boolean>>,
	openTokenTwo:boolean,
	setOpenTokenTwo: React.Dispatch<React.SetStateAction<boolean>>,
};

const TokenSelectPopup = ( props:ComponentProps ) => {
	if(!props) return null;
	const {
		context,
		openToken,
		setOpenToken,
		openTokenTwo,
		setOpenTokenTwo,
	} = props;

	const {tokenData} = useContext<IWalletContext>(WalletContext);
	const {tokenOne, setTokenOne, tokenTwo, setTokenTwo} = context === "SwapContext" 
		? useContext<ISwapContext>(SwapContext)
		: useContext<IPoolContext>(PoolContext);

	return (
		<div className={Style.TokenSelectPopup}>
			{/* TOKEN ONE && TOKEN TWO SELECT POPUPS */}
			{openToken ? (
				<Popup
		            open={openToken}
		            className={Style.Token_Select_Popup}
		            closeOnEscape={true}
		            onClose={() => setOpenToken(false)}
		          >
					<SearchToken
						setOpenToken={setOpenToken}
						setToken={setTokenOne}
						tokenData={tokenData}
					/>
				</Popup>
			): openTokenTwo ? (
				<Popup
		            open={openTokenTwo}
		            className={Style.Token_Select_Popup}
		            closeOnEscape={true}
		            onClose={() => setOpenTokenTwo(false)}
		          >
					<SearchToken
						setOpenToken={setOpenTokenTwo}
						setToken={setTokenTwo}
						tokenData={tokenData}
					/>
				</Popup>
			):null }
		</div>
	)
}
export default TokenSelectPopup;
