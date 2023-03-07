import React from "react"

import Style from "./Toggle.module.scss";

const Toggle = ({ label }) => {

	return (
		<div className={Style.Toggle}>
			<div className={Style.switch_box}>
				<input 
					type="checkbox"
					className={Style.checkbox}
					name={label}
					id={label}
				/>
				<label className={Style.label} htmlFor={label}>
					<span className={Style.inner} />
					<span className={Style.switch} />
				</label>
			</div>
		</div>
	)
}

export default Toggle;