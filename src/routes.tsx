import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect, ReactElement } from "react";
import { useLocation } from "react-router-dom";

import Loading from "./Components/Loading";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Authentication from "./Pages/Auth";
import NotFound from "./Pages/NotFound";
import PageBodySystem from "./Components/PageBodySystem";
import Home from "./Pages/Home";
import Funcionarios from "./Pages/Funcionarios";
import FuncionarioDetails from "./Pages/Funcionarios/Details";
import RegistroOcorrencia from "./Pages/RegistroOcorrencia";
import OcorrenciaDetalhes from "./Pages/RegistroOcorrencia/OcorrenciaDetalhes";
import UsersList from "./Pages/Usuarios";
import Forbidden from "./Components/Forbidden";
import FeriasCalendar from "./Pages/Ferias";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

interface ProtectedRouteProps {
    element: ReactElement;
    allowedCompanyIds?: number[];
    requireUserType1?: boolean;
}

function ProtectedRoute({ element, allowedCompanyIds, requireUserType1 }: ProtectedRouteProps) {
    const { authData } = useAuth();
    const isAuthenticated = !!authData.authToken;
    const userCompanyId = Number(authData.companyID) || 0;  // Aqui, 0 é o valor padrão

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedCompanyIds && !allowedCompanyIds.includes(userCompanyId)) {
        return <Navigate to="/home" />;
    }

    if (requireUserType1 && !authData.userType.includes("1")) {
        return <Navigate to="/forbidden" replace />;
    }

    return element;
}


function AppRoutes() {
    return (
        <AuthProvider>
            <HashRouter>
                <ScrollToTop />
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<Authentication />} />
                        <Route element={<PageBodySystem />}>
                            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
                            <Route path="/funcionarios" element={<ProtectedRoute element={<Funcionarios />} />} />
                            <Route path="/ocorrencias" element={<ProtectedRoute element={<RegistroOcorrencia />} />} />
                            <Route path="/ocorrencias/:id" element={<ProtectedRoute element={<OcorrenciaDetalhes />} />} />

                            <Route path="/funcionario-details/:id" element={<ProtectedRoute element={<FuncionarioDetails />} />} />
                            <Route path="/ferias" element={<ProtectedRoute element={<FeriasCalendar />} />} />

                            {/* Proteja a rota /usuarios para userType = 1 */}
                            <Route path="/usuarios" element={<ProtectedRoute element={<UsersList />} requireUserType1={true} />} />
                            <Route path="/forbidden" element={<Forbidden />} />

                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Suspense>
            </HashRouter>
        </AuthProvider>
    )
}

export default AppRoutes;
