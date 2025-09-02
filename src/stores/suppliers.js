import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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
            
            // Transform and save suppliers data to JSON file
            const suppliersData = response.data.map(supplier => ({
                nit: supplier.nit,
                complete_name: supplier.complete_name || `${supplier.nombre} ${supplier.apellido}`.trim()
            }));
            
            // Write to JSON file
            const filePath = join(process.cwd(), 'src', 'assests', 'utils', 'suppliers.json');
            await writeFile(filePath, JSON.stringify(suppliersData, null, 2));
            console.log('Archivo de proveedores actualizado correctamente');
            
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
