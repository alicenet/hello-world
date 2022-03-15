---
sidebar_position: 1
title: "Create A Test Wallet"
---

# Create A Test Wallet

In this step you will be creating a demo wallet.

As noted in the text the following terms apply:

- Cookies related only to demo progress and a demo wallet will be stored
- The demo wallet root is stored insecurely in a cookie

### How it works

We generate an insecure demonstration private key by hashing date time before adding the key via the underlying AliceNetJs API.

See the snippet below, and please note, this is an **extremely unsecure** method for generating keys.

A more secure method would be to use the AliceNet Wallet to generate keys where cryptographically secure randomness is used. However, this demo does not allow injecting keys to prevent loss of funds and user error.

The method below is strictly used for this demo application:

```
const aliceNetJs = require('aliceNetJs'); // Import AliceNetJs

// Create an AliceNetWallet using aliceNetJs's main constructor with params for (chainID, RpcEndpoint) 
// The chainID will be provided by the RPC if you provide false, but you can provide it here if you like
const aliceNetWallet =  new aliceNetJs(false, "<RPC_ENDPOINT>"); 

// Get current data time in seconds and hash it
// Remember -- This is UNSECURE and for demo purposes only!
let demoPrivateKeyRoot = Date.now(); 
let demoPrivateKey = aliceNetWallet.Utils.hash("0x" + demoPrivateKeyRoot.toString()); 

// Add the private key as an account on the aliceNetWallet object
await aliceNetWallet.Account.addAccount(hash); 

```

The account is now successfully added to the aliceNetWallet instance and [can be funded](/docs/ui-in-depth/fund-a-wallet)

##### Note

Once you generate a demo wallet it will remain as a session cookie until the browser is closed to allow seamless interaction with the demo application.