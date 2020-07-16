// const Promise = require('./promise')

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
// let a = function () {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(2)
//     }, 1000)
//   })
// }
// let b = function () {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(3)
//     }, 2000)
//   })
// }
// Promise.race([a(), b()]).then(
//   (data) => {
//     console.log(data)
//   },
//   (err) => {
//     console.log(err, 'err')
//   }
// )
Promise.try = function (fn) {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn())
    } catch (error) {
      reject(error)
    }
  })
}

function test() {
  throw '222'
  //   return new Promise((resolve, reject) => {
  //     reject(11)
  //   })
}
Promise.try(function () {
  test()
})
  .then((err) => {
    console.log(err, '111')
  })
  .catch((err) => {
    console.log(err)
  })
