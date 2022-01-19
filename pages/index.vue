<template>
  <v-container fill-height fluid style="height: 100vh">
    <v-row 
      align="center"
      justify="center"
    >
      <v-col>
        <v-text-field
          v-model="query"
          placeholder="Linggle Search"
          append-icon="mdi-help"
          class="mt-3"
          rounded
          solo
          @keydown.enter="search(query)"
          @click:append="linggleHelp"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      query: "",
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
      let result = this.$axios.$get(
        `/`
      ).catch(error => {
        console.log(error)
      })
      // console.log('result: ', result)
      // return result
    },
    linggleHelp() {
      window.open('https://linggle.com/help/')
    }
  },
}
</script>
