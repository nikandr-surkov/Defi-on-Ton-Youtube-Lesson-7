import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { ReceiveCoins } from '../wrappers/ReceiveCoins';
import '@ton/test-utils';

describe('ReceiveCoins', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let receiveCoins: SandboxContract<ReceiveCoins>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        receiveCoins = blockchain.openContract(await ReceiveCoins.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await receiveCoins.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: receiveCoins.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and receiveCoins are ready to use
    });

    it('should receive TON coins (empty message)', async () => {
        let balance = await receiveCoins.getBalance();
        console.log(`Balance before empty message: ${balance}`);

        const sendResult = await receiveCoins.send(
            deployer.getSender(),
            {
                value: toNano('3')
            },
            null
        );

        expect(sendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: receiveCoins.address,
            success: true
        });

        balance = await receiveCoins.getBalance();
        console.log(`Balance after empty message: ${balance}`);

        // Additional checks for empty message
        expect(balance).toBeLessThanOrEqual(toNano('3'));
    });

    it('should handle increment message', async () => {
        let balance = await receiveCoins.getBalance();
        console.log(`Balance before increment message: ${balance}`);

        const sendResult = await receiveCoins.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            'increment'
        );

        expect(sendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: receiveCoins.address,
            success: true
        });

        balance = await receiveCoins.getBalance();
        console.log(`Balance after increment message: ${balance}`);
    });

    it('should handle refunding increment message', async () => {
        let balance = await receiveCoins.getBalance();
        console.log(`Balance before refunding increment message: ${balance}`);

        const sendResult = await receiveCoins.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            'refunding increment'
        );

        expect(sendResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: receiveCoins.address,
            success: true
        });

        balance = await receiveCoins.getBalance();
        console.log(`Balance after refunding increment message: ${balance}`);

        const val = await receiveCoins.getVal();
        expect(val).toBe(1n);

        // Ensure refund transaction is included
        expect(sendResult.transactions).toHaveTransaction({
            from: receiveCoins.address,
            to: deployer.address,
            success: true
        });
    });

});
