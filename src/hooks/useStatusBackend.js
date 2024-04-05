import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';

export const useStatusBackend = () => {
	const { getAuthCookie } = useSetAuthCookie();

	const getTaskStatus = async taskId => {
		const { auth } = getAuthCookie();

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.get(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/task/result/' + taskId,
			config
		);
	};

	return { getTaskStatus };
};
