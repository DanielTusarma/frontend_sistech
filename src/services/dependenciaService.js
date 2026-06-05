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
    const nombreLimpio = datos.nombre?.trim() || "";

    // validaciones
    if (!nombreLimpio) {
        throw new Error("El nombre es obligatorio");
    }

    if (nombreLimpio.length < 2) {
        throw new Error("El nombre debe tener al menos dos caracteres");
    }
    if (nombreLimpio.length > 30) {
        throw new Error("El nombre no puede superar los 30 caracteres");
    }

    const dependenciaAEnviar = {
        nombre: nombreLimpio,
    };


    const response = await clienteAxios.post(
        "/dependencias",
        dependenciaAEnviar
    );

    return response.data;
}