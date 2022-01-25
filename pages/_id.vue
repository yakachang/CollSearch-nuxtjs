<template>
  <v-container fluid style="height: 100%">
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
          @keydown.enter="search()"
          @click:append="linggleHelp"
        ></v-text-field>
      </v-col>
    </v-row>
    <div v-show="isSearching">
      <v-progress-linear
        indeterminate
        color="cyan"
      ></v-progress-linear>
    </div>
    <v-row
      align="center"
      justify="center"
    >
      <h2 v-show="showNoResult" style="color: white">
        - No Result -
      </h2>
    </v-row>
    <v-data-table
      v-show="isDataExisted"
      :headers="Headers"
      :items="result_list"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="pattern"
      show-expand
      class="elevation-1 white--text"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-spacer />
          <ul
            v-for="(example, idx) in item.example.slice(0,10)"
            :key="idx"
            style="margin:10px 70px; padding:0; float:left; color: white"
          >
            <li style="width: 80vw">{{ example[0] }}</li>
          </ul>
          <v-spacer />
        </td>
      </template>
    </v-data-table>
    <!--
    <v-card
      v-show="isDataExisted"
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
              <v-list-item-title v-text="`${result['res'][0]}`"></v-list-item-title>
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
    -->
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
          <v-list-item
            v-for="(symbol, idx) in symbol_list"
            :key="idx"
          >
            <v-list-item-content>
              <v-list-item-title>{{ symbol.char }}</v-list-item-title>
              <v-list-item-subtitle>{{ symbol.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          three-line
          subheader
        >
          <v-subheader>POS</v-subheader>
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
  name: 'SearchPage',
  async asyncData ({ params, $axios }) {
    // called every time before loading the component
    console.log(params)
    let query = params.id
    if (query.includes("^")) {
      query = query.replaceAll("^", "/")
    }
    
    // let result_list = await $axios.$post(
    //   `https://m.linggle.com/api/search/${query}`, {query: query}
    // ).catch(error => {
    //   console.log(error)
    // })
    
    return {
      query,
      // result_list
    }
  },
  data() {
    return {
      query: "",
      query_new: "",
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
      res_list: [],
      example_list: [],
      result_list: [],
      expanded: [],
      singleExpand: true,
      isSearching: true,
      Headers: [
        {
          text: 'Phrase',
          align: 'start',
          sortable: false,
          value: 'pattern',
          class: "#3a405a orange--text",
        },
        { text: 'Count', value: 'count', class: "#3a405a orange--text" },
        { text: '%', value: 'percentage', class: "#3a405a orange--text" },
      ],
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
    isDataExisted() {
      try {
        if (this.result_list.length !== 0){
          return true
        } else {
          return false
        }
      } catch {
        return false
      }
    },
    showNoResult() {
      if (!this.isDataExisted && !this.isSearching){
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async search() {
      this.isSearching = true
      this.isLoading = true
      console.log("Lang: ", this.lang)
      this.result_list = []
      if (this.query.includes("/")) {
        this.query_new = this.query.replaceAll("/", "^")
      } else {
        this.query_new = this.query
      }
      console.log(this.query_new)
      this.$router.push({ path: this.query_new })
    },
    linggleHelp() {
      // window.open('https://linggle.com/help/')
      this.dialog = true
    }
  },
  async fetch() {
    console.log("Lang: ", this.lang)
    if (this.query.includes("/")) {
      this.query_new = this.query.replaceAll("/", "^")
    } else {
      this.query_new = this.query
    }
    console.log(this.query)
    this.result_list = await this.$axios.$post(
      `https://m.linggle.com/api/search/${this.lang}/${this.query_new}`, {query: this.query_new}
    ).catch(error => {
      console.log(error)
    })
    this.isSearching = false
  }
}
</script>

<style scoped>
  .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    background: #3a405a;
  }
  .elevation-1 tr th:first-of-type, td:first-of-type {
    background-color: #3a405a;
  }
  .v-data-table__mobile-row {
    background-color: #474e6e;
  }
  .v-data-table {
    background-color: #3a405a;
  }
</style>

<style lang="scss">  
  tbody {
     tr:hover {
        background-color: inherit !important;
     }
  }
</style>