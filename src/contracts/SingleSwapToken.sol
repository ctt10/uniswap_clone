// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SingleSwapToken{
	
	//Uniswap ISwapRouter contract
	ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    ///IN ORDER TO MAKE A SWAPTHIS FUNCTION WILL NEED TO BE ABLE TO ??
    ///QUERY A POOL'S ADDRESS AND IMMUTABLES to get the tokens in a pool??
	function swapExactInputSingle(address tokenX, address tokenY, uint256 amountIn) external returns (uint256 amountOut) {
        // Transfer the specified amount From sender to this contract
        TransferHelper.safeTransferFrom(tokenX, msg.sender, address(this), amountIn);
        // Approve the router to spend token
        TransferHelper.safeApprove(tokenX, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenX,
                tokenOut: tokenY,
                fee: 3000, //TODO: MAKE DYNAMIC
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
	}

    function swapExactOutputSingle(address tokenX, address tokenY, uint256 amountOut, uint amountInMaximum) external returns (uint256 amountIn) {
        // Transfer the specified amount to this contract
        TransferHelper.safeTransferFrom(tokenX, msg.sender, address(this), amountInMaximum);
        // Approve the router to spend
        TransferHelper.safeApprove(tokenX, address(this), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: tokenX,
                tokenOut: tokenY,
                fee: 3000, //TODO: MAKE DYNAMIC
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountIn = swapRouter.exactOutputSingle(params);

        if(amountIn < amountInMaximum){
            TransferHelper.safeApprove(tokenX, address(swapRouter), 0);
            TransferHelper.safeTransfer(tokenX, msg.sender, amountInMaximum - amountIn);
        }
    }
}