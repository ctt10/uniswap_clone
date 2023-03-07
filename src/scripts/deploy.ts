import { ethers } from "hardhat";

//deploy all contracts
async function main() {
  const SingleSwapToken = await ethers.getContractFactory("SingleSwapToken");
  const singleSwapToken = await SingleSwapToken.deploy();
  await singleSwapToken.deployed(); 
  console.log(`SingleSwapToken deployed to ${singleSwapToken.address}`); //

  // const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop");
  // const swapMultiHop = await SwapMultiHop.deploy();
  // await swapMultiHop.deployed();
  // console.log(`SwapMultiHop deployed to ${swapMultiHop.address}`); //
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
