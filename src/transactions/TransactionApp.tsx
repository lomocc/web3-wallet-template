import TransferETH from "./TransferETH";
import TransferERC20Token from "./TransferERC20Token";
import ERC20TokensContext from "../contexts/ERC20TokensContext";
import { Fragment, useContext, useState } from "react";
import { Transition } from "@headlessui/react";
import { HiX } from "react-icons/hi";

interface Props {
  isOpen: boolean;
  onClose(): void;
  from: string;
  signTransaction(unsignedTransaction: string): Promise<string | undefined>;
}
export default function TransactionApp({
  isOpen,
  onClose,
  from,
  signTransaction
}: Props) {
  const ERC20Tokens = useContext(ERC20TokensContext);
  const [toStr, setToStr] = useState(
    "0x8887dE42b2c75019fAcc63285A4B058aD48d391d"
  );
  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="container mx-auto relative">
        <h1 className="text-xl text-center font-bold p-4">Transfer</h1>
        <div className="space-y-4">
          <input
            className="w-full border rounded-full px-4 py-2 text-gray-600 bg-blue-100 border-blue-600"
            value={toStr}
            onChange={(event) => setToStr(event.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TransferETH
              from={from}
              to={toStr}
              signTransaction={signTransaction}
            />
            {ERC20Tokens.map((token) => (
              <TransferERC20Token
                key={token.symbol}
                address={token.address}
                symbol={token.symbol}
                decimals={token.decimals}
                from={from}
                to={toStr}
                signTransaction={signTransaction}
              />
            ))}
            <TransferERC20Token
              address="0xec03D179d5683a1b58F018fD3C39d238BF1189a3"
              symbol="uniETH"
              decimals={18}
              from={from}
              to={toStr}
              signTransaction={signTransaction}
            />
          </div>
        </div>
        <button
          type="button"
          className="absolute right-2 top-2 p-2 rounded-full hover:bg-blue-100"
          onClick={() => onClose()}
        >
          <HiX />
        </button>
      </div>
    </Transition>
  );
}
