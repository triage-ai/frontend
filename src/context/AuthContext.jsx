import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const getInitialAuthState = () => {
		const storedAuthState = localStorage.getItem('authState');
		return storedAuthState
			? JSON.parse(storedAuthState)
			: {
					isAuth: false,
					userId: null,
					isAdmin: false,
					token: null,
			  };
	};

	const [authState, setAuthState] = useState(getInitialAuthState);

	useEffect(() => {
		const storedAuthState = localStorage.getItem('authState');
		if (storedAuthState) {
			setAuthState(JSON.parse(storedAuthState));
		}
	}, []);

	const setUserData = userData => {
		setAuthState(userData);
		localStorage.setItem('authState', JSON.stringify(userData));
	};

	const logout = () => {
		setAuthState({
			isAuth: false,
			userId: null,
			isAdmin: false,
			token: null,
		});
		localStorage.removeItem('authState');
	};

	return (
		<AuthContext.Provider value={{ authState, setUserData, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };
