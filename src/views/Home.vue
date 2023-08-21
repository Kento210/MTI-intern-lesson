<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

      <!--新しく投稿する-->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="postArticle">
          <div class="field">
            <div class="ui input">
              <textarea v-model="post.text" placeholder="投稿内容を入力"></textarea>
            </div>
          </div>
          <div class="field">
            <div class="ui grid">
              <div class="two column row">
                <div class="column" style="flex: 2">
                  <label for="article-category">カテゴリー</label>
                </div>
                <div class="column" style="flex: 8">
                  <input v-model="post.category" type="text" placeholder="カテゴリーを入力">
                </div>
                <div class="column" style="flex: 3">
                  <button class="ui green button" type="submit" v-bind:disabled="isPostButtonDisabled">
                    投稿
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- 投稿一覧 -->
      <h1 class="ui dividing header">投稿一覧</h1>
      <div class="ui segment">
        <ul class="ui comments divided article-list">
          <template v-for="(article, index) in articles" :key="index">
            <li class="comment">
              <div class="content">
                <span class="author">{{ article.userId }}</span>
                <div class="metadata">
                  <span class="date">{{
                    convertToLocaleString(article.timestamp)
                  }}</span>
                </div>
                <p class="text">
                  {{ article.text }}
                </p>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // 必要なものはここでインポートする
  // @は/srcと同じ意味です
  // import something from '@/components/something.vue';
  import { baseUrl } from '@/assets/config.js';

  const headers = { 'Authorization': 'mtiToken' };

  export default {
    name: 'Home',

    components: {
      // 読み込んだコンポーネント名をここに記述する
    },

    data() {
      // Vue.jsで使う変数はここに記述する
      return {
        post: {
          text: null,
          category: null,
        },
        search: {
          userId: null,
          category: null,
          start: null,
          end: null,
        },
        articles: [],
        iam: null,
      };
    },
    computed: {
      // 計算した結果を変数として利用したいときはここに記述する
      isPostButtonDisabled() {
        return !this.post.text;
      },
    },

    created: async function() {
      // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
      // apiからarticleを取得する

      //最初にtokenがあるか確認してなければ自動的にloginに移動する
      var tokenString = window.localStorage.getItem('token');
      if (
        window.localStorage.getItem("userId") &&
        window.localStorage.getItem("token")
      ) {
        this.iam = window.localStorage.getItem("userId");
        await this.getArticles();
      }
      else {
        window.localStorage.clear();
        this.$router.push({ name: "Login" });
      }
    },

    methods: {
      // Vue.jsで使う関数はここで記述する
      // isMyArticle(id) {}, // 自分の記事かどうかを判定する
      // 記事一覧を取得する
      async getArticles() {
        
        try {
          const res = await fetch(baseUrl + "/articles", {
            method: "GET",
            headers,
          });
          
          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {};
          
          this.articles = jsonData.articles ?? [];
        } catch (e) {
          this.errorMsg = `記事一覧取得時にエラーが発生しました: ${e}`;
        } finally {
          this.isCallingApi = false;
        }
      },
          
      async postArticle() {
        // リクエストボディを指定する
        const requestBody = {
          userId: this.iam,
          text: this.post.text,
          category: this.post.category,
        };

        try {
          /* global fetch */
          const res = await fetch(baseUrl + '/article', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers,
          });

          const text = await res.text();
          const jsonData = text ? JSON.parse(text) : {}

          // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
          if (!res.ok) {
            const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
            throw new Error(errorMessage);
          }

          // 成功時の処理
          this.post.text = "";
          this.post.category = "";
          console.log(jsonData);
        }
        catch (e) {
          // エラー時の処理
          console.log("error");
        }
      },// 記事を作成する

        // async getSearchedArticles() {}, // 記事を検索する
        // async deleteArticle(article) {}, // 記事を削除する
        // convertToLocaleString(timestamp) {} // timestampをLocaleDateStringに変換する
      convertToLocaleString(timestamp) {
        return new Date(timestamp).toLocaleString();
      },
    },
  };
</script>

<style scoped>
.field {
  text-align: center;
}
</style>
