data(){
  return{
    pagination: {}
  }
},
mounted() {
  this.getProduct()
},
methods:{
  getProduct(page = 1){
    const api = `${this.apiUrl}/api/${this.path}/admin/products?page=${page}`;
    this.pagination = res.data.pagination;
  }
}