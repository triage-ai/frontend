import { ThemeProvider, createTheme } from "@mui/material";
import { useContext } from "react";
import { CookiesProvider } from "react-cookie";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/protected-route";
import UserProtectedRoute from "./components/user-protected-route";
import { AuthContext } from "./context/AuthContext";
import { Agents } from "./pages/agent/Agents";
import { AgentSignIn } from "./pages/auth/agent-sign-in";
import { UserEmailConfirmation } from "./pages/auth/user-email-confirmation";
import { UserResetPassword } from "./pages/auth/user-reset-password";
import { UserResetPasswordConfirmation } from "./pages/auth/user-reset-password-confirmation";
import { UserResetPasswordForm } from "./pages/auth/user-reset-password-form";
import { UserSignIn } from "./pages/auth/user-sign-in";
import { UserSignUp } from "./pages/auth/user-sign-up";
import { UserSignUpConfirmation } from "./pages/auth/user-sign-up-confirmation";
import { AgentDashboard } from "./pages/dashboard/AgentDashboard";
import { UserTickets } from "./pages/dashboard/UserTickets";
import { Departments } from "./pages/department/Departments";
import { EmailBanlist } from "./pages/email/EmailBanlist";
import { EmailDiagnostic } from "./pages/email/EmailDiagnostic";
import { Emails } from "./pages/email/emails/Emails";
import { EmailSettings } from "./pages/email/EmailSettings";
import { EmailTemplates } from "./pages/email/templates/EmailTemplates";
import { Forms } from "./pages/form/Forms";
import { Groups } from "./pages/group/Groups";
import { Landing } from "./pages/landing/landing";
import { Profile } from "./pages/profile/AgentProfile";
import { Roles } from "./pages/role/Roles";
import { Settings } from "./pages/settings/Settings";
import {
	AgentMenu,
	CompanyMenu,
	KnowledgebaseMenu,
	SystemMenu,
	TaskMenu,
	TicketMenu,
	UserMenu,
} from "./pages/settings/SettingsMenus";
import { Tickets } from "./pages/ticket/Tickets";
import { Topics } from "./pages/topic/Topics";
import { Users } from "./pages/user/Users";
import { Sidebar } from "./components/sidebar";
import { drawerWidth } from "./components/sidebar";

const theme = createTheme({
	palette: {
		primary: {
			main: "#22874E",
		},
	},
	typography: {
		fontFamily: [
			"Mont",
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: {
			fontSize: "2rem",
			lineHeight: 1.1875,
			fontWeight: 600,
			letterSpacing: "-0.03em",
		},
		h2: {
			fontSize: "1.5rem",
			fontWeight: 600,
			letterSpacing: "-0.02em",
		},
		h3: {
			fontSize: "1.25rem",
			fontWeight: 500,
			letterSpacing: "-0.02em",
		},
		h4: {
			fontSize: "1.125rem",
			fontWeight: 500,
			letterSpacing: "-0.02em",
		},
		h6: {
			letterSpacing: "-0.02em",
		},
		subtitle1: {
			letterSpacing: "-0.05em",
		},
		subtitle2: {
			color: "#545555",
			letterSpacing: "-0.05em",
		},
		caption: {
			letterSpacing: "-0.03em",
			fontFamily: [
				"Mont",
				"Roboto",
				'"Helvetica Neue"',
				"Arial",
				"sans-serif",
			].join(","),
		},
		overline: {
			fontWeight: 600,
			lineHeight: "unset",
			letterSpacing: "-0.03em",
		},
	},
});

function App() {
	const { agentAuthState, userAuthState } = useContext(AuthContext);

	return (
		<ThemeProvider theme={theme}>
			<CookiesProvider defaultSetOptions={{ path: "/" }}>
				<div className="App">
					<Routes>
						<Route path="/" exact element={<Landing />} />
						<Route
							path="agent/login"
							element={
								agentAuthState.isAuth ? (
									<Navigate to="/tickets" />
								) : (
									<AgentSignIn />
								)
							}
						/>
						<Route
							path="user/login"
							element={
								userAuthState.isAuth ? (
									<Navigate to="/user/tickets" />
								) : (
									<UserSignIn />
								)
							}
						/>
						<Route path="signup" element={<UserSignUp />} />
						<Route
							path="signup/confirmation/:user_id"
							element={<UserSignUpConfirmation />}
						/>
						<Route
							path="/reset_password"
							element={<UserResetPassword />}
						/>
						<Route
							path="/reset_password/confirmation/:user_id"
							element={<UserResetPasswordConfirmation />}
						/>
						<Route
							path="/reset_password/:token"
							element={<UserResetPasswordForm />}
						/>
						<Route
							path="confirm_email/:token"
							element={<UserEmailConfirmation />}
						/>
						<Route
								path="user/tickets/:ticketId"
								element={
									<UserProtectedRoute>
										<UserTickets />
									</UserProtectedRoute>
								}
							/>
						<Route
							path="user/tickets"
							element={
								<UserProtectedRoute>
									<UserTickets />
								</UserProtectedRoute>
							}
						/>
						<Route element={<Sidebar/>}>
							<Route
								path="dashboard"
								element={<AgentDashboard />}
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
								path="settings/system"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={SystemMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/company"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={CompanyMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/tickets"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={TicketMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/tasks"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={TaskMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/agents"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={AgentMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/users"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={UserMenu} />
									</ProtectedRoute>
								}
							/>
							<Route
								path="settings/knowledgebase"
								element={
									<ProtectedRoute requireAdmin>
										<Settings Menu={KnowledgebaseMenu} />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/emails"
								element={
									<ProtectedRoute requireAdmin>
										<Emails />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/settings"
								element={
									<ProtectedRoute requireAdmin>
										<EmailSettings />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/banlist"
								element={
									<ProtectedRoute requireAdmin>
										<EmailBanlist />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/templates"
								element={
									<ProtectedRoute requireAdmin>
										<EmailTemplates />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/templates/:templateId"
								element={
									<ProtectedRoute requireAdmin>
										<EmailTemplates />
									</ProtectedRoute>
								}
							/>

							<Route
								path="email/diagnostic"
								element={
									<ProtectedRoute requireAdmin>
										<EmailDiagnostic />
									</ProtectedRoute>
								}
							/>

							<Route
								path="profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/agents"
								element={
									<ProtectedRoute
										requirePermission={"agent.view"}
									>
										<Agents />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/groups"
								element={
									<ProtectedRoute
										requirePermission={"agent.view"}
									>
										<Groups />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/users"
								element={
									<ProtectedRoute>
										<Users />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/queues"
								element={
									<ProtectedRoute>
										<Users />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/slas"
								element={
									<ProtectedRoute>
										<Users />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/schedules"
								element={
									<ProtectedRoute>
										<Users />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/departments"
								element={
									<ProtectedRoute>
										<Departments />
									</ProtectedRoute>
								}
							/>

							<Route
								path="manage/groups"
								element={
									<ProtectedRoute>
										<Groups />
									</ProtectedRoute>
								}
							/>
							<Route
								path="manage/topics"
								element={
									<ProtectedRoute>
										<Topics />
									</ProtectedRoute>
								}
							/>
							<Route
								path="manage/forms"
								element={
									<ProtectedRoute>
										<Forms />
									</ProtectedRoute>
								}
							/>
							<Route
								path="manage/roles"
								element={
									<ProtectedRoute>
										<Roles />
									</ProtectedRoute>
								}
							/>
						</Route>

					</Routes>
				</div>
			</CookiesProvider>
		</ThemeProvider>
	);
}

export default App;
