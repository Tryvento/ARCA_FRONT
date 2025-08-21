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
            <label for="">
                <span>Ubicacion:</span>
                <select name="" id="" v-if="authStore.userData.location_code === '1101'">
                    <option value="">1</option>
                    <option value="">2</option>
                </select>
            </label>
            <label for="">
                <span>Tipo:</span>
                <select name="" id="">
                    <option value="">Factura</option>
                    <option value="">Nota de credito:</option>
                </select>
            </label>
        </nav>
        <div class="search-content">
            <table>
                <thead>
                    <tr>
                        <th>NIT</th>
                        <th>Fecha</th>
                        <th>Ubicacion</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>123456789</td>
                        <td>2022-01-01</td>
                        <td>1</td>
                        <td>Factura</td>
                        <td>Pagada</td>
                        <td>
                            <button>Descargar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <button @click="router.push('/users')" v-if="authStore.userData.admin">Usuarios</button>
    <button @click="authStore.logout(); router.push('/')">Cerrar sesión</button>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()


</script>