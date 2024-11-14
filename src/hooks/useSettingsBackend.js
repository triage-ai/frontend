import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useSettingsBackend = () => {
    const { agentAuthState } = useContext(AuthContext);

    const getAllSettings = async () => {
        const config = {
            headers: { Authorization: `Bearer ${agentAuthState.token}` }
        };

        return await axios.get(process.env.REACT_APP_BACKEND_URL + 'settings/get', config);
    };


    const updateSettings = async (settingsInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'settings/put',
			settingsInfo,
			config
		);
	};

    return { getAllSettings, updateSettings };
 
};