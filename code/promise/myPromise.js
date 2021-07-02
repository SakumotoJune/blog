const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';


class MyPromise {
    state = PENDING;
    callbacks = [];
    value = null;
    reason = null;

    constructor(fn) {
        fn(this._resolve.bind(this), this._reject.bind(this));
    }

    _resolve(value) {}

    _rejected(reason) {}

    then (onFulfilled, onRejected) {}

    catch(callback) {}
}