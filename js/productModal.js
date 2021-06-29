export default {
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
              <input type="text" class="form-control"
               placeholder="請輸入圖片連結"  v-model="product.imageUrl" id="imageUrl" >
              <img class="img-fluid" :src="product.imageUrl">
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
}