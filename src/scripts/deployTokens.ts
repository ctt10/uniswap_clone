import { ethers } from "hardhat";

//deploy all contracts
async function deployToken(name: string, symbol: string) {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20");
    const token = await Token.deploy(name, symbol);
    await token.deployed();
    console.log(`Trash deployed to ${token.address}`); //

    await token.connect(owner).mint(
        owner.address,
        ethers.utils.parseEther('100000')
    )
    const balance = await token.balanceOf(owner.address);

    console.log( `${name} - ${symbol}`)
    console.log(`${owner}, Has ${name} balance of=, ${balance}`); //
}