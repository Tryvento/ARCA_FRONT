<template>
  <div class="search-container">
    <div class="search-header">
      <h1>BÚSQUEDA DE FACTURAS</h1>
      <h2>{{ authStore.userData.location_code }}</h2>
      <div class="header-buttons">
        <button
          @click="router.push('/users')"
          v-if="authStore.userData.admin"
          class="btn-secondary"
        >
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
          <label
            for="date-range"
            class="filter-label"
            v-if="typeFile === 'NC' || typeFile === 'ND'"
          >
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
            <input
              type="date"
              id="end-date"
              v-model="end_date"
              min="2018-01-01"
              max="2050-12-31"
              class="filter-input"
            />
          </label>
          <label
            v-if="
              authStore.userData.location_code === '1101' &&
              typeSearch === 'FEDEARROZ' &&
              dateRange === '2'
            "
            class="filter-label"
          >
            <span>Ubicación:</span>
            <select v-model="selectedLocation" class="filter-select">
              <option value="">Todas las ubicaciones</option>
              <option v-for="location in locationsList" :key="location.code" :value="location.code">
                {{ location.name }} ({{ location.code }})
              </option>
            </select>
          </label>
          <label class="filter-label">
            <span>Mostrar:</span>
            <select v-model="pageSize" @change="searchFactures" class="filter-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <button @click="searchFactures(false)" class="search-button">
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
                <button class="download-btn" @click="downloadFile(facture)">
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
    <div class="pagination" v-if="totalPages > 1">
      <button @click="previousPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
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
const typeFile = ref('FAC')
const dateRange = ref('2')

const selectedLocation = ref('')
const start_date = ref(null)
const end_date = ref(null)
const facturesStore = useFacturesStore()
const nit_search = ref(null)

const filesData = ref([])
const files_paths = ref('')

const totalPages = ref(1)
const currentPage = ref(1)
const pageSize = ref(25)

const searchFactures = async (isPagination = false) => {
  filesData.value = []

  if (!isPagination) {
    console.log("isPagination: ", isPagination)
    currentPage.value = 1
  }

  if ((typeFile.value === 'NC' || typeFile.value === 'ND') && typeSearch.value === 'PROVEEDORES') {
    
  }

  if (typeFile.value === 'FAC') {
    isLoading.value = true
    if (nit_search.value === '') {
      nit_search.value = null
    }
    try {
      const response = await facturesStore.getFactures(
        selectedLocation.value,
        start_date.value,
        end_date.value,
        nit_search.value,
        typeSearch.value,
        currentPage.value,
        pageSize.value,
      )
      filesData.value = response.data
      totalPages.value = response.total_pages

      console.log(filesData.value)
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  } else if (typeFile.value === 'NC' || typeFile.value === 'ND') {
    console.log('Searching for notes:', typeFile.value)
    try {
      console.log(typeFile.value)
      const response = await facturesStore.getNCND(
        dateRange.value,
        typeFile.value.toLowerCase(),
        selectedLocation.value,
        start_date.value,
        end_date.value,
        currentPage.value,
        pageSize.value,
      )
      console.log(response)
      filesData.value = response.data
      totalPages.value = response.total_pages
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const downloadFile = async (facture) => {
  isLoading.value = true
  let path = ''
  if (typeSearch.value === 'FEDEARROZ'){
    path = selectedLocation.value
  } else if (typeSearch.value === 'PROVEEDORES'){
    path = 'suppliers'
  }
  switch (typeFile.value) {
    case 'FAC':
      path += '/factura-ubl'
      break;
    case 'NC':
      path += '/nc-ubl'
      break;
    case 'ND':
      path += '/nd-ubl'
      break;
    case 'SA':
      path = 'soportes-adquisicion'
      break;
    default:
      break;
  }
  files_paths.value = await facturesStore.getFilesPath(path, facture.file_name)
  facturesStore.downloadFile(files_paths.value.pdf, files_paths.value.xml, facture.file_name)
  isLoading.value = false
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    searchFactures(true)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    searchFactures(true)
  }
}

onMounted(() => {
  console.log('SearchView mounted')
  console.log('User data:', authStore.userData)
  selectedLocation.value = authStore.userData.location_code
  console.log('Selected location:', selectedLocation.value)
  console.log('Initial typeFile:', typeFile.value)
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

.pagination button {
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}

.page-size {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
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
