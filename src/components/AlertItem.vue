<template>
  <div
    ref="alertElement"
    :class="['alert', `alert--${type}`]"
    @mouseover="pauseTimer"
    @mouseleave="resumeTimer"
    v-show="isVisible"
    :style="{ width: 'fit-content' }"
  >
      <div class="alert_content">
        <span class="alert_message">{{ message }}</span>
        <button v-if="!duration" @click="close" class="alert_close" aria-label="Cerrar Alerta">
          <ion-icon name="close"></ion-icon>
        </button>
      </div>
      <div
        v-if="duration"
        :class="['alert_progress', `alert_progress--${type}`]"
        :style="progressStyle"
      ></div>
    </div>
</template>

<script>
export default {
  // Nombre del componente para depuración y referencia
  name: 'AlertItem',
  
  // Props que recibe el componente
  props: {
    // Identificador único para cada alerta
    id: {
      type: [String, Number],
      required: true,
    },
    // Tipo de alerta que determina el estilo visual
    type: {
      type: String,
      default: 'info',
      // Valida que el tipo sea uno de los permitidos
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
    },
    // Mensaje que se mostrará en la alerta
    message: {
      type: String,
      required: true,
    },
    // Duración en milisegundos que la alerta estará visible (0 = permanente)
    duration: {
      type: Number,
      default: 0,
    },
  },
  
  // Datos reactivos del componente
  data() {
    return {
      isVisible: true,        // Controla si la alerta es visible
      progressWidth: '100%',  // Ancho actual de la barra de progreso
      timer: null,           // Referencia al temporizador de la alerta
      remainingTime: this.duration, // Tiempo restante para que se cierre
      observer: null,        // Observer para detectar cambios en el ancho
    }
  },
  
  // Propiedades computadas
  computed: {
    // Estilos dinámicos para la barra de progreso
    progressStyle() {
      return {
        width: this.progressWidth,
        // Transición suave para la animación de la barra
        transition: `width ${this.remainingTime}ms linear`,
      }
    },
  },
  
  // Hook del ciclo de vida: se ejecuta cuando el componente se monta en el DOM
  mounted() {
    // Inicia el temporizador si se especificó una duración
    if (this.duration > 0) {
      this.startTimer()
    }
    
    // Configurar el observer para detectar cambios en el ancho
    this.setupWidthObserver()
  },
  
  beforeUnmount() {
    this.clearTimer()
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  
  // Métodos del componente
  methods: {
    // Inicia el temporizador para cerrar automáticamente la alerta
    startTimer() {
      this.clearTimer() // Limpia cualquier temporizador existente
      this.remainingTime = this.duration
      this.progressWidth = '100%'

      // Pequeño retraso para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        this.progressWidth = '0%' // Inicia la animación de la barra de progreso
      }, 50)

      // Configura el temporizador para cerrar la alerta
      this.timer = setTimeout(() => {
        this.close()
      }, this.duration)
    },
    
    // Pausa el temporizador cuando el usuario pasa el mouse sobre la alerta
    pauseTimer() {
      if (this.duration > 0) {
        this.clearTimer()
        // Obtiene el ancho actual de la barra de progreso
        const computedStyle = window.getComputedStyle(this.$el.querySelector('.alert_progress'))
        const currentWidth = parseFloat(computedStyle.width)
        // Calcula el ancho total del contenedor padre
        const totalWidth = this.$el.querySelector('.alert_progress').parentElement.offsetWidth
        // Calcula el tiempo restante basado en el progreso actual
        this.remainingTime = (currentWidth / totalWidth) * this.duration
      }
    },
    
    // Reanuda el temporizador cuando el usuario quita el mouse
    resumeTimer() {
      if (this.duration > 0 && this.remainingTime > 0) {
        this.startTimer()
      }
    },
    
    // Limpia el temporizador actual
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    
    // Cierra la alerta
    close() {
      // Emite el evento de cierre
      this.$emit('close', this.id)
      this.isVisible = false
      this.clearTimer()
    },
    
    setupWidthObserver() {
      // Usar ResizeObserver para detectar cambios en el ancho del alerta
      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const width = entry.contentRect.width
            const wrapper = this.$el.closest('.alert-wrapper')
            if (wrapper) {
              wrapper.style.setProperty('--alert-width', `${width}px`)
            }
          }
        })
        
        if (this.$refs.alertElement) {
          this.observer.observe(this.$refs.alertElement)
        }
      }
    },
  },
}
</script>

<style scoped>
.alert {
  position: relative;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: inline-flex;
  flex-direction: column;
  max-width: 100%;
  width: fit-content;
}

/* Alert enter/leave transitions */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-fade-move {
  transition: transform 0.3s ease;
}
.alert_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  white-space: nowrap;
}
.alert_message {
  flex: 1;
  margin-right: .5rem;
  font-size: 1rem;
  font-weight: bold;
  font-family: var(--font-family);
}
.alert_close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.alert_progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
}
.alert--info {
  background-color: var(--alert-color);
  color: var(--info-color);
  border-left: 4px solid var(--info-color-hover);
}
.alert--success {
  background-color: var(--alert-color);
  color: var(--fede-color);
  border-left: 4px solid var(--fede-color-hover);
}
.alert--warning {
  background-color: var(--alert-color);
  color: var(--warning-color);
  border-left: 4px solid var(--warning-color-hover);
}
.alert--error {
  background-color: var(--alert-color);
  color: var(--negative-color);
  border-left: 4px solid var(--negative-color-hover);
}

/* Barras de progreso por tipo */
.alert_progress--info {
  background-color: var(--info-color-hover);
}
.alert_progress--success {
  background-color: var(--fede-color-hover);
}
.alert_progress--warning {
  background-color: var(--warning-color-hover);
}
.alert_progress--error {
  background-color: var(--negative-color-hover);
}

/* Transiciones */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

</style>
