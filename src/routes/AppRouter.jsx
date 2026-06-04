import { BrowserRouter, Routes, Route } from 'react-router-dom';
// paginas publicas
import Login from "../pages/auth/Login";

// paginas protegidas
import Dashboard from "../pages/dashboard/Dashboard";
import Empleados from '../pages/empleados/Empleados';
import Dependencias from '../pages/dependencias/Dependencias';
import Cargos from '../pages/cargos/Cargos';

// Guards de rutas
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Layout principal
import Layout from '../components/Layout';

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicRoute><Login /></PublicRoute>} /> {/* Rutas públicas */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Dashboard principal */}
                <Route path='/empleados' element={<ProtectedRoute><Layout><Empleados /></Layout></ProtectedRoute>} /> {/* Módulo Empleados */}
                <Route path='/dependencias' element={<ProtectedRoute><Layout><Dependencias /></Layout></ProtectedRoute>} /> {/* Módulo Dependencias */}
                <Route path='/cargos' element={<ProtectedRoute><Layout><Cargos /></Layout></ProtectedRoute>} /> {/* Módulo Cargos */}
            </Routes>
        </BrowserRouter>

    );
}

export default AppRouter;