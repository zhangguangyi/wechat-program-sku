Page({
  data: {
    "sku": {
      "tree": [{
        "k": "课时",
        "v": [{
          "id": "29",
          "name": "3课时"
        }, {
          "id": "40",
          "name": "4课时"
        }],
        "ks": "17"
      }],
      "list": [{
        "id": "76",
        "price": "0.05",
        "stock_num": 10,
        "17": "29"
      }, {
        "id": "77",
        "price": "0.05",
        "stock_num": 1,
        "17": "40"
      }]
    },
    theme: '#cccccc'


  },
  selectChange (select) {
    console.log(select)
  }
})
