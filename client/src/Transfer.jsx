import { useState } from "react";
import server from "./server";
import React from "react";
import { sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import {
  hexToBytes,
  toHex,
  utf8ToBytes,
  bytesToHex,
} from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transactionData = {
      sender: address,
      recipient,
      amount: parseInt(sendAmount)
    }

    const transactionHash = keccak256(
      utf8ToBytes(JSON.stringify(transactionData))
    );

    const signature = await sign(transactionHash, privateKey);

    transactionData.senderSignature = toHex(signature);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, transactionData);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address(publicKey), for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
