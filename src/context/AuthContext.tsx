import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../Components/api/api';

interface AuthData {
    companyID: string | null;
    authToken: string | null;
    userType: string[];
}

interface AuthProviderProps {
    children: ReactNode;
}

interface CompanyDetailsResponse {
    company_id: string;
    user_type: string[];
}

const AuthContext = createContext<{
    authData: AuthData;
    updateAuthData: (data: AuthData) => void;
    logout: () => void;
} | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authData, setAuthData] = useState<AuthData>({
        companyID: null,
        authToken: null,
        userType: [],
    });

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            setAuthData((prev) => ({ ...prev, authToken }));
            fetchCompanyDetails(authToken);
        }
    }, []);

    const fetchCompanyDetails = async (token: string) => {
        try {
            const response = await api.get<CompanyDetailsResponse>('/auth/company-log-details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status >= 200 && response.status < 300) {
                const { company_id, user_type } = response.data;
                setAuthData({ authToken: token, companyID: company_id, userType: user_type });
            } else if (response.status === 401) {
                logout();
            } else {
                throw new Error('Não foi possível obter os detalhes da empresa.');
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };

    const updateAuthData = (data: AuthData) => {
        setAuthData(data);
        sessionStorage.setItem('authToken', data.authToken || '');
    };

    const logout = () => {
        setAuthData({ authToken: null, companyID: null, userType: [] });
        sessionStorage.removeItem('authToken');
        window.location.href = '/#login';
    };

    return (
        <AuthContext.Provider value={{ authData, updateAuthData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
