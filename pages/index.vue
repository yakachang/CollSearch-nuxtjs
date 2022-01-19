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
          @keydown.enter="search(query)"
          @click:append="linggleHelp"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card
      v-show="res_list.length !== 0"
      class="mx-auto"
      width="100vw"
    >
      <v-list>
        <v-list-group
          v-for="(res, idx) in res_list"
          :key="idx"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="`${res[0]}`"></v-list-item-title>
              <v-list-item-subtitle v-text="`Count: ${res[1]} (${res[2]}%)`"></v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <v-list-item>
            <v-list-item-content>
              <ul
                v-for="(example, idx) in example_list"
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
      res_list: [],
      example_list: [],
    }
  },
  head() {
    return {
      title: 'Collocation Search',
    }
  },
  methods: {
    async search(query) {
      // console.log(query)
      // let result = this.$axios.$get('/ngram/', {query: query})
      let result = await this.$axios.$post(
        `/search/${query}`, {query: query}
      ).catch(error => {
        console.log(error)
      })

      this.res_list = result["res"].slice(0, 10)
      // console.log('result: ', result)
      // return result
    },
    linggleHelp() {
      window.open('https://linggle.com/help/')
    }
  },
}
</script>
