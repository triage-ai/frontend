import axios from 'axios';

export const useSetAuthCookie = () => {
	const signInEmailAndPassword = async (email, password) => {
		const config = {
			auth: {
				username: email,
				password: password,
			},
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'auth/login', {}, config);
	};

	return { signInEmailAndPassword };
};
