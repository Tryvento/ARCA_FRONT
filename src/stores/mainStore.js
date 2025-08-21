import { defineStore } from 'pinia'

export const mainStore = defineStore('main', () => {
  const mainData = ref({
    loading: false,
    error: false,
    message: "",
  })
})
