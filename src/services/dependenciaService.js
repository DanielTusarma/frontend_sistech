import clienteAxios from "../api/clienteAxios";

// Servicio de Dependencias
// Encapsula todas las llamadas HTTP relacionadas con dependencias


// Obtener todas las dependencias con paginación
export async function listarDependencias(page = 1, size = 5) {
    const response = await clienteAxios.get(`/dependencias?page=${page}&size=${size}`);

    return response.data;
}

// Crear una nueva dependencia
export async function crearDependencia(datos) {
    const response = await clienteAxios.post(
        "/dependencias",
        datos
    );

    return response.data;
}