import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../utils/api';

interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const refreshUser = async () => {
        try {
            const response: any = await api.get('/auth/me');
            setState({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            // If 401, it means not authenticated, which is fine during initial load
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (data: any) => {
        const response: any = await api.post('/auth/login', data);
        setState({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
        });
    };

    const signup = async (data: any) => {
        const response: any = await api.post('/auth/signup', data);
        setState({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
        });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, signup, logout, refreshUser }}>
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
