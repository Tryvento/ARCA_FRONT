import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useSuppliersStore = defineStore('suppliers', () => {
  const authStore = useAuthStore()

  const getSuppliers = async (nit = null) => {
    try {
      if (!nit) return []
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/seven_suppliers`, {
        params: { nit },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Proveedores obtenidos:', response.data)
      
      // Return the response data directly, let the component handle the formatting
      return response.data
    } catch (error) {
      console.error('Error al obtener proveedores:', error.response?.data || error.message)
      throw error
    }
  }

  const getLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Ubicaciones obtenidas:', response.data.locations)
      
      // Return the response data directly, let the component handle the formatting
      return response.data.locations
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error.response?.data || error.message)
      throw error
    }
  }

  return {
    getSuppliers,
    getLocations,
  }
})
