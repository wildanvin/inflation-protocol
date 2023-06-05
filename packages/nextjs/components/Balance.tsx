import React from "react";
import { useScaffoldContractRead } from "../hooks/scaffold-eth";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export const Balance: React.FC = () => {
  const { address } = useAccount();

  const { data: balance } = useScaffoldContractRead({
    contractName: "FactoryCPI",
    functionName: "balanceOf",
    args: [address],
  });

  const balance0 = balance ?? "0";
  //const balanceToDisplay = Number(balance0).toFixed(2);

  return (
    <h3 className="text-3xl font-bold pt-5 px-5 pb-0 mb-0">
      {Number(ethers.utils.formatEther(balance0).toString()).toFixed(2)} ICOP
    </h3>
  );
};
