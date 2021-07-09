// 计时器，过了wait之后执行一次
function throttleByTimer(fn, wait) {
    var timer;
    return function() {
        if(!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.call(this, arguments)
            }, wait);
        }
    }
}

// 计算时间差，立刻执行一次，之后要再wait秒之后再触发才可以再次执行
function throttleByRemain(fn, wait) {
    let previous = 0;
    return function() {
        let now = +new Date();
        let remain = wait - (now - previous);
        if(remain < 0) {
            previous = now;
            fn.call(this, arguments);
        }
    }
}

// 结合版，立即执行一次，等时间到达后，再执行一次最后那次触发的
function throttle(fn, wait) {
    let timer;
    let previous = 0;
    return function() {
        var that = this;
        var args = arguments;
        let now = +new Date();
        let remain = wait - (now - previous);
        if(remain < 0) {
            if(timer) clearTimeout(timer);
            previous = now;
            fn.call(that, args);
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.call(that, args);
                timer = null;
            }, remain);
        }
    }
}