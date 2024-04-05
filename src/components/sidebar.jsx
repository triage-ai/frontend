import {
	Box,
	CircularProgress,
	CssBaseline,
	Drawer,
	IconButton,
	Toolbar,
	Typography,
	circularProgressClasses,
	styled,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { CheckCircle, LogOut, Menu } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { SidebarItems } from './sidebar-items';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import { useStatusBackend } from '../hooks/useStatusBackend';
import { useModelBackend } from '../hooks/useModelBackend';
import { useSetAuthCookie } from '../hooks/useSetAuthCookie';

const drawerWidth = 90;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer - 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	backgroundColor: '#FCFCFC',
	boxShadow: 'none',
	color: '#1B1D1F',
	borderBottom: '1px solid #F4F4F4',
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
// 	({ theme, open }) => ({
// 		width: drawerWidth,
// 		flexShrink: 0,
// 		whiteSpace: 'nowrap',
// 		boxSizing: 'border-box',
// 		...(!open && {
// 			...closedMixin(theme),
// 			'& .MuiDrawer-paper': closedMixin(theme),
// 		}),
// 	})
// );

export const Sidebar = ({ taskId, processParam, finishedParam }) => {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [activeModel, setActiveModel] = useState(sessionStorage.getItem('activeModel'));
	const [activeModelEnv, setActiveModelEnv] = useState(sessionStorage.getItem('activeModelEnv'));
	const initialTime = 10; // in seconds
	const [timeLeft, setTimeLeft] = useState(initialTime);

	const [progressBarPercent, setProgressBarPercent] = useState(0);
	const navigate = useNavigate();
	const { getTaskStatus } = useStatusBackend();
	const { getDevCategories } = useModelBackend();

	const [process, setProcess] = useState(0);
	const [finishedProcessing, setFinishedProcessing] = useState(0);

	const timerId = useRef();

	const location = useLocation();
	const { handleLogout } = useSetAuthCookie();

	useEffect(() => {
		setProcess(processParam);

		if (processParam === 'test') {
			setFinishedProcessing(finishedParam);
		}
	}, [processParam, finishedParam]);

	useEffect(() => {
		setProgressBarPercent(0);
		setTimeLeft(initialTime);
		setProcess('');
	}, [location]);

	useEffect(() => {
		window.addEventListener('storage', () => {
			setActiveModel(sessionStorage.getItem('activeModel'));
			setActiveModelEnv(sessionStorage.getItem('activeModelEnv'));
		});
	}, []);

	useEffect(() => {
		if (taskId !== 0 && taskId) {
			if (initialTime) {
				timerId.current = window.setInterval(() => {
					setTimeLeft(prevProgress => prevProgress - 1);
				}, 1000);

				return () => {
					clearInterval(timerId.current);
				};
			}
		}
	}, [taskId]);

	useEffect(() => {
		if (initialTime) {
			if (progressBarPercent < 100) {
				let updateProgressPercent = Math.round(((initialTime - timeLeft) / initialTime) * 100);
				setProgressBarPercent(updateProgressPercent);
			}

			if (timeLeft === 1 && timerId.current) {
				clearInterval(timerId.current);
				getStatus();
				return;
			}
		}
	}, [timeLeft]);

	const getStatus = () => {
		const interval = window.setInterval(() => {
			getTaskStatus(taskId).then(res => {
				// MUST REMOVE THIS BECAUSE IT'S JUST SIMULATING
				if ((process === 'fine-tune' || process === 'build') && res.data.state === 'PENDING') {
					clearInterval(interval);
					setTimeLeft(0);
				} else if (res.data.state !== 'PENDING') {
					clearInterval(interval);
					setTimeLeft(0);
				} else if (res.data.state === 'FAILURE') {
					clearInterval(interval);
					setTimeLeft(0);
				}
			});
		}, 1000);
	};

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	const logout = async () => {
		auth.signOut().then(() => {
			handleLogout();
			// localStorage.removeItem('auth');
			navigate('/', { replace: true });
			sessionStorage.clear();
		});
	};

	const getProcessNumber = () => {
		if (progressBarPercent <= 20) {
			return 1;
		} else if (progressBarPercent <= 50) {
			return 2;
		} else if (progressBarPercent <= 70) {
			return 3;
		} else if (progressBarPercent <= 100) {
			return 4;
		}
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
					ml: `${drawerWidth}px`,
				}}
			>
				<Toolbar sx={{ height: '80px', justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { sm: 'none' } }}
						>
							<Menu />
						</IconButton>
						<Box sx={{ display: 'flex', flexDirection: 'column', color: '#7A8087' }}>
							<Typography variant="caption">
								{activeModelEnv === 'prod' ? 'Production' : 'Development'} model
							</Typography>
							<Typography
								variant="h5"
								sx={{
									// textTransform: 'capitalize',
									fontWeight: 600,
									mt: '-5px',
									color: '#1B1D1F',
								}}
							>
								{activeModel}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{(progressBarPercent > 0 || process === 'test') && (
							<Box
								sx={{
									minWidth: '250px',
									padding: '6px 14px',
									background: '#EFEFEF',
									display: 'flex',
									alignItems: 'center',
									borderRadius: '12px',
									marginRight: '12px',
								}}
							>
								{progressBarPercent !== 100 && process !== 'test' && (
									<Box
										sx={{ position: 'relative', display: 'flex', alignItems: 'center', mr: '12px' }}
									>
										<CircularProgress
											variant="determinate"
											sx={{
												color: '#00000033',
											}}
											size={22}
											thickness={5}
											value={100}
										/>
										<CircularProgress
											variant="determinate"
											sx={{
												color: '#1B1D1F',
												position: 'absolute',
												left: 0,
												[`& .${circularProgressClasses.circle}`]: {
													strokeLinecap: 'round',
												},
											}}
											size={22}
											thickness={5}
											value={progressBarPercent}
										/>
									</Box>
								)}

								{process === 'test' && !finishedProcessing && (
									<Box
										sx={{ position: 'relative', display: 'flex', alignItems: 'center', mr: '12px' }}
									>
										<CircularProgress
											variant="determinate"
											sx={{
												color: '#00000033',
											}}
											size={22}
											thickness={5}
											value={100}
										/>
										<CircularProgress
											variant="indeterminate"
											sx={{
												color: '#1B1D1F',
												position: 'absolute',
												left: 0,
												[`& .${circularProgressClasses.circle}`]: {
													strokeLinecap: 'round',
												},
											}}
											size={22}
											thickness={5}
										/>
									</Box>
								)}

								{process === 'test' && finishedProcessing && (
									<Box sx={{ display: 'flex', alignItems: 'center', mr: '12px' }}>
										<CheckCircle />
									</Box>
								)}

								<Box sx={{ display: 'flex', flexDirection: 'column' }}>
									{process === 'build' && (
										<Typography
											variant="body1"
											sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F', mb: -0.5 }}
										>
											{progressBarPercent !== 100 ? 'Building model' : 'Model built!'}
										</Typography>
									)}

									{process === 'fine-tune' && (
										<Typography
											variant="body1"
											sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F', mb: -0.5 }}
										>
											{progressBarPercent !== 100 ? 'Fine-tuning model' : 'Model is ready to use'}
										</Typography>
									)}

									{process === 'test' && (
										<Typography
											variant="body1"
											sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F', mb: -0.5 }}
										>
											{finishedProcessing ? 'Model deployed' : 'Deploying model'}
										</Typography>
									)}

									{progressBarPercent !== 100 && process !== 'test' && (
										<Typography
											variant="caption"
											sx={{ fontSize: '0.8125rem', fontWeight: 400, color: '#9A9FA5' }}
										>
											{getProcessNumber()}/4 · {progressBarPercent}%
										</Typography>
									)}

									{process === 'test' && (
										<Typography
											variant="caption"
											sx={{ fontSize: '0.8125rem', fontWeight: 400, color: '#9A9FA5' }}
										>
											{finishedProcessing
												? 'Model was deployed successfully'
												: 'Model is being deployed'}
										</Typography>
									)}

									{progressBarPercent === 100 && process === 'build' && (
										<Typography
											variant="caption"
											sx={{ fontSize: '0.8125rem', fontWeight: 400, color: '#9A9FA5' }}
										>
											The model has finished building
										</Typography>
									)}

									{progressBarPercent === 100 && process === 'fine-tune' && (
										<Typography
											variant="caption"
											sx={{ fontSize: '0.8125rem', fontWeight: 400, color: '#9A9FA5' }}
										>
											The model is ready to be used
										</Typography>
									)}
								</Box>
							</Box>
						)}

						<IconButton
							aria-label="logout"
							onClick={logout}
						>
							<LogOut color="#000" />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							alignItems: 'center',
							backgroundColor: '#FCFCFC',
							borderRight: '1px solid #F4F4F4',
						},
					}}
				>
					<SidebarItems />
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							alignItems: 'center',
							backgroundColor: '#FCFCFC',
							borderRight: '1px solid #F4F4F4',
						},
					}}
					open
				>
					<SidebarItems />
				</Drawer>
			</Box>
		</Box>
	);
};
