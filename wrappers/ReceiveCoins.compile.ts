import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/receive_coins.tact',
    options: {
        debug: true
    }
};
