<template>
  <v-content class="grey lighten-3">
    <v-container fluid fill-height>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="10" xl="8">
          <v-row justify="center" no-gutters>
            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
              <v-container pa-0>
                <v-card tile elevation="0">
                  <v-card tile elevation="0" v-if="!$store.getters.getIsMobile">
                    <v-container
                      py-2
                      transparent
                      title
                      font-weight-bold
                      text-left
                      blue-grey--text
                      text--darken-3
                      d-flex
                      align-center
                      justify-space-between
                    >
                      <span></span>
                      <span>プライバシーポリシー</span>
                      <span></span>
                    </v-container>
                  </v-card>
                </v-card>
                <v-container pt-5 text-center px-0>
                  <v-card tile elevation="0">
                    <v-container text-left blue-grey--text text--darken-3>
                      <v-container>
                        はじめに
                      </v-container>
                      <v-container>
                        コードスニペット共有サイト「Snippy」（以下、当サイト）は、個人情報の取り扱いにおいて、下記のように定めます。
                        以下のプライバシーポリシーでは、個人情報の取得・利用・管理について記載しております。サービス利用にあたり、個人情報保護方針をお読みになり、ご理解いただけますと幸いです。
                      </v-container>
                      <v-container>
                        個人情報の取得
                      </v-container>
                      <v-container>
                        当サービスでは、ユーザーの皆様の個人情報（メールアドレス等個人を特定できる物）を取得させて頂くことがあります。
                      </v-container>
                      <v-container>
                        ユーザーからご提供いただく情報
                      </v-container>
                      <v-container>
                        ユーザーが本サービスを利用するために、ご提供いただく情報は以下の通りです。
                      </v-container>
                      <v-container>
                        <ul>
                          <li>メールアドレス</li>
                          <li>ユーザープロフィール</li>
                          <li>その他当サイトが定める入力フォームにユーザーが入力する情報</li>
                          <li>ユーザーが本サービスを利用するにあたって、運営チームが収集する情報</li>
                          <li>Cookie及び匿名ID</li>
                        </ul>
                      </v-container>
                      <v-container>
                        その他本サービスの機能により収集可能な一連の情報 第三者への開示・提供の禁止
                      </v-container>
                      <v-container>
                        基本的に個人情報は第三者には提供しませんが、個人情報の保護に関する法律第23条第1項各号により、法令に基づいて提供する場合があります。
                      </v-container>
                      <v-container>
                        アクセス解析ツールについて
                      </v-container>
                      <v-container>
                        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
                        このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくはこちら（https://www.google.com/analytics/terms/jp.html）からご確認ください。
                      </v-container>
                      <v-container>
                        個人情報に関する問い合わせ
                      </v-container>
                      <v-container>
                        <p>
                          個人情報に関するお問い合わせは、下記までお願い致します。 (at を @
                          に変更し、メールをお送りください。)
                        </p>
                        <p>
                          メールアドレス:contact_at_code-plum.dev
                        </p>
                      </v-container>
                      <v-container>
                        改変と見直しについて
                      </v-container>
                      <v-container>
                        個人情報については、法令変更などを受けて随時見直しを行います。
                      </v-container>
                    </v-container>
                  </v-card>
                </v-container>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  data: function() {
    return {};
  }
};
</script>

<style scope></style>
