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
      res_list: [],
      example_list: [],
      result_list: [],
      expanded: [],
      singleExpand: true,
      isSearching: true,
      Headers: [
        {
          text: 'Sentence Pattern',
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
      return this.$store.getters['lang/getLang']
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
      if (this.query.includes("/")) {
        this.query_new = this.query.replaceAll("/", "^")
      } else {
        this.query_new = this.query
      }
      console.log(this.query_new)
      this.$router.push({ path: this.query_new })
    },
    linggleHelp() {
      window.open('https://linggle.com/help/')
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