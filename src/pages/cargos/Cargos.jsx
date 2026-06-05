import { useEffect, useState } from "react";
import { crearCargo, listarCargos } from "../../services/cargoService";
import Alert from "../../components/Alert";
import { obtenerMensajeError } from "../../utils/errorHandler";
import TablaGenerica from "../../components/TablaGenerica";

function Cargos() {
  // Estados
  const [cargos, setCargos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [alerta, setAlerta] = useState({
    tipo: "",
    mensaje: "",
  });
  const [page, setPage] = useState(1);
  const size = 5;

  // nuevos estados para tabla generica
  const columnasCargos = [
    { texto: "ID", alineacion: "text-center", ancho: "10%" },
    { texto: "Nombre", alineacion: "text-start", ancho: "30%" },
    { texto: "Descripción", alineacion: "text-start", ancho: "60%" },
  ];

  // carga inicial de cargos
  useEffect(() => {
    cargarCargos();
  }, [page]);

  // Funciones

  // carga los cargos desde la API y actualiza el estado
  async function cargarCargos() {
    try {
      const datos = await listarCargos(page, size);

      setCargos(datos);
    } catch (error) {
      console.error(error);
    }
  }

  // validar el formulario y crear un nuevo cargo
  async function manejarSubmit(e) {
    e.preventDefault();

    try {
      const nuevoCargo = {
        nombre,
        descripcion,
      };

      await crearCargo(nuevoCargo);

      setNombre("");
      setDescripcion("");
      setAlerta({
        tipo: "success",
        mensaje: "Cargo creado correctamente",
      });

      await cargarCargos();
    } catch (error) {
      // utilizamos la funcion de obtenerMensajeError
      setAlerta({
        tipo: "danger",
        mensaje: obtenerMensajeError(error),
      });
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cargos</h2>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalCargo"
        >
          <i className="bi bi-plus-lg me-1"></i>+ Nuevo cargo
        </button>
      </div>

      <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />
      {/* <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th className="text-center" style={{ width: "10%" }}>
                  ID
                </th>
                <th className="text-start" style={{ width: "30%" }}>
                  Nombre
                </th>
                <th className="text-start" style={{ width: "60%" }}>
                  Descripción
                </th>
              </tr>
            </thead>

            <tbody className="text-start">
              {cargos.map((cargo) => (
                <tr key={cargo.id}>
                  <td className="text-center text-muted">{cargo.id}</td>
                  <td className="text-start fw-bold">{cargo.nombre}</td>
                  <td className="text-start text-secondary">
                    {cargo.descripcion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3">
            {page > 1 ? (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setPage((prev) => prev - 1)}
              >
                Anterior
              </button>
            ) : (
              <div />
            )}

            <span className="align-self-center fw-medium">Página {page}</span>

            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={cargos.length < size}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div> */}

      <TablaGenerica
        columnas={columnasCargos}
        datos={cargos}
        paginacion={{ page, setPage, size }}
        renderFila={(cargo) => (
          <>
            <td className="text-center text-muted">{cargo.id}</td>
            <td className="text-start fw-bold">{cargo.nombre}</td>
            <td className="text-start text-secondary">{cargo.descripcion}</td>
          </>
        )}
      />

      <div
        className="modal fade"
        id="modalCargo"
        tabIndex="-1"
        aria-labelledby="modalCargoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCargoLabel">
                Registrar Cargo
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={manejarSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Cargo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Guardar Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cargos;
