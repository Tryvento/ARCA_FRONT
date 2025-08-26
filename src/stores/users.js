import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import axios from 'axios'

export const useUsersStore = defineStore('users', () => {
  const authStore = useAuthStore()


  const restorePassword = async (user_name) => {
    if (!authStore.userData?.admin) {
      console.error('Solo los administradores pueden restablecer contraseñas')
      return
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user_name}`,
        {
          restore_password: true,
          password: '123456',
        }, // Enviamos el campo a actualizar
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      console.error(
        'Error al restablecer la contraseña:',
        error.response?.data?.detail || error.message,
      )
      throw error // Opcional: relanzar el error para manejarlo en el componente
    }
  }

  const updatePassword = async (newPassword, user_name) => {
    try {
      // Get fresh token from auth store
      const token = authStore.userData.token
      if (!token) {
        throw new Error('No se encontró el token de autenticación')
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user_name}`,
        {
          password: newPassword,
          restore_password: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      // Clear user data and token
      //authStore.logout()
      localStorage.clear()
      return { success: true, message: 'Contraseña actualizada correctamente' }
    } catch (error) {
      console.error(
        'Error al restablecer la contraseña:',
        error.response?.data?.detail || error.message,
      )
      throw error // Opcional: relanzar el error para manejarlo en el componente
    }
  }

  const createUser = async (user_name, complete_name, location_code, admin) => {
    if (!authStore.userData?.admin) {
      console.error('Solo los administradores pueden crear usuarios');
      throw new Error('No autorizado');
    }
    try {
        console.log('Datos nuevo usuario', user_name, complete_name, location_code, admin)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          user_name: user_name,
          complete_name: complete_name,
          location_code: location_code,
          admin: admin,
          password: '123456',  // Considera implementar un generador de contraseñas seguro
          restore_password: true,  // Forzar cambio de contraseña en primer inicio
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Usuario creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error.response?.data || error.message);
      throw error;
    }
  };
  const deleteUser = async (user_name) => {
    if (!authStore.userData?.admin) {
      console.error('Solo los administradores pueden eliminar usuarios');
      throw new Error('No autorizado');
    }
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${user_name}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Usuario eliminado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  const stateUser = async (user_name, state) => {
    if (!authStore.userData?.admin) {
      console.error('Solo los administradores pueden desactivar usuarios');
      throw new Error('No autorizado');
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user_name}`,
        {
          is_active: state,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Usuario actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al desactivar usuario:', error.response?.data || error.message);
      throw error;
    }
  }

  const switchPermission = async (user_name, admin) => {
    if (!authStore.userData?.admin) {
      console.error('Solo los administradores pueden cambiar permisos');
      throw new Error('No autorizado');
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user_name}`,
        {
          admin: admin,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.userData.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Permiso cambiado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar permiso:', error.response?.data || error.message);
      throw error;
    }
  }


  return {
    restorePassword,
    updatePassword,
    createUser,
    deleteUser,
    stateUser,
    switchPermission
  }
})
