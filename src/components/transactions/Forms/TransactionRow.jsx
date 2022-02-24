import utils from 'utils';

const getTxType = (type) => {
    switch(type){
        case utils.transaction.transactionTypes.DATA_STORE:
            return 'Data Store'
        case utils.transaction.transactionTypes.VALUE_STORE:
            return 'Value Store'
        default: 
            return 'N/A'
    }
}

export function TransactionRow( { row, index, onClick } ) {
    const { duration, from, key, type, value } = row;
    const txType = getTxType(type);
    return <div> <b>Type:</b> {txType} <b>From:</b> {from} {type === utils.transaction.transactionTypes.DATA_STORE && <><b>Key:</b>{key}</>} <b>Value:</b> {value} {type === utils.transaction.transactionTypes.DATA_STORE && <><b>Duration:</b>{duration} </>} <span className="cursor-pointer text-red-500 ml-3" onClick={() => onClick(index)}>Remove</span> </div>
}