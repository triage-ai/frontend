import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { agentAuthState } = useContext(AuthContext);

	if (!agentAuthState.isAuth) {
		debugger;
		return <Navigate to="/" />;
	}

	return children;
};

export default ProtectedRoute;
