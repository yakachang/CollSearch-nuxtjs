<template>
  <v-container fill-height fluid style="height: 100%">
    <v-row 
      align="center"
      justify="center"
    >
      <v-col>
        <v-text-field
          v-model="query"
          placeholder="Collocation Search"
          append-icon="mdi-help"
          class="mt-3"
          rounded
          solo
          @keydown.enter="pageChange()"
          @click:append="linggleHelp"
          :to="`${query}`"
        ></v-text-field>
      </v-col>
    </v-row>
    <div v-show="isLoading">
      <v-progress-linear
        indeterminate
        color="cyan"
      ></v-progress-linear>
    </div>
    <v-card
      v-show="result_list.length !== 0"
      class="mx-auto"
      width="100vw"
    >
      <v-list>
        <v-list-group
          v-for="(result, idx) in result_list"
          :key="idx"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="`${result.res[0]}`"></v-list-item-title>
              <v-list-item-subtitle v-text="`Count: ${result.res[1]} (${result.res[2]}%)`"></v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <ul
                v-for="(example, idx) in result.example.slice(0,10)"
                :key="idx"
              >
                <li>{{ example }}</li>
              </ul>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Common symbols</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-row>
          <v-col cols="12" md="6">
            <v-list
              three-line
              subheader
            >
              <v-subheader>Symbols Introduction</v-subheader>
              <v-list-item>
                <v-img
                  :src="require('~/assets/symbols.png')"
                  class="mr-2"
                  contain
                />
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6" v-show="lang!='ch'">
            <v-list
              three-line
              subheader
            >
              <v-subheader>POS</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-img
                    :src="require('~/assets/pos_en.png')"
                    class="mr-2"
                    contain
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6" v-show="lang=='ch'">
            <v-list
              three-line
              subheader
            >
              <v-subheader>POS</v-subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-img
                    :src="require('~/assets/pos_ch.png')"
                    class="mr-2"
                    contain
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <!--
        <v-list
          three-line
          subheader
        >
          <v-subheader>Symbols Introduction</v-subheader>
          <v-list-item>
            <v-img
              :src="require('~/assets/symbols.png')"
              class="mr-2"
              max-height="60vh"
              max-width="80vw"
              contain
            />

            <v-list-item-content>
              <v-list-item-title>{{ symbol.char }}</v-list-item-title>
              <v-list-item-subtitle>{{ symbol.description }}</v-list-item-subtitle>
            </v-list-item-content>
            
          </v-list-item>
        </v-list>
        -->
        <!--
        <v-list
          three-line
          subheader
        >
          <v-subheader>POS</v-subheader>
          <v-list-item v-show="lang!='ch'">
            <v-list-item-content>
              <v-img
                :src="require('~/assets/pos_en.png')"
                class="mr-2"
                max-height="60vh"
                max-width="80vw"
                contain
              />
            </v-list-item-content>
          </v-list-item>
          
          <v-list-item
            v-show="lang!='ch'"
            v-for="(pos, i) in pos_list_en"
            :key="i"
          >
            <v-list-item-content>
              <v-list-item-title>{{ pos.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ pos.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-show="lang=='ch'"
            v-for="(pos, idx) in pos_list_ch"
            :key="idx"
          >
            <v-list-item-content>
              <v-list-item-title>{{ pos.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ pos.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          
        </v-list>
        -->
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      query: "",
      query_new: "",
      res_list: [],
      example_list: [],
      result_list: [],
      isLoading: false,
      dialog: false,
      // symbol_list: [
      //   { "char": "/", "description": "Any collection of words." },
      //   { "char": "?", "description": "Return results with/without the word." },
      //   { "char": "_", "description": "可以指定長度「_(a-b)」表示長度a~b的詞，「_(a-)」表示長度a以上的詞，「_(-b)」表示長度b以下的詞，「_(a)」表示長度為a的詞" },
      //   { "char": "$", "description": "Any length of characters. 可以指定長度，方法如上" },
      //   { "char": "~", "description": "可以指定長度，方法如上" },
      //   { "char": "!", "description": "Not" },
      //   { "char": "[ ]", "description": "加在token外面指定要搜尋的位置，指定搜尋內容可以不只一個詞，一個query可以有多個[ ]" },
      //   { "char": "[PE]", "description": "Pattern elements" },
      // ],
      // pos_list_en: [
      //   { "title": "punct.", "subtitle": "PUNCT -LRB- -RRB- HYPH LS SYM NFP" },
      //   { "title": "conj.", "subtitle": "CC CONJ" },
      //   { "title": "num.", "subtitle": "CD NUMBER" },
      //   { "title": "det.", "subtitle": "DT DET" },
      //   { "title": "there.", "subtitle": "THERE EX" },
      //   { "title": "fw.", "subtitle": "FW" },
      //   { "title": "prep.", "subtitle": "IN PREP" },
      //   { "title": "adj.", "subtitle": "ADJ JJ JJR JJS" },
      //   { "title": "aux.", "subtitle": "MD AUX" },
      //   { "title": "n.", "subtitle": "NOUN NN NNP NNPS NNS" },
      //   { "title": "predet.", "subtitle": "PREDET PDT" },
      //   { "title": "poss.", "subtitle": "POS POSS" },
      //   { "title": "pron.", "subtitle": "PRON PRP PRP$" },
      //   { "title": "adv.", "subtitle": "ADV RB RBR RBS RP" },
      //   { "title": "to.", "subtitle": "TO" },
      //   { "title": "intj.", "subtitle": "UH INTJ" },
      //   { "title": "v.", "subtitle": "VERB VB VBD VBG V-ING VBN VPP VBP VBZ" },
      //   { "title": "wh.", "subtitle": "WH WDT WP WP$ WRB" },
      //   { "title": "be.", "subtitle": "BE BES" },
      //   { "title": "have.", "subtitle": "HAVE HVS" },
      // ],
      // pos_list_ch: [
      //   { "title": "adj.", "subtitle": "VH A" },
      //   { "title": "c.", "subtitle": "Caa Cbb Cbaa Cbba Cbbb Cbca Cbc" },
      //   { "title": "adv.", "subtitle": "Dfa Da Daa Dfb Dab Dbaa Dbab Dbb Dbc Dc Dd Dg Dh Dj Dk" },
      //   { "title": "det.", "subtitle": "Neu Nes Nep Neqa" },
      //   { "title": "punct.", "subtitle": "EXCLAMATIONCATEGORY QUESTIONCATEGORY DASHCATEGORY COLONCATEGORY PAUSECATEGORY PERIODCATEGORY COMMACATEGORY ETCCATEGORY SPAN PARENTHESISCATEGORY SEMICOLONCATEGORY SPCHANGECATEGORY" },
      //   { "title": "v.", "subtitle": "VA VB VC VD VE" },
      //   { "title": "n.", "subtitle": "Na Nb Nc Nd Nh" },
      //   { "title": "prep.", "subtitle": "P" },
      // ],
    }
  },
  head() {
    return {
      title: 'Collocation Search',
    }
  },
  computed: {
    lang() {
      return this.$store.getters['lang/getLang'] || 'en'
    },
  },
  methods: {
    pageChange() {
      this.isLoading = true
      console.log("Lang: ", this.lang)
      if (this.query.includes("/")) {
        this.query_new = this.query.replaceAll("/", "^")
      } else {
        this.query_new = this.query
      }
      console.log("Index, query: ", this.query)
      console.log("Index, query_new: ", this.query_new)
      this.$router.push({ path: this.query_new })
    },
    // async search(query) {
    //   let result = await this.$axios.$post(
    //     `/search/${query}`, {query: query}
    //   ).catch(error => {
    //     console.log(error)
    //   })

    //   this.result_list = result.slice(0, 10)
    // },
    linggleHelp() {
      // window.open('https://linggle.com/help/')
      this.dialog = true
    }
  },
}
</script>
