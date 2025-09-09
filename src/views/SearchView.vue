<template>
  <div class="search-container">
    <div class="search-header">
      <h1><img src="../assests/images/arca_inv_logo.png" alt="" />BÚSQUEDA DE COMPROBANTES </h1>
      <span class="header-user">
        <h2>
          {{
            locationsList.find((location) => location.code === authStore.userData.location_code)
              ?.name || 'Ubicación desconocida'
          }}
        </h2>
        <h2>{{ authStore.userData.complete_name }}</h2>
      </span>
      <div class="header-buttons">
        <button
          @click="router.push('/users')"
          v-if="authStore.userData.admin"
          class="btn-secondary"
          title="Usuarios"
        >
          <ion-icon name="people"></ion-icon>
        </button>
        <button
          v-if="authStore.userData.admin"
          @click="showUploadFilesWindow = true"
          class="btn-upload"
          title="Subir archivos"
        >
          <ion-icon name="cloud-upload"></ion-icon>
        </button>
        <button
          @click="(authStore.logout(), router.push('/'))"
          class="btn-logout"
          title="Cerrar sesión"
        >
          <ion-icon name="log-out"></ion-icon>
        </button>
      </div>
    </div>

    <div class="search-filters">
      <div class="filter-section">
        <h2>Tipo de búsqueda</h2>
        <div class="filter-group">
          <label
            for="typeSearch"
            class="filter-label"
            v-if="authStore.userData.location_code === '1101' || authStore.userData.admin"
            id="step1"
          >
            <div class="label-with-tooltip">
              <span>Tipo de búsqueda:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona el tipo de búsqueda: EMISIÓN para facturas emitidas por FEDEARROZ o
                  RECEPCIÓN para facturas de proveedores.</span
                >
              </div>
            </div>
            <select name="" id="typeSearch" v-model="typeSearch" class="filter-select">
              <option value="FEDEARROZ">EMISION - FEDEARROZ</option>
              <option value="PROVEEDORES">RECEPCION - PROVEEDORES</option>
            </select>
          </label>
          <label for="typeFile" class="filter-label" id="step2">
            <div class="label-with-tooltip">
              <span>Tipo de archivo:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona el tipo de documento que deseas buscar: Facturas, Notas de Crédito,
                  Notas de Débito o, Soportes de Adquisición solo para EMISIÓN.</span
                >
              </div>
            </div>
            <select name="" id="typeFile" v-model="typeFile" class="filter-select">
              <option value="FAC">FACTURAS</option>
              <option value="NC">NOTAS DE CRÉDITO</option>
              <option value="ND">NOTAS DE DÉBITO</option>
              <option value="SA" v-if="typeSearch === 'FEDEARROZ'">SOPORTE DE ADQUISICIÓN</option>
            </select>
          </label>
          <label
            for="date-range"
            class="filter-label"
            v-if="(typeFile === 'NC' || typeFile === 'ND') && typeSearch === 'FEDEARROZ'"
            id="step3"
          >
            <div class="label-with-tooltip">
              <span>Rango de fechas:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona el rango de fechas para la búsqueda de notas crédito/débito: 2018-2020
                  o 2020 en adelante.</span
                >
              </div>
            </div>
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
          <label for="nit-search" class="filter-label" v-if="typeSearch === 'PROVEEDORES'" id="step4">
            <div class="label-with-tooltip">
              <span>NIT:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Ingresa el NIT del proveedor para filtrar los resultados.</span
                >
              </div>
            </div>
            <input type="text" id="nit-search" v-model="nit_search" class="filter-input" />
          </label>
          <label for="start-date" class="filter-label" id="step5">
            <div class="label-with-tooltip">
              <span>Fecha inicio:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona la fecha de inicio para filtrar. Puedes usar solo esta fecha, solo la
                  fecha final, o ambas.</span
                >
              </div>
            </div>
            <input
              type="date"
              id="start-date"
              v-model="start_date"
              min="2018-01-01"
              max="2050-12-31"
              class="filter-input"
            />
          </label>
          <label for="end-date" class="filter-label" id="step6">
            <div class="label-with-tooltip">
              <span>Fecha fin:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona la fecha de fin para filtrar. Puedes usar solo esta fecha, solo la
                  fecha de inicio, o ambas.</span
                >
              </div>
            </div>
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
              dateRange === '2' &&
              typeFile !== 'SA'
            "
            class="filter-label"
            id="step7"
          >
            <div class="label-with-tooltip">
              <span>Ubicación:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext"
                  >Selecciona la ubicación para filtrar los resultados. Solo disponible para ciertos
                  tipos de búsqueda.</span
                >
              </div>
            </div>
            <select v-model="selectedLocation" class="filter-select">
              <!-- <option value="all" v-if="typeFile !== 'SA'">Todas las ubicaciones</option> -->
              <option v-for="location in locationsList" :key="location.code" :value="location.code">
                ({{ location.code }}) / {{ location.name }}
              </option>
              <option value="others">OTROS</option>
            </select>
          </label>
          <label class="filter-label" id="step8">
            <div class="label-with-tooltip">
              <span>Mostrar:</span>
              <div class="tooltip">
                <ion-icon name="help-circle"></ion-icon>
                <span class="tooltiptext">Selecciona cuántos resultados mostrar por página.</span>
              </div>
            </div>
            <select v-model="pageSize" @change="searchFactures" class="filter-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
            </select>
          </label>
          <div class="filter-buttons">
            <button @click="clearFilters" class="btn-secondary">
              <ion-icon name="trash"></ion-icon> Limpiar Filtros
            </button>
            <button @click="searchFactures(false)" class="search-button">
              <ion-icon name="search"></ion-icon> Buscar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="results-container" v-if="filesData.length > 0">
      <div class="results-header">
        <h2>Resultados de la búsqueda</h2>
        <div class="header-actions">
          <div class="results-toggle-container">
            <transition name="fade-swap" mode="out-in">
              <span class="results-count" v-if="selectedFiles.length === 0" key="count">
                <ion-icon name="search"></ion-icon>
                {{ totalFiles }} comprobantes encontrados
              </span>
              <button v-else key="download" @click="downloadSelected" class="download-selected-btn" >
                <ion-icon name="download"></ion-icon> Descargar
                {{ selectedFiles.length }} seleccionados
              </button>
            </transition>
          </div>
        </div>
      </div>

      <div class="table-container" id="step9">
        <table class="factures-table">
          <thead>
            <tr>
              <th>
                <label for="selectAll" class="checkbox-container">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    id="selectAll"
                  />
                  <span class="checkmark"></span>
                </label>
              </th>
              <th>Fecha</th>
              <th>NIT</th>
              <th v-if="typeSearch === 'PROVEEDORES'">Proveedor</th>
              <th>N° COMPROBANTE</th>
              <th v-if="selectedLocation === 'all'">Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="facture in filesData"
              :key="facture.file_name"
              class="facture-row"
              :class="{ selected: selectedFiles.includes(facture.file_name) }"
            >
              <td>
                <label :for="`select-${facture.file_name}`" class="checkbox-container">
                  <input
                    type="checkbox"
                    v-model="selectedFiles"
                    :value="facture.file_name"
                    :id="`select-${facture.file_name}`"
                  />
                  <span class="checkmark"></span>
                </label>
              </td>
              <td>{{ formatDate(facture.date) }}</td>
              <td>{{ facture.nit || 'N/A' }}</td>
              <td v-if="typeSearch === 'PROVEEDORES' && facture.nit">
                {{
                  facture.nit === '860010522' ? 'FEDEARROZ' : supplierNames[facture.nit] || 'N/A'
                }}
              </td>
              <td>{{ facture.bill_number || 'N/A' }}</td>
              <td v-if="selectedLocation === 'all'">
                {{ getLocationFromInvoice(facture.bill_number) }}
              </td>
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
  <transition name="fade">
    <UploadFiles v-if="showUploadFilesWindow" @close="showUploadFilesWindow = false" />
  </transition>

  <transition name="fade">
    <div class="modal" v-if="showDownloadConfirm">
      <div class="modal-content">
        <p v-if="pendingDownload?.type === 'single'">
          ¿Estás seguro de que deseas descargar este archivo?
        </p>
        <p v-else>
          ¿Estás seguro de que deseas descargar {{ selectedFiles.length }} archivos seleccionados?
        </p>
        <div class="modal-buttons">
          <button @click="confirmDownload" class="modal-button">Sí</button>
          <button @click="cancelDownload" class="modal-cancel-button">No</button>
        </div>
      </div>
    </div>
  </transition>
  
  <TourButton :steps="steps" class="tour-button"/>
</template>

<script setup>
import { ref, onMounted, inject, provide, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useFacturesStore } from '../stores/files'
import { useLogsStore } from '../stores/logs'
import { useSuppliersStore } from '../stores/suppliers'
import { useRouter } from 'vue-router'
import axios from 'axios'
import JSZip from 'jszip'
import UploadFiles from '../components/UploadFilesWindow.vue'
import TourButton from '../components/TourButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const alerts = inject('alerts')

const isLoading = inject('isLoading')

const showUploadFilesWindow = ref(false)
provide('showUploadFilesWindow', showUploadFilesWindow)

const locationsList = ref([])

const steps = [
    {
      element: '#step1',
      popover: {
        title: 'Tipo de Búsqueda',
        description: 'Selecciona el tipo de búsqueda:\n- EMISIÓN para facturas emitidas por FEDEARROZ\n- RECEPCIÓN para facturas de proveedores',
        position: 'bottom',
        showButtons: ['next'],
        doneBtnText: 'Entendido',
        nextBtnText: 'Siguiente'
      }
    },
    {
      element: '#step2',
      popover: {
        title: 'Tipo de Documento',
        description: 'Selecciona el tipo de documento que deseas buscar:\n- Facturas\n- Notas de Crédito\n- Notas de Débito\n- Soportes de Adquisición (solo para EMISIÓN)',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente'
      }
    },
    {
      element: '#step3',
      popover: {
        title: 'Rango de Fechas (Notas Crédito/Débito)',
        description: 'Solo para Notas de Crédito/Débito de EMISIÓN:\n\nSelecciona el rango de fechas:\n- 2018-2020\n- 2020 en adelante',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente',
        when: {
          show: () => (typeFile.value === 'NC' || typeFile.value === 'ND') && typeSearch.value === 'FEDEARROZ'
        }
      }
    },
    {
      element: '#step4',
      popover: {
        title: 'Búsqueda por NIT',
        description: 'Solo para búsqueda de PROVEEDORES:\n\nIngresa el NIT del proveedor para filtrar los resultados.',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente',
        when: {
          show: () => typeSearch.value === 'PROVEEDORES'
        }
      }
    },
    {
      element: '#step5',
      popover: {
        title: 'Filtrar por Fecha de Inicio',
        description: 'Selecciona la fecha de inicio para filtrar los resultados.\n\nPuedes usar solo esta fecha, solo la fecha final, o ambas.',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente'
      }
    },
    {
      element: '#step6',
      popover: {
        title: 'Filtrar por Fecha de Fin',
        description: 'Selecciona la fecha de fin para filtrar los resultados.\n\nPuedes usar solo esta fecha, solo la fecha de inicio, o ambas.',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente'
      }
    },
    {
      element: '#step7',
      popover: {
        title: 'Filtrar por Ubicación',
        description: 'Solo para EMISIÓN y ciertos tipos de documentos (no Soportes de Adquisición):\n\nSelecciona la ubicación para filtrar los resultados.',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente',
        when: {
          show: () => typeSearch.value === 'FEDEARROZ' && typeFile.value !== 'SA' && authStore.userData.location_code === '1101'
        }
      }
    },
    {
      element: '#step8',
      popover: {
        title: 'Resultados por Página',
        description: 'Selecciona cuántos resultados deseas ver por página.\n\nOpciones disponibles: 10, 25, 50 o 100 resultados.',
        position: 'bottom',
        showButtons: ['next', 'previous'],
        prevBtnText: 'Anterior',
        nextBtnText: 'Siguiente'
      }
    },
    {
      element: '.results-container',
      popover: {
        title: 'Resultados de Búsqueda',
        description: 'Aquí se mostrarán los resultados de tu búsqueda.\n\nPuedes:\n- Ordenar los resultados haciendo clic en los encabezados de columna\n- Seleccionar documentos para descargar\n- Navegar entre páginas si hay muchos resultados',
        position: 'left'
      }
    }
]

const getLocationFromInvoice = (invoiceNumber) => {
  if (!invoiceNumber) return 'Otro'

  // Get first 4 digits from invoice number
  const invoiceCode = invoiceNumber.toString().substring(0, 4)

  // Find location with matching code
  const location = locationsList.find((loc) => loc.code === invoiceCode)

  return location ? location.name : 'Otro'
}

const logsStore = useLogsStore()
const suppliersStore = useSuppliersStore()
const supplierNames = ref({})

const getSupplierName = async (nit) => {
  if (!nit) return 'N/A'

  // Return cached name if available
  if (supplierNames.value[nit]) {
    return supplierNames.value[nit]
  }

  try {
    // Set loading state
    supplierNames.value = { ...supplierNames.value, [nit]: 'Cargando...' }

    const supplierData = await suppliersStore.getSuppliers(nit)
    let supplierName = 'N/A'

    if (supplierData) {
      // Handle both array and single object responses
      const supplier = Array.isArray(supplierData) ? supplierData[0] : supplierData
      if (supplier) {
        supplierName = supplier.complete_name || supplier.name || 'N/A'
      }
    }

    // Update cache
    supplierNames.value = { ...supplierNames.value, [nit]: supplierName }
    return supplierName
  } catch (error) {
    console.error('Error fetching supplier:', error)
    supplierNames.value = { ...supplierNames.value, [nit]: 'N/A' }
    return 'N/A'
  }
}

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
const selectedFiles = ref([])
const selectAll = ref(false)
const showDownloadConfirm = ref(false)
const pendingDownload = ref(null)

const totalPages = ref(1)
const currentPage = ref(1)
const pageSize = ref(25)
const totalFiles = ref(0)

const clearFilters = () => {
  typeSearch.value = 'FEDEARROZ'
  typeFile.value = 'FAC'
  dateRange.value = '2'
  selectedLocation.value = authStore.userData.location_code
  start_date.value = null
  end_date.value = null
  nit_search.value = null
  currentPage.value = 1
  alerts.info(`Limpieza realizada correctamente`, 5000)
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedFiles.value = filesData.value.map((facture) => facture.file_name)
  } else {
    selectedFiles.value = []
  }
}

const downloadSelected = () => {
  if (selectedFiles.value.length === 0) {
    return
  }
  pendingDownload.value = { type: 'multiple', fileNames: [...selectedFiles.value] }
  showDownloadConfirm.value = true
}

const searchFactures = async (isPagination = false) => {
  filesData.value = []
  selectedFiles.value = []
  selectAll.value = false

  if (!isPagination) {
    currentPage.value = 1
  }

  // Ajustar la fecha de inicio para que incluya el día completo
  let adjustedStartDate = start_date.value
  if (start_date.value) {
    const date = new Date(start_date.value)
    date.setHours(0, 0, 0, 0) // Establecer a medianoche en la zona horaria local
    adjustedStartDate = date.toISOString().split('T')[0]
  }

  if (selectedLocation.value === 'all' && typeFile.value !== 'SA') {
    isLoading.value = true
    try {
      const response = await facturesStore.getAll(
        adjustedStartDate,
        end_date.value,
        currentPage.value,
        pageSize.value,
        typeFile.value.toLowerCase(),
      )
      filesData.value = response.data
      totalPages.value = response.total_pages
      totalFiles.value = response.total_items
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  } else if (typeFile.value === 'SA') {
    isLoading.value = true

    try {
      const response = await facturesStore.getSA(
        adjustedStartDate,
        end_date.value,
        currentPage.value,
        pageSize.value,
      )
      filesData.value = response.data
      totalPages.value = response.total_pages
      totalFiles.value = response.total_items
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  } else if (
    (typeFile.value === 'NC' || typeFile.value === 'ND') &&
    typeSearch.value === 'PROVEEDORES'
  ) {
    isLoading.value = true
    try {
      const response = await facturesStore.getNCNDSuppliers(
        typeFile.value,
        adjustedStartDate,
        end_date.value,
        nit_search.value,
        currentPage.value,
        pageSize.value,
      )

      console.log(response)

      if (response && response.data) {
        filesData.value = response.data || []
        totalPages.value = response.total_pages || 1
        totalFiles.value = response.total_items || 0
      } else {
        filesData.value = []
        totalPages.value = 1
        totalFiles.value = 0
        alerts.error(`No se encontraron comprobantes`, 5000)
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      filesData.value = []
      totalPages.value = 1
      totalFiles.value = 0
      alerts.error(`No se encontraron comprobantes`, 5000)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  } else if (typeFile.value === 'FAC') {
    isLoading.value = true
    if (nit_search.value === '') {
      nit_search.value = null
    }
    try {
      const response = await facturesStore.getFactures(
        selectedLocation.value,
        adjustedStartDate,
        end_date.value,
        nit_search.value,
        typeSearch.value,
        currentPage.value,
        pageSize.value,
      )
      filesData.value = response.data
      totalPages.value = response.total_pages
      totalFiles.value = response.total_items
      console.log(filesData.value)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  } else if (typeFile.value === 'NC' || typeFile.value === 'ND') {
    isLoading.value = true
    console.log('Searching for notes:', typeFile.value)
    try {
      console.log(typeFile.value)
      const response = await facturesStore.getNCND(
        dateRange.value,
        typeFile.value.toLowerCase(),
        selectedLocation.value,
        adjustedStartDate,
        end_date.value,
        currentPage.value,
        pageSize.value,
      )
      console.log(response)
      filesData.value = response.data
      totalPages.value = response.total_pages
      totalFiles.value = response.total_items
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const downloadFile = async (facture) => {
  pendingDownload.value = { type: 'single', facture }
  showDownloadConfirm.value = true
}

const confirmDownload = async () => {
  if (!pendingDownload.value) return

  isLoading.value = true
  showDownloadConfirm.value = false

  if (pendingDownload.value.type === 'single') {
    const { facture } = pendingDownload.value
    let path = ''
    if (typeSearch.value === 'FEDEARROZ') {
      path = selectedLocation.value
    } else if (typeSearch.value === 'PROVEEDORES') {
      path = 'suppliers'
    }
    switch (typeFile.value) {
      case 'FAC':
        path += '/factura-ubl'
        break
      case 'NC':
        path += '/nc-ubl'
        break
      case 'ND':
        path += '/nd-ubl'
        break
      case 'SA':
        path = 'soportes-adquisicion'
        break
      default:
        break
    }
    files_paths.value = await facturesStore.getFilesPath(path, facture.file_name)
    facturesStore.downloadFile(files_paths.value.pdf, files_paths.value.xml, facture.file_name)
    const logData = {
      bill_number: facture.bill_number,
      date: facture.date,
      file_name: facture.file_name,
      nit: facture.nit,
    }
    useLogsStore().createLog(authStore.userData.user_name, [logData])
    alerts.info(`Comprobante ${facture.bill_number} descargado`, 5000)
  } else if (pendingDownload.value.type === 'multiple') {
    const { fileNames } = pendingDownload.value
    await downloadMultipleFiles(fileNames)
  }

  pendingDownload.value = null
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const cancelDownload = () => {
  showDownloadConfirm.value = false
  pendingDownload.value = null
}

const downloadMultipleFiles = async (fileNames) => {
  isLoading.value = true
  const logsData = []

  try {
    const zip = new JSZip()

    // First, collect all file information and download files
    for (const fileName of fileNames) {
      let path = ''
      if (typeSearch.value === 'FEDEARROZ') {
        path = selectedLocation.value
      } else if (typeSearch.value === 'PROVEEDORES') {
        path = 'suppliers'
      }

      switch (typeFile.value) {
        case 'FAC':
          path += '/factura-ubl'
          break
        case 'NC':
          path += '/nc-ubl'
          break
        case 'ND':
          path += '/nd-ubl'
          break
        case 'SA':
          path = 'soportes-adquisicion'
          break
        default:
          break
      }

      const files_paths = await facturesStore.getFilesPath(path, fileName)

      // Add file info to logs
      let fileInfo = {
        file_name: fileName,
        nit: '',
        bill_number: '',
        date: '',
      }

      // Parse filename based on file type
      if (typeFile.value === 'SA') {
        // Format for SOPORTE-ADQUISICION
        const parts = fileName.replace('SOPORTE-ADQUISICION(', '').replace(').pdf', '').split(';')
        fileInfo = {
          ...fileInfo,
          nit: parts[0],
          bill_number: parts[1],
          date: parts[2],
        }
      } else {
        // Format for FACTURA-UBL, NC-UBL, ND-UBL
        const prefix =
          typeFile.value === 'FAC'
            ? 'FACTURA-UBL('
            : typeFile.value === 'NC'
              ? 'NC-UBL('
              : 'ND-UBL('
        const parts = fileName.replace(prefix, '').replace(').pdf', '').split(';')
        fileInfo = {
          ...fileInfo,
          nit: parts[0],
          bill_number: parts[1],
          date: parts[2],
        }
      }
      logsData.push(fileInfo)

      const rarBlob = await downloadFileAsBlob(files_paths.pdf, files_paths.xml, fileName)
      zip.file(`${fileName}.rar`, rarBlob)
    }

    // Create ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    // Download ZIP
    const url = window.URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'DATOS.zip')
    document.body.appendChild(link)
    link.click()
    link.remove()

    // Create a single log entry with all files
    if (logsData.length > 0) {
      useLogsStore().createLog(authStore.userData.user_name, logsData)
    }
    alerts.info(`Comprobantes descargados`, 5000)

    // Clean up
    setTimeout(() => window.URL.revokeObjectURL(url), 100)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

const downloadFileAsBlob = async (pdf, xml, file_name) => {
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
      responseType: 'blob',
    })

    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error('Error al descargar archivo:', error.response?.data?.detail || error.message)
    return error.response?.data?.detail || error.message
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    searchFactures(true)
    selectedFiles.value = []
    selectAll.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    searchFactures(true)
    selectedFiles.value = []
    selectAll.value = false
  }
}

onMounted(async () => {
  selectedLocation.value = authStore.userData.location_code

  try {
    isLoading.value = true
    // Load locations first
    const locations = await suppliersStore.getLocations()
    locationsList.value = locations.sort((a, b) => a.code.localeCompare(b.code))

    // Then search factures
    await searchFactures()

    // Pre-fetch supplier names when component mounts
    if (typeSearch.value === 'PROVEEDORES') {
      filesData.value.forEach((facture) => {
        if (facture.nit) {
          getSupplierName(facture.nit)
        }
      })
    }
  } catch (error) {
    console.error('Error initializing component:', error)
    alerts.error('Error al cargar las ubicaciones')
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
})

// Watch for search results to update supplier names
watch(
  () => filesData,
  (newFiles) => {
    if (typeSearch.value === 'PROVEEDORES') {
      newFiles.value.forEach((facture) => {
        if (facture.nit && !supplierNames.value[facture.nit]) {
          getSupplierName(facture.nit)
        }
      })
    }
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
/* Tooltip container */
.label-with-tooltip {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tooltip {
  position: relative;
  display: flex;
  cursor: help;
  color: var(--fede-color);
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
  line-height: 1.4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

tooltip ion-icon {
  color: #666;
  font-size: 14px;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  font-family: var(--font-family);
  color: var(--font-color);
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

.header-user h2 {
  text-align: center;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.header-buttons button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-buttons button ion-icon {
  scale: 1.2;
}

.btn-logout {
  background-color: var(--negative-color, #2c5aa0);
}

.btn-logout:hover {
  background-color: var(--negative-color-hover, #1e3d73);
  transform: translateY(-2px);
}

.btn-logout:active {
  background-color: var(--negative-color-active, #1a2e61);
}

.btn-upload {
  background-color: var(--fede-color, #2c5aa0);
}

.btn-upload:hover {
  background-color: var(--fede-color-hover, #1e3d73);
  transform: translateY(-2px);
}

.btn-upload:active {
  background-color: var(--fede-color-active, #1a2e61);
}

.search-filters {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgb(0, 0, 0, 0.4);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-swap-enter-from,
.fade-swap-leave-to {
  opacity: 0;
}

.fade-swap-enter-to,
.fade-swap-leave-from {
  opacity: 1;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--fede-color, #2c5aa0);
  box-shadow: 0 0 0 3px rgba(44, 90, 160, 0.15);
}

.filter-select:hover{
  outline: none;
}

.header-buttons button,
.search-container button {
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

.results-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
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

/* Contenedor para mantener dimensiones consistentes */
.results-toggle-container {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 280px;
  transition: all 0.3s ease;
}

/* Estilo para el mensaje de conteo */
.results-count {
  color: var(--secondary-color);
  font-size: 0.95rem;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-height: 44px;
  box-sizing: border-box;
  min-width: 280px;
  font-weight: bolder;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilo para el botón de descarga */
.download-selected-btn {
  background-color: var(--fede-color);
  color: white;
  font-size: 0.95rem;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-height: 44px;
  box-sizing: border-box;
  min-width: 280px;
  font-weight: bolder;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-selected-btn:hover {
  background-color: var(--fede-color-hover, #1e3d73);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.download-selected-btn:active {
  background-color: var(--fede-color-active, #1a2e61);
  transform: translateY(0);
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

th:first-child,
td:first-child {
  width: 40px;
  padding-right: 0;
  text-align: center;
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.factures-table th {
  background-color: var(--background-color, #f9fafb);
  color: var(--secondary-color, #374151);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

/* Hover state */
.facture-row:hover {
  background-color: var(--background-color-hover, #f5f5f5);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Selected row state */
.facture-row.selected {
  background-color: rgba(44, 90, 160, 0.08) !important;
  position: relative;
}

.facture-row.selected::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: var(--fede-color);
  border-radius: 0 3px 3px 0;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-height: 44px; /* Minimum touch target size */
  padding: 12px 0;
  user-select: none;
}

.checkbox-container input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border: 2px solid var(--fede-color);
  border-radius: 4px;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: var(--fede-color);
}

.checkbox-container input[type='checkbox']:checked ~ .checkmark {
  background-color: var(--fede-color);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input[type='checkbox']:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
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
  color: var(--secondary-color, #6b7280);
  font-size: 1.1rem;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: var(--secondary-color, #d1d5db);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  font-family: var(--font-family);
  font-size: 1.1rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  margin-top: 25px;
}

.modal-button {
  background-color: var(--positive-color, #4caf50);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-button:hover {
  background-color: var(--positive-color-hover, #45a049);
}

.modal-cancel-button {
  background-color: var(--negative-color, #f44336);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-cancel-button:hover {
  background-color: var(--negative-color-hover, #d32f2f);
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

.filter-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-buttons button {
  width: 100%;
  justify-content: center;
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

  .results-toggle-container {
    min-width: 100%;
  }

  .results-count,
  .download-selected-btn {
    min-width: 100%;
    width: 100%;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }

  .search-button {
    width: 100%;
  }
}

.tour-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
}
</style>
