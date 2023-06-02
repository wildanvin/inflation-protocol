import React from "react";
import { useState } from "react";
import { useCustomContractWrite } from "../hooks/scaffold-eth";
import { ethers } from "ethers";

interface RevealProps {
  address: string;
}

interface RevealInput {
  price0: number;
  price1: number;
  price2: number;
  price3: number;
}

export const Reveal: React.FC<RevealProps> = ({ address }) => {
  const [revealInput, setRevealInput] = useState<RevealInput>({
    price0: 0,
    price1: 0,
    price2: 0,
    price3: 0,
  });

  const handleRevealInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = event.target;
      setRevealInput(prevRevealInput => ({
        ...prevRevealInput,
        [name]: value,
      }));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleReveal = (event: React.FormEvent) => {
    event.preventDefault();
    writeAsync();
  };

  const { writeAsync, isLoading } = useCustomContractWrite({
    contractName: "MonthlyCPI",
    functionName: "reveal",
    address: address,
    args: [
      ethers.utils.parseEther(revealInput.price0.toString()),
      ethers.utils.parseEther(revealInput.price1.toString()),
      ethers.utils.parseEther(revealInput.price2.toString()),
      ethers.utils.parseEther(revealInput.price3.toString()),
    ],
  });
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md px-6 py-6">
      <h2 className="text-2xl font-bold">Reveal</h2>
      <p className="mt-2">Reveal description goes here...</p>
      <form onSubmit={handleReveal}>
        <div className="mt-4">
          <label htmlFor="price0" className="block">
            1 kw-hour:
          </label>
          <input
            type="number"
            id="price0"
            className="mt-1 p-2 border border-gray-300 rounded text-gray-900"
            placeholder="Enter number 1..."
            name="price0"
            value={revealInput.price0.toString()}
            onChange={handleRevealInputChange}
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
            placeholder="Enter number 2..."
            name="price1"
            value={revealInput.price1.toString()}
            onChange={handleRevealInputChange}
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
            placeholder="Enter number 3..."
            name="price2"
            value={revealInput.price2.toString()}
            onChange={handleRevealInputChange}
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
            placeholder="Enter number 4..."
            name="price3"
            value={revealInput.price3.toString()}
            onChange={handleRevealInputChange}
          />
        </div>
        <br />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Reveal
        </button>
      </form>
    </div>
  );
};
