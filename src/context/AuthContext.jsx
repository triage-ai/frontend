import axios from 'axios';
import PropTypes from 'prop-types';
import React, { createContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

	AuthProvider.propTypes = {
		children: PropTypes.node.isRequired
	}

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
					user_id: null,
					token: null,
			  };
	};

	const [agentAuthState, setAgentAuthState] = useState(getAgentInitialAuthState);
	const [userAuthState, setUserAuthState] = useState(getUserInitialAuthState);
	const [permissions, setPermissions] = useState({});
	const [preferences, setPreferences] = useState({});

	useEffect(() => {
		const storedAgentAuthState = localStorage.getItem('agentAuthState');
		const storedUserAuthState = localStorage.getItem('userAuthState');

		if (storedAgentAuthState) {
			const agentData = JSON.parse(storedAgentAuthState)
			setAgentAuthState(agentData)
			refreshAgentData(agentData)
		}
		if (storedUserAuthState) setUserAuthState(JSON.parse(storedUserAuthState));
	}, []);

	const setAgentData = (agentData) => {
		setAgentAuthState(agentData);
		refreshAgentData(agentData)
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
			user_id: null,
			token: null,
		});
		localStorage.removeItem('userAuthState');
	};

	const refreshAgentData = async (agentAuthState) => {
		getAgentById(agentAuthState)
			.then((agentRes) => {
				const agent_perm = agentRes.data.permissions ? JSON.parse(agentRes.data.permissions) : {};
				const agent_roles = agentRes.data.role ? JSON.parse(agentRes.data.role.permissions) : {};
				const agent_pref = agentRes.data.preferences ? JSON.parse(agentRes.data.preferences) : {};
				setPermissions({...agent_perm, ...agent_roles})
				setPreferences({...agent_pref})
			})
			.catch((err) => {
				console.error(err);
			});
	}

	const value = useMemo(() => (
		{ agentAuthState, userAuthState, setAgentData, setUserData, agentLogout, userLogout, permissions, preferences }
	), [agentAuthState, userAuthState, setAgentData, setUserData, agentLogout, userLogout, permissions, preferences])

	return (
		<AuthContext.Provider value={value}>
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

