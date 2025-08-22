<template>
    <div class="search-container">
      <div class="search-header">
        <h1>Búsqueda de Facturas</h1>
        <div class="header-buttons">
          <button @click="router.push('/users')" v-if="authStore.userData.admin" class="btn-secondary">
            <ion-icon name="people"></ion-icon> Usuarios
          </button>
          <button @click="(authStore.logout(), router.push('/'))" class="btn-logout">
            <ion-icon name="log-out"></ion-icon> Cerrar sesión
          </button>
        </div>
      </div>
  
      <div class="search-filters">
        <div class="filter-section">
          <h2>Tipo de búsqueda</h2>
          <div class="filter-group">
            <label for="typeSearch" class="filter-label">
              <span>Tipo de búsqueda:</span>
              <select name="" id="typeSearch" v-model="typeSearch" class="filter-select">
                <option value="FEDEARROZ">FEDEARROZ</option>
                <option value="PROVEEDORES">PROVEEDORES</option>
              </select>
            </label>
            <label for="typeFile" class="filter-label">
              <span>Tipo de archivo:</span>
              <select name="" id="typeFile" v-model="typeFile" class="filter-select">
                <option value="FAC">FACTURAS</option>
                <option value="NC">NOTAS DE CRÉDITO</option>
                <option value="ND">NOTAS DE DÉBITO</option>
                <option value="SA">SOPORTE DE ADQUISICIÓN</option>
              </select>
            </label>
            <label for="date-range" class="filter-label">
              <span>Rango de fechas:</span>
              <select name="" id="date-range" v-model="dateRange" class="filter-select">
                <option value="1">2018-2020</option>
                <option value="2">2020 en adelante</option>
              </select>
            </label>
          </div>
        </div>
        <div class="filter-section">
          <h2>Filtros</h2>
          <div class="filter-group">
            <label for="nit-search" class="filter-label" v-if="typeSearch === 'PROVEEDORES'">
              <span>NIT:</span>
              <input type="text" id="nit-search" v-model="nit_search" class="filter-input" />
            </label>
            <label for="start-date" class="filter-label">
              <span>Fecha inicio:</span>
              <input
                type="date"
                id="start-date"
                v-model="start_date"
                min="2018-01-01"
                max="2050-12-31"
                class="filter-input"
              />
            </label>
            <label for="end-date" class="filter-label">
              <span>Fecha fin:</span>
              <input type="date" id="end-date" v-model="end_date" min="2018-01-01" max="2050-12-31" class="filter-input" />
            </label>
            <label v-if="authStore.userData.location_code === '1101' && typeSearch === 'FEDEARROZ'" class="filter-label">
              <span>Ubicación:</span>
              <select v-model="selectedLocation" class="filter-select">
                <option value="">Todas las ubicaciones</option>
                <option v-for="location in locationsList" :key="location.code" :value="location.code">
                  {{ location.name }} ({{ location.code }})
                </option>
              </select>
            </label>
            <button @click="searchFactures" class="search-button">
              <ion-icon name="search"></ion-icon> Buscar
            </button>
          </div>
        </div>
      </div>
  
      <div class="results-container" v-if="filesData.length > 0">
        <div class="results-header">
          <h2>Resultados de la búsqueda</h2>
          <span class="results-count">{{ filesData.length }} facturas encontradas</span>
        </div>
  
        <div class="table-container">
          <table class="factures-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>NIT</th>
                <th>N° Factura</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="facture in filesData" :key="facture.file_name" class="facture-row">
                <td>{{ formatDate(facture.date) }}</td>
                <td>{{ facture.nit || 'N/A' }}</td>
                <td>{{ facture.bill_number || 'N/A' }}</td>
                <td class="actions-cell">
                  <button class="download-btn" @click="downloadFile()">
                    <ion-icon name="download"></ion-icon> Descargar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="no-results">
        <ion-icon name="document-text-outline" class="no-results-icon"></ion-icon>
        <p>No se encontraron facturas con los filtros seleccionados</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, inject } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useFacturesStore } from '../stores/factures'
  import locations from '../assests/utils/locations.json'
  import { useRouter } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const isLoading = inject('isLoading')
  
  const locationsList = [...locations.locations].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
  )
  
  const typeSearch = ref('FEDEARROZ')
  const typeFile = ref('')
  const dateRange = ref('')
  
  const selectedLocation = ref('')
  const start_date = ref(null)
  const end_date = ref(null)
  const facturesStore = useFacturesStore()
  const nit_search = ref(null)
  
  const filesData = ref([])
  
  const searchFactures = async () => {
    isLoading.value = true
    if(nit_search.value === ''){
      nit_search.value = null
    }
    try {
      const response = await facturesStore.getFactures(
        selectedLocation.value,
        start_date.value,
        end_date.value,
        nit_search.value,
        typeSearch.value
      )
      filesData.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  const downloadFile = () => {
    const link = document.createElement('a')
    link.href = 'C:/Users/David Carrillo/Documents/ARC@/file_sorter/sorted_files/suppliers/FACTURA-UBL(1061463;FE296;2022-12-12;PRINCIPAL;PRINCIPAL).pdf'
    link.download = 'FACT'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  onMounted(() => {
    selectedLocation.value = authStore.userData.location_code
    searchFactures()
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
  }
  
  h2 {
    color: var(--fede-color, #2c5aa0);
    font-size: 1.3rem;
    margin: 0 0 15px 0;
    font-weight: 600;
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
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 30px;
  }
  
  .filter-section {
    padding: 15px;
    background: #f9fafc;
    border-radius: 8px;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
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
  
  .filter-input,
  .filter-select {
    padding: 12px 15px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
    transition: all 0.25s ease;
    background: white;
  }
  
  .filter-input:focus,
  .filter-select:focus {
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
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
    transform: translateY(-2px);
  }
  
  .btn-logout {
    background-color: #dc3545;
    color: white;
  }
  
  .btn-logout:hover {
    background-color: #c82333;
    transform: translateY(-2px);
  }
  
  .search-button {
    background-color: var(--fede-color, #2c5aa0);
    color: white;
    margin-top: 10px;
    justify-content: center;
  }
  
  .search-button:hover {
    background-color: var(--fede-color-hover, #1e3d73);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
    padding-bottom: 15px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .results-count {
    color: #6b7280;
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
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .factures-table th {
    background-color: #f9fafb;
    color: #374151;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }
  
  .facture-row:hover {
    background-color: #f8f9fa;
  }
  
  .actions-cell {
    white-space: nowrap;
  }
  
  .download-btn {
    background-color: var(--fede-color, #2c5aa0);
    color: white;
    padding: 8px 14px;
    font-size: 0.85rem;
    height: auto;
  }
  
  .download-btn:hover {
    background-color: var(--fede-color-hover, #1e3d73);
    transform: translateY(-1px);
  }
  
  .no-results {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    color: #6b7280;
    font-size: 1.1rem;
  }
  
  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #d1d5db;
  }
  
  /* Responsive adjustments */
  @media (max-width: 968px) {
    .search-filters {
      grid-template-columns: 1fr;
      gap: 20px;
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
    
    .filter-input,
    .filter-select {
      width: 100%;
    }
    
    .search-button {
      width: 100%;
    }
  }
  </style>