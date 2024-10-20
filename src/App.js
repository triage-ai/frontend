import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { AgentSignIn } from './pages/auth/agent-sign-in';
import { UserSignIn } from './pages/auth/user-sign-in';
import { Landing } from './pages/landing/landing';
import { CookiesProvider } from 'react-cookie';
import { AgentDashboard } from './pages/dashboard/agent-dashboard';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/protected-route';
import { Tickets } from './pages/ticket/Tickets';
import { Agents } from './pages/agent/Agents';
import { UserDashboard } from './pages/dashboard/user-dashboard';
import { Settings } from './pages/settings/Settings';
import {
	SystemMenu,
	CompanyMenu,
	TicketMenu,
	TaskMenu,
	AgentMenu,
	UserMenu,
	KnowledgebaseMenu,
} from './pages/settings/SettingsMenus';

const theme = createTheme({
	palette: {
		primary: {
			main: '#22874E',
		},
	},
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

function App() {
	const { agentAuthState, userAuthState } = useContext(AuthContext);

	return (
		<ThemeProvider theme={theme}>
			<CookiesProvider defaultSetOptions={{ path: '/' }}>
				<div className="App">
					<Routes>
						<Route
							path="/"
							exact
							element={<Landing />}
						/>
						<Route
							path="agent/login"
							element={agentAuthState.isAuth ? <Navigate to="/agents" /> : <AgentSignIn />}
						/>
						<Route
							path="user/login"
							element={userAuthState.isAuth ? <Navigate to="/user/tickets" /> : <UserSignIn />}
						/>
						<Route
							path="dashboard"
							element={<AgentDashboard />}
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
							path="tickets/:ticketId"
							element={
								<ProtectedRoute>
									<Tickets />
								</ProtectedRoute>
							}
						/>
						<Route
							path="user/tickets/"
							element={
								<ProtectedRoute>
									<UserDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/system"
							element={
								<ProtectedRoute>
									<Settings Menu={SystemMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/company"
							element={
								<ProtectedRoute>
									<Settings Menu={CompanyMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/tickets"
							element={
								<ProtectedRoute>
									<Settings Menu={TicketMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/tasks"
							element={
								<ProtectedRoute>
									<Settings Menu={TaskMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/agents"
							element={
								<ProtectedRoute>
									<Settings Menu={AgentMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/users"
							element={
								<ProtectedRoute>
									<Settings Menu={UserMenu} />
								</ProtectedRoute>
							}
						/>
						<Route
							path="settings/knowledgebase"
							element={
								<ProtectedRoute>
									<Settings Menu={KnowledgebaseMenu} />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</CookiesProvider>
		</ThemeProvider>
	);
}

export default App;
