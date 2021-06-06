import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
  data(){     // 資料
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io',
      path: 'dogezad',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {  //函式的集合，方法
    login() {
      const api = `${this.apiUrl}/admin/signin`;
      axios.post(api,this.user)
        .then(res =>{
          if(res.data.success){
            const { token, expired } = res.data;
            // 物件解構賦值
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
            window.location = 'products.html';
          }else {
            alert(res.data.message);
            this.user.password='';
          }
        }).catch(err =>{
          console.log(err);
        });
    },
  },
});
app.mount('#app');
