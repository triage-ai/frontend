import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSLABackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllSLAs = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'sla/get', config);
	};

	return { getAllSLAs };
};
