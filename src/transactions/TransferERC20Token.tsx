import { useCallback, useContext, useState } from "react";
import * as ethers from "ethers";
import JsonRpcProviderContext from "../contexts/JsonRpcProviderContext";

interface Props {
  address: string;
  symbol: string;
  decimals: number;
  from: string;
  to: string;
  signTransaction(unsignedTransaction: string): Promise<string | undefined>;
}
export default function TransferERC20Token({
  address,
  symbol,
  decimals,
  from,
  to,
  signTransaction
}: Props) {
  const [valueStr, setValueStr] = useState("0.01");

  const provider = useContext(JsonRpcProviderContext);
  const onRequestClick = useCallback(async () => {
    const value = ethers.utils.parseUnits(valueStr, decimals);
    const network = await provider.getNetwork();
    const nonce = await provider.getTransactionCount(from);
    const feeData = await provider.getFeeData();
    console.log("from", from);
    console.log("nonce", nonce);

    const contract = new ethers.Contract(address, [
      "function transfer(address to, uint amount) returns (bool)"
    ]); // note that there is no signer or provider here
    const unsignedTransaction = await contract.populateTransaction.transfer(
      to,
      value
    );

    // const unsignedTransaction: ethers.PopulatedTransaction = {
    //   type: 2,
    //   nonce,
    //   chainId: network.chainId,
    //   from,
    //   to,
    //   value,
    //   gasLimit: ethers.BigNumber.from(210000),
    //   maxFeePerGas: feeData.maxFeePerGas!,
    //   maxPriorityFeePerGas: feeData.maxPriorityFeePerGas!
    // };
    console.log("unsignedTransaction", unsignedTransaction);

    // unsignedTransaction.value = ethers.utils.parseEther("0.1");
    // // now you can add more stuff to this unsignedTx like nonce and gas prices
    unsignedTransaction.gasLimit = ethers.BigNumber.from(210000);
    // unsignedTransaction.gasPrice = feeData.gasPrice!;
    // console.log("unsignedTransaction", unsignedTransaction);
    unsignedTransaction.type = 2;
    unsignedTransaction.chainId = network.chainId;
    unsignedTransaction.nonce = nonce;
    unsignedTransaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas!;
    unsignedTransaction.maxFeePerGas = feeData.maxFeePerGas!;
    const unsignedTransactionHex = ethers.utils.serializeTransaction(
      unsignedTransaction
    );
    ////////////////////////////////////////////////////////////////
    // signTransaction
    ////////////////////////////////////////////////////////////////
    const signedTransactionHex = await signTransaction(unsignedTransactionHex);
    ////////////////////////////////////////////////////////////////
    // sendTransaction
    ////////////////////////////////////////////////////////////////
    console.log("sendTransaction", signedTransactionHex);
    if (signedTransactionHex) {
      const { hash } = await provider.sendTransaction(signedTransactionHex);
      console.log("transactionHash", hash);
      const transactionReceipt = await provider.waitForTransaction(hash);
      console.log("transactionReceipt", transactionReceipt);
    }
  }, [provider, from, to, address, decimals, signTransaction, valueStr]);

  return (
    <div className="space-y-4 rounded bg-blue-50 border border-blue-100 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold">Transfer {symbol}</h1>
      </div>
      <div className="flex gap-4">
        <input
          className="w-full border rounded p-2 text-yellow-500 bg-blue-100 border-blue-300"
          value={valueStr}
          onChange={(event) => setValueStr(event.target.value)}
        />
        <button
          className="flex-shrink-0 border px-2 py-1 rounded hover:bg-gray-50"
          onClick={onRequestClick}
        >
          请求签名交易
        </button>
      </div>
    </div>
  );
}
