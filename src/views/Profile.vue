<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId" required disabled>
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input  v-model="user.password" type="password" placeholder="password">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input  v-model="user.nickname" type="text" placeholder="Nickname">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input  v-model.number="user.age" type="text" placeholder="Age">
            </div>
          </div>
          
          <button class="ui huge green fluid button" type="submit">
            更新
          </button>
          
        </form>
      </div>
      
      <button @click="deleteUser" class="ui huge grey fluid button" type="submit">
        退会
      </button>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Profile',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      user:{
        // userId: window.localStorage.getItem('userId'),
        // for debug
        userId: "kento210",
        password: null,
        nickname: null,
        age: null,
      },
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    async submit() {
      // headerを指定する
      const headers = {'Authorization': 'mtiToken'};
      // リクエストボディを指定する
      const { userId, password, nickname, age } = this.user;
      const reqBody = {
        userId,
        password,
        nickname,
        age
      };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + '/user',  {
          method: 'PUT',
          body: JSON.stringify(reqBody),
          headers
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        // 成功時の処理
        console.log(jsonData);
      } catch (e) {
        // エラー時の処理
      }
    },
    
    async deleteUser() {
      
      const headers = {'Authorization':'mtiToken'};
      
      try {
        /* global fetch */
        const res = await fetch(`${baseUrl}/user?userId=${this.user.userId}`,{
        method: 'DELETE',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        // 成功時の処理
        this.$router.push({ name: 'Login'});
        console.log(jsonData);
      } catch (e) {
        // エラー時の処理
      }
    }
  },
  
  created: async function() {
    const headers = {'Authorization': 'mtitoken'};
    
     /* global fetch */
    try{
      const res = await fetch(baseUrl + `/user?userId=${this.user.userId}`,
      {
        method: 'GET',
        headers
      });
      
      const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        // 成功時の処理
        this.user.nickname = jsonData.nickname;
        this.user.age = jsonData.age;
        console.log(jsonData);
      } catch (e) {
        // エラー時の処理
      }
    }
  }
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
