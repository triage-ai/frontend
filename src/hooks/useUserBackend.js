import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useUserBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	// const getAllAgents = async () => {
	// 	const config = {
	// 		headers: { Authorization: `Bearer ${agentAuthState.token}` },
	// 	};

	// 	return await axios.get(process.env.REACT_APP_BACKEND_URL + 'agent/get', config);
	// };

	const getAllUsersBySearch = async (input, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `user?name=${input}&page=${page}&size=${size}`, config);
	}

	const getUserBySearch = async (input) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `user/search/${input}`, config);
	}

	const createUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'user/create', userInfo, config);
	};

	const updateUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'user/put/' + userInfo.user_id,
			userInfo,
			config
		);
	};

	const removeUser = async userInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'user/delete/' + userInfo.user_id,
			config
		);
	};

	return { createUser, updateUser, getAllUsersBySearch, getUserBySearch, removeUser };
};
