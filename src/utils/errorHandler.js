/**
 * Extrae de forma inteligente el mensaje de error de las validaciones locales o del backend (FastAPI/Axios)
 * @param {Error} error - El objeto de error capturado en el catch
 * @returns {string} El mensaje de error masticado y listo para el usuario
 */
export function obtenerMensajeError(error) {
  // Asumiendo el mensaje del error local (throw new Error)
  let mensaje = error.message;

  // Si el error viene del Backend (FastAPI) a través de Axios
  if (error.response && error.response.data) {
    const data = error.response.data;

    if (data.detail) {
      // Si FastAPI manda un string, lo usamos. Si manda un array de errores, lo volvemos texto.
      mensaje = typeof data.detail === "string" 
        ? data.detail 
        : JSON.stringify(data.detail);
    } else if (data.mensaje) {
      mensaje = data.mensaje;
    }
  }

  return mensaje || "Error inesperado al procesar la solicitud";
}