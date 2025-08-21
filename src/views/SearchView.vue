<template>
    <div class="container">
        <nav class="search-container">
            <h2>Buscar</h2>
            <input type="text" placeholder="NIT">
            <label for="start-date">
                <span>Fecha inicio:</span>
                <input type="date" id="start-date">
            </label>
            <label for="end-date">
                <span>Fecha fin:</span>
                <input type="date" id="end-date">
            </label>
            <label v-if="authStore.userData.location_code === '1101'">
                <span>Ubicación:</span>
                <select v-model="selectedLocation">
                    <option value="">Todas las ubicaciones</option>
                    <option v-for="location in locationsList" :key="location.code" :value="location.code">
                        {{ location.name }} ({{ location.code }})
                    </option>
                </select>
            </label>
            <label for="">
                <span>Tipo:</span>
                <select name="" id="">
                    <option value="">Factura</option>
                    <option value="">Nota de credito</option>
                    <option value="">Nota de debito</option>
                    <option value="">Soporte de adquisicion</option>
                </select>
            </label>
        </nav>
    </div>
    <button @click="router.push('/users')" v-if="authStore.userData.admin">Usuarios</button>
    <button @click="authStore.logout(); router.push('/')">Cerrar sesión</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import locations from '../assests/utils/locations.json'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const locationsList = [...locations.locations].sort((a, b) => 
  a.name.localeCompare(b.name, 'es', {sensitivity: 'base'})
)

const selectedLocation = ref('')
</script>