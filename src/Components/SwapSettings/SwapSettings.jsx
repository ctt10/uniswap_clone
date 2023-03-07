import React, {useState, useEffect} from "react"
import Image from "next/image";

import Style from "./SwapSettings.module.scss";
import images from "@/Assets";
import { Toggle } from "@/Components";

const SwapSettings = (props ) => {
	if(!props)return null;
	const {
		setOpenSetting,
		slippage,
		setSlippage,
		deadline,
		setDeadline,
	} = props;

	return (
		<div className={Style.SwapSettings}>
			<div className={Style.box}>
				
				{/* Close */}
				<div className={Style.heading}>
					<h4>Setting</h4>
					<Image 
						src={images.Cross} 
						alt="close" 
						width={25} 
						height={25} 
						onClick={() => setOpenSetting(false)}
					/>
				</div>
				
				{/* Slippage settings */}
				<p className={Style.para}>
					Slippage tolerance
					<Image 
					src={images.Lock}
					alt="image" 
					width={20} 
					height={20}
					/>
				</p>

				{/* */}
				<div className={Style.input}>
					<button>Auto</button>
					<input 
						type="text" 
						placeholder={slippage} 
						onChange={(e)=> setSlippage(Number(e.target.value))}
					/>
				</div>

				<p className={Style.para}>
					Deadline {""}
					<Image 
						src={images.Lock}
						alt="image" 
						width={20} 
						height={20}
					/>
				</p>

				{/* */}
				<div className={Style.input}>
					<input 
						type="text" 
						placeholder={deadline}
						onChange={(e)=> setDeadline(Number(e.target.value))}
					/>
					<button>minutes</button>
				</div>

				<h3>Interface Setting</h3>

				{/* Toggle */}
				<div className={Style.toggle}> 
					<p className={Style.para}>
						Transaction Deadline
					</p>
					<Toggle 
						label="No"
					/>
				</div>

			</div>
		</div>
	)
}

export default SwapSettings;