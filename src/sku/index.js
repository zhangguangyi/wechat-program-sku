
Component({
  properties: {
    skuTree: {
      type: Array,
      value: [],
      observer(newVal) {
        const cpNewVal = JSON.parse(JSON.stringify(newVal))
        cpNewVal.forEach(row => {
          row.v.forEach(item => {
            Object.assign(item, {
              selected: false,
              disabled: false
            })
          })
        })
        this.setData({
          cpSkuTree: cpNewVal
        })
        this.judgeAllItem()
      }
    },
    skuList: {
      type: Array,
      value: []
    },
    themeColor: {
      type: String,
      value: '#38ADFF'
    }
  },
  data: {
    cpSkuTree: [],
    // 选择的 sku 组合
    selectedSku: {
    }
  },
  methods: {
    // 点击sku按钮
    selectSku(e) {
      const k = e.currentTarget.dataset.k
      const index = e.currentTarget.dataset.index
      const value = e.currentTarget.dataset.value
      const iindex = e.currentTarget.dataset.iindex
      value.disabled = true
      if (this.data.cpSkuTree[index].v[iindex].disabled) {
        return
      }
      // 勾选或者反选
      const key = `selectedSku.${k.ks}`
      if (!this.data.cpSkuTree[index].v[iindex].selected) {
        // 勾选把值记住
        this.setData({
          [key]: value.id
        })
      } else {
        // 反选把值删掉
        this.setData({
          [key]: ''
        })
      }
      this.setData({
        [`cpSkuTree[${index}].v[${iindex}].selected`]: !this.data.cpSkuTree[index].v[iindex].selected
      })
      this.cancelOption(index, value)
      this.judgeAllItem()
      this.changePic(index, iindex)
      if (this.isAllSelected()) {
        const skuData = this.getSkuComb()
        this.triggerEvent('selectChange', skuData)
      } else {
        this.triggerEvent('selectChange', null)
      }
    },
    /**
     * 取消同一组所有选项
     */
    cancelOption(index, value) {
      const rowList = this.data.cpSkuTree[index].v
      for (let i = 0; i < rowList.length; i++) {
        if (rowList[i].id !== value.id) {
          this.setData({
            [`cpSkuTree[${index}].v[${i}].selected`]: false
          })
        }
      }
    },
    /**
     * 循环判断是否可选
     */
    judgeAllItem() {
      const tree = this.data.cpSkuTree
      for (let i = 0; i < tree.length; i++) {
        const v = tree[i].v
        for (let j = 0; j < v.length; j++) {
          if (this.isSkuChoosable(tree[i].ks, v[j].id)) {
            this.setData({
              [`cpSkuTree[${i}].v[${j}].disabled`]: false
            })
          } else {
            this.setData({
              [`cpSkuTree[${i}].v[${j}].disabled`]: true
            })
          }
        }
      }
      this.getSelectedText()
    },
    /**
     * 判断可选项的库存
     */
    isSkuChoosable(ks, id) {
      const list = this.data.skuList
      const selectedSku = this.data.selectedSku
      // 先假设已经选中剩余按钮
      const matchedSku = Object.assign({}, selectedSku, {
        [ks]: id
      })

      // 将matchedSku中有效的key提取
      const skusToCheck = Object.keys(matchedSku).filter(
        skuKey => matchedSku[skuKey] !== ''
      )
      // 有效key值匹配有多少sku
      const filterSku = list.filter(sku => skusToCheck.every(
        skuKey => matchedSku[skuKey] === sku[skuKey]
      ))
      // 假设按钮包含所有sku的库存数
      const stock = filterSku.reduce((total, sku) => {
        total += sku.stock_num
        return total
      }, 0)
      return stock > 0
    },
    /**
     * 判断是否选完所有规格
     */
    isAllSelected() {
      const selectedSku = this.data.selectedSku
      const selected = Object.keys(selectedSku).filter(
        skuKey => selectedSku[skuKey] !== ''
      )
      return selected.length === this.data.cpSkuTree.length
    },
    /**
     * 获得已经确定的组合
     */
    getSkuComb() {
      const selectedSku = this.data.selectedSku
      const list = this.data.skuList
      const skusToCheck = []
      this.data.cpSkuTree.forEach(item => {
        skusToCheck.push(item.ks)
      })
      const filteredSku = list.filter(sku => (
        skusToCheck.every(skuKey => selectedSku[skuKey] === sku[skuKey])
      ))
      return filteredSku[0]
    },
    /**
     * 修改图片
     */
    changePic(index, iindex) {
      if (index === 0) {
        this.triggerEvent('changePic', this.data.cpSkuTree[index].v[iindex].picUrl)
      }
    },
    // 选择属性文字
    getSelectedText() {
      const selectedSku = this.data.selectedSku
      let text = ''
      Object.keys(selectedSku).forEach(skuKey => {
        const id = selectedSku[skuKey]
        const tree = this.data.cpSkuTree
        for (let i = 0; i < tree.length; i++) {
          const v = tree[i].v
          for (let j = 0; j < v.length; j++) {
            if (v[j].id === id) {
              text = `${text} ${v[j].name}`
            }
          }
        }
      })
      this.triggerEvent('textChange', text)
    }
  }
})
