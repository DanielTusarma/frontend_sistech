import React, { useState, useEffect } from "react";
import { listarUsuarios } from "../../services/usuarioService";
import TablaGenerica from "../../components/TablaGenerica";
import { crearUsuario } from "../../services/usuarioService";

export default function Usuarios() {

  // Estado para el formulario de creación
  const estadoInicialForm = {
    nombre: "",
    email: "",
    password: "",
    rol: "",
  };

  const [formUsuario, setFormUsuario] = useState(estadoInicialForm);
  const [errorValidacion, setErrorValidacion] = useState("");

  // Manejador de cambios en inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setFormUsuario({
      ...formUsuario,
      [name]: value,
    });
  };

  // Estados para la paginación y datos
  const [usuariosData, setUsuariosData] = useState({
    items: [],
    pages: 0,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  // Definición de columnas fijas para Usuarios
  const columnas = [
    { texto: "ID", ancho: "10%" },
    { texto: "Username / Email", ancho: "40%" },
    { texto: "Rol", ancho: "30%" },
    { texto: "Acciones", ancho: "20%" },
  ];

  // Función para cargar los datos desde FastAPI
  async function cargarUsuarios() {
    try {
      const datos = await listarUsuarios(page, size);
      setUsuariosData(datos);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    setErrorValidacion("");

    // Validación en frontend 
    if (!formUsuario.nombre.trim() || formUsuario.password.length < 8) {
      setErrorValidacion(
        "Por favor, verifica que el nombre no esté vacío y la contraseña tenga mínimo 8 caracteres.",
      );
      return;
    }

    try {
      await crearUsuario(formUsuario);

      setFormUsuario(estadoInicialForm); 
      cargarUsuarios(); 

    document.querySelector('#modalUsuario .btn-close')?.click();

      alert("¡Usuario creado con éxito!");
    } catch (error) {
      console.error("Error al crear usuario:", error);

      const mensajeError =
        error.response?.data?.detail || "Error interno al crear el usuario";
      setErrorValidacion(
        typeof mensajeError === "string" ? mensajeError : "Datos inválidos",
      );
    }
  }

  // Escuchar cambios de página
  useEffect(() => {
    cargarUsuarios();
  }, [page, size]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios del Sistema</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalUsuario"
        >
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
        </button>
      </div>

      <TablaGenerica
        columnas={columnas}
        datos={usuariosData.items}
        paginacion={{
          page: page,
          pages: usuariosData.pages,
          total: usuariosData.total,
          setPage: setPage,
        }}
        renderFila={(usuario) => (
          <>
            <td className="text-start">{usuario.id}</td>
            <td className="text-start">{usuario.email || usuario.username}</td>
            <td className="text-start">
              {(() => {
                switch (usuario.rol) {
                  case "admin":
                    return (
                      <span className="badge bg-danger">Administrador</span>
                    );
                  case "supervisor":
                    return (
                      <span className="badge bg-warning text-dark">
                        Supervisor
                      </span>
                    );
                  case "auditor":
                    return (
                      <span className="badge bg-info text-dark">Auditor</span>
                    );
                  case "usuario":
                    return <span className="badge bg-success">Usuario</span>;
                  default:
                    return (
                      <span className="badge bg-secondary">
                        {usuario.rol || "Sin Rol"}
                      </span>
                    );
                }
              })()}
            </td>
            <td className="text-start">
              <div className="btn-group" role="group">
                <span className="text-muted fs-7">Sin acciones</span>
              </div>
            </td>
          </>
        )}
      />

      <div
        className="modal fade"
        id="modalUsuario"
        tabIndex="-1"
        aria-labelledby="modalUsuarioLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="modalUsuarioLabel">
                <i className="bi bi-person-plus-fill me-2"></i>Registrar Nuevo
                Usuario
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form onSubmit={guardarUsuario}>
              <div className="modal-body">
                {errorValidacion && (
                  <div className="alert alert-danger py-2 fs-6" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorValidacion}
                  </div>
                )}

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    required
                    minLength={3}
                    maxLength={100}
                    value={formUsuario.nombre}
                    onChange={manejarCambioInput}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    maxLength={254}
                    value={formUsuario.email}
                    onChange={manejarCambioInput}
                    placeholder="juan.perez@empresa.com"
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    required
                    minLength={8}
                    maxLength={64}
                    value={formUsuario.password}
                    onChange={manejarCambioInput}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                {/* Rol */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Rol de Usuario</label>
                  <select
                    className="form-select"
                    name="rol"
                    required
                    value={formUsuario.rol}
                    onChange={manejarCambioInput}
                  >
                    <option value="">Selecciona un rol...</option>
                    <option value="admin">Administrador 👑</option>
                    <option value="usuario">Usuario Estándar 👤</option>
                    <option value="supervisor">Supervisor 🔎</option>
                    <option value="auditor">Auditor 📊</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalUsuario"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save me-2"></i>Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
