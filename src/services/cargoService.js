import clienteAxios from "../api/clienteAxios";

// Sercicio de Cargos
// Encapsula todas las llamadas HTTP relacionadas con cargos


// Obtener todos los cargos con paginacion
export async function listarCargos(page = 1, size = 5) {
    const response = await clienteAxios.get(`/cargos?page=${page}&size=${size}`);

    return response.data;
}

// crear un nuevo cargo
export async function crearCargo(datos) {
    const nombreLimpio = datos.nombre?.trim() || "";
    const descripcionLimpio = datos.descripcion?.trim() || "";

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

    if (!descripcionLimpio) {
        throw new Error("La descrición es obligatoria");
    }
    if (descripcionLimpio.length < 2) {
        throw new Error("La descripción debe tener al menos dos caracteres");
    }
    if (descripcionLimpio.length > 255) {
        throw new Error("La descripción no puede superar los 255 caracteres");
    }

    const cargoAEnviar = {
        nombre: nombreLimpio,
        descripcion: descripcionLimpio,
    };

    const response = await clienteAxios.post(
        "/cargos",
    cargoAEnviar);

    return response.data;

} 

// Obtener empleados por cargo
export async function listarEmpleadosPorCargo(cargoId, page = 1, size = 5) {
  // Ajusta la ruta si tu router de cargos tiene un prefijo (ej: /cargos)
  const respuesta = await clienteAxios.get(`/cargos/${cargoId}/empleados`, {
    params: { page, size }
  });
  return respuesta.data;
}


