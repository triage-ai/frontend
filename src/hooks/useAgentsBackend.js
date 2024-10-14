import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAgentsBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllAgents = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'agent/get', config);
	};

	const createAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'agent/create', agentInfo, config);
	};

	const updateAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'agent/put/' + agentInfo.agent_id,
			agentInfo,
			config
		);
	};

	const removeAgent = async agentInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.delete(
			process.env.REACT_APP_BACKEND_URL + 'agent/delete/' + agentInfo.agent_id,
			{},
			config
		);
	};

	return { getAllAgents, createAgent, updateAgent, removeAgent };
};
