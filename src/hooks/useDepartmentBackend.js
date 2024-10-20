import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useDepartmentBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllDepartments = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'department/get', config);
	};

	const createDepartment = async departmentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'department/create',
			departmentInfo,
			config
		);
	};

	return { getAllDepartments, createDepartment };
};
