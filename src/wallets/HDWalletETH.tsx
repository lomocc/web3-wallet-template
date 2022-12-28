import { ethers } from "ethers";
import React, { useMemo } from "react";
import EthereumAvatar from "./EthereumAvatar";

interface Props {
  mnemonic: string;
  derivePath: string;
}
export default function HDWalletETH({ mnemonic, derivePath }: Props) {
  const wallet = useMemo(
    () =>
      ethers.utils.isValidMnemonic(mnemonic)
        ? ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(derivePath)
        : null,
    [mnemonic, derivePath]
  );
  return wallet ? (
    <div className="flex space-x-1 rounded-full px-3 py-2 bg-amber-100 border border-amber-200">
      <EthereumAvatar
        address={wallet.address}
        className="shrink-0 w-6 h-6 inline-block align-middle"
      />
      <span className="truncate inline-block align-middle text-base text-gray-500">
        {wallet.address}
      </span>
    </div>
  ) : null;
}
