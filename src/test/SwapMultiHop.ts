import { expect } from "chai";
import { ethers } from "hardhat";

//Goerli Network
const WETH9 = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const DAI = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
const USDC = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

const WETH9_USDC_POOL_FEE = 2400;
const DAI_USDC_POOL_FEE = 100;

describe("SwapMultiHop", () => {
    let swapMultiHop; //contract instance
    let owner;
    let weth;
    let dai;
    let usdc;

    //deploy contract and populate erc20|weth9 addresses for test transfer
    before(async() => { 
      [owner] = await ethers.getSigners(1);
      //deploy contract
      const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop");
      swapMultiHop = await SwapMultiHop.deploy();
      
      // console.log(await owner.provider.getCode(singleSwapToken.address));
      await swapMultiHop.deployed();
      //get contract info of test tokens
      weth = await ethers.getContractAt("IWETH", WETH9)
      dai = await ethers.getContractAt("IERC20", DAI)
      usdc = await ethers.getContractAt("IERC20", USDC)
    });

    //begin tests
    it("swapExactInputMultihop", async()=> {
      const amountIn = 10000000000;

      console.log('WETH balance before: ', await weth.balanceOf(owner.address))
      console.log('USDC balance before: ', await usdc.balanceOf(owner.address))
      console.log('DAI balance before: ', await dai.balanceOf(owner.address))

      //this call to deposit is depositing ETH by default
      await weth.deposit({ value: amountIn });
      await weth.approve(swapMultiHop.address, amountIn); //approve this contract

      /**
       * @params {tokenX} input | ERC20, 
       * @params {tokenY} expected output | ERC20,
       * @params {amountIn} amount of tokenX | uint256
       */ 
      const txn = await swapMultiHop.swapExactInputMultihop(
        weth.address,
        WETH9_USDC_POOL_FEE,
        usdc.address,
        DAI_USDC_POOL_FEE,
        dai.address,
        amountIn
      )

      txn.wait();

      //TODO: await TXN mined before displaying post balance
      console.log('WETH balance after: ', await weth.balanceOf(owner.address))
      console.log('USDC balance after: ', await usdc.balanceOf(owner.address))
      console.log('DAI balance after: ', await dai.balanceOf(owner.address))
    });

});