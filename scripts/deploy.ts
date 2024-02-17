import {ethers} from "hardhat";

async function main() {
    const erc = await ethers.deployContract("Class");
    await erc.waitForDeployment();

    console.log(`Contract: Todo deployed to ${erc.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
