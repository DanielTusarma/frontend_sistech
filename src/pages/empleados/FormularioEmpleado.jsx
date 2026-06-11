import { useEffect, useState } from "react";
import { crearEmpleado } from "../../services/empleadoService";
import { listarCargos } from "../../services/cargoService";
import { listarDependencias } from "../../services/dependenciaService";
import Alert from "../../components/Alert";
import { obtenerMensajeError } from "../../utils/errorHandler";

function FormularioEmpleado({ onSubmitExitoso, empleadoAEditar }) {
  // Estados para los campos del formulario
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [salario, setSalario] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [dependenciaId, setDependenciaId] = useState("");

  // Estados para los selectores de cargos y dependencias
  const [cargos, setCargos] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });

  // Carga los selectores una sola vez al montar el formulario
  useEffect(() => {
    async function cargarSelectores() {
      try {
        const datosCargos = await listarCargos(1, 100);
        const datosDeps = await listarDependencias(1, 100);
        setCargos(datosCargos.items || []);
        setDependencias(datosDeps.items || []);
      } catch (error) {
        console.error("Error al cargar selectores de empleados:", error);
      }
    }
    cargarSelectores();
  }, []);

  // Si se recibe un empleado para editar, carga sus datos en el formulario
  useEffect(() => {
    if (empleadoAEditar) {
      setNombres(empleadoAEditar.nombres || "");
      setApellidos(empleadoAEditar.apellidos || "");
      setTelefono(empleadoAEditar.telefono || "");
      setEmail(empleadoAEditar.email || "");
      setSalario(empleadoAEditar.salario || "");
      setFechaIngreso(empleadoAEditar.fecha_ingreso ? empleadoAEditar.fecha_ingreso.substring(0, 10) : "");
      setCargoId(empleadoAEditar.cargo_id || "");
      setDependenciaId(empleadoAEditar.dependencia_id || "");
      setAlerta({ tipo: "", mensaje: "" });
    } else {
      limpiarCampos();
    }
  }, [empleadoAEditar]);

  // Función para limpiar los campos del formulario (útil para nuevo registro o después de editar)
  function limpiarCampos() {
    setNombres("");
    setApellidos("");
    setTelefono("");
    setEmail("");
    setSalario("");
    setFechaIngreso("");
    setCargoId("");
    setDependenciaId("");
  }

  // Función para manejar el submit del formulario, tanto para crear como para editar
  async function manejarSubmit(e) {
    e.preventDefault();
    try {
      const datosEmpleado = {
        nombres,
        apellidos,
        telefono,
        email,
        salario: Number(salario),
        fecha_ingreso: fechaIngreso,
        cargo_id: Number(cargoId),
        dependencia_id: Number(dependenciaId),
      };

      if (onSubmitExitoso) {
        await onSubmitExitoso(datosEmpleado);
      }

      if (!empleadoAEditar) {
        limpiarCampos();
      }

      setAlerta({ 
        tipo: "success", 
        mensaje: empleadoAEditar ? "Empleado actualizado con éxito." : "Empleado registrado con éxito."
      });

    } catch (error) {
      setAlerta({
        tipo: "danger",
        mensaje: obtenerMensajeError(error),
      });
    }
  }

  return (
    <div className="modal fade" id="modalEmpleado" tabIndex="-1" aria-labelledby="modalEmpleadoLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalEmpleadoLabel">
              {empleadoAEditar ? "✏️ Editar Empleado" : "Registrar Nuevo Empleado"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setAlerta({ tipo: "", mensaje: "" })}></button>
          </div>
          
          <form onSubmit={manejarSubmit}>
            <div className="modal-body">
              {alerta.mensaje && <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />}

              <div className="mb-3">
                <label className="form-label">Nombres</label>
                <input type="text" className="form-control" value={nombres} onChange={(e) => setNombres(e.target.value)} required minLength={2} maxLength={50} />
              </div>

              <div className="mb-3">
                <label className="form-label">Apellidos</label>
                <input type="text" className="form-control" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required minLength={2} maxLength={50} />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: +573001234567" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} />
              </div>

              <div className="mb-3">
                <label className="form-label">Salario</label>
                <input type="number" step="0.01" className="form-control" value={salario} onChange={(e) => setSalario(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha de Ingreso</label>
                <input type="date" className="form-control" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Dependencia</label>
                <select className="form-select" value={dependenciaId} onChange={(e) => setDependenciaId(e.target.value)} required>
                  <option value="">Seleccione una dependencia...</option>
                  {dependencias.map((dep) => (
                    <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Cargo</label>
                <select className="form-select" value={cargoId} onChange={(e) => setCargoId(e.target.value)} required>
                  <option value="">Seleccione un cargo...</option>
                  {cargos.map((car) => (
                    <option key={car.id} value={car.id}>{car.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setAlerta({ tipo: "", mensaje: "" })}>Cerrar</button>
              <button type="submit" className={empleadoAEditar ? "btn btn-warning" : "btn btn-primary"}>
                {empleadoAEditar ? "Guardar Cambios" : "Guardar Empleado"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioEmpleado;