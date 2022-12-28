import { ethers } from "ethers";
import React from "react";

const JsonRpcProviderContext = React.createContext(
  new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/b4232d71ead544ca8e7a72110f5d4574"
  )
);
export default JsonRpcProviderContext;
