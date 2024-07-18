import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useDepartmentsBackend = () => {
	const { authState } = useContext(AuthContext);

	const getAllDepartments = async () => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'department/get', config);
	};

	return { getAllDepartments };
};
