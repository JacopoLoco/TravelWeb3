import React, { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  const [transferInfo, setTransferInfo] = useState({
    recipient: "",
    amount: "",
  });

  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];

        setBalanceInfo((prev) => ({ ...prev, address }));
        setWalletConnected(true);
      } catch (error) {
        console.error("Errore nella connessione al wallet:", error);
      }
    } else {
      alert("MetaMask non è installato!");
    }
  };

  const getBalance = async () => {
    if (window.ethereum && balanceInfo.address !== "-") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(balanceInfo.address);
        const formattedBalance = ethers.formatEther(balance);

        setBalanceInfo((prev) => ({ ...prev, balance: formattedBalance }));
      } catch (error) {
        console.error("Errore nel recupero del saldo:", error);
      }
    } else {
      alert("Connetti prima il wallet!");
    }
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendETH = async () => {
    const { recipient, amount } = transferInfo;

    if (!recipient || !amount) {
      alert("Per favore, inserisci un indirizzo e un importo!");
      return;
    }

    if (window.ethereum && balanceInfo.address !== "-") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        setIsTransactionPending(true); 
        setTransactionSuccess(true); 

        const transaction = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount),
        });

        await transaction.wait(); 
        setIsTransactionPending(false); 
      } catch (error) {
        console.error("Errore nell'invio della transazione:", error);
        setTransactionSuccess(false); 
        setIsTransactionPending(false);
      }
    } else {
      alert("Connetti prima il wallet!");
    }
  };

  return (
    <>
      {!transactionSuccess ? (
        <>
          <div className="max-w-xl mx-auto p-6 mt-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
              Wallet Connection
            </h2>

            {!walletConnected ? (
              <button
                onClick={connectWallet}
                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <div className="mt-6 overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-left bg-gray-50">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-3 text-gray-600">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3 text-gray-800">{balanceInfo?.balance} ETH</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={getBalance}
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition mt-4 duration-300"
                >
                  Get my balance
                </button>
              </>
            )}
          </div>

          {walletConnected && (
            <div className="max-w-xl mx-auto p-6 mt-4 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Send ETH</h3>

              <input
                type="text"
                name="recipient"
                placeholder="Recipient address"
                value={transferInfo.recipient}
                onChange={handleTransferChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="amount"
                placeholder="Amount (ETH)"
                value={transferInfo.amount}
                onChange={handleTransferChange}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendETH}
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send ETH
              </button>
            </div>
          )}
        </>
      ) : (
        
        <div className="mt-6 max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
          <h3 className={`text-xl font-semibold ${isTransactionPending ? "text-black" : "text-green-700"} mb-4`}>
            {isTransactionPending ? "Transazione in corso..." : "Transazione effettuata con successo!"}
          </h3>
          <p className="text-gray-700">
            {isTransactionPending ? "Attendi la conferma della transazione." : "La tua prenotazione è stata confermata."}
          </p>
          {!isTransactionPending && (
            <button
              onClick={() => setTransactionSuccess(false)}
              className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Torna alla Home
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Home;
