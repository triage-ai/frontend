import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const getAgentInitialAuthState = () => {
		const storedAuthState = localStorage.getItem('agentAuthState');
		return storedAuthState
			? JSON.parse(storedAuthState)
			: {
					isAuth: false,
					agent_id: null,
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
	const [permissions, setPermissions] = useState({});

	useEffect(() => {
		const storedAgentAuthState = localStorage.getItem('agentAuthState');
		const storedUserAuthState = localStorage.getItem('userAuthState');
		if (storedAgentAuthState) setAgentAuthState(JSON.parse(storedAgentAuthState));
		if (storedUserAuthState) setUserAuthState(JSON.parse(storedUserAuthState));
	}, []);

	const setAgentData = (agentData) => {
		setAgentAuthState(agentData);
		localStorage.setItem('agentAuthState', JSON.stringify(agentData));
	};

	const setUserData = (userData) => {
		setUserAuthState(userData);
		localStorage.setItem('userAuthState', JSON.stringify(userData));
	};

	const agentLogout = () => {
		setAgentAuthState({
			isAuth: false,
			agent_id: null,
			isAdmin: false,
			token: null,
		});
		setPermissions({});
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

	useEffect(() => {
		if (agentAuthState.agent_id) {
			getAgentById(agentAuthState)
				.then((agentRes) => {
					const agent_perm = JSON.parse(agentRes.data.permissions);
					const agent_roles = JSON.parse(agentRes.data.role.permissions);
					setPermissions({...agent_perm, ...agent_roles})
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [agentAuthState]);

	return (
		<AuthContext.Provider value={{ agentAuthState, userAuthState, setAgentData, setUserData, agentLogout, userLogout, permissions }}>
			{children}
		</AuthContext.Provider>
	);
};

const getAgentById = async (agentAuthState) => {
	const config = {
		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	};

	return await axios.get(process.env.REACT_APP_BACKEND_URL + `agent/id/${agentAuthState.agent_id}`, config);
};

export { AuthContext, AuthProvider };

