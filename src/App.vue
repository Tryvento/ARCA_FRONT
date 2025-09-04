<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useAlertsProviders } from './stores/useAlerts'
import AlertContainer from './components/AlertContainer.vue'
import HelpButton from './components/HelpButton.vue'

const router = useRouter()
const route = useRoute()

const alerts = useAlertsProviders()

provide('alerts', alerts)

const isLoading = ref(false)
provide('isLoading', isLoading)

const intervalId = ref(null)

const checkEveryFiveSeconds = () => {
  useAuthStore().verifyToken()
  if (useAuthStore().userData.token === null) {
    router.push('/')
  }
  let estado = false;
  setInterval(() => {
    document.title = estado ? "ARC@" : "SISTEMA DE GESTION DE ARCHIVOS";
    estado = !estado;
  }, 2000);
  // Programar el próximo llamado cada 60 segundos
  intervalId.value = setTimeout(checkEveryFiveSeconds, 1000 * 60 * 5)
}

const handlePath = () => {
  if (route.name === 'login' && useAuthStore().userData.token !== null) {
    router.push('/search')
  }
  if (route.name === 'search' && useAuthStore().userData.token === null) {
    router.push('/')
  }
}

onMounted(() => {
  isLoading.value = false
  const userData = JSON.parse(localStorage.getItem('userData'))
  if (userData) {
    useAuthStore().userData.token = userData.token
    useAuthStore().userData.user_name = userData.user_name
    useAuthStore().userData.complete_name = userData.complete_name
    useAuthStore().userData.location_code = userData.location_code
    useAuthStore().userData.admin = userData.admin
    useAuthStore().userData.restore_password = userData.restore_password
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

watch(
  () => route.name,
  () => {
    handlePath()
  }
)
</script>

<template>
  <div v-if="isLoading" class="loading">
    <p>Cargando...</p>
  </div>
  <router-view></router-view>
  <img src="./assests/images/l_fdz_v.png" alt="" class="logo">
  <AlertContainer position="top-left"/>
  <HelpButton/>
  <span class="secret">DFCM - SERPENTINGK</span>
</template>

<style scoped>

.logo {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
  z-index: -1;
  max-height: 50vh;
  pointer-events: none;
}

@media (max-width: 767px) {
  .logo {
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
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
.secret {
    position: fixed;
    right: 0;
    top: 20px;
    transform: translateY(-50%);
    opacity: 0.04;
    z-index: -1;
    max-height: 50vh;
    pointer-events: none;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1rem;
}
</style>
