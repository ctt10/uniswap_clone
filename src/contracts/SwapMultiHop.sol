// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SwapMultiHop{
	//Uniswap ISwapRouter contract
	ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

	function swapExactInputMultihop(address tokenX, uint24 poolFeeXY, address tokenY, uint24 poolFeeYZ, address tokenZ, uint amountIn) external returns(uint amountOut){
		TransferHelper.safeTransferFrom(tokenX, msg.sender, address(this), amountIn);
		TransferHelper.safeApprove(tokenX, address(swapRouter), amountIn);

		//this contract will need a pricing oracle to determine 
		//the fees of the pools being accessed for each token
		ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
			path: abi.encodePacked(
				tokenX, 
				poolFeeXY, //weth -> USDC pool fees
				tokenY,
				poolFeeYZ, //usdc -> tokenY pool fees
				tokenZ
			),
			recipient:msg.sender,
			deadline: block.timestamp,
			amountIn: amountIn,
			amountOutMinimum: 0
		});

		amountOut = swapRouter.exactInput(params);
	}


}