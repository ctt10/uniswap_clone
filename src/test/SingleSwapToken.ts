import { expect } from "chai";
import { ethers } from "hardhat";

//Goerli Network
const DAI = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
const USDC = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const WETH9 = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

describe("SingleSwapToken", () => {
    let singleSwapToken; //contract instance
    let owner;
    let weth;
    let dai;
    let usdc;

    before(async() => {
      [owner] = await ethers.getSigners(1);
      //deploy contract
      const SingleSwapToken = await ethers.getContractFactory("SingleSwapToken");
      singleSwapToken = await SingleSwapToken.deploy();
      
      // console.log(await owner.provider.getCode(singleSwapToken.address));
      await singleSwapToken.deployed();
      //get contract info of test tokens
      weth = await ethers.getContractAt("IWETH", WETH9)
      dai = await ethers.getContractAt("IERC20", DAI)
      usdc = await ethers.getContractAt("IERC20", USDC)
    });

    //begin tests
    it("swapExactInputSingle", async()=> {
      const amountIn = 10000000000;

      console.log('WETH balance before: ', await weth.balanceOf(owner.address))
      console.log('DAI balance before: ', await dai.balanceOf(owner.address))
      //deposit token to weth contract,
      await weth.deposit({ value: amountIn });
      //approve singleSwapToken for deposited amount
      await weth.approve(singleSwapToken.address, amountIn); //approve this contract

      /**
       * @params {tokenX} input | ERC20, 
       * @params {tokenY} expected output | ERC20,
       * @params {amountIn} amount of tokenX | uint256
       */ 
      const txn = await singleSwapToken.swapExactInputSingle(weth.address, dai.address, amountIn)
      txn.wait();

      console.log('WETH balance after: ', await weth.balanceOf(owner.address))
      console.log('DAI balance after: ', await dai.balanceOf(owner.address))
    });

});