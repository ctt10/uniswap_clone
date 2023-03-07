import React, {useState, useEffect, useContext} from "react";
import Image from "next/image";
import { WalletContext } from "@/Context/WalletContext";
import { PoolContext } from "@/Context/PoolContext";
import { getPools } from "@/Utils/Pools/PoolUtils";

import Style from "./PoolLiquidity.module.scss";
import images from "@/Assets";

const PoolLiquidity = () => {

	const {activePool, setActivePool} = useContext(PoolContext);
	const { account, liquidityData } = useContext(WalletContext)
	const pools = getPools();

	return (
		<div className={Style.PoolLiquidity}>
			<div className={Style.box}>
				{/* HEADER */}
				<div className={Style.box_header}>
					<h2>Pool</h2>
					<p>+ New Position</p>
				</div>


				{ !!account ? (
					<div className={Style.liquidity}> 
						<div className={Style.liquidity_header}>
							<p>Your Positions {liquidityData?.length}</p>
						</div>
						{ liquidityData?.map((el, i:number) => (
							<div key={i} className={Style.liquidity_positions}>
								<div className={Style.liquidity_positions_list}>
									<p>
										<small className={Style.mark}> 
											{el.poolExample.token0.name}
										</small>{""}
										<small className={Style.mark}> 
											{el.poolExample.token1.name}
										</small>{""}
										<span className={Style.paragraph && Style.hide}> 
											{el.poolExample.token0.name}/{el.poolExample.token1.name}
										</span>{""}
										<span className={Style.paragraph && Style.hide}> 
											{el.fee}
										</span>{""}
									</p>
									<p className={Style.highlight}>In Range</p>
								</div>
								<div className={Style.liquidity_positions_info}>
									<p>
										<small>Min: 0.999</small>{""}
										<span>
											{el.poolExample.token0.name} per {""} {el.poolExample.token1 .name} 
										</span>{""}
										<span>------------</span> <small>Max: 1.000</small>{""}
										<span className={Style.hide}> 
											{el.poolExample.token0.name} per {""} {el.poolExample.token1 .name} 
										</span>
									</p>
								</div>
							</div>
						) ) }
					</div>

				):
					<div className={Style.box_middle}>
						<Image src={images.Wallet} alt="Wallet" height={80} width={80}/>
						<p> 
							Your active V3 liquidity position will appear here.
						</p>
						<button>Connect Wallet</button>
					</div>
				}


				<div className={Style.box_info}>
					<div className={Style.box_info_left}>
						<h5>Learn about providiting liquidity.</h5>
						<p>Check out activeour V3 LP walkthrough and migrate guide</p>
					</div> 
					<div className={Style.box_info_right}>
						<h5>Top Pools</h5>
						<p>Explore Uniswap Analytics</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PoolLiquidity;