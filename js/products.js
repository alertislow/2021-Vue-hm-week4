// ESM 載入 
// Vue3 esm.cdn
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';
// import modal from './modal.js';

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
  // 區域註冊元件 components
  components: {
    pagination,
    // modal,
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
    
    // 更新產品Modal的內容，取得後更新產品列表以及關閉Modal
                  // 內層元件傳入參數
    updateProduct(tempProduct) {
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
      // 使用元件時改用參數的方式傳遞，this.tempProduct改為 tempProduct
      axios[method](url,{data: tempProduct})
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
//app.component('pagination',) //元件封裝後 改為區域註冊 import pagination

// 新增/編輯產品元件
app.component('productModal',{
  template:`<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span >新增產品</span>
          <span >編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <!-- 單圖新增 -->
            <div class="form-group">
              <label for="imageUrl">主要圖片</label>
              <input type="text" class="form-control" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl" id="imageUrl">
              <img class="img-fluid" :src="tempProduct.imageUrl">
            </div>
            <!-- 多圖新增 -->
            <div class="mb-1">多圖新增</div>
            <!-- 判斷teamProduct內的imagesUrl是否是陣列 -->
            <!-- 是的話顯示陣列區塊 -->
            <div v-if="Array.isArray(tempProduct.imagesUrl)">
              <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                <div class="form-group">
                  <label for="imageUrl">圖片網址</label>
                  <!-- 綁定tempProduct內imageUrl的索引位址 -->
                  <input type="text" class="form-control"
                    placeholder="請輸入圖片連結" v-model="tempProduct.imagesUrl[key]">
                </div>
                <img class="img-fluid" :src="image">
              </div>
              <!-- 判斷tempProduct長度為0或是在編輯的最後一個陣列位址是否有內容，是0或有內容就不顯示刪除圖片按鈕 -->
              <!-- 陣列從0開始 最後一個為長度-1 -->
              <div
                v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]"
              >
              <!-- .push新增圖片到陣列 -->
                <button class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="tempProduct.imagesUrl.push('')"
                  >
                  新增圖片
                </button>
              </div>
              <!-- .pop為把陣列最後一筆資料砍掉 -->
              <div v-else>
                <button class="btn btn-outline-danger btn-sm d-block w-100"
                  @click="tempProduct.imagesUrl.pop()">
                  刪除圖片
                </button>
              </div>
            </div>
            <!-- 判斷teamProduct內的imagesUrl不是陣列 -->
            <!-- 不是的話顯示新增陣列圖片 -->
            <div v-else>
              <button class="btn btn-outline-primary btn-sm d-block w-100"
                @click="createImages"
                >
                新增陣列圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                  placeholder="請輸入分類">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0"
                  class="form-control" placeholder="請輸入原價">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                  placeholder="請輸入售價">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                placeholder="請輸入產品描述">
            </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                placeholder="請輸入說明內容">
            </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                  :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click.prevent="$emit('update-product',tempProduct)">
          確認
        </button>
      </div>
    </div>
  </div>
</div>`,
  // 外層與內層的名稱都取為 tempProduct
  props:['tempProduct'],
  methods: {
    // 新增陣列圖片
    createImages() {
      this.tempProduct.imagesUrl = [
        ''
      ]
    },
  },
})
// 刪除產品元件
app.component('delProductModal',{

})
app.mount('#app');