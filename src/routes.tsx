import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Loading from "./Components/Loading";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Authentication from "./Pages/Auth";
import NotFound from "./Pages/NotFound";
import PageBodySystem from "./Components/PageBodySystem";
import { ReactElement } from "react";
import Home from "./Pages/Home";
import Funcionarios from "./Pages/Funcionarios";

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
}

function ProtectedRoute({ element, allowedCompanyIds }: ProtectedRouteProps) {
    const { authData } = useAuth();
    const isAuthenticated = !!authData.authToken;
    const userCompanyId = authData.companyID;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // @ts-expect-errorsdsds
    if (allowedCompanyIds && !allowedCompanyIds.includes(userCompanyId)) {
        return <Navigate to="/home" />;
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
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Suspense>
            </HashRouter>
        </AuthProvider>
    )
}

export default AppRoutes;
