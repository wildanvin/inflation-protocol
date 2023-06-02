import React from "react";
import { useEffect, useState } from "react";
import { useCustomContractRead, useCustomContractWrite } from "../hooks/scaffold-eth";
import { BigNumber, ethers } from "ethers";

interface CommitProps {
  address: string;
}

interface CommitInput {
  price0: number;
  price1: number;
  price2: number;
  price3: number;
}

export const Commit: React.FC<CommitProps> = ({ address }) => {
  //return <div>Hello from Commit comp with address {address}</div>;
  function getCommitInBytes(price0: BigNumber, price1: BigNumber, price2: BigNumber, price3: BigNumber): string {
    const encodedData = ethers.utils.solidityPack(
      ["uint256", "uint256", "uint256", "uint256"],
      [price0, price1, price2, price3],
    );
    const hash = ethers.utils.keccak256(encodedData);
    return hash;
  }

  const [commitInput, setCommitInput] = useState<CommitInput>({
    price0: 0,
    price1: 0,
    price2: 0,
    price3: 0,
  });

  const [userCommit, setUserCommit] = useState("");

  const handleCommitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = event.target;
      setCommitInput(prevCommitInput => ({
        ...prevCommitInput,
        [name]: value,
      }));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCommit = (event: React.FormEvent) => {
    event.preventDefault();
    writeAsync();
  };

  useEffect(() => {
    const commit = getCommitInBytes(
      ethers.utils.parseEther(commitInput.price0.toString()),
      ethers.utils.parseEther(commitInput.price1.toString()),
      ethers.utils.parseEther(commitInput.price2.toString()),
      ethers.utils.parseEther(commitInput.price3.toString()),
    );
    setUserCommit(commit);
  }, [commitInput]);

  const { writeAsync, isLoading } = useCustomContractWrite({
    contractName: "MonthlyCPI",
    functionName: "commit",
    address: address,
    //address: "0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154",
    args: [userCommit],
  });
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Commit</h2>
      <p className="mt-2">Commit description goes here...</p>
      <form onSubmit={handleCommit}>
        <input
          type="number"
          className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter number 1..."
          name="price0"
          value={commitInput.price0.toString()}
          onChange={handleCommitInputChange}
        />
        <input
          type="number"
          className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter number 2..."
          name="price1"
          value={commitInput.price1.toString()}
          onChange={handleCommitInputChange}
        />
        <input
          type="number"
          className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter number 3..."
          name="price2"
          value={commitInput.price2.toString()}
          onChange={handleCommitInputChange}
        />
        <input
          type="number"
          className="mt-4 p-2 border border-gray-300 rounded text-gray-900"
          placeholder="Enter number 4..."
          name="price3"
          value={commitInput.price3.toString()}
          onChange={handleCommitInputChange}
        />
        <br />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Commit
        </button>
      </form>
    </div>
  );
};
