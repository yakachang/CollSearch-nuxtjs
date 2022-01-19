<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-main>
      <v-container style="height: 100%">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
  <!--
  <v-card color='#3a405a' height="100vh">
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-card>
  -->
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      
    }
  },
}
</script>
