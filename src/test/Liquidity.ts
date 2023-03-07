import { expect } from "chai";
import { network, ethers } from "hardhat";

//Goerli Network
const WETH9 = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const DAI = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
const USDC = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
export const nonfungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
export const UniswapV3Factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
const WETH9_USDC_POOL_FEE = 2400;
const DAI_USDC_POOL_FEE = 100;

describe("Liquidity", () => {
    let liquidity; //contract instance
    let owner:string;
    let dai; //ERC20 Contract instance
    let usdc; //ERC20 Contract instance

    before(async() => {
      	[owner] = await ethers.getSigners(1);
      	//deploy contract
      	const Liquidity = await ethers.getContractFactory("Liquidity");
     	liquidity = await Liquidity.deploy(nonfungiblePositionManagerAddress, UniswapV3Factory, WETH9);
	    await liquidity.deployed();

	    //byte code to confirm contract exists
	    // console.log(await owner.provider.getCode(liquidity.address));

	    //get contract info of test tokens
	    dai = await ethers.getContractAt("IERC20", DAI)
	    usdc = await ethers.getContractAt("IERC20", USDC)
    });

    it("mintNewPosition", async()=> {
      	const daiAmount = 10000000000;
      	const usdcAmount = 10000000000;

      	await dai.connect(owner).transfer(liquidity.address, daiAmount)
      	await usdc.connect(owner).transfer(liquidity.address, usdcAmount)

	   	console.log('USDC balance before: ', await usdc.balanceOf(owner.address))
    	console.log('DAI balance before: ', await dai.balanceOf(owner.address))
    	const txn = await liquidity.mintNewPositiion();
	    txn.wait();
	    console.log('USDC balance after: ', await usdc.balanceOf(owner.address))
	    console.log('DAI balance after: ', await dai.balanceOf(owner.address))
    })
});