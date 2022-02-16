import { useState } from 'react';
import { Button } from 'semantic-ui-react';
import madAdapter from 'adapters/madAdapter';
import { WALLET_ACTIONS } from 'redux/actions';
import { useSelector, useDispatch } from 'react-redux';

export function GenerateBurnerAccount(){

    const [address, setAddress] = useState('');

    const dispatch = useDispatch();
    const { wallets } = useSelector(state => ({ wallets: state.wallet.wallets }))

    const createBurnerAccount = async () => {
        let pRaw = new Date().valueOf();
        let hash = await madAdapter.getMadNetWalletInstance().Utils.hash("0x" + pRaw.toString());
        await madAdapter.getMadNetWalletInstance().Account.addAccount(hash);
        const newAddress = madAdapter.getMadNetWalletInstance().Account.accounts[madAdapter.getMadNetWalletInstance().Account.accounts.length-1].address;
        setAddress(newAddress);
        dispatch(WALLET_ACTIONS.addWallet(newAddress));
    }

    const removeAccount = async (wallet) => {
        await madAdapter.getMadNetWalletInstance().Account.removeAccount(wallet);
        setAddress('');
        dispatch(WALLET_ACTIONS.removeWallet(wallet));
    }

    return  <div className="text-center">
                {wallets.map(wallet => <div>{wallet} <span className="cursor-pointer text-red-500" onClick={() => removeAccount(wallet)}>Remove</span></div>)}
                <Button size="small" basic onClick={createBurnerAccount}>Generate Burner Wallet</Button>
                <div>{address ? `Created account: ${address}`: ''}</div>
            </div>

}