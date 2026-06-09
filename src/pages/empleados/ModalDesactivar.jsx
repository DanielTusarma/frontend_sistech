// src/pages/ModalDesactivar.jsx
import { useState } from "react";
import { desactivarEmpleado } from "../../services/empleadoService";
import Alert from "../../components/Alert";
import { obtenerMensajeError } from "../../utils/errorHandler";

function ModalDesactivar({ empleado, onClose, onDesactivadoExitoso }) {
  const [fechaSalida, setFechaSalida] = useState("");
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });

  if (!empleado) return null;

  async function manejarSubmit(e) {
    e.preventDefault();
    try {
      // Enviamos el ID del empleado y la fecha seleccionada al servicio
      await desactivarEmpleado(empleado.id, fechaSalida);
      
      // Limpiamos el estado y avisamos al padre para que recargue la tabla
      setFechaSalida("");
      onDesactivadoExitoso();
      onClose();
    } catch (error) {
      setAlerta({
        tipo: "danger",
        mensaje: obtenerMensajeError(error),
      });
    }
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bi bi-person-x-fill me-2"></i>
              Inactivar Empleado
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={manejarSubmit}>
            <div className="modal-body">
              {alerta.mensaje && <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />}
              
              <p>
                Estás a punto de desactivar a <strong>{empleado.nombreCompleto}</strong>. 
                Para proceder, debes registrar su fecha oficial de salida.
              </p>

              <div className="mb-3">
                <label className="form-label fw-semibold">Fecha de Salida</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={fechaSalida} 
                  onChange={(e) => setFechaSalida(e.target.value)} 
                  required 
                  min={empleado.fechaIngreso}
                />
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger">
                Confirmar Baja
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalDesactivar;