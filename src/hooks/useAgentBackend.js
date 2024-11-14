import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAgentBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllAgents = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'agent/get', config);
	};

	const getAllAgentsByDeptAndGroup = async (dept_id, group_id, page, size) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		var url = `agent/get/?page=${page}&size=${size}&`
		if (dept_id) {
			url += `dept_id=${dept_id}&`
		}
		if (group_id) {
			url += `group_id=${group_id}`
		}

		return await axios.get(process.env.REACT_APP_BACKEND_URL + url, config);
	};

	const getAgentBySearch = async (input) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `agent/search/${input}`, config);
	}

	const getAgentById = async (id) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `agent/id/${id}`, config);
	}

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
			config
		);
	};

	const getPermissions = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + 'agent/permissions/',
			config
		);
	};

	return { getAllAgents, getAllAgentsByDeptAndGroup, getPermissions, getAgentBySearch, createAgent, updateAgent, removeAgent, getAgentById };
};
