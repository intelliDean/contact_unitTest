import { ethers } from "hardhat";

async function main() {
  const mutators = await ethers.deployContract("Todo");
  await mutators.waitForDeployment();

  console.log(`Contract: Todo deployed to ${mutators.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
