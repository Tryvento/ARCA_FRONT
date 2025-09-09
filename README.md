# Archivo y Recuperacion de Comprobantes Automatico ARCA

## 1. Introducción

### 1.1 Propósito y Descripción del Sistema

El presente documento tiene como objetivo explicar el funcionamiento de ARCA.
Arca es un sistema que permite la gestión de documentos comprobantes electrónicos **(facturas, notas de crédito, notas de débito, soportes de adquisición)**, en cuanto a emitidos como recepcionados. Su enfoque está dado para facilitar el almacenamiento y administración a nivel de búsquedas, cargas y descargas de los respectivos documentos electrónicos; tanto el respectivo PDF (representación gráfica) como el archivo XML. Los comprobantes ya tienen aplicados los filtros respectivos de acuerdo con el Anexo técnico vigente expedido por la DIAN.
De otra parte, se construyó la gestión de usuarios y permisos, con roles de acuerdo con las respectivas ubicaciones. Conectando con la base de datos de Seven ERP para mantener actualizados datos de las ubicaciones, de los terceros, recepción.
### 1.2 Alcance

El sistema **ARCA** abarca las siguientes funcionalidades principales:

- **Búsqueda avanzada** de comprobantes electrónicos.  
- **Gestión documental**, con opción de descarga en diferentes formatos.  
- **Administración centralizada** de usuarios y perfiles de acceso.  
- **Control de permisos granulares**, definidos por ubicación y funcionalidad.  
- **Carga masiva** de documentos.  

Este documento técnico describe en detalle la arquitectura, la configuración y los procedimientos operativos del sistema de búsqueda y repositorio documental **ARCA**.

### 1.3 Público Objetivo

Este documento está dirigido a los siguientes perfiles dentro de **FEDEARROZ**:

- **Equipo de desarrollo**: responsables del mantenimiento, actualización y mejora continua del sistema **ARCA**.  
- **Administradores de sistemas**: encargados de la implementación, configuración y soporte técnico.  
- **Responsables de gestión documental**: usuarios especializados que velan por la correcta administración, organización y disponibilidad de los comprobantes electrónicos.  
- **Auditores o personal de control interno**: quienes requieran validar los procesos de trazabilidad y seguridad implementados en el sistema.  

En general, el documento constituye una referencia técnica para todos los actores involucrados en la operación, soporte y evolución de **ARCA**.


## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

![Diagrama de Arquitectura del Sistema](./src/assests/doc_img/img1.png)

El diagrama anterior ilustra la interacción entre los distintos componentes de **ARCA**, así como la comunicación entre la capa de presentación, la lógica de negocio y los servicios de persistencia de datos.

---

### 2.2 Stack Tecnológico

El sistema **ARCA** está construido sobre un conjunto de tecnologías modernas que garantizan escalabilidad, mantenibilidad y alto rendimiento.

#### 2.2.1 Frontend

La capa de presentación fue desarrollada con tecnologías orientadas a la construcción de interfaces web dinámicas e interactivas:

- **Vue 3** – Framework progresivo para el desarrollo de interfaces de usuario.  
- **Vite** – Herramienta de construcción rápida y optimizada para entornos de desarrollo modernos.  
- **Pinia** – Solución oficial de gestión de estado para aplicaciones Vue.  
- **Axios** – Cliente HTTP basado en promesas, utilizado para la comunicación con el backend.  
- **Vue Router** – Sistema de enrutamiento oficial para la navegación en aplicaciones Vue.js.  
- **JSZip** – Biblioteca para la creación y descompresión de archivos ZIP en el navegador.   

#### 2.2.2 Backend

La lógica de negocio y los servicios de integración se implementaron con las siguientes tecnologías:

- **Python 3.13** – Lenguaje de programación de alto nivel, robusto y versátil.  
- **FastAPI (0.115.4)** – Framework moderno para el desarrollo de APIs RESTful de alto rendimiento.  
- **Uvicorn (0.32.0)** – Servidor ASGI optimizado para aplicaciones asincrónicas.  
- **SQLAlchemy (2.0.36)** – ORM para la gestión e interacción con bases de datos relacionales.  
- **Pydantic (2.11.1)** – Validación y tipado de datos en tiempo de ejecución.  
- **PyMySQL (1.1.1) / mysqlclient (2.2.5)** – Conectores para bases de datos **MySQL**.  
- **python-dotenv (1.1.0)** – Manejo seguro de variables de entorno.  
- **python-jose (3.4.0)** – Implementación de autenticación mediante **JWT**.  
- **bcrypt (4.2.0)** – Algoritmo seguro de hashing para contraseñas.  
- **passlib (1.7.4)** – Conjunto de utilidades para la gestión de credenciales.  
- **requests (2.32.3)** – Cliente HTTP para integraciones con servicios externos.  
- **pandas (2.2.3)** – Biblioteca para análisis y transformación de datos.  
- **py7zr (1.0.0)** – Soporte para compresión y descompresión en formato **7z**.  
- **python-multipart (0.0.17)** – Manejo de formularios y archivos multiparte en solicitudes HTTP.  

---

### 2.3 Patrones de Diseño

El diseño de **ARCA** se fundamenta en patrones que permiten mantener la modularidad, la escalabilidad y la facilidad de mantenimiento del sistema.

#### 2.3.1 Frontend

- **Gestión de Estado (Pinia)** – Implementación del patrón *store* para centralizar el estado de la aplicación y asegurar consistencia en los datos compartidos entre componentes.  

#### 2.3.2 Backend

- **Arquitectura basada en APIs (FastAPI)** – Implementación del patrón **API-first**, orientado a la construcción de servicios RESTful escalables y fácilmente integrables.  


## 3. Configuración del Entorno

### 3.1 Requisitos del Sistema

#### 3.1.1 Servidor Principal

El servidor principal debe contar con la siguiente configuración mínima recomendada:

- **Sistema operativo**: Windows Server 2016  
- **Lenguaje de programación**: Python 3.13 (backend y módulo *file_sorter*)  
- **Servidor web**: XAMPP  
- **Base de datos**: MySQL  
- **Control de versiones**: Git / GitHub Desktop  
- **Memoria RAM**: 8 – 16 GB  
- **Procesador**: Dual Core  
- **Almacenamiento**: Disco duro con al menos 100 GB libres  
- **Navegador web**: Google Chrome  
- **Entorno frontend**: Node.js con Vue (framework progresivo de JavaScript para interfaces de usuario)  

#### 3.1.2 Servidor Secundario

El servidor secundario se emplea como repositorio de almacenamiento masivo de archivos. Sus requisitos son:

- **Sistema operativo**: No relevante (flexible según infraestructura disponible)  
- **Almacenamiento**: 2 – 4 TB de espacio en disco  
- **Memoria RAM**: 2 – 4 GB  
- **Procesador**: Dual Core  
- **Carpeta compartida**: `arca_repo` (carpeta accesible en red para almacenamiento masivo)  
- **Servicio adicional**: *File Sorter* (programa encargado de clasificar y organizar los archivos almacenados)  

### 3.2 Instalación de dependencias

#### 3.2.1 Frontend

**npm install** - Instala las dependencias del frontend desde el package.json

#### 3.2.2 Backend

**pip install -r requirements.txt** - Instala las dependencias del backend desde el requirements.txt

#### 3.2.3 File Sorter

**pip install -r requirements.txt** - Instala las dependencias del file sorter desde el requirements.txt (Ejecutar en el directorio del file sorter dentro de la carpeta del backend)

### 3.3 Variables de Entorno

El sistema **ARCA** requiere la configuración de variables de entorno para definir parámetros sensibles y de conexión. Estas variables deben almacenarse en archivos de configuración (`.env`) y nunca compartirse en repositorios públicos.

#### 3.3.1 Frontend

- **VITE_API_URL**: URL del backend.  
  *Ejemplo*: `http://194.168.0.57:8000`  

- **VITE_SUPPORT_NUMBER**: Número de contacto para soporte.  
  *Ejemplo*: `3219231178`  

- **VITE_SUPPORT_EMAIL**: Correo electrónico de soporte.  
  *Ejemplo*: `davidcarrillo@fedearroz.com.co`  

#### 3.3.2 Backend

- **SECRET_KEY**: Clave secreta utilizada para la encriptación de *tokens* y contraseñas.  
  *Ejemplo*: `1019983157`  

- **SORTED_FILES_PATH**: Ruta de la carpeta donde se almacenan los archivos organizados.  
  *Ejemplo*: `\\194.168.0.22\arca repo\sorted_files`  

- **RAW_FILES_PATH**: Ruta de la carpeta donde se almacenan los archivos sin procesar.  
  *Ejemplo*: `\\194.168.0.22\arca repo\raw_files`  

- **DATABASE_URL**: Cadena de conexión a la base de datos.  
  *Ejemplo*: `mysql+pymysql://root:@localhost/arca_db`  

- **ENVIRONMENT**: Entorno de ejecución de la aplicación.  
  *Ejemplo*: `development`  

- **DEBUG**: Activación o desactivación del modo de depuración.  
  *Ejemplo*: `True`  

#### 3.3.3 File Sorter

El módulo **File Sorter** funciona de manera independiente y **no requiere variables de entorno** para su ejecución.

## 4. Estructura del Proyecto

### 4.1 Descripción de Directorios

#### 4.1.1 Frontend


```
ARCA-FRONTEND/ # Proyecto frontend del sistema
├── .vscode/ # Configuración del entorno de desarrollo en VS Code
├── node_modules/ # Dependencias instaladas mediante npm
├── public/ # Archivos públicos accesibles directamente
└── src/ # Código fuente de la aplicación
├── assets/ # Archivos estáticos
│ ├── doc_img/ # Imágenes utilizadas en documentación
│ └── images/ # Recursos gráficos de la aplicación
├── components/ # Componentes reutilizables de la interfaz
├── views/ # Vistas principales de la aplicación
├── stores/ # Gestión de estado con Pinia
├── router/ # Configuración de enrutamiento (Vue Router)
├── App.vue # Componente raíz de la aplicación
└── main.js # Punto de entrada de la aplicación
├── vite.config.js # Configuración del bundler Vite
├── package.json # Definición de dependencias y scripts npm
└── .env # Variables de entorno del frontend
```

#### 4.1.2 Backend

```
ARCA-BACKEND/ # Proyecto backend del sistema
├── .vscode/ # Configuración del entorno de desarrollo en VS Code
├── ARCA_FS/ # Módulo File Sorter para organización automática de archivos
├── main.py # Aplicación principal (endpoints de la API con FastAPI)
├── requirements.txt # Dependencias de Python necesarias para el backend
└── .env # Variables de entorno del backend
```

### 4.2 Componentes principales

#### 4.2.1 Frontend

```
src/
├── components/ # Componentes reutilizables
│ ├── NewUserWindows.vue # Formulario para la creación de usuarios
│ ├── AlertContainer.vue # Contenedor de notificaciones del sistema
│ ├── AlertItem.vue # Componente individual de alerta
│ ├── UploadFilesWindows.vue # Interfaz de carga de archivos
│ └── HelpButton.vue # Botón de ayuda contextual
│
├── views/ # Vistas principales de la aplicación
│ ├── UsersView.vue # Módulo de gestión de usuarios
│ ├── LogsView.vue # Visualización de registros del sistema
│ ├── SearchView.vue # Búsqueda y consulta de comprobantes electrónicos
│ └── LoginView.vue # Pantalla de autenticación de usuarios
│
└── stores/ # Gestión de estado (Pinia)
├── auth.js # Estado y lógica de autenticación
├── files.js # Estado y operaciones relacionadas con archivos
├── logs.js # Gestión de registros y auditoría
├── suppliers.js # Información y manejo de proveedores
├── users.js # Estado y operaciones de usuarios
└── useAlerts.js # Utilidades para el sistema de notificaciones
```

#### 4.2.2 Backend

```
ARCA-BACKEND/ # Backend del sistema
├── main.py # Aplicación principal con los endpoints de la API
├── models.py # Definición de modelos de base de datos (ORM)
├── schemas.py # Esquemas de validación y tipado de datos (Pydantic)
├── crud.py # Operaciones CRUD generales
├── auth.py # Módulo de autenticación y autorización
├── config.py # Configuración del sistema y variables globales
├── database.py # Inicialización y conexión a la base de datos
├── file_searcher.py # Buscador de archivos en el servidor de almacenamiento
├── logs_crud.py # Operaciones CRUD específicas para registros de descargas
├── seven_suppliers.py # Integración y operaciones con SEVEN ERP (proveedores)
```

#### 4.2.3 File Sorter

```
AARCA-BACKEND/ARCA_FS/ # Módulo File Sorter del sistema
├── file_sorter.py # Organizador de archivos de alto volumen/tráfico
```

### 4.3 Flujos de datos

#### 4.3.1 Frontend

1. **Autenticación**
   - El usuario ingresa sus credenciales en `LoginView.vue`.  
   - El módulo `auth.js` procesa la autenticación enviando una petición **POST** al endpoint `/login`.  
   - El **token JWT** recibido se almacena en el estado de **Pinia** y en `localStorage`.  
   - El sistema redirige al usuario a la vista principal (`SearchView.vue`).  

2. **Búsqueda de Comprobantes** (`SearchView.vue`)
   - El usuario ingresa parámetros de búsqueda (fechas, número de factura, etc.).  
   - El módulo `files.js` gestiona la solicitud al backend para recuperar los comprobantes.  
   - Los resultados se almacenan en el estado de **Pinia** y se renderizan en la interfaz.  
   - La acción se registra en `logs.js` para fines de auditoría.  

3. **Gestión de Usuarios** (`UsersView.vue`)
   - Los administradores pueden consultar, crear y modificar usuarios.  
   - El módulo `users.js` gestiona las operaciones **CRUD** sobre usuarios.  
   - Todas las acciones quedan registradas en el sistema de **logs**.  

4. **Visualización de Logs** (`LogsView.vue`)
   - Permite consultar el historial de acciones del sistema.  
   - El módulo `logs.js` obtiene los registros desde el backend.  
   - La vista ofrece opciones de filtrado y búsqueda de registros.  

5. **Notificaciones**
   - El módulo `useAlerts.js` gestiona las notificaciones globales.  
   - Está integrado con todas las vistas para mostrar mensajes al usuario.  
   - Soporta diferentes tipos de alertas: **éxito, error, advertencia e información**.  
   - Las alertas pueden ser **automáticas (autocierre)** o requerir cierre manual por parte del usuario.  

6. **Flujo General de Datos**

   ```
   Vistas (Vue Components)
   → Stores (Pinia)
   → API (Axios)
   → Backend (FastAPI)
   → Base de Datos (MYSQL)
   ```

7. **Gestión de Estado**
- **Pinia** funciona como *store* centralizado de la aplicación.  
- Cada dominio funcional (`auth`, `files`, `users`, `logs`) posee su propio módulo de estado.  
- El estado se mantiene sincronizado y accesible entre los distintos componentes.

#### 4.3.2 Backend

1. **Arquitectura**
   - API **RESTful** implementada con **FastAPI**.  
   - Autenticación basada en **JWT**.  
   - Base de datos relacional **MySQL**.  
   - ORM **SQLAlchemy** para la capa de persistencia.  

2. **Módulos Principales**
   - `auth.py`: Gestión de autenticación y autorización.  
   - `crud.py`: Operaciones CRUD sobre usuarios y archivos.  
   - `logs_crud.py`: Operaciones CRUD específicas de registros de actividad.  
   - `models.py`: Definición de modelos de datos con SQLAlchemy.  
   - `schemas.py`: Validación y serialización con **Pydantic**.  
   - `file_searcher.py`: Módulo de búsqueda y gestión de archivos en el servidor.  
   - `ARCA_FS/file_sorter.py`: Proceso de organización automática de archivos de alto tráfico.  

3. **Flujo de Datos**
   - Los clientes realizan solicitudes **HTTP** a los endpoints expuestos por la API.  
   - El **middleware de autenticación** valida los tokens JWT antes de procesar la petición.  
   - Los **controladores** reciben la solicitud y validan los datos de entrada.  
   - Los **servicios** ejecutan la lógica de negocio correspondiente.  
   - Los **modelos** acceden a la base de datos mediante SQLAlchemy.  
   - Los resultados se serializan con **Pydantic** y se devuelven al cliente.  

4. **Seguridad**
   - Autenticación y autorización con **JWT**.  
   - Configuración de **CORS** para controlar orígenes permitidos.  
   - Validación estricta de entrada mediante esquemas Pydantic.  
   - Hash seguro de contraseñas utilizando **bcrypt**.  

5. **Rendimiento**
   - Uso de **pooling** de conexiones a la base de datos.  
   - Consultas optimizadas con SQLAlchemy.  
   - Manejo **asíncrono** de operaciones intensivas.  
   - Estrategias de **caché** para consultas frecuentes.  

6. **Logging y Monitoreo**
   - Registro estructurado y centralizado de eventos.  
   - Métricas de rendimiento para detectar cuellos de botella.  
   - Sistema de alertas para errores críticos.  
   - Auditoría completa de operaciones para trazabilidad.  


#### 4.3.3 FileSorter Service

El **FileSorter** es un servicio autónomo encargado de la organización y clasificación automática de los archivos que ingresan al sistema ARCA. Opera de manera independiente al backend, pero se integra con la base de datos y el repositorio de archivos.  

1. **Monitoreo de Carpetas**
   - Supervisa de forma continua los directorios configurados en busca de nuevos archivos.  
   - Detecta modificaciones en tiempo real mediante la librería **watchdog**.  
   - Agrupa archivos para su procesamiento en lotes, reduciendo la sobrecarga del sistema.  

2. **Procesamiento de Archivos**
   - **Análisis**: Extrae metadatos relevantes de los nombres de archivo mediante expresiones regulares.  
   - **Clasificación**: Determina el tipo de documento y define la carpeta de destino (`sorted_files` o `trash`).  
   - **Validación**: Verifica integridad, formato y estructura de los archivos antes de su clasificación.  
   - **Procesamiento en paralelo**: Utiliza múltiples hilos para optimizar el tiempo de procesamiento en escenarios de alto volumen.  

3. **Gestión de Errores**
   - Implementa **reintentos automáticos** para archivos que fallan en la primera ejecución.  
   - Los archivos no válidos se trasladan a una carpeta de **cuaresma/cuidados especiales (quarantine)** para su posterior revisión.  
   - Registra de manera detallada los errores en los logs del sistema.  

4. **Integración con Base de Datos**
   - Realiza consultas para validar información de ubicaciones y proveedores.  
   - Actualiza metadatos de los archivos procesados en la base de datos central.  
   - Mantiene un **historial de auditoría** de operaciones ejecutadas para trazabilidad.  

5. **Características de Rendimiento**
   - Procesamiento **batch** para reducir la carga por archivo individual.  
   - Uso eficiente de memoria en escenarios de alto tráfico de documentos.  
   - Límites configurables de uso de CPU e hilos para evitar saturación del servidor.  

6. **Estructura del Código**
   - `file_sorter.py`: Módulo principal con la lógica completa de monitoreo, validación, clasificación y auditoría.  


## 5. Guía de Desarrollo

### 5.1 Estándares de código

#### 5.1.1 Frontend (Vue 3 + JavaScript/TypeScript)

1. **Estructura de Componentes**
   - Utilizar **Composition API** con `<script setup>` para mayor claridad y consistencia.  
   - Mantener un orden estándar en los bloques de código:  
     `script` → `template` → `style`.  
   - Un componente por archivo `.vue`, con responsabilidades claras y bien delimitadas.  
   - Nombrar archivos en **PascalCase** (ejemplo: `UserProfile.vue`).  

2. **Convenciones de Código**
   - Indentación de **2 espacios** para mejorar legibilidad.  
   - Uso de **comillas simples** en strings.  
   - Terminar cada declaración con **punto y coma**.  
   - Definir objetos y arrays con coma final para facilitar la edición.  

3. **Estilo de Código**
   - Variables y funciones en **camelCase**.  
   - Componentes y clases en **PascalCase**.  
   - Constantes globales en **UPPER_SNAKE_CASE**.  
   - Evitar código duplicado; abstraer lógica en funciones reutilizables o composables.  

4. **Manejo de Estado**
   - Utilizar **Pinia** como gestor de estado global.  
   - Centralizar la lógica de negocio en los stores, manteniendo los componentes ligeros.  
   - Usar `ref` y `computed` para valores reactivos.  
   - Implementar módulos separados para cada dominio (`auth`, `files`, `logs`, `users`, etc.).  

5. **Rendimiento**
   - Implementar **paginación y lazy loading** en listas extensas.  
   - Evitar cálculos costosos dentro de los templates; preferir `computed`.  
   - Minimizar el uso innecesario de `watch` y priorizar el uso de `computed`.  
   - Reutilizar componentes y evitar renderizados innecesarios.  

6. **Seguridad**
   - Validar y sanitizar todas las entradas de usuario antes de procesarlas.  
   - Escapar datos dinámicos en templates para prevenir **XSS (Cross-Site Scripting)**.  
   - Restringir el acceso a rutas protegidas mediante guardias de navegación.  
   - Evitar exponer información sensible en variables globales o en el frontend.  


#### 5.1.2 Backend (Python + FastAPI)

1. **Convenciones de Código**
   - **Rutas**: Definidas en `main.py` o en módulos específicos, organizadas con prefijos lógicos (`/users`, `/files`, `/logs`, etc.).  
   - **Modelos**: Declarados en `models.py` con nombres en **PascalCase** (ejemplo: `User`, `DownloadedLog`).  
   - **Variables y funciones**: En **snake_case**, siguiendo la PEP 8.  
   - **Constantes**: En **UPPER_SNAKE_CASE** dentro del módulo correspondiente.  
   - **Tipado**: Uso obligatorio de *type hints* en todas las funciones y métodos para mayor legibilidad.  
   - **Docstrings**: Formato **Google Style** o **PEP 257**, documentando propósito, parámetros y valores de retorno.  

2. **Manejo de Datos**
   - **Modelos SQLAlchemy**: Implementar como capa de acceso a datos, incluyendo relaciones y restricciones.  
   - **Esquemas Pydantic**: Separar los modelos de entrada y salida para mayor seguridad.  
   - **Paginación**: Implementar en todos los endpoints que devuelvan colecciones de datos.  
   - **Filtrado y ordenamiento**: Soportar parámetros de consulta (`query params`) para búsquedas específicas y resultados ordenados.  
   - **Validación**: Validar siempre datos de entrada contra los esquemas Pydantic.  

3. **Seguridad**
   - **Autenticación**: Uso de JWT para tokens de acceso y refresh, con tiempos de expiración configurables.  
   - **Autorización**: Basada en roles y permisos definidos en la base de datos.  
   - **CORS**: Configuración explícita para permitir solicitudes solo desde dominios autorizados.  
   - **Variables de entorno**: Todo dato sensible (claves, tokens, credenciales de BD) debe definirse en `.env`.  
   - **Contraseñas**: Almacenadas siempre con hash seguro (`bcrypt` + salt).  
   - **Validación de entrada**: Evitar inyección SQL gracias al uso de SQLAlchemy parametrizado.  

4. **Rendimiento**
   - **Conexiones a BD**: Usar sesiones de SQLAlchemy con contexto (`SessionLocal`) y *connection pooling*.  
   - **Tareas en segundo plano**: Usar `BackgroundTasks` o workers externos para procesos pesados.  
   - **Optimización de consultas**: Crear índices en campos de búsqueda frecuentes y usar `selectinload` para relaciones.  
   - **Caching**: Evaluar cacheo de resultados en consultas muy frecuentes.  
   - **Logging estructurado**: Registrar métricas clave, errores y auditoría con niveles (`INFO`, `WARNING`, `ERROR`).  

5. **Manejo de Archivos**
   - **Subidas**: Validar tipo, extensión y tamaño de archivo antes de aceptarlo.  
   - **Almacenamiento**: Mantener una estructura organizada de directorios (`raw_files`, `sorted_files`, `trash`).  
   - **Descargas**: Implementar *streaming* en lugar de carga en memoria para archivos grandes.  
   - **Integridad**: Validar que los archivos subidos o descargados no estén corruptos.  
   - **Auditoría**: Registrar toda carga, descarga y eliminación de archivos en los logs del sistema.  


#### 5.1.3 Convenciones de Commits

Los mensajes de commit deben seguir la convención **Conventional Commits**, con el siguiente formato:

```
tipo[alcance]: descripción breve en presente

detalles opcionales

[Optional footer(s)]

```
**Ejemplo:**
```
feat(auth): agregar validación de tokens expirados

Se implementó la validación automática de tokens JWT expirados en el middleware de autenticación.

```

**Tipos de commit:**
- `feat`: Nueva funcionalidad incorporada al sistema.  
- `fix`: Corrección de errores.  
- `docs`: Cambios en la documentación.  
- `style`: Cambios de formato que no afectan la lógica (espacios, comas, indentación).  
- `refactor`: Reestructuración de código sin alterar la funcionalidad.  
- `perf`: Cambios orientados a mejorar el rendimiento.  
- `test`: Creación o modificación de pruebas.  
- `chore`: Cambios en la configuración, dependencias o tareas de mantenimiento.  
- `hotfix`: Corrección crítica y urgente directamente sobre la rama `main`.  

---

#### 5.1.4 Proceso de Contribución

1. **Crear una rama a partir de `main`** siguiendo las convenciones:  
   - `feat/funcionalidad` → Nueva característica.  
   - `fix/error` → Corrección de bug.  
   - `style/estilo` → Cambios de formato.  
   - `perf/rendimiento` → Mejoras de rendimiento.  
   - `test/prueba` → Pruebas unitarias o de integración.  
   - `chore/herramientas` → Configuración, dependencias o scripts.  
   - `hotfix/error` → Corrección crítica sobre `main`.  

2. **Realizar cambios atómicos**: cada commit debe ser pequeño, coherente y enfocado en un único objetivo.  

3. **Escribir pruebas unitarias e integración** que cubran la nueva funcionalidad o corrección.  

4. **Actualizar la documentación** en caso de que los cambios lo requieran.  

5. **Ejecutar linters y pruebas automáticas** antes de subir la rama.  

6. **Crear un Pull Request (PR)** hacia `main`, con una descripción detallada que incluya:  
   - Propósito del cambio.  
   - Impacto en el sistema.  
   - Pasos de validación y pruebas realizadas.  

7. **Revisión por pares**: al menos un integrante del equipo debe aprobar el PR antes de integrarlo.  

## 6. Despliegue

### 6.1 Build y Compilación

#### 6.1.1 Frontend

1. Ejecutar el comando **npm run dev** en el servidor de producción.  
   *(Nota: la configuración actual permite mantener el entorno de producción utilizando el modo `dev`).*  
2. El sistema se desplegará en la ruta:  
   - `http://localhost:8081`  
   - `http://{IP_DEL_SERVIDOR}:8081`  
3. Asegurarse de que el servidor cuente con:  
   - **Node.js** instalado en la versión recomendada por el proyecto.  
   - **npm** correctamente instalado y configurado.  
4. Configurar el servidor para escuchar y exponer públicamente el **puerto 8081**.  

---

#### 6.1.2 Backend

1. Ejecutar el comando:  
   **uvicorn main:app --host 0.0.0.0 --port 8000 --reload**  
   en el servidor de producción.  
2. El sistema backend se desplegará en la ruta:  
   - `http://localhost:8000`  
   - `http://{IP_DEL_SERVIDOR}:8000`  
3. Asegurarse de que el servidor cuente con:  
   - **Python 3.x** instalado en la versión soportada.  
   - Dependencias instaladas (ver archivo `requirements.txt`).  
4. Configurar el servidor para escuchar y exponer públicamente el **puerto 8000**.  

---

#### 6.1.3 FileSorter

1. Ejecutar el comando:  
   **python file_sorter.py** en el servidor de producción.  
2. Editar el archivo **file_sorter.py** para configurar las rutas de las carpetas:  
   - **raw_files** (archivos sin organizar).  
   - **sorted_files** (archivos organizados).  
   - **trash** (archivos descartados).  
3. El servidor de almacenamiento debe:  
   - Compartir por red la carpeta de almacenamiento.  
   - Otorgar permisos al usuario que ejecute el `file_sorter` desde el servidor principal.  
4. Asegurarse de que el servidor cuente con:  
   - **Python 3.x** instalado.  
   - Librerías necesarias según el archivo de dependencias.  
5. Verificar que el servidor esté configurado para permitir acceso de red en el **puerto 8000**.  


### 6.2 Builds y Nuevas Versiones

1. Después de completar el proceso descrito en el numeral **5.1.4**.  
2. Se accede mediante conexión remota al servidor principal, se abre **Git/GitHub Desktop** y se descargan los cambios de la rama **main**.  

---

## 7. API Documentation

La documentación de la API se genera automáticamente gracias a **FastAPI** al desplegar el backend.  
Se puede acceder en la siguiente ruta:  

- `{URL_DEL_BACKEND}/docs`

---

## 8. Troubleshooting

### 8.1 Errores comunes

#### 8.1.1 Error de subida de archivos
Mediante la interfaz de usuario para subir archivos al **FileSorter**, existe una limitación en la cantidad de archivos que se pueden subir.  
Esto depende directamente del **sistema operativo** y de la **cantidad de memoria RAM disponible**.

#### 8.1.2 Error: el usuario no carga la información después de un tiempo
El sistema de autenticación mantiene una sesión activa por un máximo de **30 minutos**.  
Si el usuario deja la página en segundo plano y su sesión expira, no podrá cargar información hasta autenticarse nuevamente.

#### 8.1.3 El FileSorter no clasifica los archivos
El **FileSorter**, después de organizar cierta cantidad de archivos, puede detenerse por problemas de rendimiento.  
La solución es interrumpirlo manualmente en consola usando `Ctrl + C` y volver a ejecutarlo.

---

### 8.2 Soluciones

#### 8.2.1 Solución a error de subida de archivos
Cuando se manejen grandes cantidades de archivos, acceder directamente al **servidor de almacenamiento** y moverlos a la carpeta **raw_files** del FileSorter.

#### 8.2.2 Solución a sesión vencida
Refrescar la página para iniciar una nueva sesión.

---

### 8.3 Logs y monitoreo

- En la **consola del backend** se registran todas las consultas y operaciones realizadas.  
- En la **consola del FileSorter** se muestran los archivos organizados y la velocidad de procesamiento.  
