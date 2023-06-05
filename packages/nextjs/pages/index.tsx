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

  const productNames = ["Kw-hour", "Gas", "Milk", "Internet", "TOTAL"];

  return (
    <>
      <Head>
        <title>Inflation Protocol</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div>
        <h1 className="text-4xl font-bold pt-5 px-5 pb-0 mb-0">Months:</h1>
        <div className="grid grid-cols-3 gap-4 p-4 md:p-8">
          {cpisArray?.map((address, index) => (
            <Link key={address} href={`/month/${address}`}>
              <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-center">
                <span className="text-gray-800 flex">
                  <Address address={address} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <h1 className="text-4xl font-bold pt-5 px-5 pb-0 mb-0">Percentages:</h1>

        <div className="grid grid-cols-3 gap-4 p-4 md:p-8">
          {percentageArray?.map((percentage, index) => {
            const numericValues = Object.values(percentage)
              .slice(0, 5)
              .map(value => value.toNumber() / 1000);
            return (
              <div key={index} className="bg-gray-200 p-4 rounded-lg flex flex-col items-center">
                {numericValues.map((value, i) => (
                  <div key={i}>
                    <span className="text-gray-800">{productNames[i]}: </span>
                    <span className="text-gray-800">{value}%</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
