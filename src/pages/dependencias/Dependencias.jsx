import { useEffect, useState } from "react";
import {
  listarDependencias,
  crearDependencia,
} from "../../services/dependenciaService";
import Alert from "../../components/Alert";
import { obtenerMensajeError } from "../../utils/errorHandler";
import TablaGenerica from "../../components/TablaGenerica";

function Dependencias() {
  // Estados
  const [dependencias, setDependencias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [alerta, setAlerta] = useState({
    tipo: "",
    mensaje: "",
  });
  const [page, setPage] = useState(1);
  const size = 5;

  // nuevos estados para tabla generica
  const columnasDependencias = [
    { texto: "ID", alineacion: "text-center", ancho: "20%" },
    { texto: "Nombre", alineacion: "text-start", ancho: "50%" },
    { texto: "Activo", alineacion: "text-start", ancho: "30%" }
  ];

  // Carga inicial de dependencias
  useEffect(() => {
    cargarDependencias();
  }, [page]);

  // Funciones

  // Carga las dependencias desde la API y actualiza el estado
  async function cargarDependencias() {
    try {
      const datos = await listarDependencias(page, size);

      setDependencias(datos);
    } catch (error) {
      console.error(error);
    }
  }

  // Valida el formulario y crea una nueva dependencia
  async function manejarSubmit(e) {
    e.preventDefault();

    try {
      const nuevaDependencia = {
        nombre,
      };

      await crearDependencia(nuevaDependencia);

      setNombre("");
      setAlerta({
        tipo: "success",
        mensaje: "Dependencia creada correctamente,",
      });

      await cargarDependencias();

    } catch (error) {
      // utilizamos la funcion de obtenerMensajeError
      setAlerta({
        tipo: "danger",
        mensaje: obtenerMensajeError(error)
      });     
    }
  }

  return (
    <>
      <h2 className="mb-4">Dependencias</h2>

      <Alert tipo={alerta.tipo} mensaje={alerta.mensaje} />

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={manejarSubmit}>
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre dependencia"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);

                  if (alerta.mensaje) {
                    setAlerta({
                      tipo: "",
                      mensaje: "",
                    });
                  }
                }}
              />
            </div>

            <div className="col-md-4">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th className="text-center" style={{ width: "20%" }}>
                  ID
                </th>
                <th className="text-start" style={{ width: "50% " }}>
                  Nombre
                </th>
                <th className="text-start" style={{ width: "30% " }}>
                  Activo
                </th>
              </tr>
            </thead>

            <tbody className="text-start">
              {dependencias.map((dependencia) => (
                <tr key={dependencia.id}>
                  <td className="text-center text-muted">{dependencia.id}</td>
                  <td className="text-start fw-bold">{dependencia.nombre}</td>
                  <td className="text-start text-secondary">
                    {dependencia.activo ? "Sí" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3">
            {page > 1 ? (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setPage((prev) => prev - 1, 1)}
              >
                Anterior
              </button>
            ) : (
              <div />
            )}

            <span className="align-self-center">Página {page}</span>

            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={dependencias.length < size}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div> */}
      <TablaGenerica 
        columnas={columnasDependencias}
        datos={dependencias}
        paginacion={{ page, setPage, size }}
        renderFila={(dependencia) => (
          <>
            <td className="text-center text-muted">{dependencia.id}</td>
            <td className="text-start fw-bold">{dependencia.nombre}</td>
            <td className="text-start text-secondary">{dependencia.activo ? "Si" : "No"}</td>
          </>
        )}
      />

    </>
  );
}

export default Dependencias;
