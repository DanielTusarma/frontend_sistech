import { useEffect, useState } from "react";
import {
  listarDependencias,
  crearDependencia,
} from "../../services/dependenciaService";
import Alert from "../../components/Alert";

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

  // Carga inicial de dependencias
  useEffect(() => {
    cargarDependencias();
  }, [page]);

  // Funciones

  // Carga las dependencias desde la API y actualiza el estado
  async function cargarDependencias() {
    try {

      console.log("Página actual en api:", page);
      const datos = await listarDependencias(page, size);

      
      setDependencias(datos);
    } catch (error) {
      console.error(error);
    }
  }

  // Valida el formulario y crea una nueva dependencia
  async function manejarSubmit(e) {
    e.preventDefault();

    if (!nombre.trim()) {
      setAlerta({
        tipo: "danger",
        mensaje: "El nombre es obligatorio",
      });
      return;
    }

    if (nombre.trim().length < 2) {
      setAlerta({
        tipo: "danger",
        mensaje: "El nombre debe tener al menos 2 caracteres",
      });
      return;
    }

    if (nombre.trim().length > 30) {
      setAlerta({
        tipo: "danger",
        mensaje: "El nombre no puede superar los 30 caracteres",
      });
      return;
    }

    try {
      const nuevaDependencia = {
        nombre,
      };

      const respuesta = await crearDependencia(nuevaDependencia);

      console.log(respuesta);

      await cargarDependencias();

      setNombre("");

      setAlerta({
        tipo: "success",
        mensaje: "Dependencia creada correctamente",
      });
    } catch (error) {
      console.error(error.response.data);
      setAlerta({
        tipo: "danger",
        mensaje: "Error al crear la dependencia",
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

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Activo</th>
              </tr>
            </thead>

            <tbody>
              {dependencias.map((dependencia) => (
                <tr key={dependencia.id}>
                  <td>{dependencia.id}</td>
                  <td>{dependencia.nombre}</td>
                  <td>{dependencia.activo ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </button>

            <span className="align-self-center">Página {page}</span>

            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dependencias;
