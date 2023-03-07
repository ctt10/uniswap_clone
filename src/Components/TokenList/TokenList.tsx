import React from "react"
import Image from "next/image";

import Style from "./TokenList.module.scss";
import images from "@/Assets";
import {IToken} from "@/Models";

/**
 * Navbar component displaying list of all tokens where user has some balance > 0
 * 	!!Displays supported tokens Only!! 
 */
const TokenList = ({ tokenData, setOpenTokenBox }) => {

	return (
		<div className={Style.TokenList}>
			<p 
				className={Style.close}
				onClick={()=> setOpenTokenBox(false)}
			>
				<Image src={images.Cross} alt="close" width={25} height={25}/>
			</p>
			<div className={Style.title}> 
				<h2>Your Token List</h2>
			</div>
			{tokenData.map((el:IToken,i:number)=> el.balance !== 0 && (
				<div 
					key={i+1}
					className={Style.box}
				>
					<div className={Style.info}>
						<p className={Style.symbol}>
							{el.symbol}
						</p>
						<p>
							<span>{el.balance}</span>
							{el.name}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default TokenList;