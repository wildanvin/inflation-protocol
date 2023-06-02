// scripts/interactWithContract.ts

import { factoryCPI } from "./adresses";
import { ethers } from "hardhat";

async function main() {
  const contractAddress = factoryCPI;

  const [account] = await ethers.getSigners();

  //Interact from account
  const Contract = await ethers.getContractFactory("FactoryCPI", account);
  const contract = await Contract.attach(contractAddress);

  const tx = await contract.createMonthlyCPI();
  await tx.wait();
  console.log("MonthlyCPI created");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
