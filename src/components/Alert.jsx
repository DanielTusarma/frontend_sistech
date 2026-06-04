// Componente reutilizable para mostrar mensajes
// de éxito, advertencia o error.
function Alert({ tipo, mensaje }) {

    // Si no existe mensaje, no renderiza nada
    if (!mensaje) {
        return null;
    }

    return (
        <div className={`alert alert-${tipo}`}>
            {mensaje}
        </div>
    );
}

export default Alert;