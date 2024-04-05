import logo from '../../logo-icon.svg';
import '../../App.css';
import React, { useState } from 'react';
import googleIcon from '../../assets/google-icon.svg';
import microsoftIcon from '../../assets/microsoft-icon.svg';

import { getRedirectResult, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, samlProvider } from '../../config/firebase-config';
import {
	Box,
	Button,
	CircularProgress,
	InputAdornment,
	TextField,
	Typography,
	styled,
	useMediaQuery,
} from '@mui/material';
import { CheckCircle, Lock, Mail } from 'lucide-react';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useSetAuthCookie } from '../../hooks/useSetAuthCookie';

const ProviderButton = styled(Box)({
	border: '2px solid #EFEFEF',
	padding: '10px',
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '10px',
	cursor: 'pointer',
	transition: 'all 0.2s',
	'&:hover': {
		borderColor: '#1B1D1F',
	},
});

const CustomTextField = styled(TextField)({
	m: 0,
	width: '100%',
	'& fieldset': { border: 'none' },
	'& input::placeholder': {
		fontSize: '0.9375rem',
		fontWeight: 600,
		opacity: 1,
		color: '#575757',
	},
	'& .MuiInputBase-root': {
		background: '#F4F4F4',
		borderRadius: '12px',
		fontWeight: 600,
		color: '#000',
		transition: 'all .3s',

		'&.Mui-focused': {
			background: '#FFF',
			borderRadius: '12px',
			border: '2px solid #EFEFEF',
		},
	},
	'& .MuiInputBase-input': {
		padding: '10.5px 14px',
		paddingLeft: '6px',
	},
});

const RedirectButton = styled('a')({
	cursor: 'pointer',
	color: '#1B1D1F',
	transition: 'color 0.3s',
	'&:hover': {
		color: '#2B85FF',
	},
});

export const SignIn = () => {
	const currentTheme = useTheme();
	const onlySmallScreen = useMediaQuery(currentTheme.breakpoints.down('md'));
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState('');
	const [error, setError] = useState(false);

	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(false);

	const navigate = useNavigate();
	const { getApiToken, handleAuthCookie } = useSetAuthCookie();

	const goToAuth = () => {
		navigate('/auth');
	};

	const loginWithSAML = async () => {
		const results = await signInWithPopup(auth, samlProvider);
		const authInfo = {
			userId: results.user.uid,
			isAuth: true,
			token: results.user.accessToken,
		};
		handleAuthCookie(authInfo);
		// localStorage.setItem('auth', JSON.stringify(authInfo));
		navigate('/build');
	};

	const refreshToken = () => {
		auth.currentUser
			.getIdToken(true)
			.then(newToken => {
				console.log(newToken);
			})
			.catch(error => {});
	};

	const signIn = async e => {
		e.preventDefault();
		setLoading(true);

		if (validateEmail(email) && password !== '') {
			signInWithEmailAndPassword(auth, email, password)
				.then(userCredential => {
					// console.log(userCredential);
					// getApiToken(userCredential);
					const authInfo = {
						userId: userCredential.user.uid,
						isAuth: true,
						token: userCredential.user.accessToken,
					};
					handleAuthCookie(authInfo);
					// localStorage.setItem('auth', JSON.stringify(authInfo));
					setLoading(false);
					navigate('/build');
				})
				.catch(error => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.error(errorCode, errorMessage);
					setLoading(false);
				});
		} else if (!validateEmail(email)) {
			setError(true);
			setLoading(false);
		} else if (password === '') {
			setPasswordError(true);
			setLoading(false);
		}
	};

	const validateEmail = email => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	return (
		<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
			<div
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#FCFCFC',
				}}
			>
				<header className="App-header">
					<img
						src={logo}
						className="App-logo"
						alt="logo"
					/>

					<h1
						style={{
							fontSize: '3rem',
							fontWeight: 600,
							color: '#1B1D1F',
							letterSpacing: '-0.03em',
							marginTop: '30px',
							marginBottom: '30px',
						}}
					>
						Sign in
					</h1>

					<p
						style={{
							fontSize: '0.875rem',
							fontWeight: 600,
							color: '#1B1D1F',
							letterSpacing: '-0.01em',
							lineHeight: 1.2,
							marginTop: 0,
							marginBottom: '20px',
							textAlign: 'center',
						}}
					>
						Sign in with a provider
					</p>

					<Box sx={{ display: 'flex', width: '100%', gap: '10px', mb: '35px' }}>
						<ProviderButton onClick={loginWithSAML}>
							<img
								src={microsoftIcon}
								alt="Microsoft Icon"
							/>
							<span
								style={{
									fontSize: '0.9375rem',
									fontWeight: 700,
									color: '#1B1D1F',
									marginLeft: '8px',
								}}
							>
								Microsoft
							</span>
						</ProviderButton>

						<ProviderButton>
							<img
								src={googleIcon}
								alt="Google Icon"
							/>
							<span
								style={{
									fontSize: '0.9375rem',
									fontWeight: 700,
									color: '#1B1D1F',
									marginLeft: '8px',
								}}
							>
								Google
							</span>
						</ProviderButton>
					</Box>

					<hr style={{ width: '100%', border: '1px solid #EFEFEF', margin: 0 }} />

					<span
						style={{
							fontSize: '0.875rem',
							fontWeight: 600,
							color: '#1B1D1F',
							letterSpacing: '-0.01em',
							lineHeight: 1.2,
							marginTop: '32px',
							marginBottom: '25px',
						}}
					>
						Or continue with email and password
					</span>

					<form onSubmit={e => signIn(e)}>
						<CustomTextField
							label=""
							id="email"
							autoComplete="username"
							sx={{
								mb: 1,
								'& .MuiInputBase-root': {
									border: error ? '2px solid #ff7474' : '2px solid transparent',
								},
							}}
							placeholder="Your email"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Mail color="#575757" />
									</InputAdornment>
								),
							}}
							value={email}
							onChange={event => {
								if (validateEmail(email)) {
									setError(false);
								}
								setEmail(event.target.value);
							}}
						/>

						<CustomTextField
							label=""
							id="password"
							type="password"
							autoComplete="current-password"
							sx={{
								'& .MuiInputBase-root': {
									border: passwordError ? '2px solid #ff7474' : '2px solid transparent',
								},
							}}
							placeholder="Your password"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock color="#575757" />
									</InputAdornment>
								),
							}}
							value={password}
							onChange={event => {
								// if (validatePassword(password)) {
								// 	setError(false);
								// }
								setPassword(event.target.value);
							}}
						/>

						<Button
							sx={{
								backgroundColor: '#2B85FF',
								color: '#FFF',
								borderRadius: '12px',
								width: '100%',
								fontSize: '0.9375rem',
								fontWeight: 600,
								lineHeight: 1,
								textTransform: 'unset',
								padding: '16.5px 10px',
								marginTop: '12px',
								marginBottom: '28px',
								transition: 'all 0.3s',
								'&:hover': {
									backgroundColor: '#0069f6',
								},
								'&:disabled': {
									color: 'unset',
									opacity: 0.4,
								},
							}}
							type="submit"
							disabled={loading || !validateEmail(email) || password === ''}
						>
							{loading ? (
								<CircularProgress
									size={22}
									thickness={5}
									sx={{ color: '#FFF' }}
								/>
							) : (
								'Sign in'
							)}
						</Button>
					</form>

					<Typography
						variant="caption"
						sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
					>
						Don’t have an account? <RedirectButton onClick={goToAuth}>Sign up</RedirectButton>
					</Typography>
				</header>
			</div>
		</Box>
	);
};
