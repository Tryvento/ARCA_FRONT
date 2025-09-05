<template>
  <div class="modal-container">
    <div id="new-user-window">
      <h2>Nuevo Usuario</h2>
      <form @submit.prevent="createUser">
        <label for="user_name" class="info-label">
          <span>Usuario:</span>
          <input type="text" id="user_name" v-model="user_name" />
        </label>
        <label for="complete_name" class="info-label">
          <span>Nombre completo:</span>
          <input type="text" id="complete_name" v-model="complete_name" />
        </label>
        <label for="location_code" class="info-label">
          <span>Código de ubicación:</span>
          <select id="location_code" v-model="location_code">
            <option value="">Seleccione una ubicación</option>
            <option v-for="location in locationsList" :key="location.code" :value="location.code">
              ({{ location.code }}) / {{ location.name }}
            </option>
          </select>
        </label>
        <label for="admin" class="admin-label">
          <span>Admin:</span>
          <input type="checkbox" id="admin" v-model="admin" />
        </label>
        <button type="submit">Guardar</button>
        <button type="button" @click="showNewUserWindow = false">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'
import { useSuppliersStore } from '../stores/suppliers'

const alerts = inject('alerts')
const suppliersStore = useSuppliersStore()
const isLoading = inject('isLoading')

const locationsList = ref([])

// Load locations when component mounts
onMounted(async () => {
  try {
    isLoading.value = true
    const locations = await suppliersStore.getLocations()
    locationsList.value = [...locations].sort((a, b) =>
      a.code.localeCompare(b.code, 'es', { numeric: true }),
    )
  } catch (error) {
    console.error('Error loading locations:', error)
    alerts.error('Error al cargar las ubicaciones')
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
})

const usersStore = useUsersStore()

const user_name = ref('')
const complete_name = ref('')
const location_code = ref('')
const admin = ref(false)

const showNewUserWindow = inject('showNewUserWindow')

const createUser = async () => {
  isLoading.value = true
  try {
    await usersStore.createUser(
      user_name.value,
      complete_name.value,
      location_code.value,
      admin.value,
    )
    showNewUserWindow.value = false
    setTimeout(() => {
      isLoading.value = false
    }, 500)
    window.location.reload()
    alerts.success('Usuario creado', 5000)
  } catch (error) {
    console.error(error)
    alerts.error('Error al crear usuario', 5000)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

#new-user-window {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

#new-user-window h2 {
  text-align: center;
  color: black;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

#new-user-window form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--secondary-text);
  font-weight: bolder;
  letter-spacing: 1px;
  font-size: 0.9rem;
}
.admin-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

#new-user-window input[type='text'],
#new-user-window input[type='password'] {
  padding: 0.75rem;
  border: 1px solid var(--back-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

#new-user-window input[type='text']:focus,
#new-user-window input[type='password']:focus {
  outline: none;
  border-color: var(--fede-color);
  box-shadow: 0 0 0 2px var(--fede-color-rgba);
}

#new-user-window input[type='checkbox'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--fede-color);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

#new-user-window input[type='checkbox']:checked {
  background-color: var(--fede-color);
  border-color: var(--fede-color);
}

#new-user-window input[type='checkbox']:checked::after {
  content: '✓';
  color: white;
  font-size: 0.7rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#new-user-window input[type='checkbox']:hover {
  border-color: var(--fede-color);
  box-shadow: 0 0 0 2px rgba(var(--fede-color-rgb), 0.2);
}

#new-user-window .input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

#new-user-window button[type='submit'] {
  background-color: var(--fede-color);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

#new-user-window button[type='submit']:hover {
  background-color: var(--fede-color-hover);
}

#new-user-window button[type='button'] {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  margin-top: 0.5rem;
}

#new-user-window button[type='button']:hover {
  background-color: #e9e9e9;
  border-color: #ccc;
}

#location_code {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--back-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

#location_code:focus {
  outline: none;
  border-color: var(--fede-color);
  box-shadow: 0 0 0 2px var(--fede-color-rgba);
}
</style>
