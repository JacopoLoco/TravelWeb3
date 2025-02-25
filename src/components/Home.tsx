import React, { useState } from "react";
import { ethers } from "ethers";

// Dichiarazione per evitare errori di TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

function Home() {
  const [walletConnected, setWalletConnected] = useState(false); // Stato per controllare se il wallet è connesso
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  const [transferInfo, setTransferInfo] = useState({
    recipient: "",
    amount: "",
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); // Richiede l'autorizzazione al wallet
        const address = accounts[0]; // Salva l'indirizzo del wallet connesso

        setBalanceInfo((prev) => ({ ...prev, address })); // Aggiorna lo stato con l'indirizzo
        setWalletConnected(true); // Imposta lo stato del wallet come connesso
      } catch (error) {
        console.error("Errore nella connessione al wallet:", error);
      }
    } else {
      alert("MetaMask non è installato!"); // Mostra un avviso se MetaMask non è presente
    }
  };

  const getBalance = async () => {
    if (window.ethereum && balanceInfo.address !== "-") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(balanceInfo.address); // Ottiene il saldo dell'account
        const formattedBalance = ethers.formatEther(balance); // Converte il saldo in ETH

        setBalanceInfo((prev) => ({ ...prev, balance: formattedBalance })); // Aggiorna il saldo nello stato
      } catch (error) {
        console.error("Errore nel recupero del saldo:", error);
      }
    } else {
      alert("Connetti prima il wallet!"); // Avvisa l'utente se prova a ottenere il saldo senza un wallet connesso
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
        const signer = await provider.getSigner(); // Risolvi la promessa e ottieni il signer

        // Invia la transazione
        const transaction = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount), // Converte l'importo in Wei
        });

        console.log("Transazione inviata:", transaction);
        alert("Transazione inviata con successo!");
      } catch (error) {
        console.error("Errore nell'invio della transazione:", error);
        alert("Si è verificato un errore durante il trasferimento.");
      }
    } else {
      alert("Connetti prima il wallet!");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 mt-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Wallet Connection
        </h2>

        {!walletConnected ? ( // Se il wallet non è connesso, mostra il pulsante per connetterlo
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
              onClick={getBalance} // Se il wallet è connesso, mostra il pulsante per ottenere il saldo
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition mt-4 duration-300"
            >
              Get my balance
            </button>
          </>
        )}
      </div>

      {/* Form per inviare ETH con miglioramenti stilistici */}
      {walletConnected && (
        <div className="max-w-xl mx-auto p-6 mt-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Send ETH</h3>
          
          {/* Input per indirizzo e importo con margini e padding */}
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
  );
}

export default Home;
