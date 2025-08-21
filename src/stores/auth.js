import { ref} from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('userAuth', () => {
  const userData = ref({
    user_name: '',
    complete_name: '',
    location_code: '',
    admin: false,
    token: '',
    restore_password: false,
  })

  const login = async (user_name, password) => {
    try {
      if (!user_name || !password) {
        throw new Error('Por favor ingrese usuario y contraseña')
      }

      const response = await axios.post(
        'http://localhost:8000/login',
        {
          user_name: user_name.trim(),
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => true, // Ensure we don't get HTTP errors for non-2xx responses
        },
      )

      if (response.status === 200) {
        userData.value.token = response.data.access_token
        try {
            const userResponse = await axios.get('http://localhost:8000/users/me', {
                headers: {
                    'Authorization': `Bearer ${userData.value.token}`,
                    'Content-Type' : 'application/json',
                }

            })
            userData.value.user_name = userResponse.data.user_name
            userData.value.complete_name = userResponse.data.complete_name
            userData.value.location_code = userResponse.data.location_code
            userData.value.admin = userResponse.data.admin
            userData.value.restore_password = userResponse.data.restore_password

            localStorage.setItem('userData', JSON.stringify(userData.value))

            console.log(userData.value)
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error)
        }
        return { success: true, message: 'Inicio de sesión exitoso' }
      } else if (response.status === 401) {
        return { success: false, message: 'Usuario o contraseña incorrectos' }
      } else {
        return { success: false, message: response.data?.detail || 'Error en el servidor' }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Error de conexión con el servidor' 
      }
    }
  }

  const logout = () => {
    userData.value = {
      user_name: '',
      complete_name: '',
      location_code: '',
      admin: false,
      token: '',
      restore_password: false,
    }
    localStorage.removeItem('userData')
  }

  const verifyToken = async () => {
    if (!userData.value.token) {
      logout()
      return
    }
    try {
      const response = await axios.get('http://localhost:8000/users/me', {
        headers: {
          'Authorization': `Bearer ${userData.value.token}`,
          'Content-Type' : 'application/json',
        }
      })
      userData.value.user_name = response.data.user_name
      userData.value.complete_name = response.data.complete_name
      userData.value.location_code = response.data.location_code
      userData.value.admin = response.data.admin
      userData.value.restore_password = response.data.restore_password
      localStorage.setItem('userData', JSON.stringify(userData.value))
      console.log("Token verificado: ", userData.value.token)
      return { success: true, message: 'Inicio de sesión exitoso' }
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
        console.log("Token expirado: ", userData.value.token)
        return { success: false, message: 'Sesion Expirada' }
      }
      console.log("Error al verificar token: ", error)
      return { success: false, message: error.response?.data?.detail || 'Error de conexión con el servidor' }
    }
  }

  return {
    userData,
    login,
    logout,
    verifyToken,
  }
})
