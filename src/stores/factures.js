import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useFacturesStore = defineStore('factures', () => {
  
  let factures = [];
  const authStore = useAuthStore()


  const getFactures = async (location_code, start_date=null, end_date=null, nit_search=null, type_search=null) => {
    let search_endpoint = ''
    if(type_search === 'FEDEARROZ'){
      search_endpoint = 'factures'
    } else if(type_search === 'PROVEEDORES'){
      search_endpoint = 'factures/suppliers'
    }
    try{

        const response = await axios.post(`http://localhost:8000/${search_endpoint}`, 
            {
                location_code: location_code,
                start_date: start_date,
                end_date: end_date,
                nit: nit_search,
            },
            {
                headers: {
                    'Authorization': `Bearer ${authStore.userData.token}`,
                    'Content-Type' : 'application/json',
                }
            }
        )
        factures = response.data
        return factures
    } catch (error) {
        console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
        return error.response?.data?.detail || error.message
    }
  }

  return {
    factures,
    getFactures,
  }
})