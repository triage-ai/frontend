import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

	const getAgentInitialAuthState = () => {
		const storedAuthState = localStorage.getItem('agentAuthState');
		return storedAuthState
			? JSON.parse(storedAuthState)
			: {
					isAuth: false,
					agentId: null,
					isAdmin: false,
					token: null,
			  };
	};

	const getUserInitialAuthState = () => {
		const storedAuthState = localStorage.getItem('userAuthState');
		return storedAuthState
			? JSON.parse(storedAuthState)
			: {
					isAuth: false,
					userId: null,
					token: null,
			  };
	};

	const [agentAuthState, setAgentAuthState] = useState(getAgentInitialAuthState);
	const [userAuthState, setUserAuthState] = useState(getUserInitialAuthState);


	useEffect(() => {
		const storedAgentAuthState = localStorage.getItem('agentAuthState');
		const storedUserAuthState = localStorage.getItem('userAuthState');
		if (storedAgentAuthState) setAgentAuthState(JSON.parse(storedAgentAuthState));
		if (storedUserAuthState) setUserAuthState(JSON.parse(storedUserAuthState));
	}, []);

	const setAgentData = agentData => {
		setAgentAuthState(agentData);
		localStorage.setItem('agentAuthState', JSON.stringify(agentData));
	};

	const setUserData = userData => {
		setUserAuthState(userData);
		localStorage.setItem('userAuthState', JSON.stringify(userData));
	};

	const agentLogout = () => {
		setAgentAuthState({
			isAuth: false,
			agentId: null,
			isAdmin: false,
			token: null,
		});
		localStorage.removeItem('agentAuthState');
	};

	const userLogout = () => {
		setUserAuthState({
			isAuth: false,
			userId: null,
			token: null,
		});
		localStorage.removeItem('userAuthState');
	};

	return (
		<AuthContext.Provider value={{ agentAuthState, userAuthState, setAgentData, setUserData, agentLogout, userLogout }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };
