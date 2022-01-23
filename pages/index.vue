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
    }
  },
  head() {
    return {
      title: 'Collocation Search',
    }
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
      window.open('https://linggle.com/help/')
    }
  },
}
</script>
