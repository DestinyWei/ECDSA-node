import server from "./server";
import React, { useEffect } from "react";
import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { bytesToHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey
}) {
  async function getAddressAndBalance() {
    try {
      let publicKey = bytesToHex(getPublicKey(privateKey));
      setAddress(`${publicKey}`);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } catch (err) {
      setAddress("Invalid private key");
      setBalance(0);
    }
  }

  async function onChangePrivateKey(evt) {
    const key = evt.target.value;
    setPrivateKey(key);
  }

  useEffect(() => {
    getAddressAndBalance();
  }, [privateKey, address]);

  const borderObject = (() => {
    if (address === "Invalid private key") {
      return { borderColor: "red" };
    } else {
      return { borderColor: "green" };
    }
  })();

  return (
    <div className="container wallet" style={borderObject}>
      <h1>Your Wallet</h1>

      <label>
        Wallet Address (auto generated)
        <input
          placeholder="auto generate the address according to your privateKey"
          value={address}
          disabled
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChangePrivateKey}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
