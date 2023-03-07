import React, {useState, useEffect} from "react"
import Image from "next/image";

import Style from "./WalletModal.module.scss";
import images from "@/Assets";

const WalletModal = ({ setOpenModal, connectWallet }) => {

	const walletMenu = [
		"Metamask", 
		"Coinbase", 
		"Wallet", 
		"Wallet Connect"
	];

	const [walletName, setWalletName] = useState("")

	return (
		<div className={Style.WalletModal}>
			<div className={Style.box}>
				
				<div className={Style.heading}>
					<p>Connect a wallet</p>
					<div className={Style.img}>
						<Image src={images.Cross}
							alt="Close"
							width={25}
							height={25}
							onClick={()=> setOpenModal(false)}
						/>
					</div>
				</div>

				{/* Wallet Menu Options */}
				<div className={Style.wallet}>
					{walletMenu.map((el,i)=> (
						<p 
							key={i+1} 
							onClick={()=> connectWallet()}
						>
							{el}
						</p>
					))}
				</div>
			
				{/* Consent message */}
				<p className={Style.para} >
					By connecting a wallet, you agree to Uniswap Labs'
					Terms of service and consent to its Privacy Policy. 				
				</p>
			
			</div>
		</div>
	)
}

export default WalletModal;