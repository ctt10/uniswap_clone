// SPDX-License-Identifier: GPL-2.0-or-Later
pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol";
import "hardhat/console.sol";

contract Liquidity is IERC721Receiver {

	//.0.3% fee
	uint24 public poolFee = 3000;
	INonfungiblePositionManager public immutable nonfungiblePositionManager;

	/// @notice Represents deposit of NFT
	struct Deposit {
		address owner;
		uint128 liquidity;
		address token0;
		address token1;
    }

    /// @dev deposits[tokenId] => Deposit
    /// all liquidity stored in this mapping
    /// NFTS act as expressions of liquidity
    mapping(uint256 => Deposit) public deposits;	

    constructor(
        INonfungiblePositionManager _nonfungiblePositionManager
    ) {
        nonfungiblePositionManager = _nonfungiblePositionManager;
    }

    ///@notice Creates an NFT for position and gives custody to depositer
    ///@dev ERC721 are used to track what positions are open in this contract
    function onERC721Received(
        address operator,
        address,
        uint256 _tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        // get position information
        _createDeposit(operator, _tokenId);
        return this.onERC721Received.selector;
    }

    function _createDeposit(address owner, uint256 _tokenId) internal {
        (, , address token0, address token1, , , , uint128 liquidity, , , , ) =
            nonfungiblePositionManager.positions(_tokenId);

        // set the owner and data for position
        // operator is msg.sender
        deposits[_tokenId] = Deposit({
        	owner: owner, 
        	liquidity: liquidity, 
        	token0: token0, 
        	token1: token1
       	});
    
    	console.log('TokenId', _tokenId);
    	console.log('Liquidity', liquidity);
    }

    /// @notice Calls the mint function defined in periphery, mints the same amount of each token. 
    /// For this example we are providing 1000 DAI and 1000 USDC in liquidity
    /// @return _tokenId The id of the newly minted ERC721
    /// @return liquidity The amount of liquidity for the position
    /// @return amount0 The amount of token0
    /// @return amount1 The amount of token1
    function mintNewPosition(address tokenX, uint256 positionX, address tokenY, uint256 positionY)
        external
        returns (
            uint256 _tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        // Approve the position manager
        TransferHelper.safeApprove(tokenX, address(nonfungiblePositionManager), positionX);
        TransferHelper.safeApprove(tokenY, address(nonfungiblePositionManager), positionY);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: tokenX,
                token1: tokenY,
                fee: poolFee,
                //TODO:
                //By using TickMath.MIN_TICK and TickMath.MAX_TICK, 
                //we are providing liquidity across the whole range of the pool. 
                //In production you may want to specify a more concentrated position.
                tickLower: TickMath.MIN_TICK,
                tickUpper: TickMath.MAX_TICK,
                amount0Desired: positionX,
                amount1Desired: positionY,
                amount0Min: 0, //TODO: SLIPPAGE PROTECTION
                amount1Min: 0, //TODO: SLIPPAGE PROTECTION
                //otherwise could frontrun this function
                recipient: address(this),
                deadline: block.timestamp
            });

        /// @dev the pool defined by tokenX/tokenX and fee tier 0.3% 
          //must already be created and initialized in order to mint
        (_tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager.mint(params);

        // Create a deposit
        _createDeposit(msg.sender, _tokenId);

        // Remove allowance and refund in both assets.
        if (amount0 < positionX) {
            TransferHelper.safeApprove(tokenX, address(nonfungiblePositionManager), 0);
            uint256 refund0 = positionX - amount0;
            TransferHelper.safeTransfer(tokenX, msg.sender, refund0);
        }

        if (amount1 < positionY) {
            TransferHelper.safeApprove(tokenY, address(nonfungiblePositionManager), 0);
            uint256 refund1 = positionY - amount1;
            TransferHelper.safeTransfer(tokenY, msg.sender, refund1);
        }
    }

    /// @notice Collects the fees associated with provided liquidity
    /// @dev The contract must hold the ERC721 token before it can collect fees
    /// @param _tokenId The id of the ERC721 token
    /// @return amount0 The amount of fees collected in token0
    /// @return amount1 The amount of fees collected in token1
	function collectAllFees(uint256 _tokenId) external returns (uint256 amount0, uint256 amount1){
        //est amount0Max and amount1Max to uin256.max to collect all fess
        //alternativly can set recipient to msg.sender to avoid another transaction 'sendToOwner'

        INonfungiblePositionManager.CollectParams memory params = 
            INonfungiblePositionManager.CollectParams({
                tokenId: _tokenId,
                recipient:  msg.sender,
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);
        console.log('fee - amount0', amount0);
        console.log('fee - amount1', amount1);
    }

    function increaseLiquidityCurrentRange(
        uint256 _tokenId,
        address tokenX,
        uint256 amountAdd0,
        address tokenY,
        uint256 amountAdd1
        ) external returns(
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) {
            TransferHelper.safeTransferFrom(tokenX, msg.sender, address(this), amountAdd0);
            TransferHelper.safeTransferFrom(tokenY, msg.sender, address(this), amountAdd1);
            
            TransferHelper.safeApprove(tokenX, address(nonfungiblePositionManager), amountAdd0);
            TransferHelper.safeApprove(tokenY, address(nonfungiblePositionManager), amountAdd1);

            INonfungiblePositionManager.IncreaseLiquidityParams memory params = 
                INonfungiblePositionManager.IncreaseLiquidityParams({
                    tokenId: _tokenId,
                    amount0Desired: amountAdd0,
                    amount1Desired: amountAdd1,
                    amount0Min: 0,
                    amount1Min: 0,
                    deadline: block.timestamp
                });

            (liquidity, amount0, amount1) = nonfungiblePositionManager.increaseLiquidity(params);

            console.log("liquidity", liquidity);
            console.log("amount0", amount0);
            console.log("amount1", amount1);
    }

    function decreaseLiquidityInHalf(uint256 _tokenId) external returns (uint256 amount0, uint256 amount1) {
        // caller must be the owner of the NFT
        require(msg.sender == deposits[_tokenId].owner, 'Not the owner');
        // get liquidity data for tokenId
        uint128 liquidity = deposits[_tokenId].liquidity;
        uint128 halfLiquidity = liquidity / 2;

        // amount0Min and amount1Min are price slippage checks
        // if the amount received after burning is not greater than these minimums, transaction will fail
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: _tokenId,
                liquidity: halfLiquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);
        console.log("amount0", amount0);
        console.log("amount1", amount1);

        //send liquidity back to owner
        _sendToOwner(_tokenId, amount0, amount1);
    }

    /// @notice Transfers funds to owner of NFT
    /// @param _tokenId The id of the erc721
    /// @param amount0 The amount of token0
    /// @param amount1 The amount of token1
    function _sendToOwner(
        uint256 _tokenId,
        uint256 amount0,
        uint256 amount1
    ) internal {
        // get owner of contract
        address owner = deposits[_tokenId].owner;

        address token0 = deposits[_tokenId].token0;
        address token1 = deposits[_tokenId].token1;
        // send collected fees to owner
        TransferHelper.safeTransfer(token0, owner, amount0);
        TransferHelper.safeTransfer(token1, owner, amount1);
    }

    function getLiquidity(uint _tokenId) external view returns (uint128){
        (,,,,,,,uint128 liquidity,,,,) = nonfungiblePositionManager.positions(_tokenId);
        return liquidity;
    }

    /// @notice Transfers the NFT to the owner
    /// @param _tokenId The id of the erc721
    function retrieveNFT(uint256 _tokenId) external {
        // must be the owner of the NFT
        require(msg.sender == deposits[_tokenId].owner, 'Not the owner');
        // transfer ownership to original owner
        nonfungiblePositionManager.safeTransferFrom(address(this), msg.sender, _tokenId);
        //remove information related to tokenId
        delete deposits[_tokenId];
    }

}