<template>
  <div id="login-container">
    <div id="login-header">
      <img src="../assests/images/arca_logo.png" alt="">
    </div>

    <form id="login-form" @submit.prevent="handleLogin">
      <h2>Inicio de sesión</h2>
      <p>Comunicar con el equipo de sistemas en caso de no conocer su usuario y/o contraseña</p>
      <label for="user_name" class="input-label">
        <ion-icon name="person"></ion-icon>
        <input type="text" placeholder="Usuario" v-model="user_name" :disabled="isLoading" />
      </label>
      <label for="pwd" class="password-container, input-label">
        <ion-icon name="lock-closed"></ion-icon>
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="Contraseña"
          id="pwd"
          v-model="password"
          :disabled="isLoading"
        />
        <button
          type="button"
          class="toggle-password"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <ion-icon :name="showPassword ? 'eye-off' : 'eye'"></ion-icon>
        </button>
      </label>
      <button type="submit" :disabled="isLoading" class="login-button">
        <span v-if="!isLoading">Iniciar sesión</span>
        <span v-else>Iniciando sesión...</span>
      </button>
    </form>
    <div id="login-footer">
      <span><span class="fede-color">FEDEARROZ</span> - FEDERACION NACIONAL DE ARROCEROS</span>
      <span>Version 1.0.0</span>
      <span>© 2025 Copyright Fedearroz. Todos los derechos reservados.</span>
    </div>
  </div>
  <transition name="fade">
    <div v-if="showRestoreModal" id="restore-modal">
      <div id="restore-modal-content">
        <h2>Restablecer contraseña</h2>
        <label for="pwd_r" class="input-label">
          <ion-icon name="lock-closed-outline"></ion-icon>
          <input :type="showRestorePassword ? 'text' : 'password'" id="pwd_r" />
        </label>
        <label for="pwd_r2" class="input-label">
          <ion-icon name="lock-closed"></ion-icon>
          <input :type="showRestorePassword ? 'text' : 'password'" id="pwd_r2" />
        </label>
        <input
          style="display: none;"
          type="checkbox"
          id="pwd_r_s"
          v-model="showRestorePassword"
        />
        <label for="pwd_r_s" class="toggle-r-password">
            <span>{{ showRestorePassword ? 'Ocultar ' : 'Mostrar ' }} contraseña</span>
            <ion-icon :name="showRestorePassword ? 'eye-off' : 'eye'"></ion-icon>
        </label>
        <p>¿Estás seguro de que deseas restablecer la contraseña?</p>
        <div class="restore-modal-buttons">
            <button @click="showRestoreModal = false">Cancelar</button>
            <button @click="updatePassword">Restablecer</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useUsersStore } from '../stores/users'

const usersStore = useUsersStore()

const authStore = useAuthStore()
const router = useRouter()
const alerts = inject('alerts')

const user_name = ref('')
const password = ref('')
const isLoading = inject('isLoading')
const showPassword = ref(false)
const restorePassword = ref(false)
const message = ref('')
const messageType = ref('')

const showRestoreModal = ref(false)
const showRestorePassword = ref(false)

const showMessage = (msg, type = 'error') => {
  if (type === 'error') {
    alerts.error(msg)
  } else if (type === 'success') {
    alerts.success(msg, 3000)
  }
}

const handleLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true
  message.value = ''

  try {
    const result = await authStore.login(user_name.value, password.value)
    if (result.success) {
      showMessage(result.message, 'success')
      restorePassword.value = authStore.userData.restore_password
      console.log('Restore password: ', restorePassword.value)
      if (restorePassword.value) {
        showRestoreModal.value = true
      } else {
        router.push('/search')
      }
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    showMessage('Error inesperado al intentar iniciar sesión', 'error')
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  try {
    const newPassword = document.getElementById('pwd_r').value
    const confirmPassword = document.getElementById('pwd_r2').value

    if (!newPassword || !confirmPassword) {
      showMessage('Por favor ingresa y confirma la nueva contraseña', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showMessage('Las contraseñas no coinciden', 'error')
      return
    }

    const result = await usersStore.updatePassword(newPassword, user_name.value)
    if (result.success) {
      showMessage(
        'Contraseña actualizada correctamente. Por favor inicia sesión nuevamente.',
        'success',
      )
      showRestoreModal.value = false
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      showMessage(result.message || 'Error al actualizar la contraseña', 'error')
    }
  } catch (error) {
    console.error('Update password error:', error)
    showMessage(
      error.response?.data?.detail || 'Error inesperado al intentar actualizar la contraseña',
      'error',
    )
  }
}

onMounted(() => {
  if (authStore.token) {
    router.push('/search')
  }
})
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#login-container {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
#login-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#login-header img {
  width: 250px;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.336)); 
  margin-bottom: 20px;
  scale: 1.3; 
}
#login-header p {
    color: white;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.61);
    text-transform: uppercase;
    font-size: 1rem;
    letter-spacing: 1px;
}
#login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: var(--fede-color);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.61);
  min-width: 250px;
  max-width: 90dvw;
  margin-bottom: 20px;
  margin-top: 20px;
}
#login-form h2 {
  font-size: 1.5rem;
  color: white;
}
#login-form p {
    color: white;
    font-size: 1rem;
    text-align: center;
    width: 70%;
    font-size: .9rem
}
.input-label {
  display: flex;
  flex-direction: row;
  padding: 5px;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  border-bottom: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  margin-bottom: 10px;
  border-radius: 2px;
}

.input-label input {
  all: unset;
  width: 100%;
  color: white;
}

.input-label button {
  all: unset;
  cursor: pointer;
}

.input-label:focus-within {
  scale: 1.01;
  border-bottom: 5px solid var(--fede-color-hover);
}
.input-label input::placeholder{
    color: white;
}

.login-button {
  all: unset;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--fede-color);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: var(--fede-color-hover);
}
.message {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.password-container {
  position: relative;
  width: 100%;
}

button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
#login-footer {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: .7rem;
  margin-bottom: 40px;
}
.fede-color {
  color: var(--fede-color);
  font-weight: bolder;
  letter-spacing: 1.5px;
}

#restore-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

#restore-modal-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 5px solid var(--fede-color);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.747);
}

#restore-modal-content h2{
    color: var(--fede-color);
    font-weight: bolder;
    letter-spacing: 1.5px;
}

#restore-modal-content .input-label{
  color: black;
  margin-bottom: 10px;
}
#restore-modal-content .input-label ion-icon{
    color: black;
}
#restore-modal-content .input-label input{
    color: black;
}
.toggle-r-password{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    margin-top: 20px;
    border-bottom: 2px solid var(--fede-color);
    padding-bottom:5px;
    padding-left:10px;
    padding-right:10px;
}
.toggle-r-password ion-icon{
    color: var(--fede-color);
}

.restore-modal-buttons{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    margin-top: 20px;
    padding-bottom:5px;
    padding-left:10px;
    padding-right:10px;
    flex-wrap: wrap;
    width: 80%;
}
.restore-modal-buttons button{
    all: unset;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--fede-color);
    color: white;
    transition: all 0.3s ease;
}
.restore-modal-buttons button:hover{
    background-color: var(--fede-color-hover);
    scale: 1.1;
}
.restore-modal-buttons button:active{
    transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
