import WalletApp from "./wallets/WalletApp";
import TransactionApp from "./transactions/TransactionApp";
import "./index.css";

export default function App() {
  return (
    <div className="container mx-auto p-4 space-y-2">
      <WalletApp derivePath="m/44'/60'/0'/0/0">
        {({ from, signTransaction, isOpen, onClose }) => (
          <TransactionApp
            isOpen={isOpen}
            onClose={onClose}
            from={from}
            signTransaction={signTransaction}
          />
        )}
      </WalletApp>
    </div>
  );
}
