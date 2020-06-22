const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
class Promise {
    constructor(execute) {
        this.value = undefined;
        this.reason = undefined
        this.state = PENDING
        this.onFulfilledCallback = []
        this.onRejectedCallback = []
        let resolve = (value) => {
            if (this.state === PENDING) {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                }
                this.value = value
                this.state = FULFILLED
                this.onFulfilledCallback.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if (this.state === PENDING) {
                this.reason = reason
                this.state = REJECTED
                this.onRejectedCallback.forEach(fn => fn())
            }
        }
        try {
            execute(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    catch (callback) {
        this.then(null, callback)
    }
    finally (callback) {
        this.then((value) => {
            callback()
            return value
        }, (r) => {
            callback()
            return r
        })
    }
    then (onFulfilled, onRejected) {
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : v => v
        onRejected = isFunction(onRejected) ? onRejected : r => { throw r }
        let promise2 = new Promise((resolve, reject) => {
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            if (this.state === PENDING) {
                this.onFulfilledCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
            }
        })
        return promise2
    }
}
function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError("类型错误"))
    }
    let called = false
    if ((typeof x === "object" && x !== null) || isFunction(x)) {
        try {
            let then = x.then
            if (isFunction(then)) {
                then.call(x, (y) => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {

        resolve(x)
    }
}
function isFunction (fn) {
    return typeof fn === "function"
}
// module.exports = Promise
// Promise.deferred = function () {
//     let dfd = {};
//     dfd.promise = new Promise((resolve, reject) => {
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     })
//     return dfd;
// }
module.exports = Promise;

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let result = []
        let i = 0
        let s = (value, index) => {
            result[index] = value
            if (++i === promises.length) {
                resolve(result)
            }
        }
        promises.forEach((promise, index) => {
            if ((typeof promise === "object" && promise !== null) && typeof promise.then === "function") {
                promise.then((value) => {
                    s(value, index)
                }, reject)
            } else {
                s(promise, index)
            }
        })
    })
}
