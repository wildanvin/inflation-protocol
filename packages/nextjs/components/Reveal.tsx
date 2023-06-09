import React from "react";
import { useState } from "react";
import { useCustomContractWrite } from "../hooks/scaffold-eth";
import { BigNumber, ethers } from "ethers";

interface RevealProps {
  address: string;
  time: BigNumber | undefined;
}

interface RevealInput {
  price0: number;
  price1: number;
  price2: number;
  price3: number;
}

export const Reveal: React.FC<RevealProps> = ({ address, time }) => {
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
        [name]: value == "" ? 0 : value,
      }));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleReveal = (event: React.FormEvent) => {
    event.preventDefault();
    writeAsync();
  };

  const { writeAsync } = useCustomContractWrite({
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

  /*
  HANDLE DATES:
  */

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  function formatDate(unixTimestamp: any) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString(undefined, options);
  }

  function addDaysToUnixTimestamp(unixTimestamp: any, days: any) {
    const millisecondsPerDay = 86400000; // 1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const timestampInMilliseconds = unixTimestamp * 1000; // Convert Unix timestamp to milliseconds
    const targetTimestamp = timestampInMilliseconds + days * millisecondsPerDay;
    const targetUnixTimestamp = Math.floor(targetTimestamp / 1000); // Convert back to Unix timestamp
    return targetUnixTimestamp;
  }
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md px-6 py-6">
      <h2 className="text-2xl font-bold">2. Reveal</h2>
      <p className="my-0">
        {" "}
        <b>From: </b>
        {formatDate(addDaysToUnixTimestamp(time, 3))}
      </p>
      <p>
        {" "}
        <b>To: </b>
        {formatDate(addDaysToUnixTimestamp(time, 6))}
      </p>
      <form onSubmit={handleReveal}>
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
            placeholder="Enter price..."
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
            placeholder="Enter price..."
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
            placeholder="Enter price..."
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
