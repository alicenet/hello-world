---
sidebar_position: 3
title: "Send Value"
---

# Send Value

Now that you have a funded demo wallet, you can send value to someone else on testnet.

For this example we'll be using the predetermined demo address noted below to send some test tokens to.

Demo Destination Address: *01527b9166b4e323384a536996e84f572bab62a0*

### How it works

After an account has been added and it has some funds the underlying api can be used to send transactions containing *Value Stores*

For sending tokens AliceNet uses what are called *Value Stores* which are UTXOs that track a sum of token value.

Because AliceNet uses the Unspent Transaction Object method for accounting we need to figure out which UTXOs can be consumed and what the IDs of those UTXOs are to use an Inputs for our transaction.

Luckily AliceNetJS handles this overhead for us and we can send transactions with *Value Stores* quite easily as outlined below.

:::caution Remember
This example assumes an account has been added, and it has the appropriate funds. Otherwise you will encounter errors.
:::

```
// aliceNetWallet has been instanced and an account has been added

// TX Object for clarity, you can pass this directly into the createAndSendTx() method
const tx = {
    from  : "0x0", // From address as a hexadecimal value -- Should be the added account address -- Will work without 0x
    to    : "0x01527b9166b4e323384a536996e84f572bab62a0", // To address as hexadecimal value
    value : "100", // Can be a hexadecimal or integer value -- It will be converted to hexadecimal by library -- No Floats!
    curve : 1 || 2 // This is the curve used to derrive the public key -- it is required. Default and usual is 1 for secp256k1
}

// Set the fee on the Transaction object
await aliceNetWallet.Transaction.createTxFee(tx.from, 1); // 1 Is used to designate secp256k1 curve

// Create the value store to be sent
await aliceNetWallet.Transaction.createValueStore(tx.from, tx.value, tx.to, 1);

// Await the send()
const pendingTransaction = await this.wallet().Transaction.sendTx();

// Reset the transaction object state for the next transaction
await this.wallet().Transaction._reset(); 

// The pending transaction has been submitted, however we are unsure if it's mined yet, to check that we can write an async wrapper
let minedTx = await monitorPending(pendingTransaction)

// We can now attempt to get the mined transaction by intermittantly polling for it.
async monitorPending(tx) {
    try {
        let txDetails = await aliceNetWallet.Rpc.getMinedTransaction(tx);
        // Success TX Mine
        return { "txDetails": txDetails.Tx, "txHash": tx, "msg": "Mined: " + this.trimTxHash(tx) };
    } catch (ex) {
        console.log(ex)
        await this.sleep(3500);
        monitorPending(tx);
    }
}
```

