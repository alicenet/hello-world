---
sidebar_position: 4
title: "Store Data"
---

# Store Data

One of AliceNet's core functionalities is built around storing and proving existence of data using *Data Stores*

*Data Stores* can be written to the chain for lengths of time measured in epochs.

Depending on how many *epochs* a piece of data is stored for will effect the *fees* associated with storing it.

The raw data for a *Data Store* will only persist for as long it is paid for, however the proof of it's existence will be permanent.

### How it works

After an account has been added and it has some funds the underlying api can be used to send transactions containing *Data Stores*

For storing data AliceNet uses what are called *Data Stores* which are UTXOs that contain data.

Just like in the [Send Value Step](/docs/ui-in-depth/send-value) *Unspent Transaction Object (UTXO)* method for accounting we need to figure out which UTXOs can be consumed to cover the cost of the *Data Store*

In addition to having the value to cover the *Data Store* we need to supply an index and value.

An *index* is the location at which the data will be stored, while the *value* is the actual data itself

:::caution Remember
This example assumes an account has been added, and it has the appropriate funds. Otherwise you will encounter errors.
:::

```
// aliceNetWallet has been instanced and an account has been added 

// TX Object for clarity, you can pass this directly into the createAndSendTx() method
const tx = {
    from     : "0x0",     // From address as a hexadecimal value, this is the owner of the datastore, should be the added account address -- Will work without 0x
    index    : "myIndex", // An index to store the value, can be utf-8, will be converted to hexadecimal
    duration : 1,         // Number of epochs to store this data on chain. One epoch = 1024 blocks. 1 block takes ~4-6s to mine
    value    : "myData"   // The value to store at index. Can be a string or rawBytes 
}

// Create the value store to be sent
await aliceNetWallet.Transaction.createDataStore(tx.from, tx.index, tx.duration, tx.value);

// Await the send()
const pendingTransaction = await aliceNetWallet.Transaction.sendTx();

// Reset the transaction object state for the next transaction
await aliceNetWallet.Transaction._reset(); 

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

