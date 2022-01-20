<template>
  <v-app :style="{background: $vuetify.theme.themes.light.background}">
    <v-app-bar
      color="#3a405a"
      fixed
      app
      flat
    >
      <v-img
        :src="require('~/assets/linggle-logo-dark.png')"
        class="mr-2"
        max-height="100"
        max-width="100"
        contain
      />
      <v-spacer />
      <div class="flex-1-1-auto d-flex align-center justify-end">
        <v-btn
          v-for="(tab, i) in tabs"
          :to="tab.to"
          :key="i"
          class="white--text text--capitalize"
          text
          nuxt
        >
          {{ tab.title }}
        </v-btn>
        <!--
        <v-divider
          class="mx-4"
          vertical
        ></v-divider>
        <v-menu offset-y open-on-hover transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="text--secondary px-2" text v-bind="attrs" v-on="on">
              <v-icon>mdi-translate</v-icon>
              <v-icon small>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group v-model="selectedLang">
              <v-list-item
                v-for="lang in $i18n.locales"
                :key="lang.code"
                :value="lang.code"
              >
                <v-list-item-title v-text="lang.name"></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        -->
      </div>
    </v-app-bar>
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
      tabs: [
        {
          icon: 'mdi-file',
          title: "About",
          to: '/about',
        },
        {
          icon: 'mdi-library',
          title: "Contact",
          to: '/contact',
          menuItems: [],
        },
      ],
    }
  },
}
</script>
