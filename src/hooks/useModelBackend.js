import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';

export const useModelBackend = () => {
	const { getAuthCookie } = useSetAuthCookie();

	const getAllDevModels = async () => {
		const { auth } = getAuthCookie();

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.get('https://demo-docker-3jtvhz75ca-uk.a.run.app/model/list/dev', config);
	};

	const createDataset = async categories => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		const transformedData = {};
		categories.forEach(category => {
			if (category.model === activeModel) {
				const useCasesParagraph = category.useCases.join(' ');
				transformedData[category.name] = [category.question1, useCasesParagraph];
			}
		});

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/create_dataset/' + activeModel,
			transformedData,
			config
		);
	};

	const createModel = async files => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		const data = {
			filenames: files,
		};

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/create/' + activeModel,
			data,
			config
		);
	};

	const getDevCategories = async () => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.get(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/classes/dev/' + activeModel,
			config
		);
	};

	const testIndividualTicket = async ticketInfo => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		const data = {
			tickets: {
				[ticketInfo.title]: {
					description: ticketInfo.description,
					label: ticketInfo.label,
				},
			},
		};

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/run/dev/' + activeModel,
			data,
			config
		);
	};

	const testUploadedFiles = async files => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		const data = {
			filenames: files,
		};

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/run/dev/' + activeModel,
			data,
			config
		);
	};

	const publishModelIntoProd = async () => {
		const { auth } = getAuthCookie();
		const activeModel = sessionStorage.getItem('activeModel');

		const config = {
			headers: { Authorization: `Bearer ${auth.token}` },
		};

		return await axios.post(
			'https://demo-docker-3jtvhz75ca-uk.a.run.app/model/publish/' + activeModel,
			{},
			config
		);
	};

	return {
		getAllDevModels,
		createDataset,
		createModel,
		getDevCategories,
		testIndividualTicket,
		testUploadedFiles,
		publishModelIntoProd,
	};
};
