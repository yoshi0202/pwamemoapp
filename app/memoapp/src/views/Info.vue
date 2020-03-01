<template>
  <v-content class="grey lighten-3">
    <v-container fluid fill-height>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="10" xl="8">
          <v-row justify="center" no-gutters>
            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
              <v-container pa-0>
                <v-card tile elevation="0">
                  <v-card tile elevation="0">
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
                      <span>運用者情報(中の人)</span>
                      <span></span>
                    </v-container>
                  </v-card>
                </v-card>
                <v-container pt-5 text-left px-0 blue-grey--text text--darken-3>
                  <v-card tile elevation="0">
                    <v-container>当サービスは個人により開発、運用が行われています。</v-container>
                    <v-container>
                      <span>作ったひと：Yoshiki Kobayashi</span>
                      <p>
                        <a href="https://twitter.com/codeplumdev" target="_blank">Twitter</a>/
                        <a href="https://qiita.com/yoshiplum" target="_blank">Qiita</a>/
                        <a href="https://code-plum.dev/" target="_blank">HP</a>
                      </p>
                    </v-container>
                    <v-container>お問い合わせは下記メールアドレス、もしくはTwitterよりご連絡ください。</v-container>
                    <v-container>(_at_を＠に変更して送信ください。)</v-container>
                    <v-container>contact_at_code-plum.dev</v-container>
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
