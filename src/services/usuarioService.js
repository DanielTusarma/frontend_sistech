import clienteAxios from "../api/clienteAxios"; 

// Servicio de Usuarios
export async function listarUsuarios(page = 1, size = 5) {
  const respuesta = await clienteAxios.get("/usuarios", {
    params: { page, size }
  });
  return respuesta.data;
}

// Crear un nuevo usuario
export async function crearUsuario(datosUsuario) {
  const { nombre, email, password, rol } = datosUsuario;

  // Validaciones en frontend (además de las del backend)

  // Validación de nombre: no vacío, entre 3 y 100 caracteres
  if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3 || nombre.length > 100) {
    throw {
      response: {
        data: { detail: "El nombre debe tener entre 3 y 100 caracteres y no puede estar vacío." }
      }
    };
  }

  // Validación de email: formato correcto y longitud máxima de 254 caracteres
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    throw {
      response: {
        data: { detail: "El formato del correo electrónico no es válido o supera los 254 caracteres." }
      }
    };
  }

  // Validación de contraseña: entre 8 y 64 caracteres
  if (!password || password.length < 8 || password.length > 64) {
    throw {
      response: {
        data: { detail: "La contraseña debe tener entre 8 y 64 caracteres." }
      }
    };
  }

  // Validación de rol: debe ser uno de los roles permitidos
  const rolesPermitidos = ["admin", "usuario", "supervisor", "auditor"];
  if (!rol || !rolesPermitidos.includes(rol)) {
    throw {
      response: {
        data: { detail: "El rol seleccionado no es válido para el sistema." }
      }
    };
  }

  const respuesta = await clienteAxios.post("/usuarios", datosUsuario);
  return respuesta.data;
}
