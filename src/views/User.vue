<template>
  <div>
    <div class="ui main container">
      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label for="nickname">ユーザー名</label>
            <input v-model="nickname" type="text" name="nickname" placeholder="Nickname"/>
          </div>
          
          <div class="field">
            <label>年齢</label>
            <div class="inline fields">
              <div class="field">
                <input v-model.number="start" type="text" name="agestart" placeholder="0"/>
                <label for="agestart">歳から</label>
              </div>
              
              <div class="field">
                <input v-model.number="end" type="text" name="ageend" placeholder="100"/>
                <label for="ageend">歳まで</label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- ユーザー一覧 -->
      <ul class="ui three column grid">
        <template v-for="(item, index) in filterUsers" :key="index">
          <li class="column">
            <div class="ui card fluid">
              <div class="content">
                <h2 class="header">
                  {{ item.nickname }}
                  <span class="ui green label">{{ item.age }}</span>
                </h2>
                <span class="meta">{{ item.userId }}</span>
              </div>
            </div>
          </li>
        </template>
      </ul>
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
    name: 'User',

    components: {
      // 読み込んだコンポーネント名をここに記述する
    },

    data() {
      // Vue.jsで使う変数はここに記述する
      return {
        users: [],
        nickname: "",
        start: "",
        end: "",
      };
    },

    computed: {
      // 計算した結果を変数として利用したいときはここに記述する
      filterUsers() {
        let result = this.users;
        if (this.nickname) {
          result = result.filter(target => {
            return target.nickname.match(this.nickname);
          });
        }
        if (this.start) {
          result = result.filter(target => {
            return target.age >= this.start;
          });
        }
        if (this.end) {
          result = result.filter(target => {
            return target.age <= this.end;
          });
        }
        return result;
      }
    },

    created: async function() {
      this.isCallingApi = true;
      try {
        /* global fetch */
        const res = await fetch(baseUrl + '/users', {
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
        this.users = jsonData.users ?? [];
      }
      catch (e) {
        //エラー時の処理
      }
    },

    methods: {
      // Vue.jsで使う関数はここで記述する
    }
  }
</script>

<style scoped>
  /* このコンポーネントだけに適用するCSSはここに記述する */
</style>
