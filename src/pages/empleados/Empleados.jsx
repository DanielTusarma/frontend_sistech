import { useEffect, useState } from "react";
import {
  listarEmpleados,
  desactivarEmpleado,
  obtenerEmpleadoDetalle,
} from "../../services/empleadoService";
import TablaGenerica from "../../components/TablaGenerica";
import FormularioEmpleado from "./FormularioEmpleado";
import DetalleEmpleado from "./DetalleEmpleado";
import ModalDesactivar from "./ModalDesactivar";

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

  useEffect(() => {
    cargarEmpleados();
  }, [page]);


  // funciones

  async function cargarEmpleados() {
    try {
      const datos = await listarEmpleados(page, size);
      setEmpleadosData(datos);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    }
  }

  async function manejarInactivar(id, nombreCompleto) {
    try {
      const empleadoFull = await obtenerEmpleadoDetalle(id);

      console.log("Datos completos del empleado:", empleadoFull);

      setEmpleadoAInactivar({
        id: id,
        nombreCompleto: nombreCompleto,
        fechaIngreso: empleadoFull.fecha_ingreso
      });
      
    } catch (error) {
      console.error("Error al obtener la fecha de ingreso del empleado:", error);
      alert("No se pudo abrir el asistente de baja. Intenta de nuevo.");
    }    
  }

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

  const columnas = [
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
        {/* Botón que abre el modal (el modal vivirá dentro del componente hijo) */}
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalEmpleado"
        >
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Empleado
        </button>
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

                {/* Editar */}
                <button
                  className="btn btn-sm btn-outline-warning"
                  title="Editar"
                  onClick={() => manejarEditar(empleado)}
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
                      `${empleado.nombres} ${empleado.apellidos}`
                    )
                  }
                >
                  <i className="bi bi-person-x-fill"></i>
                </button>
              </div>
            </td>
          </>
        )}
      />

      <ModalDesactivar 
        empleado={empleadoAInactivar}
        onClose={() => setEmpleadoAInactivar(null)}
        onDesactivadoExitoso={cargarEmpleados} // Reutiliza tu recarga automática
      />

      <FormularioEmpleado onEmpleadoGuardado={cargarEmpleados} />

      <DetalleEmpleado 
        empleado={empleadoSeleccionado} 
        onClose={() => setEmpleadoSeleccionado(null)} 
      />
    </div>
  );
}

export default Empleados;
