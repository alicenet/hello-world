import React, { useMemo } from 'react';
import { Button, Container, Grid, Icon, Popup, Message } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import utils from 'utils';
import _ from 'lodash';
import { ADAPTER_ACTIONS } from 'redux/actions';

export function TransactionsList(){
    const { list, fees } = useSelector(state => ({
        list: state.transaction.list,
        fees: state.transaction.fees,
    }));

    const dispatch = useDispatch();

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

    const TransactionRow = ( { row } ) => {
        const { duration, from, key, type, value } = row;
        const txType = getTxType(type);
        return <div> <b>Type:</b> {txType} <b>From:</b> {from} {type === utils.transaction.transactionTypes.DATA_STORE && <><b>Key:</b>{key}</>} <b>Value:</b> {value} {type === utils.transaction.transactionTypes.DATA_STORE && <><b>Duration:</b>{duration}</>} </div>
    }

    const handleSendTransaction = async () => {
        // Send the TX via the main tx action -- Just fire it off, latest TX will appear in transaction reducer as lastSentAndMinedTx
        dispatch(ADAPTER_ACTIONS.sendTransactionReducerTXs())
        //dispatch(TRANSACTION_ACTIONS.toggleStatus());
    };

    const valueStoreTotal = useMemo(() => {
        let total = 0;
        list.forEach(tx => {
            if (tx.type === utils.transaction.transactionTypes.VALUE_STORE) {
                total += parseInt(tx.value);
            }
        })
        return total;
    }, [list])

    const TxFeesDisplay = ({ feesLabel, feesAmount, tooltipText }) => (
        <div className="flex text-xs justify-between">
            <div className="font-bold w-24 text-left">{`${feesLabel}:`}</div>
            <div className="flex flex-shrink gap-1">
                <div className="text-gray-500">{`${feesAmount} MadBytes`}</div>
                <Popup
                    content={tooltipText}
                    size="mini"
                    className="w-60"
                    position="top right"
                    trigger={
                        <Icon name="question circle" className="cursor-pointer"/>
                    }
                />
            </div>
        </div>
    );


    return <div>
                <div>{list.length === 0 && <div>No transactions</div>}</div>
                <div className="mb-10">
                    {list.map(t => <TransactionRow row={t} key={_.uniqueId()}/>)}
                </div>
                {list.length > 0 &&
                    <div>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column></Grid.Column>
                                <Grid.Column className="p-0 flex flex-col justify-between gap-2">

                                    <Container className="flex flex-col gap-1">
                                        {fees.errors.map((err) => <Message size="mini" error content={err}/>)}

                                        <TxFeesDisplay tooltipText="The minimum + prioritization + changeout(+1)" feesLabel="Tx Fee" feesAmount={fees.txFee}/>
                                        <TxFeesDisplay tooltipText="The sum of the cost of each store and deposits" feesLabel="Store Fees" feesAmount={fees.dataStoreFees + fees.valueStoreFees}/>
                                        <TxFeesDisplay tooltipText="The sum of any value moved" feesLabel="Value" feesAmount={valueStoreTotal}/>
                                        <TxFeesDisplay tooltipText="The total TX Cost" feesLabel="Total Cost" feesAmount={fees.totalFee + valueStoreTotal}/>

                                    </Container>

                                    <Button
                                        color={fees.errors?.length > 0 ? "red" : "teal"}
                                        content="Send Transaction"
                                        disabled={_.isEmpty(list) || fees.errors?.length > 0}
                                        onClick={handleSendTransaction}
                                        className="m-0"
                                    />

                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                }
            </div>
}