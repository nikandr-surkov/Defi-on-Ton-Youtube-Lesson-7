import "@stdlib/deploy";

contract ReceiveCoins with Deployable {

    val: Int as int64;

    init() {
        self.val = 0;        
    }

    // receive empty message, these are usually simple TON coin transfers to the contract
    receive() {
        dump("empty message received");
        // revert the transaction if balance is growing over 3 TON
        require(myBalance() <= ton("3"), "Balance getting too high");
    }

    receive("increment") {
        // print how much TON coins were sent with this message
        dump(context().value);
        self.val = self.val + 1;
    }

    receive("refunding increment") {
        // print how much TON coins were sent with this message
        dump(context().value);
        self.val = self.val + 1;
        // return all the unused excess TON coins on the message back to the sender with a textual string message
        self.reply("increment refund".asComment());
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun val(): Int {
        return self.val;
    }
}
