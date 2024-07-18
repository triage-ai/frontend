import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useRolesBackend = () => {
	const { authState } = useContext(AuthContext);

	const getAllRoles = async () => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'role/get', config);
	};

	return { getAllRoles };
};
