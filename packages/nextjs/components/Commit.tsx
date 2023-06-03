import React from "react";
import { useEffect, useState } from "react";
import { useCustomContractWrite } from "../hooks/scaffold-eth";
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
        [name]: value == "" ? 0 : value,
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
    try {
      const commit = getCommitInBytes(
        ethers.utils.parseEther(commitInput.price0.toString()),
        ethers.utils.parseEther(commitInput.price1.toString()),
        ethers.utils.parseEther(commitInput.price2.toString()),
        ethers.utils.parseEther(commitInput.price3.toString()),
      );
      setUserCommit(commit);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [commitInput]);

  const { writeAsync, isLoading } = useCustomContractWrite({
    contractName: "MonthlyCPI",
    functionName: "commit",
    address: address,
    args: [userCommit], //this is a weird error from wagmi
  });
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md px-6 py-6">
      <h2 className="text-2xl font-bold">1. Commit</h2>
      <p className="mt-2">Commit description goes here...</p>
      <form onSubmit={handleCommit}>
        <div className="mt-4">
          <label htmlFor="price0" className="block">
            1 kw-hour:
          </label>
          <input
            type="number"
            id="price0"
            className="mt-1 p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter price..."
            name="price0"
            value={commitInput.price0.toString()}
            onChange={handleCommitInputChange}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="price1" className="block">
            1 liter of gas:
          </label>
          <input
            type="number"
            id="price1"
            className="mt-1 p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter price..."
            name="price1"
            value={commitInput.price1.toString()}
            onChange={handleCommitInputChange}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="price2" className="block">
            1 liter of milk:
          </label>
          <input
            type="number"
            id="price2"
            className="mt-1 p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter price..."
            name="price2"
            value={commitInput.price2.toString()}
            onChange={handleCommitInputChange}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="price3" className="block">
            Internet at 10 mbps upload speed (1 month):
          </label>
          <input
            type="number"
            id="price3"
            className="mt-1 p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter price..."
            name="price3"
            value={commitInput.price3.toString()}
            onChange={handleCommitInputChange}
          />
        </div>
        <br />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Commit
        </button>
      </form>
    </div>
  );
};
