import { useCookies } from 'react-cookie';
import { auth } from '../config/firebase-config';
import { useEffect } from 'react';
import axios from 'axios';

export const useSetAuthCookie = () => {
	const [authCookie, setAuthCookie, removeAuthCookie] = useCookies(['auth']);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user != null) {
				const authInfo = {
					userId: user.uid,
					isAuth: true,
					token: user.accessToken,
				};
				handleAuthCookie(authInfo);
			} else {
				handleLogout();
			}
		});
	}, []);

	const getApiToken = userInfo => {
		// const config = {
		// 	headers: { Authorization: `Bearer ${userInfo.user.accessToken}` },
		// };
		// axios
		// 	.get('https://demo-docker-3jtvhz75ca-uk.a.run.app/auth/generate_key', config)
		// 	.then(res => {
		// 		const persons = res.data;
		// 		this.setState({ persons });
		// 	})
		// 	.catch(res => {
		// 		console.log(res.response);
		// 	});
	};

	const signInEmailAndPassword = async (email, password) => {
		const config = {
			auth: {
				username: email,
				password: password,
			},
		};

		return await axios.post(process.env.REACT_APP_BACKEND_URL + 'auth/login', {}, config);
	};

	const handleAuthCookie = user => {
		setAuthCookie('auth', user);
	};

	const handleLogout = () => {
		removeAuthCookie('auth');
	};

	const getAuthCookie = () => {
		return authCookie;
	};

	return { getApiToken, signInEmailAndPassword, handleAuthCookie, getAuthCookie, handleLogout };
};
