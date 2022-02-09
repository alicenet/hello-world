import { useState } from 'react';
import { Button } from 'semantic-ui-react';
import madAdapter from 'adapters/madAdapter';

export function GenerateBurnerAccount(){

    const [address, setAddress] = useState('');

    const createBurnerAccount = async () => {
        let pRaw = new Date().valueOf()
        let hash = await madAdapter.getMadNetWalletInstance().Utils.hash("0x" + pRaw.toString());
        await madAdapter.getMadNetWalletInstance().Account.addAccount(hash, 2)
        setAddress(madAdapter.getMadNetWalletInstance().Account.accounts[0].address)
    }

    return  <div className="text-center">
                <Button size="small" basic onClick={createBurnerAccount} disabled={address}>Generate Burner Wallet</Button>
                <div>{address}</div>
            </div>

}