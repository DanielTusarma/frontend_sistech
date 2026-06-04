import { use } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

function Dashboard() {

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");

    navigate("/login");
  }

  return (
    <Layout>
      <h1>Dashboard</h1>

      <p>Email: {usuario.email}</p>

      <p>Rol: {usuario.rol}</p>

      <button
        className="btn btn-danger mt-3"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
    </Layout>
  );
}

export default Dashboard;
