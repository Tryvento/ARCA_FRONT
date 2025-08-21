<template>
  <div class="users-container">
    <span class="users-title">
      <h1>Usuarios ARC@</h1>
      <button @click="showNewUserWindow = true">Agregar Usuario</button>
    </span>
    <div class="search-container">
      <span class="search-inputs">
        <input type="text" v-model="complete_name_search" placeholder="Nombre completo" />
        <input type="text" v-model="user_name_search" placeholder="Usuario" />
        <select v-model="location_code_search" class="location-select">
          <option value="">Todas las ubicaciones</option>
          <option v-for="location in locationsList" :key="location.code" :value="location.code">
            {{ location.name }} ({{ location.code }})
          </option>
        </select>
        <label for="inactiveSearch" class="switch" :class="{ 'switch-active': inactiveSearch }" @click="searchUsers(complete_name_search, user_name_search, location_code_search, inactiveSearch)">
          <input type="checkbox" v-model="inactiveSearch" id="inactiveSearch">
          <span class="slider"></span>
          <span>Usuarios inactivos</span>
        </label>
      </span>
      <div class="search-buttons">
        <button @click="searchUsers(complete_name_search, user_name_search, location_code_search)">
          <ion-icon name="search"></ion-icon>
        </button>
        <button @click="fetchUsers">
          <ion-icon name="refresh"></ion-icon>
        </button>
      </div>
    </div>

    <!-- Users List -->
    <div v-if="usersData && usersData.length > 0">
      <ul class="users-list">
        <li v-for="user in usersData" :key="user.user_name" class="user-item">
          <span class="user-field">{{ user.user_name }}</span>
          <span class="user-field">{{ user.complete_name }}</span>
          <span class="user-field">{{ user.location_code }}</span>
          <span class="user-field">
            <span>Admin: </span>
            {{ user.admin ? 'Si' : 'No' }}
          </span>
          <span class="user-actions">
            <button @click="restorePassword(user.user_name)">Restaurar contraseña</button>
            <button @click="handleSwitchPermission(user.user_name, user.admin)">
              <ion-icon :name="user.admin ? 'lock-closed-outline' : 'lock-open'"></ion-icon>
            </button>
            <button @click="handleDesactivateUser(user.user_name, user.is_active)" :class="user.is_active ? 'active' : 'inactive'">
              <ion-icon :name="user.is_active ? 'power' : 'power-outline'"></ion-icon>
            </button>
          </span>
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }}</span>
        <button @click="nextPage" :disabled="usersData.length < pageSize">Siguiente</button>
        <span class="page-size">
          Mostrar:
          <select v-model="pageSize" @change="handlePageSizeChange">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </span>
      </div>
    </div>
    <p v-else>No hay usuarios para mostrar</p>
  </div>
  <transition name="fade">
    <NewUserWindows v-if="showNewUserWindow" @close="showNewUserWindow = false" />
  </transition>
  <transition name="fade">
    <div class="delete-user-modal" v-if="showDesactivateUserWindow">
      <div class="delete-user-modal-content">
        <p>¿Estás seguro de que deseas desactivar este usuario?</p>
        <button @click="desactivateUser()" id="delete-user-button">Sí</button>
        <button
          @click="((showDesactivateUserWindow = false), (userToDesactivate = ''))"
          id="cancel-delete-user-button"
        >
          No
        </button>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div class="delete-user-modal" v-if="showActivateUserWindow">
      <div class="delete-user-modal-content">
        <p>¿Estás seguro de que deseas activar este usuario?</p>
        <button @click="activateUser()" id="delete-user-button">Sí</button>
        <button
          @click="((showActivateUserWindow = false), (userToActivate = ''))"
          id="cancel-delete-user-button"
        >
          No
        </button>
      </div>
    </div>
  </transition>
  <transition name="fade">
    <div class="switch-permission-modal" v-if="showSwitchPermissionWindow">
      <div class="switch-permission-modal-content">
        <p>¿Estás seguro de que deseas cambiar el permiso de este usuario?</p>
        <button @click="switchPermission()" id="delete-user-button">Sí</button>
        <button
          @click="((showDesactivateUserWindow = false), (userToDesactivate = ''))"
          id="cancel-delete-user-button"
        >
          No
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch, provide, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '../stores/users'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import locations from '../assests/utils/locations.json'
import NewUserWindows from '../components/NewUserWindows.vue'

const authStore = useAuthStore()

const usersStore = useUsersStore()
const currentPage = ref(1)
const pageSize = ref(10)
const showNewUserWindow = ref(false)
const showDesactivateUserWindow = ref(false)
const showActivateUserWindow = ref(false)
const showSwitchPermissionWindow = ref(false)
const usersData = ref([])

const userToDesactivate = ref('')
const userToSwitchPermission = ref('')
const permissionUserToSwitch = ref(false)
const userToActivate = ref('')

const complete_name_search = ref('')
const user_name_search = ref('')
const location_code_search = ref('')

const isLoading = inject('isLoading')

const inactiveSearch = ref(false)

const locationsList = [...locations.locations].sort((a, b) => 
  a.name.localeCompare(b.name, 'es', {sensitivity: 'base'})
)

provide('showNewUserWindow', showNewUserWindow)

const fetchUsers = async () => {
  isLoading.value = true
  const skip = (currentPage.value - 1) * pageSize.value
  try {
    const response = await axios.get('http://localhost:8000/users', {
      params: {
        skip,
        limit: pageSize.value
      },
      headers: {
        Authorization: `Bearer ${authStore.userData.token}`,
        'Content-Type': 'application/json',
      },
    })
    usersData.value = response.data
    console.log(usersData.value)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  } finally {
    isLoading.value = false
  }
}

const searchUsers = async (complete_name, user_name, location_code, is_active) => {
  isLoading.value = true
  console.log('REQUERIMENTOS BUSQUEDA:', complete_name, user_name, location_code, is_active)
  try {
    const response = await axios.get('http://localhost:8000/users/search/', {
      params: {
        complete_name,
        user_name,
        location_code,
        is_active
      },
      headers: {
        Authorization: `Bearer ${authStore.userData.token}`,
        'Content-Type': 'application/json',
      },
    })
    usersData.value = response.data
    console.log(usersData.value)
  } catch (error) {
    console.error('Error al buscar usuarios:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDesactivateUser = (user_name, is_active) => {
  if (is_active) {
    userToDesactivate.value = user_name
    showDesactivateUserWindow.value = true
  } else {
    userToActivate.value = user_name
    showActivateUserWindow.value = true
  }
}

const desactivateUser = async () => {
  isLoading.value = true
  await usersStore.stateUser(userToDesactivate.value, false)
  showDesactivateUserWindow.value = false
  isLoading.value = false
  userToDesactivate.value = ''
  fetchUsers()
}

const activateUser = async () => {
  isLoading.value = true
  await usersStore.stateUser(userToActivate.value, true)
  showActivateUserWindow.value = false
  isLoading.value = false
  userToActivate.value = ''
  fetchUsers()
  inactiveSearch.value = false
}

const handleSwitchPermission = (user_name, admin) => {
  showSwitchPermissionWindow.value = true
  userToSwitchPermission.value = user_name
  permissionUserToSwitch.value = admin
}

const switchPermission = async () => {
  isLoading.value = true
  try {
    await usersStore.switchPermission(userToSwitchPermission.value, !permissionUserToSwitch.value)
  } catch (error) {
    console.error('Error al cambiar permiso:', error.response.data.detail)
  } finally {
    showSwitchPermissionWindow.value = false
    isLoading.value = false
    userToSwitchPermission.value = ''
    permissionUserToSwitch.value = false
    fetchUsers()
  }
}

onMounted(fetchUsers)

const nextPage = () => {
  currentPage.value++
  fetchUsers()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUsers()
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  fetchUsers()
}

const restorePassword = async (userName) => {
  if (confirm('¿Estás seguro de que deseas restablecer la contraseña de este usuario?')) {
    await usersStore.restorePassword(userName)
    alert('Contraseña restablecida correctamente')
    fetchUsers()
  }
}

// Watch for changes in pagination
watch([currentPage, pageSize], () => {
  fetchUsers()
})
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.users-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}
.users-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  color: var(--fede-color);
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

button {
  background-color: var(--fede-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

button:hover:not(:disabled) {
  background-color: var(--fede-color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--fede-color-hover);
}

.users-list {
  list-style: none;
  padding: 0;
  margin: 30px 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background-color: #f8f9fa;
}

.user-field {
  flex: 1;
  min-width: 150px;
  padding: 0 15px;
  color: #2c3e50;
  font-size: 0.95rem;
}

.user-actions {
  display: flex;
  justify-content: space-between;
}
.user-actions button:last-child {
  background-color: var(--negative-color);
}
.user-actions button:last-child:hover {
  background-color: var(--negative-color-hover);
}
.user-actions button:first-child {
  background-color: var(--warning-color);
}
.user-actions button:first-child:hover {
  background-color: var(--warning-color-hover);
}
.user-actions button:first-child:active {
  background-color: var(--warning-color-active);
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-size {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

select {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #bdc3c7;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--fede-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.search-container input {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #bdc3c7;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.search-inputs {
  all: unset;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.search-inputs input:focus {
  outline: 4px solid var(--fede-color);
  appearance: none;
}

.delete-user-modal,
.switch-permission-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-user-modal-content,
.switch-permission-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
#delete-user-button {
  background-color: var(--negative-color);
}
#delete-user-button:hover {
  background-color: var(--negative-color-hover);
}
#delete-user-button:active,
#cancel-delete-user-button:active {
  transform: translateY(-2px);
}
#cancel-delete-user-button {
  background-color: var(--fede-color);
}
#cancel-delete-user-button:hover {
  background-color: var(--fede-color-hover);
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-size: 0.9rem;
  color: #2c3e50;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.slider {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 24px;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.switch-active .slider {
  background-color: var(--fede-color);
}

.switch-active .slider:before {
  transform: translateX(26px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .user-item {
    flex-wrap: wrap;
    gap: 10px;
  }

  .user-field,
  .user-actions {
    flex: 1 1 100%;
    text-align: left;
  }

  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .page-size {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
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