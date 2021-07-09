// 一个请求接着一个请求

function promiseOneByOne(pArr) {
    let p = Promise.resolve();
    for(let i = 0; i < pArr.length; i++) {
        p = p.then(() => {
            return pArr[i];
        })
    }
    return p;
}

// 最多同时limit个请求
function promiseByLimit(pArr, limit) {
    var index = limit;
    function addNewPromise() {
        index++;
        return pArr[index - 1].then(() => addNewPromise());
    }

    for(let i = 0; i < limit; i++) {
        pArr[i].then(() =>  addNewPromise());
    }
}