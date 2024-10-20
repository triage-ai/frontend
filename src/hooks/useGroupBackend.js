import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useGroupBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllGroups = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'group/get', config);
	};

	return { getAllGroups };
};
