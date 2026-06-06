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
  const [nombre, setNombre] = useState("");
  const [alerta, setAlerta] = useState({
    tipo: "",
    mensaje: "",
  });
  const [paginacionData, setPaginacionData] = useState({
    items: [],
    total: 0,
    pages: 1
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
      const respuesta = await listarDependencias(page, size);

      setPaginacionData(respuesta);
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

      <TablaGenerica 
        columnas={columnasDependencias}
        datos={paginacionData.items}
        paginacion={{
          page: page,
          setPage: setPage,
          pages: paginacionData.pages,
          total: paginacionData.total,
        }}       
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
