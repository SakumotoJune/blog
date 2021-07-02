# Promise

## 基本概念

 一个对象，处理异步操作。

三个状态：pending、fulfilled、rejected

特点：

1. 对像状态不受外界影响。
2. 状态一旦改变，就不会再改变。
3. 一旦新建，就立即执行，无法取消。

## 基本用法

Promise的构造函数接受一个函数作为参数，该函数有两个参数resolve和reject。
实例生成之后，用then分别指定resolved和rejected的回调函数。
resolve和reject带参数，他们的参数会传递给回调函数。

**resolve的参数除了正常值以外还可以是一个promise对象。**

如果p1作为参数传给p2的resolve，p1的状态会传给p2，即决定了p2的状态。p1是pending的时候，p2也是pending；如果p1改变状态，resolved或者rejected，p2的回调函数会立刻执行。

**resolve或reject并不会中介Promise的参数函数的执行。**

### Promise.prototype.then(onFulfilled, onRejected)

then方法返回的是一个实例，因此Promise的then是链式调用的。

    Promise1.then(function(json) {
        return value1;
    }).then(function(post) {
        //...
    }, function(err) {
        //...
    });

上面第一个then的回调函数的返回值，会作为参数传入第二个回调函数。

* 如果value1是普通值，则立刻调用第二个then的回调函数，并且状态为fulfilled；
* 如果value1是一个promise，则会等待promise的状态发生变化才会被调用。且第二个then调用哪个回调取决于value1的状态。
* 如果then1不返回，状态也是fulfilled，value是undefined

### Promise.prototype.catch()

.then(null. onRejected)的别名，用于指定发生错误时的回调函数。

异步操作与then的回调函数中抛出的错误都会被catch捕捉。（或者是没被处理的reject）。

如果promise状态变成resolved，抛出错误无效。

promise中的错误不会影响外层。

catch返回的是一个promise，所以又可以接then。

    Promise.resolve()
    .catch(function(error) {
        console.log('error', error);
        return 'catch';
    }).then(function (value) {
        console.log('carry on', value)
    });

catch中的return不会传给下面的then。

### Promise.prototype.finally()

finally是不管promise对象状态如何，都会执行的操作。

    promise.finally(() => {
        // 语句
    });

    //等同于
    promise.then(result => {
        // 语句
        return result;
    }, error => {
        // 语句
        throw error;
    });

finally的回调函数不接受参数。

### Promise.all()

将多个promise包装成一个新的promise实例。参数如果不是promise,会调用promise.resolve()将参数转为promise。

    const p = Promise.all([p1, p2, p3]);

p的状态由p1,p2,p3决定，分：

* 只有p1,p2,p3的状态都变成fulfilled，p的状态才会变fulfilled，此时p1,p2,p3的返回值，会传递给p的回调函数。
* 只有p1,p2,p3之中只有一个被rejected，p的状态就会rejected。第一个被rejected会传给p的回调。

### Promise.race()

将多个promise包装成一个新的promise实例。

    const p = Promise.all([p1, p2, p3]);

* p1,p2,p3只有一饿改变状态，p的状态跟着改变。

### Promise.allSettled()

接受一组promise实例作为参数，包装成一个新的promise实例。等到所有实例都返回结果，新的promise才会结束。状态只会变成fulfilled。

    const allSettledPromise = Promise.allSettled([resolved, rejected]);

    allSettledPromise.then(function(results) {
        // [
        //    { status: 'fulfilled', value: 42 },
        //    { status: 'rejected', reason: -1 }
        // ]
    });

如果我们不关心异步操作的结果，而是想保证所有都结束，这个就很适用。

### Promise.any()

接受一组promise实例作为参数，包装成一个新的Promise实例返回。只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态，如果所有参数实例都变成rejected，包装实例就会变成rejected。

### Promise.resolve()

将现有对象转为promise对象：

* 参数是一个Promise实例，不做任何修改，返回
* 参数是一个thenable对象,会将这个对象转为promise对象，然后立即执行thenable中的then方法。
    let thenable = {
        then: function(resolve, reject) {
            resolve(42);
        }
    };
    let p1 = Promise.resolve(thenable);
    p1.then(function(value) {
        console.log(value);
    });
* 参数不是具有then()方法的对象或者根本不是对象，则返回一个resolved且value为参数的promise。
* 不带任何参数，直接返回一个resolved状态的promise对象。

### Promise.reject()

类似resolve，但是返回的是rejected的promise。

**Promise的实现和Promise的使用，代码在code。**
