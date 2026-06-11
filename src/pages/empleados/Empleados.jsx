import { useEffect, useState } from "react";
import {
  listarEmpleados,
  desactivarEmpleado,
  obtenerEmpleadoDetalle,
  editarEmpleado,
  crearEmpleado,
} from "../../services/empleadoService";
import TablaGenerica from "../../components/TablaGenerica";
import FormularioEmpleado from "./FormularioEmpleado";
import DetalleEmpleado from "./DetalleEmpleado";
import ModalDesactivar from "./ModalDesactivar";
import { listarEmpleadosPorDependencia } from "../../services/dependenciaService";
import { listarDependencias } from "../../services/dependenciaService";
import { listarEmpleadosPorCargo } from "../../services/cargoService";
import { listarCargos } from "../../services/cargoService";
import { listarEmpleadosInactivos } from "../../services/empleadoService";

function Empleados() {
  // Estados para la tabla y paginación
  const [empleadosData, setEmpleadosData] = useState({
    items: [],
    total: 0,
    pages: 1,
  });
  const [page, setPage] = useState(1);
  const size = 5;
  const [empleadoAInactivar, setEmpleadoAInactivar] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);
  const [dependenciaFiltroId, setDependenciaFiltroId] = useState("");
  const [listaDependenciasFiltro, setListaDependenciasFiltro] = useState([]);
  const [cargoFiltroId, setCargoFiltroId] = useState("");
  const [listaCargosFiltro, setListaCargosFiltro] = useState([]);
  const [verInactivos, setVerInactivos] = useState(false);

  useEffect(() => {
    cargarEmpleados();
  }, [page, size, dependenciaFiltroId, cargoFiltroId, verInactivos]);

  useEffect(() => {
    // obtener dependencias
    async function obtenerDeps() {
      try {
        const respuesta = await listarDependencias(1, 100);
        setListaDependenciasFiltro(respuesta.items || []);
      } catch (error) {
        console.error("Error cargando dependencias para el filtro:", error);
      }
    }
    obtenerDeps();

    // obtener cargos
    async function obtenerCargos() {
      try {
        const respuesta = await listarCargos(1, 100);
        setListaCargosFiltro(respuesta.items || []);
      } catch (error) {
        console.error("Error cargando cargos para el filtro:", error);
      }
    }
    obtenerCargos();
  }, []);

  // funciones

  // Función para cargar empleados según los filtros y paginación
  async function cargarEmpleados() {
    try {
      let datos;

      if (verInactivos) {
        datos = await listarEmpleadosInactivos(page, size);
      } else {
        if (dependenciaFiltroId) {
          datos = await listarEmpleadosPorDependencia(
            dependenciaFiltroId,
            page,
            size,
          );
        } else if (cargoFiltroId) {
          datos = await listarEmpleadosPorCargo(cargoFiltroId, page, size);
        } else {
          datos = await listarEmpleados(page, size);
        }
      }
      setEmpleadosData(datos);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    }
  }

  // Función para manejar la inactivación (baja) de un empleado
  async function manejarInactivar(id, nombreCompleto) {
    try {
      const empleadoFull = await obtenerEmpleadoDetalle(id);

      console.log("Datos completos del empleado:", empleadoFull);

      setEmpleadoAInactivar({
        id: id,
        nombreCompleto: nombreCompleto,
        fechaIngreso: empleadoFull.fecha_ingreso,
      });
    } catch (error) {
      console.error(
        "Error al obtener la fecha de ingreso del empleado:",
        error,
      );
      alert("No se pudo abrir el asistente de baja. Intenta de nuevo.");
    }
  }

  // Función para manejar la visualización del detalle de un empleado
  async function manejarVerDetalle(id) {
    try {
      // Como tu Pydantic actual de la lista no trae el salario ni el email,
      // aprovechamos el endpoint de detalle por ID para traer la información full
      const empleadoFull = await obtenerEmpleadoDetalle(id);
      setEmpleadoSeleccionado(empleadoFull); // Guarda el objeto completo en el estado
    } catch (error) {
      console.error("Error al obtener detalle:", error);
      alert("No se pudo cargar la información detallada.");
    }
  }

  // Función para manejar la edición de un empleado (carga de datos en el formulario)
  async function manejarEditar(id) {
    try {
      const empleadoFull = await obtenerEmpleadoDetalle(id);

      setEmpleadoAEditar(empleadoFull);
    } catch (error) {
      console.error("Error al cargar datos de edición:", error);
      alert("No se pudieron cargar los datos para editar.");
    }
  }

  // Función para guardar o actualizar un empleado según el caso
  async function guardarOActualizarEmpleado(datosFormulario) {
    try {
      if (empleadoAEditar) {
        await editarEmpleado(empleadoAEditar.id, datosFormulario);
        alert("¡Empleado actualizado con éxito!");
      } else {
        await crearEmpleado(datosFormulario);
        alert("¡Empleado creado con éxito!");
      }

      setEmpleadoAEditar(null);
      await cargarEmpleados();
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      alert("Hubo un problema al guardar los datos.");
    }
  }

  // Definición de columnas para la tabla, ajustándose si se muestran inactivos o no
  const columnas = verInactivos
  ? [

      { texto: "Nombres", ancho: "15%" },
      { texto: "Apellidos", ancho: "15%" },
      { texto: "Dependencia", ancho: "20%" },
      { texto: "Cargo", ancho: "15%" },
      { texto: "Fecha de Salida", ancho: "20%" }, 
      { texto: "Acciones", ancho: "15%" },
    ]
  : [ 
    { texto: "Nombres", ancho: "20%" },
    { texto: "Apellidos", ancho: "20%" },
    { texto: "Dependencia", ancho: "20%" },
    { texto: "Cargo", ancho: "20%" },
    { texto: "Acciones", ancho: "20%" },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Empleados</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalEmpleado"
          onClick={() => setEmpleadoAEditar(null)} 
        >
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Empleado
        </button>
      </div>

      <div className="row my-3 align-items-center">
        <div className="col-md-4">
          <label className="form-label fw-bold">Filtrar por Dependencia:</label>
          <select
            className="form-select border-primary"
            value={dependenciaFiltroId}
            onChange={(e) => {
              setDependenciaFiltroId(e.target.value);
              if (e.target.value) setCargoFiltroId("");
            }}
          >
            <option value="">🌍 Mostrar Todas las Dependencias</option>
            {listaDependenciasFiltro.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-bold">Filtrar por Cargo:</label>
          <select
            className="form-select border-success"
            value={cargoFiltroId}
            onChange={(e) => {
              setCargoFiltroId(e.target.value);
              if (e.target.value) setDependenciaFiltroId("");
            }}
          >
            <option value="">👔 Mostrar Todos los Cargos</option>
            {listaCargosFiltro.map((car) => (
              <option key={car.id} value={car.id}>
                {car.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 d-flex align-items-center mt-4">
          <div className="form-check form-switch fs-5">
            <input
              className="form-check-input backend-switch"
              type="checkbox"
              id="switchInactivos"
              checked={verInactivos}
              onChange={(e) => {
                setVerInactivos(e.target.checked);
                if (e.target.checked) {
                  setDependenciaFiltroId("");
                  setCargoFiltroId("");
                }
              }}
            />
            <label
              className="form-check-label text-danger fw-bold"
              htmlFor="switchInactivos"
            >
              💀 Ver Historial de Inactivos
            </label>
          </div>
        </div>
      </div>

      <TablaGenerica
        columnas={columnas}
        datos={empleadosData.items}
        paginacion={{
          page: page,
          pages: empleadosData.pages,
          total: empleadosData.total,
          setPage: setPage,
        }}
        renderFila={(empleado) => (
          <>
            <td className="text-start">{empleado.nombres}</td>
            <td className="text-start">{empleado.apellidos}</td>
            <td className="text-start">
              {empleado.dependencia?.nombre || "Sin área"}
            </td>
            <td className="text-start">
              {empleado.cargo?.nombre || "Sin cargo"}
            </td>

            {verInactivos && (
              <td className="text-start fw-bold text-danger">
              {empleado.fecha_salida || "No registrada"}
              </td>
            )}

            <td className="text-start">
              <div className="btn-group" role="group">
                {/* Detalle */}
                <button
                  className="btn btn-sm btn-outline-info"
                  title="Ver Detalle"
                  onClick={() => manejarVerDetalle(empleado.id)}
                >
                  <i className="bi bi-eye-fill"></i>
                </button>

                
                { !empleado.fecha_salida && (
                  <>
                    {/* Editar */}
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      title="Editar"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEmpleado"
                      onClick={() => manejarEditar(empleado.id)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>

                    {/* Desactivar */}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Desactivar"
                      onClick={() =>
                        manejarInactivar(
                          empleado.id,
                          `${empleado.nombres} ${empleado.apellidos}`,
                        )
                      }
                    >
                      <i className="bi bi-person-x-fill"></i>
                    </button>
                  </>
                )}
              </div>
            </td>
          </>
        )}
      />

      <ModalDesactivar
        empleado={empleadoAInactivar}
        onClose={() => setEmpleadoAInactivar(null)}
        onDesactivadoExitoso={cargarEmpleados}
      />

      <FormularioEmpleado
        onSubmitExitoso={guardarOActualizarEmpleado}
        empleadoAEditar={empleadoAEditar}
      />

      <DetalleEmpleado
        empleado={empleadoSeleccionado}
        onClose={() => setEmpleadoSeleccionado(null)}
      />
    </div>
  );
}

export default Empleados;
