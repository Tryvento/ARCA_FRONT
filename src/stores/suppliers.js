import {defineStore} from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useSuppliersStore = defineStore('suppliers', () => {
    const authStore = useAuthStore()

    const getSuppliers = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/seven_suppliers`,
                {
                    headers: {
                        Authorization: `Bearer ${authStore.userData.token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            console.log('Proveedores obtenidos:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener proveedores:', error.response?.data || error.message);
            throw error;
        }
    }

    return {
        getSuppliers
    }
})
