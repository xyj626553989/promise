const Promise = require("./promise")

// let promise = new Promise((resolve,reject) => {
//     setTimeout(()=> {
//         resolve(111)
//     },1000)
// })
// promise.then(data=>{
//   throw Error("出错了")
// }).then((data)=> {
//     console.log(data)
// }).then(null,(err)=>{
//     console.log("错误：",err)
// })
let a = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2)
        }, 1000)
    })
}
let b = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3)
        }, 2000)
    })
}
Promise.all([a(), b(), 1, 3]).then(data => {
    console.log(data)
},(err)=>{
    console.log(err)
})
