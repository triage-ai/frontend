import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useTopicBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllTopics = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'topic/get', config);
	};

	return { getAllTopics };
};
