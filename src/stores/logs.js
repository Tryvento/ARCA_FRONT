import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import axios from 'axios'


export const useLogsStore = defineStore('logs', () => {

    const authStore = useAuthStore()
    
    const getLogs = async (
        id = null,
        user_name = null,
        start_date = null,
        end_date = null,
        page = 1,
        limit = 25,
    ) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/logs`, {
                params: {
                    id: id,
                    user_name: user_name,
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
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    const getLogById = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/logs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.userData.token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    const createLog = async (user_name, files) => {
        console.log("user_name", user_name)
        console.log("files", files)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/logs`, {
                user_name: user_name,
                files: files,
            }, {
                headers: {
                    Authorization: `Bearer ${authStore.userData.token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    return {
        getLogs,
        getLogById,
        createLog
    }
})
