import { ethers } from "hardhat";

async function main() {
  const mutators = await ethers.deployContract("Mutators");
  await mutators.waitForDeployment();

  console.log(`Contract: Mutators deployed to ${mutators.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
