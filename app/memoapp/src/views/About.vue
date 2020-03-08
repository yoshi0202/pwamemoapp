<template>
  <v-container pa-0 ma-0 fluid class="grey lighten-3">
    <v-content class="grey lighten-4">
      <v-img src="/img/top.svg" class="grey lighten-3" max-height="500" aspect-ratio="1" contain>
        <template v-slot:default>
          <v-row class="fill-height" align="center">
            <v-container class="app-title font-weight-bold black--text px-5 my-0 py-0">メモ感覚で</v-container>
            <v-container class="app-title font-weight-bold black--text px-10 text-left">共有しよう</v-container>
          </v-row>
        </template>
      </v-img>
    </v-content>
    <v-content class="white py-10">
      <v-layout class="justify-center py-10" wrap>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-container py-0 text-center>
            <p class="display-1 font-weight-bold">あなたのスニペットを共有しよう</p>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg4 xl4>
          <v-container py-0 text-center>
            <p class="title font-weight-bold">スニペットのメモを残そう</p>
            <p class="subtitle">
              Snippyはプログラマの「あの時どう書いたっけ？」を解決します。
              スニペットを残し、過去のコードを引っ張り出す、ナレッジ共有サイトを探す手間を削減します。
            </p>
            <v-img
              src="/img/about_img1.svg"
              class="white"
              max-height="300"
              aspect-ratio="1"
              contain
            ></v-img>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg4 xl4>
          <v-container py-0 text-center>
            <p class="title font-weight-bold">実装をもっと簡潔に</p>
            <p class="subtitle">
              Snippyは、多様なプログラマの多様な言語のスニペットが閲覧できるプラットフォームです。
              スニペットを参考に、効率的、簡潔な書き方を取り入れましょう。
            </p>
            <v-img
              src="/img/about_img2.svg"
              class="white"
              max-height="300"
              aspect-ratio="1"
              contain
            ></v-img>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg4 xl4>
          <v-container py-0 text-center>
            <p class="title font-weight-bold">好きなことをメモしよう</p>
            <p class="subtitle">
              メモのようにスニペットを残すことができます。上手な説明、面白いことを書く必要はありません。
              チラシの裏、机の上の付箋、乱雑なメモを手軽に残しましょう。
            </p>
            <v-img
              src="/img/about_img3.svg"
              class="white"
              max-height="300"
              aspect-ratio="1"
              contain
            ></v-img>
          </v-container>
        </v-flex>
      </v-layout>
    </v-content>
    <v-content class="py-10">
      <v-layout class="justify-center py-10" wrap>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-container py-0 text-center>
            <p class="display-1 font-weight-bold">多様な言語に対応</p>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-container py-0 text-center>
            <p class="subtitle">
              追加したスニペットはシンタックスハイライトで表示されます。
              説明文はマークダウン形式で、簡単に編集することができます。
            </p>
          </v-container>
        </v-flex>
        <v-flex xs4 sm4 md1 lg1 xl1 v-for="l in languages" :key="l">
          <v-container py-5 text-center>
            <v-img :src="'/img/' + l + '.svg'" max-height="60" aspect-ratio="1" contain></v-img>
          </v-container>
        </v-flex>
      </v-layout>
    </v-content>
    <v-content class="white py-10">
      <v-layout class="justify-center py-10" wrap>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-container py-0 text-center>
            <p class="display-1 font-weight-bold">好みのログイン方法で</p>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 xl12>
          <v-container py-0 text-center>
            <p class="subtitle">
              Google、GitHub、Twitter、Qiita、いずれかのアカウントでログインが可能です。
              好きなアカウントを使い、すぐに使い始めることができます。
            </p>
          </v-container>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3 xl3>
          <v-container py-5 text-center>
            <v-img src="/img/google.svg" max-height="60" aspect-ratio="1" contain></v-img>
          </v-container>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3 xl3>
          <v-container py-5 text-center>
            <v-img src="/img/github.svg" max-height="60" aspect-ratio="1" contain></v-img>
          </v-container>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3 xl3>
          <v-container py-5 text-center>
            <v-img src="/img/twitter.svg" height="60" aspect-ratio="1" contain></v-img>
          </v-container>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3 xl3>
          <v-container py-5 text-center style="background-color:#55C500">
            <v-img src="/img/qiita.png" max-height="60" aspect-ratio="1" contain></v-img>
          </v-container>
        </v-flex>
      </v-layout>
    </v-content>
  </v-container>
</template>

<script>
export default {
  name: "Top",
  data: function() {
    return {
      languages: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Vue",
        "Node.js",
        "PHP",
        "Java",
        "Ruby",
        "Python",
        "Go"
      ]
    };
  }
};
</script>

<style scope>
.app-title {
  font-size: 80px;
}

.serif-sub {
  font-size: 32px;
}
@media (max-width: 600px) {
  .app-title {
    font-size: 10vw;
    margin: 0 !important;
    padding: 0 !important;
  }
  .serif-sub {
    font-size: 5vw;
  }
}
</style>
