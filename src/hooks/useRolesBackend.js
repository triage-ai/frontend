import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useRolesBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllRoles = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'role/get', config);
	};

	const createRole = async roleInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'role/create', roleInfo, config);
	};

	return { getAllRoles, createRole };
};
