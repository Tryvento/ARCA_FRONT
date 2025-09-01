<template>
  <div class="upload-files-container">
    <div class="upload-files-modal">
      <div class="modal-header">
        <h2>Subir archivos</h2>
        <button class="close-button" @click="showUploadFilesWindow = false" aria-label="Cerrar ventana">
          <ion-icon name="close"></ion-icon>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="upload-area" :class="{ 'drag-over': dragOver }" 
             @dragover.prevent="dragOver = true" 
             @dragleave="dragOver = false"
             @drop.prevent="handleDrop">
          <ion-icon name="cloud-upload" class="upload-icon"></ion-icon>
          <p>Arrastra tus archivos aquí o</p>
          <label for="file-input" class="browse-button">Seleccionar archivos</label>
          <input id="file-input" type="file" multiple @change="handleFileUpload" />
        </div>
        
        <div class="selected-files" v-if="files.length">
          <div class="files-header" @click="showFilesList = !showFilesList">
            <span>Archivos seleccionados: {{ files.length }}</span>
            <ion-icon name="chevron-down" :class="{ 'expanded': showFilesList }"></ion-icon>
          </div>
          
          <transition name="slide">
            <ul class="files-list" v-if="showFilesList">
              <li v-for="(file, index) in files" :key="index" class="file-item">
                <ion-icon name="document" class="file-icon"></ion-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">({{ formatFileSize(file.size) }})</span>
              </li>
            </ul>
          </transition>
        </div>
        
        <div class="upload-status" :class="{ 'error': uploadStatus.includes('Error') || uploadStatus.includes('Por favor') }">
          {{ uploadStatus }}
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="upload-button" @click="uploadFiles" :disabled="isLoading || !files.length">
          <span v-if="!isLoading">Subir archivos</span>
          <span v-else class="loading-text">
            <svg class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            </svg>
            Subiendo...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { inject } from 'vue'
import axios from 'axios'

export default {
  data() {
    return {
      files: [],
      uploadStatus: '',
      isLoading: inject('isLoading'),
      showUploadFilesWindow: inject('showUploadFilesWindow'),
      showFilesList: false,
      dragOver: false,
      alerts: inject('alerts')
    }
  },
  methods: {
    handleFileUpload(event) {
      this.files = Array.from(event.target.files)
      this.dragOver = false
      this.showFilesList = true
      this.uploadStatus = this.files.length ? '' : 'Por favor, selecciona al menos un archivo'
    },
    handleDrop(event) {
      this.files = Array.from(event.dataTransfer.files)
      this.dragOver = false
      this.showFilesList = true
      this.uploadStatus = this.files.length ? '' : 'Por favor, selecciona al menos un archivo'
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    async uploadFiles() {
      if (!this.files.length) {
        this.uploadStatus = 'Por favor, selecciona al menos un archivo'
        return
      }
      this.isLoading = true
      const formData = new FormData()
      this.files.forEach((file) => {
        formData.append('files', file)
      })

      try {
        const token = useAuthStore().userData.token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload-files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        this.uploadStatus = `Archivos subidos exitosamente: ${response.data.length}`
        this.isLoading = false
        this.alerts.success('Archivos subidos exitosamente', 5000)
        
        // Limpiar después de una subida exitosa
        setTimeout(() => {
          this.files = []
          this.showFilesList = false
        }, 2000)
      } catch (error) {
        this.alerts.error('Error al subir archivos', 5000)
        this.uploadStatus = 'Error al subir archivos'
        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped>
*{
  font-family: var(--font-family);
}
.upload-files-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

.upload-files-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--fede-color, #2c5aa0);
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  font-size: 1.5rem;
}

.close-button:hover {
  color: var(--negative-color, #dc3545);
  background-color: #f8f9fa;
}

.modal-body {
  padding: 25px;
  flex: 1;
  overflow-y: auto;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s;
  background-color: #fafafa;
}

.upload-area.drag-over {
  border-color: var(--fede-color, #2c5aa0);
  background-color: rgba(44, 90, 160, 0.05);
}

.upload-icon {
  color: #9ca3af;
  margin-bottom: 15px;
  font-size: 3rem;
}

.upload-area p {
  margin: 0 0 15px;
  color: #6b7280;
  font-size: 0.95rem;
}

.browse-button {
  display: inline-block;
  background-color: var(--fede-color, #2c5aa0);
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 0.95rem;
}

.browse-button:hover {
  background-color: var(--fede-color-hover, #1e3d73);
  transform: translateY(-2px);
}

#file-input {
  display: none;
}

.selected-files {
  margin-bottom: 20px;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f9fafc;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  color: #444;
}

.files-header ion-icon {
  transition: transform 0.3s;
}

.files-header ion-icon.expanded {
  transform: rotate(180deg);
}

.files-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f3f4f6;
}

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  color: #6b7280;
  margin-right: 10px;
  flex-shrink: 0;
  font-size: 1.2rem;
}

.file-name {
  font-size: 0.9rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
  font-weight: 500;
}

.file-size {
  font-size: 0.8rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.upload-status {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: center;
  background-color: #f9fafc;
  color: #444;
}

.upload-status.error {
  background-color: #fee2e2;
  color: #dc2626;
}

.modal-footer {
  padding: 20px;
  border-top: 2px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.upload-button {
  background-color: var(--fede-color, #2c5aa0);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 0.95rem;
}

.upload-button:hover:not(:disabled) {
  background-color: var(--fede-color-hover, #1e3d73);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.upload-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: rotate 1s linear infinite;
}

.spinner circle {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.slide-enter-active, .slide-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 200px;
  opacity: 1;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .upload-files-modal {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 15px;
  }
  
  .upload-area {
    padding: 20px 15px;
  }
  
  .upload-icon {
    font-size: 2.5rem;
  }
}
</style>