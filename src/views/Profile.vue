<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <!--更新失敗メッセージ-->
        <div class="ui negative message" v-if="errorMsg">
          <i class="remove icon"></i>
          <i class="close icon" @click="clearMsg"></i>
          <div class="header">
            {{ errorMsg }}
          </div>
        </div>
        
        <!--更新成功メッセージ-->
        <div class="ui positive message" v-if="successMsg">
          <i class="checkmark icon"></i>
          <i class="close icon" @click="clearMsg"></i>
          <div class="header">
            {{ successMsg }}
          </div>
        </div>
        
        <!-- ここにセグメントの中身を記述する -->
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icom input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId" required disabled />
            </div>
          </div>

          <div class="field">
            <div class="ui left icom input">
              <i class="lock icon"></i>
              <input v-model="user.password" type="password" placeholder="Password" />
            </div>
          </div>

          <div class="field">
            <div class="ui left icom input">
              <i class="tag icon"></i>
              <input v-model="user.nickname" type="text" placeholder="Nickname" />
            </div>
          </div>

          <div class="field">
            <div class="ui left icom input">
              <i class="calendar icon"></i>
              <input v-model.number="user.age" type="text" placeholder="Age" />
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
  // 必要なものはここでインポートする
  // @は/srcの同じ意味です
  // import something from '@/components/something.vue';
  import { baseUrl } from '@/assets/config.js';

  const headers = { 'Authorization': 'mtiToken' };

  export default {
    name: 'Profile',

    components: {
      // 読み込んだコンポーネント名をここに記述する
    },

    data() {
      // Vue.jsで使う変数はここに記述する
      return {
        user: {
          userId: window.localStorage.getItem('userId'),
          password: null,
          nickname: null,
          age: null,
        },
        errorMsg:"",
        successMsg:"",
      };
    },

    computed: {
      // 計算した結果を変数として利用したいときはここに記述する
    },

    created: async function() {
      try {
        /* global fetch */
        const res = await fetch(baseUrl + `/user?userId=${this.user.userId}`, {
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
        //成功時の処理
        this.user.nickname = jsonData.nickname;
        this.user.age = jsonData.age;
      }
      catch (e) {
        //エラー時の処理
      }
    },

    methods: {
      // Vue.jsで使う関数はここで記述する
      clearMsg(target) {
        if (target === 'error') {
          this.errorMsg = ``;
        } else {
          this.successMsg = ``;
        }
      },
      
      //編集ボタン
      async submit() {
        //リクエストボディを指定する
        const { userId, password, nickname, age } = this.user;
        //送るデータ
        const requestBody = {
          userId,
          password,
          nickname,
          age,
        };

        try {
          /* global fetch */
          const res = await fetch(baseUrl + '/user', {
            method: 'PUT',
            body: JSON.stringify(requestBody),
            headers
          });

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {}

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }
          //成功時の処理
          console.log(jsonData);
          this.successMsg = 'ユーザーの更新が完了しました'
        }
        catch (e) {
          // エラー時の処理
          this.errorMsg = `ユーザーの更新時にエラーが発生しました:${e}`;
        }
      },

      //削除ボタン
      async deleteUser() {
        try {
          /* global fetch */
          const res = await fetch(`${baseUrl}/user?userId=${this.user.userId}`, {
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

          // アカウント自体が消えるので、ログイン情報も破棄する
          window.localStorage.clear();
          this.$router.push({ name: 'Login' });
        }
        catch (e) {
          //エラー処理
          this.errorMsg = `ユーザーの削除時にエラーが発生しました:${e}`;
        }
      }
    }
  }
</script>

<style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
</style>
