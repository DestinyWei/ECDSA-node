const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  // private key: 82d868994e97b07426a2e0d0044333589f4f1284a5b635ffff5cebbbd88c96f4
  "047ad27c3b9b049cec7e63b0e21faebba349e2a57bbbf385f27abb9649fd1c28847064aa7ec74c6e44b31d08073f4c5c3c42aea3d47b963b8d97dc17f6727ce3be": 100,
  // private key: 838d1000ad68868020df8de77746cf3f07d95e7169b6f94babdee8a399f5a0ed
  "0429f0c85f0db71f8d9c02d2880aa46910be833c40f7b87852c07699d1944cf5628a0eef1d399fb5595fda4ad635917ce68aa9cd9e4c0ca2679c8a000ca1b1d317": 50,
  // private key: cf64a79d04832033b7e90d8535a30dcc7938a2af36101a7f3db741fc4b82c82e
  "04051039efbcbffa835e88b870fe9d42e551c219fe29c0a4503c9839c78c16157f2e313e1464ebb10ca8bdf0b2bd278bfbbe4bec8afa8ac1a56806ab5cb7fa36ed": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // get a signature from the client-side application
  const { sender, recipient, amount, senderSignature } = req.body;

  const transactionData = { sender, recipient, amount };

  const transactionHash = keccak256(
    utf8ToBytes(JSON.stringify(transactionData))
  );

  const isSigned = secp.verify(
    senderSignature,
    transactionHash,
    sender
  )

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!isSigned) {
    res.status(400).send({ message: "Signature not valid !!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
