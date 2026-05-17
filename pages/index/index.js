// pages/index/index.js
Page({
  data: {
    // 预设的颜色数组
    colors: [
      { color: '#FF6B6B', name: '珊瑚红' },
      { color: '#4ECDC4', name: '薄荷绿' },
      { color: '#45B7D1', name: '天空蓝' },
      { color: '#96CEB4', name: '抹茶绿' },
      { color: '#FFEAA7', name: '柠檬黄' },
      { color: '#DDA0DD', name: '薰衣草紫' },
      { color: '#F8B500', name: '向日葵橙' },
      { color: '#FF69B4', name: '粉色' }
    ],
    currentColor: '#FF6B6B',
    colorName: '珊瑚红',
    currentIndex: 0
  },

  onLoad() {
    // 初始化颜色
    this.setData({
      currentColor: this.data.colors[0].color,
      colorName: this.data.colors[0].name,
      currentIndex: 0
    })
  },

  // 切换颜色
  switchColor() {
    const { colors, currentIndex } = this.data
    // 计算下一个颜色的索引（循环切换）
    const nextIndex = (currentIndex + 1) % colors.length
    const nextColor = colors[nextIndex]
    
    this.setData({
      currentColor: nextColor.color,
      colorName: nextColor.name,
      currentIndex: nextIndex
    })
  }
})
