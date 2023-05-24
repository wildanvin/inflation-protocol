// npx hardhat run scripts/advanceTime.ts

import { ethers } from "hardhat";

async function main() {
  function testHash(price0: number, price1: number, price2: number, price3: number): string {
    const encodedData = ethers.utils.solidityPack(
      ["uint256", "uint256", "uint256", "uint256"],
      [price0, price1, price2, price3],
    );
    const hash = ethers.utils.keccak256(encodedData);
    return hash;
  }

  const text = testHash(10, 10, 10, 10);
  console.log(text);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
