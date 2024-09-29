import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { Auth } from './pages/auth/auth';
import { SignIn } from './pages/auth/sign-in';
import { Build } from './pages/build/build';
import { FineTune } from './pages/fine-tune/fine-tune';
import { Test } from './pages/test/test';
import { Route as RouteComponent } from './pages/route/route';
import { CookiesProvider } from 'react-cookie';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/protected-route';
import { Tickets } from './pages/ticket/Tickets';
import { Agents } from './pages/agent/Agents';
// import { Landing } from './pages/landing/landing';

const theme = createTheme({
	typography: {
		fontFamily: ['Mont', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
		h1: {
			fontSize: '2rem',
			lineHeight: 1.1875,
			fontWeight: 600,
			letterSpacing: '-0.03em',
		},
		h2: {
			fontSize: '1.5rem',
			fontWeight: 600,
			letterSpacing: '-0.02em',
		},
		h3: {
			fontSize: '1.25rem',
			fontWeight: 500,
			letterSpacing: '-0.02em',
		},
		h4: {
			fontSize: '1.125rem',
			fontWeight: 500,
			letterSpacing: '-0.02em',
		},
		h6: {
			letterSpacing: '-0.02em',
		},
		subtitle1: {
			letterSpacing: '-0.05em',
		},
		subtitle2: {
			color: '#545555',
			letterSpacing: '-0.05em',
		},
		caption: {
			letterSpacing: '-0.03em',
			fontFamily: ['Mont', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
		},
		overline: {
			fontWeight: 600,
			lineHeight: 'unset',
			letterSpacing: '-0.03em',
		},
	},
});

// const DrawerHeader = styled('div')(({ theme }) => ({
// 	height: '80px',
// 	// necessary for content to be below app bar
// 	...theme.mixins.toolbar,
// }));

// const DrawerContentContainer = styled(Box)(() => ({
// 	width: '100%',
// 	minHeight: '100vh',
// 	background: '#F4F4F4',
// }));

function App() {
	const { authState } = useContext(AuthContext);

	const [taskId, setTaskId] = useState(0);
	const [process, setProcess] = useState('');
	const [isFinished, setIsFinished] = useState('');

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
							element={authState.isAuth ? <Navigate to="/agents" /> : <SignIn />}
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
							path="dashboard"
							element={<Dashboard />}
						/>
						<Route
							path="agents"
							element={
								<ProtectedRoute>
									<Agents />
								</ProtectedRoute>
							}
						/>
						<Route
							path="tickets"
							element={
								<ProtectedRoute>
									<Tickets />
								</ProtectedRoute>
							}
						/>
						<Route
							path="tickets/ticket-modal/:ticketId"
							element={
								<ProtectedRoute>
									<Tickets />
								</ProtectedRoute>
							}
						/>
						<Route
							path="build"
							element={<Build handleProgress={handleProgress} />}
						/>
						<Route
							path="fine-tune"
							element={
								// <Box sx={{ display: 'flex' }}>
								// 	<Sidebar
								// 		taskId={taskId}
								// 		processParam={process}
								// 	/>
								// 	<DrawerContentContainer>
								// 		<DrawerHeader />
								<FineTune handleProgress={handleProgress} />
								// 	</DrawerContentContainer>
								// </Box>
							}
						/>
						<Route
							path="playground"
							element={
								// <Box sx={{ display: 'flex' }}>
								// 	<Sidebar
								// 		processParam={process}
								// 		finishedParam={isFinished}
								// 	/>
								// 	<DrawerContentContainer>
								// 		<DrawerHeader />
								<Test handlePublishProgress={handlePublishProgress} />
								// 	</DrawerContentContainer>
								// </Box>
							}
						/>
						<Route
							path="route"
							element={
								// <Box sx={{ display: 'flex' }}>
								// 	<Sidebar />
								// 	<DrawerContentContainer>
								// 		<DrawerHeader />
								<RouteComponent />
								// 	</DrawerContentContainer>
								// </Box>
							}
						/>
					</Routes>
				</div>
			</CookiesProvider>
		</ThemeProvider>
	);
}

export default App;
