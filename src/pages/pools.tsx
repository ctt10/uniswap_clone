import React, {useState, useEffect, useContext} from "react";

import Image from "next/image";
import Style from "../styles/PoolPage.module.scss";
import images from "../Assets";

import {PoolLiquidity, CreatePool} from "../Components/index";
import {PoolContextProvider} from "../Context/PoolContext";
//@types
import {NextPage} from "next";

const PoolPage:NextPage = ({data}: any) => {

	const Pages = {
		Create:"Create",
		Connect:"Connect"
	}
	const [active, setActive] = useState<string>(Pages.Create);

	return (
		<div className={Style.PoolPage}>
			<PoolContextProvider>
				<div className={Style.header}>
					<div
						className={active === Pages.Connect ? Style.active_left: Style.inactive}
						onClick={()=> (setActive(Pages.Connect))}
					>
						<p>Add Liquidity</p>
					</div>
					<div
						className={active === Pages.Create? Style.active_right: Style.inactive}
						onClick={()=> (setActive(Pages.Create))}
					>
						<p>Create Pool</p>
					</div>
				</div>
				{active === Pages.Create ? (
						<CreatePool />
					) : (
						<PoolLiquidity />
				)	}
			</PoolContextProvider>
		</div>
	);
}

export default PoolPage;
