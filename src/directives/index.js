export const imgerror = {
  // 参数1：当前指定所在的dom元素
  // 参数2：指令相关的信息对象
  inserted(el, binding) {
    // 图片加载失败会触发onerror方法
    el.onerror = function () {
      el.src = binding.value
    }
  }
}

export const textcolor = {
  inserted(el, binding) {
    el.style.color = binding.value
  }
}
