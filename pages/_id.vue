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
    <v-row
      align="center"
      justify="center"
    >
      <h2 v-show="!isDataExisted" style="color: white">
        - No Result -
      </h2>
    </v-row>
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
  </v-container>
</template>

<script>
export default {
  name: 'SearchPage',
  async asyncData ({ params, $axios }) {
    // called every time before loading the component
    console.log(params)
    let query = params.id

    let result_list = await $axios.$post(
      `/search/${query}`, {query: query}
    ).catch(error => {
      console.log(error)
    })
    
    return {
      query: params.id,
      result_list
    }
  },
  data() {
    return {
      query: "",
      res_list: [],
      example_list: [],
      // result_list: [],
    }
  },
  head() {
    return {
      title: 'Collocation Search',
    }
  },
  computed: {
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
    }
  },
  methods: {
    async search() {
      this.$router.push({ path: `${this.query}` })
    },
    linggleHelp() {
      window.open('https://linggle.com/help/')
    }
  },
}
</script>
