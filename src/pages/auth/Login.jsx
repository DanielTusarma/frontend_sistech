import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await login(formData);

      localStorage.setItem("access_token", response.access_token);

      localStorage.setItem("usuario", JSON.stringify(response.usuario));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">
                Iniciar Sesión
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Usuario
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Ingresar
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;