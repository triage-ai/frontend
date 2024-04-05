import logo from './logo-icon.svg';
import './App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import {
	Button,
	Grid,
	IconButton,
	Input,
	InputAdornment,
	Snackbar,
	TextField,
	ThemeProvider,
	createTheme,
} from '@mui/material';
import { CheckCircle, Mail, X } from 'lucide-react';
import instaIcon from './assets/instagram-icon.svg';
import linkedInIcon from './assets/linkedin-icon.svg';
import { Fragment, useEffect, useState } from 'react';
import { useAddWaitlistEmail } from './hooks/useAddWaitlistEmail';
import { Box, useMediaQuery, useTheme } from '@mui/system';
import styled from '@emotion/styled';
import { ComingSoon } from './pages/coming-soon/coming-soon';
import { Auth } from './pages/auth/auth';
import { SignIn } from './pages/auth/sign-in';
import { Sidebar } from './components/sidebar';
import { Home } from './pages/home/home';
import { Build } from './pages/build/build';
import { FineTune } from './pages/fine-tune/fine-tune';
import { Test } from './pages/test/test';
import { Route as RouteComponent } from './pages/route/route';
import { CookiesProvider } from 'react-cookie';
import { useSetAuthCookie } from './hooks/useSetAuthCookie';

const theme = createTheme({
	typography: {
		fontFamily: ['Inter', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	height: '80px',
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const DrawerContentContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	minHeight: '100vh',
	background: '#F4F4F4',
}));

function App() {
	const { addWaitlistEmail } = useAddWaitlistEmail();
	const currentTheme = useTheme();
	const onlySmallScreen = useMediaQuery(currentTheme.breakpoints.down('md'));

	const [email, setEmail] = useState('');
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(false);
	const [added, setAdded] = useState(false);

	const [taskId, setTaskId] = useState(0);
	const [process, setProcess] = useState('');
	const [isFinished, setIsFinished] = useState('');

	const [isAuth, setIsAuth] = useState(false);

	const { getAuthCookie } = useSetAuthCookie();
	const navigate = useNavigate();

	useEffect(() => {
		// debugger;
		// const { auth } = getAuthCookie();
		// setIsAuth(auth?.isAuth);
		// if (auth) {
		// 	navigate('/build');
		// } else {
		// 	navigate('/auth');
		// }
	}, []);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const handleProgress = (taskId, processCalled) => {
		setTaskId(taskId);
		setProcess(processCalled);
	};

	const handlePublishProgress = (processCalled, finished) => {
		setProcess(processCalled);
		setIsFinished(finished);
	};

	return (
		<ThemeProvider theme={theme}>
			<CookiesProvider defaultSetOptions={{ path: '/' }}>
				<div className="App">
					<Routes>
						<Route
							path="/"
							exact
							element={<ComingSoon />}
							// element={<Home />}
							// element={isAuth ? <Navigate to="/build" /> : <ComingSoon />}
						/>
						<Route
							path="coming-soon"
							element={<ComingSoon />}
						/>
						<Route
							path="auth"
							element={<Auth />}
						/>
						<Route
							path="login"
							element={<SignIn />}
						/>
						<Route
							path="build"
							element={
								<Box sx={{ display: 'flex' }}>
									<Sidebar
										taskId={taskId}
										processParam={process}
									/>
									<DrawerContentContainer>
										<DrawerHeader />
										<Build handleProgress={handleProgress} />
									</DrawerContentContainer>
								</Box>
							}
						/>
						<Route
							path="fine-tune"
							element={
								<Box sx={{ display: 'flex' }}>
									<Sidebar
										taskId={taskId}
										processParam={process}
									/>
									<DrawerContentContainer>
										<DrawerHeader />
										<FineTune handleProgress={handleProgress} />
									</DrawerContentContainer>
								</Box>
							}
						/>
						<Route
							path="playground"
							element={
								<Box sx={{ display: 'flex' }}>
									<Sidebar
										processParam={process}
										finishedParam={isFinished}
									/>
									<DrawerContentContainer>
										<DrawerHeader />
										<Test handlePublishProgress={handlePublishProgress} />
									</DrawerContentContainer>
								</Box>
							}
						/>
						<Route
							path="route"
							element={
								<Box sx={{ display: 'flex' }}>
									<Sidebar />
									<DrawerContentContainer>
										<DrawerHeader />
										<RouteComponent />
									</DrawerContentContainer>
								</Box>
							}
						/>
					</Routes>
				</div>
			</CookiesProvider>
		</ThemeProvider>
	);
}

export default App;
