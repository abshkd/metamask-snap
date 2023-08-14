import { Json, OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

/**
 * Analyze a transaction.
 *
 * @param transaction - The transaction to analyze.
 * @param chainId - The chain ID of the transaction.
 * @param origin - The origin of the transaction.
 * @returns The result of the analysis.
 */
async function analyze(transaction: Json, chainId: string, origin?: string) {
  const rawresponse = await fetch('https://api.wicked.us/process', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      trx: transaction,
      chainId,
      origin,
    }),
  });

  return rawresponse.json();
}

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  const resp = await analyze(transaction, chainId, transactionOrigin);

  // Return the result of the analysis.
  return {
    content: panel([
      heading(`Transaction Risk - ${resp.result}`),
      text(
        `Address: ${resp.address.result} 
         ${resp.address.is_contract ? '(Contract)' : ''} ${
          resp.address.tags || ''
        }`
      ),
      text(`Blockchain: ${resp.chain.name} Info: ${resp.chain.result}`),
      text(`App: ${resp.origin.result || ''} ${resp.origin.tags || ''}`),
    ]),
  };
};
