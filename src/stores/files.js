import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useFacturesStore = defineStore('factures', () => {
  let factures = []
  const authStore = useAuthStore()

  const getFactures = async (
    location_code,
    start_date = null,
    end_date = null,
    nit_search = null,
    type_search = null,
    page = 1,
    page_size = 10,
  ) => {
    let search_endpoint = ''
    if (type_search === 'FEDEARROZ') {
      search_endpoint = 'factures'
    } else if (type_search === 'PROVEEDORES') {
      search_endpoint = 'factures/suppliers'
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${search_endpoint}`,
        {
          location_code: location_code,
          start_date: start_date,
          end_date: end_date,
          nit: nit_search,
          page: page,
          limit: page_size,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      factures = response.data
      console.log(factures)
      return factures
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const getFilesPath = async (location_code, file_name) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/factures/paths`, {
        params: {
          file_name: file_name,
          location: location_code,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
        },
      })
      if (response.status === 200) {
        return response.data.files
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const downloadFile = async (pdf, xml, file_name) => {
    console.log(pdf, xml, file_name)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/factures/download`, {
        params: {
          xml_path: xml,
          pdf_path: pdf,
          file_name: file_name,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // ¡MOVER AQUÍ!
      })

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data) // response.data ya es un blob
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${file_name}.7z`) // Cambiar a .7z
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Liberar el objeto URL
        setTimeout(() => window.URL.revokeObjectURL(url), 100)
      }
    } catch (error) {
      console.error('Error al descargar archivo:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const getNCND = async (
    searchType,
    type,
    location = null,
    start_date = null,
    end_date = null,
    page = 1,
    limit = 25,
  ) => {
    try {
      console.log('Limit: ', limit)
      console.log('Page: ', page)
      console.log(searchType, type, location, start_date, end_date, page, limit)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/nd_or_nc`, {
        params: {
          searchType: searchType,
          type: type,
          location: location,
          start_date: start_date,
          end_date: end_date,
          page: page,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const getNCNDSuppliers = async (
    type,
    start_date = null,
    end_date = null,
    nit = null,
    page = 1,
    limit = 25,
  ) => {
    try {
      console.log(type, start_date, end_date, nit, page, limit)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/nd_or_nc/suppliers`, {
        params: {
          type: type,
          start_date: start_date,
          end_date: end_date,
          nit: nit,
          page: page,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const getSA = async (start_date, end_date, page = 1, limit = 25) => {
    try {
      console.log(start_date, end_date, page, limit)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sa`, {
        params: {
          start_date: start_date,
          end_date: end_date,
          page: page,
          limit: limit,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  const getAll = async (start_date, end_date, page = 1, limit = 25, type) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/all_files`, {
        params: {
          start_date: start_date,
          end_date: end_date,
          page: page,
          limit: limit,
          type: type,
        },
        headers: {
          Authorization: `Bearer ${authStore.userData.token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error al obtener facturas:', error.response?.data?.detail || error.message)
      return error.response?.data?.detail || error.message
    }
  }

  return {
    factures,
    getFactures,
    getFilesPath,
    downloadFile,
    getNCND,
    getNCNDSuppliers,
    getSA,
    getAll,
  }
})
