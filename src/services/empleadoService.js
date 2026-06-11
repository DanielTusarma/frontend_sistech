import clienteAxios from "../api/clienteAxios";

// Servicio de dependencias
// Encapsula todas las llamadas HTTP relacionadas con empleados

// Obtener todos los empleados con paginacion
export async function listarEmpleados(page = 1, size = 5) {
  const respuesta = await clienteAxios.get(
    `/empleados/activos/?page=${page}&size=${size}`,
  );

  return respuesta.data;
}

//  Crear un nuevo empleado
export async function crearEmpleado(dataEmpleado) {
  // Validar Teléfono (Regex estricto idéntico al backend)
  if (!dataEmpleado.telefono || !/^\+?\d+$/.test(dataEmpleado.telefono)) {
    throw new Error("El teléfono es obligatorio, solo debe contener números y puede iniciar con '+'.");
  }

  // Validar Email (Formato correcto)
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!dataEmpleado.email || !regexEmail.test(dataEmpleado.email)) {
    throw new Error("El correo electrónico es obligatorio y debe tener un formato válido (ejemplo@dominio.com).");
  }

  // Validar Salario (gt=0)
  if (!dataEmpleado.salario || Number(dataEmpleado.salario) <= 0) {
    throw new Error("El salario es obligatorio y debe ser un número mayor a 0.");
  }

  // Validar Llaves Foráneas (Que no se queden en "Seleccione una opción")
  if (!dataEmpleado.cargo_id || dataEmpleado.cargo_id === "") {
    throw new Error("Debe seleccionar un cargo válido para el empleado.");
  }
  if (!dataEmpleado.dependencia_id || dataEmpleado.dependencia_id === "") {
    throw new Error("Debe seleccionar una dependencia válida para el empleado.");
  }

  const respuesta = await clienteAxios.post("/empleados/", dataEmpleado);
  return respuesta.data;
}

//  Obtener detalle empleado con id
export async function obtenerEmpleadoDetalle(id) {
  const respuesta = await clienteAxios.get(`/empleados/${id}`);
  return respuesta.data;
}

// Modificar o editar los datos de un empleado
export async function editarEmpleado(id, dataEmpleado) {
  // validaciones
  if (dataEmpleado.telefono && !/^\+?\d+$/.test(dataEmpleado.telefono)) {
    throw new Error("El teléfono solo puede contener números y el signo '+'.");
  }
  if (!dataEmpleado.cargo_id || !dataEmpleado.dependencia_id) {
    throw new Error("Debe seleccionar un cargo y una dependencia.");
  }
  if (Number(dataEmpleado.salario) <= 0) {
    throw new Error("El salario debe ser mayor a 0.");
  }

  const respuesta = await clienteAxios.put(`/empleados/${id}`, dataEmpleado);
  return respuesta.data;
}

// Desactivar un empleado por su ID
export async function desactivarEmpleado(id, fechaSalida) {
  const respuesta = await clienteAxios.patch(`/empleados/${id}/desactivar`, {
    fecha_salida: fechaSalida
  });
  return respuesta.data;
}

// Obtener empleados inactivos con paginación
export async function listarEmpleadosInactivos(page = 1, size = 5) {
  const respuesta = await clienteAxios.get("/empleados/inactivos", { 
    params: { page, size }
  });
  return respuesta.data;
}