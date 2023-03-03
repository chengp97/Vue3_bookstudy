// 用一个全局变量存储被注册的副作用函数
let activeEffect
// effect 函数用于注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
}
// 存储副作用函数的桶
const bucket = new Set()
// 原始数据
const data = { text: 'hello world' } // 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作 
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中 
    if (activeEffect) {
      bucket.add(activeEffect)
    }
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行 
    bucket.forEach(fn => fn())
    // 返回 true 代表设置操作成功 
    return true
  }
})
effect(
  () => {
    console.log('effect run')
    document.body.innerText = obj.text
  }
)

