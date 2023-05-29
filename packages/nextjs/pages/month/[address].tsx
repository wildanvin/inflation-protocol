import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const Address: NextPage = () => {
  const router = useRouter();
  /*Post: {router.query.slug} */
  return (
    <>
      <div>Hello {router.query.address}</div>
    </>
  );
};

export default Address;
