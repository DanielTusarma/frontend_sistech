# Sistema de Gestión Empresarial - Frontend

Frontend desarrollado con React, Vite, React Router, Axios y Bootstrap para consumir una API REST construida con FastAPI.

## Tecnologías utilizadas

* React
* Vite
* React Router DOM
* Axios
* Bootstrap 5

## Funcionalidades implementadas

* Inicio de sesión con JWT
* Protección de rutas privadas
* Protección de rutas públicas
* Gestión de sesión mediante Local Storage
* Logout
* Consumo de API REST FastAPI

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/DanielTusarma/frontend_sistech.git
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Ejecutar el proyecto:

```bash
npm run dev
```

## Estructura del proyecto

```text
src/
├── api/
├── components/
├── pages/
├── routes/
├── services/
├── utils/
└── assets/
```

## Estado actual

Proyecto en desarrollo.
Actualmente cuenta con autenticación JWT integrada con FastAPI.
