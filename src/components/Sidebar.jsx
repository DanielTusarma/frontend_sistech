import { NavLink } from "react-router-dom";

function Sidebar() {

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const rol = usuario?.rol;

  console.log("Rol:", rol)


  return (
    <div className="p-3 border-end vh-100">
      <h5>Menú</h5>

      <ul className="nav flex-column">

        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/empleados" className="nav-link">
            Empleados
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dependencias" className="nav-link">
            Dependencias
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cargos" className="nav-link">
            Cargos
          </NavLink>
        </li>

        {rol === "admin" && (
          <li className="nav-item">
            <NavLink to="/usuarios" className="nav-link">
              Usuarios
            </NavLink>
          </li>
        )}

      </ul>
    </div>
  );
}

export default Sidebar;