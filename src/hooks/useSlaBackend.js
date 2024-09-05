import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSlaBackend = () => {
	const { authState } = useContext(AuthContext);

	const getAllSlas = async () => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'sla/get', config);
	};

	return { getAllSlas };
};
