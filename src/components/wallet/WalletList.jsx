import madAdapter from 'adapters/madAdapter';

export function WalletList(){
    if(madAdapter.getMadNetWalletInstance().Account.accounts.length === 0)
        return <>No accounts</>
    return <>{madAdapter.getMadNetWalletInstance().Account.accounts.map(w => <div>{w.address}</div>)}</>;
}