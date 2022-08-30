---
sidebar_position: 2
title: "Fund Your Wallet"
---

# Fund Your Wallet

Now that you have a demo wallet, we can fund it with some testnet tokens.

### How it works

Currently the demo application is hooked up to a temporary API that automatically funds an address with a button press

**TODO: THIS PAGE NEEDS UDPATED TO FAUCET INFORMATION WHEN INTEGRATED**

After a wallet has been generated, we can acquire funds for testnet by visiting [AliceNet Testnet Faucet](/) and copying the demo wallet address in.

Once a request has been submitted your demo wallet's balance may take a few minutes to update on this page.

Once your balance updates you can continue to [sending value](/docs/ui-in-depth/send-value).

You can also read more about the underlying balance checking process below.

#### Checking a balance with AliceNetJs

To check a balance with AliceNetJs we can plugin an address and search for ValueStores.

AliceNet uses an unspent transaction output model for tracking balances similar to Bitcoin.

See the below snippet for an example:

```
const aliceNetJs = require('aliceNetJs'); // Import AliceNetJs

// Remember false will let the RPC fetch the correct chainId, but you can supply it if you like.
const aliceNetWallet =  new aliceNetJs(false, "<RPC_ENDPOINT>"); 

try {

    // The below function API method will return UTXO IDs and the sum of value for UTXOs 
    let [utxoids, balance] = await aliceNetWallet.Rpc.getValueStoreUTXOIDs(address, SECP256K1);

    // Balance is a hexadecimal string so we need to parse it with radix 16
    balance = String(parseInt(balance, 16)); 
    
} catch (ex) {

    // If an error were to occur it will throw inside aliceNetWallet and we can handle it here
    return [{ error: ex }, null]

}

```

Very similar code is used in this application to fetch the balances for your demo wallet.