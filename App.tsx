import React from 'react';
import { useAuth } from './auth/AuthContext';
import AuthenticatedApp from './AuthenticatedApp';
import PublicApp from './PublicApp';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <AuthenticatedApp />;
    }

    return <PublicApp />;
};

export default App;
