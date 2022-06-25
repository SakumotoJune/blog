const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';


class MyPromise {
    constructor(fn) {
        // 构造函数传入一定要是函数
        if(typeof fn !== 'function') {
            throw new Error('MyPromise must accept a function as a parameter')
        }
        this._state = PENDING;
        this._value = undefined;
        this._reason = undefined;
        this._fulfilledQueues = [];
        this._rejectedQueues = [];
        // 捕获函数执行过程中产生的错误
        try {
            fn(this._resolve.bind(this), this._reject.bind(this));
        } catch (err) {
            this._reject(err)
        }
        
    }

    _handle(callback) {
        if(this.state === PENDING) {
            this.callbacks.push(callback);
            return;
        }

        let cb = this.state === FULFILLED ? callback.onFulfilled : callback.onRejected;
        if(!cb) {
            cb = this.state === FULFILLED ? callback.resolve : callback.reject;
            cb(this.value);
            return;
        }

        let ret;
        try {
            ret = cb(this.value);
            cb = this.state === FULFILLED ? callback.resolve : callback.reject;
        } catch(error) {
            ret = error;
            cb = callback.reject;
        } finally {
            cb(ret);
        }
    }

    _resolve(val) {
        const run = () => {
            if(this._state !== PENDING) return;

            const runFulfilled = (value) => {
                let cb;
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }

            const runRejected = (error) => {
                let cb;
                while(cb = this._rejectedQueues.shift()) {
                    cb(error);
                }
            }

            if(val instanceof MyPromise) {
                val.then(value => {
                    this._value = value;
                    runFulfilled(value);
                }, err => {
                    runRejected(err);
                })
            } else {
                this.value = val;
                runFulfilled(val);
            }
        }
        //为了支持同步的Promise,采用异步调用
        setTimeout(() => run(), 0);
    }

    _reject(reason) {
        if(this._state !== PENDING) return;
        const run = () => {
            this._state = REJECTED;
            this._value = val;
            let cb;
            while(cb = this._rejectedQueues.shift()) cb(val);
        }
        //为了支持同步的Promise,采用异步调用
        setTimeout(() => run(), 0);
    }

    then (onFulfilled, onRejected) {
        // return new MyPromise((resolve, reject) => {
        //     this._handle({
        //         onFulfilled: onFulfilled || null,
        //         onRejected: onRejected || null,
        //         resolve: resolve,
        //         reject: reject
        //     });
        // });
        const { _value, _state, _reason } = this;
        
        return new Promise((resolveNext, rejectNext) => {
            let fulfilled = value => {
                try {
                    if(typeof onFulfilled !== 'function') {
                        resolveNext(value);
                    } else {
                        let res = onFulfilled(value);
                        if(res instanceof MyPromise) {
                            // 如果当前函数返回MyPromise对象，必须等待其状态改变后再调用
                            res.then(resolveNext, rejectNext)
                        } else {
                            resolveNext(res);
                        }
                    }
                } catch(err) {
                    rejectNext(err)
                }
            }
            
            let rejected = error => {
                try {
                    if(typeof onRejected !== 'function') {
                        rejectNext(error)
                    } else {
                        let res = onRejected(error);
                        if(res instanceof MyPromise) {
                            res.then(resolveNext, rejectNext)
                        } else {
                            resolveNext(res);
                        }
                    }
                } catch(err) {
                    rejectNext(error)
                }
            }
            switch(_state) {
                case PENDING:
                    this._fulfilledQueues.push(onFulfilled);
                    this._rejectedQueues.push(onRejected);
                    break;
                case FULFILLED:
                    fulfilled(_value);
                    break;
                case REJECTED:
                    rejected(_reason);
                    break;
            }
        });
    }

    catch(onError) {
        return this.then(null, onError);
    }

    finally(onDone) {
        if(typeof onDone !== 'function') return this.then();
        let Promise = this.constructor;
        return this.then(
            value => Promise.resolve(onDone()).then(() =>  value),
            reason => Promise.resolve(onDone()).then(() =>  { throw reason })
        );
    }

    static reject(value) {
        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise((resolve, reject) => {
              then(reject);
            });
        } else {
            return new Promise((resolve, reject) => reject(value));
        }
    }

    static resolve(value) {
        if (value && value instanceof MyPromise) {
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new MyPromise((resolve, reject)=> {
                then(resolve, reject);
            });
        } else if (value) {
            return new MyPromise(resolve => resolve(value));
        } else {
            return new MyPromise(resolve => resolve());
        }
    }
}