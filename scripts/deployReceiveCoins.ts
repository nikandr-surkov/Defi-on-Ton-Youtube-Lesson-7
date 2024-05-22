import { toNano } from '@ton/core';
import { ReceiveCoins } from '../wrappers/ReceiveCoins';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const receiveCoins = provider.open(await ReceiveCoins.fromInit());

    await receiveCoins.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(receiveCoins.address);

    // run methods on `receiveCoins`
}
