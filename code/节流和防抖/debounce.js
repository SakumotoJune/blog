// 停止触发n秒后，再执行
function debounce(fn ,wait) {
    var timer;
    return function() {
        var args = arguments;
        var that = this;
        if(timer) {
            clearTimeout(timer)
        };
        timer = setTimeout(() => {
            fn.apply(that, args);
        }, wait);
    }
}

// 立即执行后，停止触发n秒才能重新触发
function debounce2(fn, wait) {
    var timer;
    return function() {
        var args = arguments;
        var that = this;
        if(!timer) fn.apply(that, args);
        if(timer) {
            clearTimeout(timer)
        };
        timer = setTimeout(() => {
           timer = null;
        }, wait);
    }
}