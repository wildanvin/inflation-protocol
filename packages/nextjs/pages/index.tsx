import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Address } from "../components/scaffold-eth";
import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: cpisArray } = useScaffoldContractRead({
    contractName: "FactoryCPI",
    functionName: "getCPIsArray",
  });

  const { data: percentageArray } = useScaffoldContractRead({
    contractName: "FactoryCPI",
    functionName: "getPercentagesArray",
  });

  console.log(`Percentage array is: ${percentageArray}`);

  return (
    <>
      <Head>
        <title>Inflation Protocol</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="grid grid-cols-3 gap-4 p-4 md:p-8">
        {cpisArray?.map(address => (
          <Link key={address} href={`/month/${address}`}>
            <div className="bg-gray-200 p-4 rounded-lg">
              <span className="text-gray-800">
                <Address address={address} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
