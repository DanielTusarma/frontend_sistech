// src/pages/DetalleEmpleado.jsx

function DetalleEmpleado({ empleado, onClose }) {
  // Si no hay un empleado seleccionado, no renderizamos nada
  if (!empleado) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-card-heading me-2"></i>
              Ficha del Empleado
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12 border-bottom pb-2">
                <h6 className="text-muted mb-1">Nombre Completo</h6>
                <p className="fw-bold fs-5 mb-0">{empleado.nombres} {empleado.apellidos}</p>
              </div>
              
              <div className="col-6">
                <h6 className="text-muted mb-1">Teléfono</h6>
                <p className="mb-0">{empleado.telefono || "No registrado"}</p>
              </div>

              <div className="col-6">
                <h6 className="text-muted mb-1">Correo Electrónico</h6>
                <p className="mb-0 text-break">{empleado.email}</p>
              </div>

              <div className="col-6">
                <h6 className="text-muted mb-1">Dependencia</h6>
                <p className="mb-0 fw-semibold text-primary">{empleado.dependencia?.nombre || "Sin asignar"}</p>
              </div>

              <div className="col-6">
                <h6 className="text-muted mb-1">Cargo</h6>
                <p className="mb-0 fw-semibold text-success">{empleado.cargo?.nombre || "Sin asignar"}</p>
              </div>

              <div className="col-6">
                <h6 className="text-muted mb-1">Salario Mensual</h6>
                <p className="mb-0 fw-bold text-dark">${Number(empleado.salario || 0).toLocaleString()}</p>
              </div>

              <div className="col-6">
                <h6 className="text-muted mb-1">Fecha de Ingreso</h6>
                <p className="mb-0">{empleado.fecha_ingreso ? new Date(empleado.fecha_ingreso).toLocaleDateString() : "No registrada"}</p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar Vista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleEmpleado;