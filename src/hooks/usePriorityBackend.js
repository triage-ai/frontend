import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useProrityBackend = () => {
	const { authState } = useContext(AuthContext);

	const getAllPriorities = async () => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'ticket_priority/get', config);
	};

	return { getAllPriorities };
};
