import React, { useState } from "react";
import Image from "next/image"

import Style from "./SearchToken.module.scss";
import images from "@/Assets";

const SearchToken = ({ setOpenToken, setToken, tokenData }) => {
	const [active, setActive] = useState(1);
	return(
		<div className={Style.SearchToken}>
			<div className={Style.box}>
				<div className={Style.heading}>
					<h4>Select a token</h4>	
					<Image 
						src={images.Cross} 
						alt="close"
						width={25}
						height={25}
						onClick={()=> setOpenToken(false)}
					/>
				</div>
				<div className={Style.search}>
					<div className={Style.img}>
						<Image
							src={images.Search}
							alt="image"
							width={20}
							height={20}
						/>
					</div>
					<input type="text" placeholder="Search name and paste address"/>
				</div>

				{/* token Container */}
				<div className={Style.tokens}>
					{/* individual token */}
					{tokenData.map((el, i)=> el.name!=="" && (
						<span 
							key={i+1} 
							className={active === i+1 ? `${Style.active}`: ""}
							onClick={()=> (
								setActive(i+1), 
								setToken({ 
									name: el.name, 
									symbol: el.symbol,
									type: el.type,
									img: el.img,
									Network:[{
									  name: el.Network[0].name,
									  Abi: el.Network[0].Abi, 
									  Address: el.Network[0].Address
									}],
									balance: el.balance,
								}),
								setOpenToken(false)
							)}
						> 
							<Image
								src={el.img || images.Eth}
								alt="image"
								width={25}
								height={25}
							/>
							{el.symbol}
						</span>
						))}
				</div>
			</div>
		</div>
	);
}

export default SearchToken;
