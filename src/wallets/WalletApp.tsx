import { ethers, Wallet } from "ethers";
import React, { useCallback, useMemo, useState, ReactElement } from "react";
import HDWalletETH from "./HDWalletETH";
import { TransactionRequest } from "@ethersproject/abstract-provider";

interface Props {
  derivePath: string;
  children: (props: {
    from: string;
    signTransaction: (
      unsignedTransaction: string
    ) => Promise<string | undefined>;
    isOpen: boolean;
    onClose: () => void;
  }) => ReactElement;
}
export default (function WalletApp({ derivePath, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const onRandomMnemonicClick = useCallback(() => {
    const randomBytes = ethers.utils.randomBytes(32);
    const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
    setMnemonic(mnemonic);
  }, []);
  const wallet = useMemo(
    () =>
      ethers.utils.isValidMnemonic(mnemonic)
        ? Wallet.fromMnemonic(mnemonic, derivePath)
        : null,
    [mnemonic, derivePath]
  );
  const signTransaction = useCallback(
    async (unsignedTransactionHex: string) => {
      const transaction = ethers.utils.parseTransaction(unsignedTransactionHex);
      console.log("====================================");
      console.log("transaction", transaction);
      console.log("====================================");

      if (
        window.confirm(
          `Sign Transaction [${
            transaction.to
          }, ${transaction.value.toString()}]?`
        )
      ) {
        const signedTransactionHex = await wallet!.signTransaction(
          transaction as TransactionRequest
        );
        console.log("====================================");
        console.log("signedTransaction", signedTransactionHex);
        console.log("====================================");
        const signedTransaction = ethers.utils.parseTransaction(
          signedTransactionHex
        );
        console.log("====================================");
        console.log("signedTransaction", signedTransaction);
        console.log("====================================");
        return signedTransactionHex;
      }
    },
    [wallet]
  );
  const onTransferClick = useCallback(() => {
    setIsOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <>
      <div className="container mx-auto p-4 space-y-4 rounded bg-amber-50 border border-amber-100">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">Mnemonic</h1>
          <button
            type="button"
            onClick={onRandomMnemonicClick}
            className="border px-2 py-1 rounded hover:bg-gray-50"
          >
            生成助记词
          </button>
        </div>
        <textarea
          rows={3}
          className="w-full border rounded p-2 text-blue-600 bg-amber-100 border-amber-300"
          value={mnemonic}
          onChange={(event) => setMnemonic(event.target.value)}
        />
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold">Address</h1>
          <button
            type="button"
            onClick={onTransferClick}
            className="border px-2 py-1 rounded hover:bg-gray-50"
          >
            Transfer
          </button>
        </div>

        {/* {mnemonic && (
        <HDWalletBTC mnemonic={mnemonic} derivePath="m/84'/0'/0'/0/0" />
      )} */}
        {mnemonic && (
          <HDWalletETH mnemonic={mnemonic} derivePath="m/44'/60'/0'/0/0" />
        )}
      </div>
      {wallet &&
        children({ from: wallet.address, signTransaction, isOpen, onClose })}
    </>
  );
});
