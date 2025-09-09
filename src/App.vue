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
  const verifyToken = useAuthStore().verifyToken()
  if (verifyToken.success === false) {
    router.push('/')
  } else {
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
    alerts.error('Su sesion se ha vencido, recargue o inicie sesion de nuevo.')
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
  <transition name="fade" mode="out-in">
    <div v-if="isLoading" class="loading">
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-inner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
            <div class="spinner-circle"></div>
          </div>
        </div>
        <p class="loading-text">Cargando</p>
        <p class="loading-subtext">Por favor espere...</p>
      </div>
    </div>
  </transition>
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
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loading-content {
    text-align: center;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
}

.spinner-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
}

.spinner-circle {
    position: absolute;
    width: 16px;
    height: 16px;
    background: var(--fede-color, #2c5aa0);
    border-radius: 50%;
    animation: spinner 1.2s infinite ease-in-out;
}

.spinner-circle:nth-child(1) {
    top: 0;
    left: 0;
    animation-delay: 0s;
}

.spinner-circle:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.15s;
}

.spinner-circle:nth-child(3) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 0.3s;
}

.spinner-circle:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 0.45s;
}

.spinner-circle:nth-child(5) {
    bottom: 0;
    right: 0;
    animation-delay: 0.6s;
}

@keyframes spinner {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(0.3);
        opacity: 0.7;
    }
}

.loading-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 15px 0 5px;
    color: #fff;
    letter-spacing: 0.5px;
    animation: none;
    opacity: 0.9;
}

.loading-subtext {
    color: #a0aec0;
    font-size: 0.9rem;
    margin: 0;
    opacity: 0.8;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>
