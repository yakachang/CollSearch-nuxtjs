const state = {
    lang: 'en'
  }
  
  const mutations = {
      setLang(state, lang) {
      state.lang = lang
    }
  }
  
  const getters = {
    getLang: (state) => state.lang
  }
  
  export default {
    state,
    mutations,
    getters
  }