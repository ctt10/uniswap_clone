import React, {useState, useEffect, useContext} from "react";
import { WalletContext } from "@/Context/WalletContext";
import { PoolContext } from "@/Context/PoolContext";

import Image from "next/image";
import Style from "./CreatePool.module.scss";
import images from "@/Assets";
import { SwapSettings, SearchToken, TokenPopup } from "@/Components";
import {defaultToken, IToken}  from "@/Models";

const CreatePool:React.FunctionComponent = () => {
  	
  	const {account, tokenData} = useContext(WalletContext);
  	const {
  		tokenOne, setTokenOne, tokenTwo, setTokenTwo, setFee,
  		tokenOneAmount, setTokenOneAmount, tokenTwoAmount, setTokenTwoAmount,
  		slippage, setSlippage, deadline, setDeadline
  } = useContext(PoolContext);

	//OPEN OPTIONS
	const [openModal, setOpenModal] = useState<boolean>(false);
 	const [openFee, setOpenFee] = useState<boolean>(false);
	
	const [openToken, setOpenToken] = useState<boolean>(false);
	const [openTokenTwo, setOpenTokenTwo] = useState<boolean>(false);

	const [active, setActive] = useState<number>(1) 	
 	const [minPrice, setMinPrice] = useState<number>(0)
 	const [maxPrice, setMaxPrice] = useState<number>(0)
 
 	const feePairs = [{
 		fee: 500,
 		feeText: "0.05%",
 		info: "Best for stable pairs",
 		number: "0% Select",
 	},{
 		fee: 3000,
 		feeText: "0.3%",
 		info: "Best for stable pairs",
 		number: "0% Select",
 	},{
 		fee: 10000,
 		feeText: "1%",
 		info: "Best for stable pairs",
 		number: "0% Select",
 	}] 

 	const minPriceRange = (text:string):void => {
 		if(text === "+") setMinPrice(minPrice+1);
 		if(text === "-") setMinPrice(minPrice-1);
 	}
 	const maxPriceRange = (text:string):void => {
 		if(text === "+") setMaxPrice(maxPrice+1);
 		if(text === "-") setMaxPrice(maxPrice-1);	
 	} 

	return (
		<div className={Style.CreatePool}>
			<div className={Style.box}>
			
				{/* SELECT PRICE RANGE */}
				<div className={Style.price}>
					{/* LEFT */}
					<div className={Style.left}>
						<h4>Select Pair</h4>
						
						{/*TOKEN INFO*/}
						<div className={Style.token}>
							
							{/*TOKEN INFO*/}
							<div 
								className={!account 
									? Style.info_disabled 
									: Style.info_active
								}
								onClick={() => (
									account && ( setOpenToken(true) ) 
								)}
							> 
								<p>
									{!!tokenOne.img ? (
										<Image 
											src={tokenOne.img}
											alt="token"
											width={20}
											height={20}
										/>
									):(
										"Select Token"
									)}
									{tokenOne.name}
								</p>
							</div>
							{/*TOKEN INFO*/}
							<div 
								className={!account 
									? Style.info_disabled 
									: Style.info_active
								}
								onClick={() => (
									account && ( setOpenTokenTwo(true) ) 
								)}
							>
								<p>
									{!!tokenTwo.img ? (
										<Image 
											src={tokenTwo.img}
											alt="token"
											width={20}
											height={20}
										/>
									):(
										"Select Token"
									)}
									{tokenTwo.name}
								</p>
							</div>
						</div>

						{/* FEE SELECT SECTION */}
						<div className={Style.fee}>
							<h4>Fee tier</h4>
							
							<div className={Style.list}>
								{feePairs.map((el,i) => (
									<div 
										className={Style.item}
										key={i+1}
										onClick={() => (
											setActive(i+1),
											setFee(el.fee)
										)}
									>
										<div className={Style.info}>
											<p>{el.feeText}</p>
											<p> 
												{active === i+1 && (
													<Image 
														src={images.FilledCheck}
														alt="image"
														width={20}
														height={20}
													/>
												)}
											</p>
										</div>
										<small>{el.info}</small>
										<p className={Style.para}>
											{el.number}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* DEPOSIT AMOUNT */}
						<div className={Style.deposit}>
							<h4>Deposit Amount</h4>

							{/* DEPOSIT TOKEN INFO */}
							<div className={Style.box}>
								<input 
									type="text" 
									placeholder="0"
									defaultValue={tokenOneAmount}
									pattern={"[0-9]*"}
									required
									onChange={(e)=> ( setTokenOneAmount(Number(e.target.value)) )}
								/>
								{ !!tokenOne.name ? (
									<div className={Style.input}>
										<p>
											<small>
												{tokenOne.symbol}
											</small> 
											{tokenOne.name}
										</p>
										<p className={Style.balance}>
											Balance: {tokenOne.balance}
										</p>
									</div>
								): (
									<div className={Style.input}>
										<p>
											<small>
												Select
											</small>
										</p>
										<p className={Style.balance}>
											Balance: 0
										</p>
									</div>
								) }
							</div>

							{/* DEPOSIT TOKEN INFO */}
							<div className={Style.box}>
								<input
									type="text" 
									placeholder="0"
									defaultValue={tokenTwoAmount}
									pattern={"[0-9]*"}
									required
									onChange={(e)=> ( setTokenTwoAmount(Number(e.target.value)) )}
								/>
								{ !!tokenTwo.name ? (
									<div className={Style.input}>
										<p>
											<small>
												{tokenTwo.symbol}
											</small> 
											{tokenTwo.name}
										</p>
										<p className={Style.balance}>
											Balance: {tokenTwo.balance}
										</p>
									</div>
								): (
									<div className={Style.input}>
										<p>
											<small>
												Select
											</small>
										</p>
									<p className={Style.balance}>
										Balance: 0
									</p>										
									</div>
								) }
							</div>
						</div>
					</div>


					{/* RIGHT */}
					<div className={Style.right}>
						<h4>Set Price Range</h4>
						<div className={Style.box}>
							<p className={Style.para}>
								Current Price: 41.1494 TOKEN per ETH
							</p>
							<Image 
							 	src={images.Wallet}
							 	alt="wallet"
							 	height={80}
							 	width={80}
							/>
							<h3>Your position will appear here.</h3>
						</div>

						{/* PRICE RANGE */}
						<div className={Style.range}>
							{/* Min Price */}
							<div className={Style.box}>
								<p>Min Price</p>
								<p
									className={Style.para}
									onClick={(e)=> minPriceRange(e.target.innerText)}
								>
									<small>-</small> {minPrice} <small>+</small>
								</p>
								<p>Token per {tokenOne.name || "Eth"}</p>
							</div>

							{/* MAX PRICE */}
							<div className={Style.box}> 
								<p>Max Price</p>
								<p
									className={Style.para}
									onClick={(e)=> maxPriceRange(e.target.innerText)}
								>
									<small>-</small> {maxPrice} <small>+</small>
								</p>
								<p>Token per {tokenTwo.name || "Eth"}</p>
							</div>
						</div>
					
						{/* PRICE RANGE BUTTONS*/}
						<div className={Style.button}>
							<button>Full Range</button>
						</div>
						<div className={Style.amount}>
							<button>Enter amount</button>
						</div>
					</div>
				</div>
			</div>

			{/* TOKEN POPUPS */}
			{openModal && (
				<div className={Style.token}>
					<SwapSettings 
						setOpenSetting={setOpenModal}
						slippage={slippage}
						setSlippage={setSlippage}
						deadline={deadline}
						setDeadline={setDeadline}
					/>
				</div>
			)}

			<TokenPopup 
				context="PoolContext"
				openToken={openToken}
				setOpenToken={setOpenToken}
				openTokenTwo={openTokenTwo}
				setOpenTokenTwo={setOpenTokenTwo}
			/>

		</div>
	);
};

export default CreatePool;