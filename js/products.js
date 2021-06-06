// ESM 載入 
// Vue3 esm.cdn
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = {}; 
let delProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      path: 'dogezad',
      products: [],
      tempProduct: {   // 修改產品時的預設結構
        imagesUrl: [],
      },
      isNew: false, 
      pagination: {}, // 分頁內容
    }
  },
  // 取得資料以及抓到DOM元素會在 mounted 執行
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    // Bootstrap 實體
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    // productModal.show();
    this.getData();
  },
  methods: {
              // 頁面參數預設值
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.path}/admin/products?page=${page}`;

      axios.get(url)
        .then(res =>{
          console.log('取得產品列表',res);
          if(res.data.success) {
            const { products,pagination } = res.data;
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }else {
            alert(res.data.message);
            window.location = 'login.html';
          }
        })
    },
    // 修改以及建立商品的 Modal
    modalProduct(isNew,item) {
      this.isNew = isNew;
      if(this.isNew === 'new') {
        this.tempProduct = {  
          // imagesUrl : [],
        };
        productModal.show();
      } else if(this.isNew ==='edit'){
        // this.tempProduct = item; 傳參考性質會使他自行更改資料內的內容
        this.tempProduct = {...item}; // 使用淺層拷貝改善
        productModal.show();
      } else if (this.isNew === 'del') {
        this.tempProduct = {...item};
        delProductModal.show();
      }
    },
    // 新增陣列圖片
    createImages() {
      this.tempProduct.imagesUrl = [
        ''
      ]
    },
    // 更新產品Modal的內容，取得後更新產品列表以及關閉Modal
    updateProduct() {
      // 建立商品的更新
      let url = `${this.apiUrl}/api/${this.path}/admin/product`
      let method = 'post';
      // 修改商品的更新
      if (this.isNew === 'edit'){
        url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`
        method = 'put';
      }
      // 資料要用 "data{}" 包起來
      // []能以變數的方式取到值，object的屬性一律是字串
      axios[method](url,{data: this.tempProduct})
        .then(res=>{
          if (res.data.success){
            this.getData();
            productModal.hide();
          }
          console.log(res);
        })
    },
    // 刪除產品   
    delProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then(res =>{
          console.log('刪除結果',res)
          if(res.data.success){
            alert(res.data.message);
            delProductModal.hide();
            this.getData();
          } else {
            alert(res.data.message);
          }
        });
    }
  },
});

/*-------------------定義全域的元件--------------------- */
// 分頁元件
app.component('pagination',{
  props: ['page'],
  template:`<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled': !page.has_pre}">
      <a class="page-link" href="#" aria-label="Previous"
      @click.prevent="$emit('get-data', page.current_page-1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" 
    :class="{ 'active': item === page.current_page }"
    v-for="item in page.total_pages" :key="item">
    <a class="page-link" href="#" @click.prevent="$emit('get-data',item)">{{ item }}</a>
    </li>
    <li class="page-item" :class="{'disabled': !page.has_next}">
      <a class="page-link" href="#" aria-label="Next"
      @click.prevent="$emit('get-data', page.current_page+1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`,
  // 使用生命週期來查看page的變化
  created() {
    console.log(this.page);
  }
})
// 新增/編輯產品元件
app.component('productModal',{

})
// 刪除產品元件
app.component('delProductModal',{

})
app.mount('#app');