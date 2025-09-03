import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useSuppliersStore = defineStore('suppliers', () => {
  const authStore = useAuthStore()

  const getSuppliers = async (nit = null) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/seven_suppliers`, {
        params: {
          nit: nit,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('Proveedores obtenidos:', response.data)

      // Transform suppliers data
      const suppliersData = response.data.map((supplier) => ({
        nit: supplier.nit,
        complete_name: supplier.complete_name || `${supplier.nombre} ${supplier.apellido}`.trim(),
      }))

      // Store in memory
      localStorage.setItem('suppliers', JSON.stringify(suppliersData))
      console.log('Datos de proveedores almacenados en localStorage')

      return response.data
    } catch (error) {
      console.error('Error al obtener proveedores:', error.response?.data || error.message)
      throw error
    }
  }

  return {
    getSuppliers,
  }
})
