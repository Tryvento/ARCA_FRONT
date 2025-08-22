<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, provide, ref } from 'vue'

const router = useRouter()
const isLoading = ref(false)
provide('isLoading', isLoading)

const intervalId = ref(null)

const checkEveryFiveSeconds = () => {
  // Aquí va la lógica que quieres ejecutar cada 5 segundos
  console.log('Ejecutando tarea cada 1 minutos')
  useAuthStore().verifyToken()
  if (useAuthStore().userData.token === null) {
    router.push('/')
  }
  
  // Programar el próximo llamado
  intervalId.value = setTimeout(checkEveryFiveSeconds, 1000 * 60 * 1)
}

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  if (userData) {
    useAuthStore().userData.token = userData.token
    useAuthStore().userData.user_name = userData.user_name
    useAuthStore().userData.complete_name = userData.complete_name
    useAuthStore().userData.location_code = userData.location_code
    useAuthStore().userData.admin = userData.admin
    useAuthStore().userData.restore_password = userData.restore_password
    router.push('/search')
  } else {
    router.push('/')
  }
  
  // Iniciar el intervalo recursivo
  checkEveryFiveSeconds()
})

// Limpiar el timeout cuando el componente se desmonte
onUnmounted(() => {
  if (intervalId.value) {
    clearTimeout(intervalId.value)
  }
})
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Cargando...</p>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
}

.loading p {
    color: #fff;
    font-size: 3rem;
    margin-top: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
    letter-spacing: 2px;

}
</style>
