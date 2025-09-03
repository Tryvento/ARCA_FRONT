<template>
    <div class="search-container">
      <div class="search-header">
        <h1><img src="../assests/images/arca_inv_logo.png" alt="">REGISTRO DE DESCARGAS</h1>
        <span class="header-user">
          <h2>{{ authStore.userData.complete_name }}</h2>
        </span>
        <div class="header-buttons">
          <button @click="router.back()" class="btn-secondary">
            <ion-icon name="arrow-back"></ion-icon> Volver
          </button>
        </div>
      </div>
  
      <div class="search-filters">
        <div class="filter-section">
          <h2>Filtros de búsqueda</h2>
          <div class="filter-group">
            <label for="idSearch" class="filter-label">
              <span>ID:</span>
              <input type="text" v-model="idSearch" placeholder="Buscar por ID" id="idSearch" class="filter-input"/>
            </label>
            <label for="userSearch" class="filter-label">
              <span>Usuario:</span>
              <input type="text" v-model="userSearch" placeholder="Buscar por usuario" id="userSearch" class="filter-input"/>
            </label>
            <label for="startDate" class="filter-label">
              <span>Fecha Inicio:</span>
              <input type="date" id="startDate" class="filter-input" v-model="startDate">
            </label>
            <label for="endDate" class="filter-label">
              <span>Fecha Fin:</span>
              <input type="date" id="endDate" class="filter-input" v-model="endDate">
            </label>
            <div class="filter-buttons">
              <button @click="clearFilters" class="btn-secondary">
                <ion-icon name="trash"></ion-icon> Limpiar Filtros
              </button>
              <button @click="searchLogs" class="search-button">
                <ion-icon name="search"></ion-icon> Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="results-container" v-if="logs.length > 0">
        <div class="results-header">
          <h2>Registros de descarga</h2>
          <div class="header-actions">
            <span class="results-count">{{ logs.length }} registros encontrados</span>
          </div>
        </div>
  
        <div class="table-container">
          <table class="factures-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Registros</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in paginatedLogs" :key="log.id" class="facture-row">
                <td>{{ log.id }}</td>
                <td>{{ log.user_name }}</td>
                <td>{{ formatDate(log.download_date) }}</td>
                <td>{{ log.downloaded_records.length }} registros</td>
                <td class="actions-cell">
                  <button class="view-btn" @click="showLogDetails(log)">
                    <ion-icon name="eye"></ion-icon> Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="no-results">
        <ion-icon name="document-text-outline" class="no-results-icon"></ion-icon>
        <p>No se encontraron registros con los filtros seleccionados</p>
      </div>
  
      <div class="pagination" v-if="totalPages > 1">
        <button @click="previousPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
  
      <!-- Log Details Modal -->
      <div v-if="selectedLog" class="modal-overlay" @click.self="selectedLog = null">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Detalles de la Descarga</h2>
            <button @click="selectedLog = null" class="close-button">&times;</button>
          </div>
          <div class="modal-body">
            <div class="modal-row">
              <div class="modal-label">ID:</div>
              <div class="modal-value">{{ selectedLog.id }}</div>
            </div>
            <div class="modal-row">
              <div class="modal-label">Usuario:</div>
              <div class="modal-value">{{ selectedLog.user_name }}</div>
            </div>
            <div class="modal-row">
              <div class="modal-label">Fecha de descarga:</div>
              <div class="modal-value">{{ formatDateTime(selectedLog.download_date) }}</div>
            </div>
            
            <h3 class="files-title">Registros descargados ({{ selectedLog.downloaded_records.length }})</h3>
            <div class="files-list">
              <div v-for="(file, index) in selectedLog.downloaded_records" :key="index" class="file-item">
                <div class="file-row">
                  <span class="file-label">Factura:</span>
                  <span class="file-value">{{ file.bill_number || 'N/A' }}</span>
                </div>
                <div class="file-row">
                  <span class="file-label">NIT:</span>
                  <span class="file-value">{{ file.nit || 'N/A' }}</span>
                </div>
                <div class="file-row">
                  <span class="file-label">Fecha:</span>
                  <span class="file-value">{{ file.date || 'N/A' }}</span>
                </div>
                <div class="file-row">
                  <span class="file-label">Archivo:</span>
                  <span class="file-value filename">{{ file.file_name || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, inject} from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useRouter } from 'vue-router'
  import { useLogsStore } from '../stores/logs'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const logsStore = useLogsStore()
  const alerts = inject('alerts')

  const isLoading = inject('isLoading')
  
  // Datos de prueba
  const logs = ref([])
  
  const selectedLog = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const idSearch = ref('')
  const userSearch = ref('')
  const startDate = ref(null)
  const endDate = ref(null)
  
  // Computed properties
  const totalPages = computed(() => Math.ceil(logs.value.length / pageSize.value))
  const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return logs.value.slice(start, end)
  })
  
  // Methods
  const showLogDetails = (log) => {
    selectedLog.value = log
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }
  
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('es-ES')
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const clearFilters = () => {
    idSearch.value = ''
    userSearch.value = ''
    startDate.value = null
    endDate.value = null
    alerts.info('Filtros limpiados', 5000)
  }
  
  const searchLogs = async () => {
    isLoading.value = true
    logs.value = []
    try {
        if (idSearch.value !== ''){
            const response = await logsStore.getLogById(idSearch.value)
            logs.value = [response]
        } else {
            const response = await logsStore.getLogs(idSearch.value, userSearch.value, startDate.value, endDate.value)
            logs.value = response
        }
        alerts.info('Logs obtenidos', 5000)
    } catch (error) {
        console.error(error)
        alerts.error('Error al buscar logs', 5000)
    } finally {
        isLoading.value = false
    }
    currentPage.value = 1
  }
  
  // Fetch logs when component is mounted
  onMounted(() => {
    // Los datos ya están definidos en logs.value, no es necesario cargarlos de nuevo
    searchLogs()
    if (!authStore.userData.admin){
      alerts.error('No tienes permiso para acceder a esta página', 5000)
      router.push('/search')
    }
  })
  </script>
  
  <style scoped>
  .search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
  }
  
  h1 {
    color: var(--fede-color, #2c5aa0);
    font-size: 2rem;
    margin: 0;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  h1 img {
    width: 50px;
  }
  
  h2 {
    color: var(--fede-color, #2c5aa0);
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    font-weight: 600;
  }
  
  .header-user {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-direction: column;
  }
  
  .header-buttons {
    display: flex;
    gap: 12px;
  }
  
  .search-filters {
    background: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }
  
  .filter-section {
    padding: 15px;
    background: #f9fafc;
    border-radius: 8px;
  }
  
  .filter-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 18px;
  }
  
  .filter-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.95rem;
    color: #444;
    font-weight: 500;
  }
  
  .filter-input {
    padding: 12px 15px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
    transition: all 0.25s ease;
    background: white;
  }
  
  .filter-input:focus {
    outline: none;
    border-color: var(--fede-color, #2c5aa0);
    box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.15);
  }
  
  button {
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.25s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-weight: 500;
  }
  
  .btn-secondary {
    background-color: var(--secondary-color, #6c757d);
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: var(--secondary-color-hover, #5a6268);
    transform: translateY(-2px);
  }
  
  .search-button {
    background-color: var(--fede-color, #2c5aa0);
    color: white;
    justify-content: center;
  }
  
  .search-button:hover {
    background-color: var(--fede-color-hover, #1e3d73);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .filter-buttons {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    grid-column: 1 / -1;
  }
  
  .filter-buttons button {
    flex: 1;
    justify-content: center;
  }
  
  .results-container {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    margin-top: 20px;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .results-count {
    color: var(--secondary-color, #6b7280);
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  .table-container {
    overflow-x: auto;
    margin-top: 15px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .factures-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }
  
  .factures-table th,
  .factures-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .factures-table th {
    background-color: var(--background-color, #f9fafb);
    color: var(--secondary-color, #374151);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }
  
  .facture-row:hover {
    background-color: var(--background-color-hover, #f8f9fa);
  }
  
  .actions-cell {
    white-space: nowrap;
  }
  
  .view-btn {
    background-color: var(--fede-color, #2c5aa0);
    color: white;
    padding: 8px 14px;
    font-size: 0.85rem;
    height: auto;
  }
  
  .view-btn:hover {
    background-color: var(--fede-color-hover, #1e3d73);
    transform: translateY(-1px);
  }
  
  .no-results {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    color: var(--secondary-color, #6b7280);
    font-size: 1.1rem;
  }
  
  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    color: var(--secondary-color, #d1d5db);
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    font-size: 1.2rem;
    gap: 15px;
  }
  
  .pagination button {
    background-color: var(--fede-color, #2c5aa0);
    color: white;
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .pagination button:disabled {
    background-color: var(--secondary-color, #6c757d);
    cursor: not-allowed;
    transform: none;
  }
  
  .pagination button:not(:disabled):hover {
    background-color: var(--fede-color-hover, #1e3d73);
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--fede-color, #2c5aa0);
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    line-height: 1;
    transition: color 0.2s;
  }
  
  .close-button:hover {
    color: var(--negative-color, #dc3545);
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .modal-row {
    display: flex;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .modal-label {
    font-weight: 600;
    color: #495057;
    min-width: 150px;
    font-size: 0.95rem;
  }
  
  .modal-value {
    color: #212529;
    flex: 1;
    font-size: 0.95rem;
  }
  
  .files-title {
    margin: 24px 0 16px;
    font-size: 1.2rem;
    color: var(--fede-color, #2c5aa0);
    padding-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .files-list {
    display: grid;
    gap: 16px;
    margin-top: 16px;
  }
  
  .file-item {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e9ecef;
  }
  
  .file-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  
  .file-row:last-child {
    margin-bottom: 0;
  }
  
  .file-label {
    font-weight: 500;
    color: #495057;
    min-width: 80px;
  }
  
  .file-value {
    color: #212529;
    flex: 1;
  }
  
  .filename {
    font-family: monospace;
    word-break: break-all;
  }
  
  /* Responsive adjustments */
  @media (max-width: 968px) {
    .filter-group {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }
  
  @media (max-width: 768px) {
    .search-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  
    .header-buttons {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
  
    .results-header {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
  
    .filter-buttons {
      flex-direction: column;
    }
  
    .modal-row {
      flex-direction: column;
      gap: 4px;
    }
  
    .modal-label {
      min-width: auto;
    }
    
    .file-row {
      flex-direction: column;
      gap: 4px;
    }
    
    .file-label {
      min-width: auto;
    }
  }
  
  @media (max-width: 480px) {
    .search-container {
      padding: 15px;
    }
  
    .search-filters {
      padding: 15px;
    }
  
    .filter-group {
      grid-template-columns: 1fr;
    }
  
    .results-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  
    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  
    .factures-table th,
    .factures-table td {
      padding: 10px 8px;
      font-size: 0.85rem;
    }
    
    .modal-content {
      width: 95%;
      padding: 10px;
    }
    
    .modal-body {
      padding: 16px;
    }
  }
  </style>