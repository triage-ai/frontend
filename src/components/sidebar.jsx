import {
	Box,
	Button,
	CircularProgress,
	CssBaseline,
	Dialog,
	Drawer,
	IconButton,
	Slide,
	Typography,
	circularProgressClasses,
	styled,
	useMediaQuery,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { CheckCircle, LogOut, Menu, X } from 'lucide-react';
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { SidebarItems } from './sidebar-items';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStatusBackend } from '../hooks/useStatusBackend';
import { AppBarHeight } from './layout';
import { useTheme } from '@emotion/react';
import { AddAgent } from '../pages/agent/AddAgent';
import { AuthContext } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AddTicket } from '../pages/ticket/AddTicket';

export const drawerWidth = 250;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer - 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	backgroundColor: '#f1f4f2',
	// backgroundColor: '#F3F8F5',
	boxShadow: 'none',
	color: '#1B1D1F',
	// borderBottom: '1px solid #F4F4F4',
}));

export const CircularButton = styled(Button)(() => ({
	backgroundColor: '#22874E',
	color: '#FFF',
	borderRadius: '50px',
	fontSize: '0.9375rem',
	fontWeight: 600,
	lineHeight: 1.1,
	textTransform: 'unset',
	padding: '8px 20px',
	'&:hover': {
		backgroundColor: '#29b866',
	},
	'& svg': {
		marginRight: '6px',
		// marginBottom: 2,
	},
	'&:disabled': {
		color: '#FFF',
		opacity: 0.38,
	},
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

export const Transition = forwardRef(function Transition(props, ref) {
	return (
		<Slide
			direction="up"
			ref={ref}
			{...props}
		/>
	);
});

export const Sidebar = ({
	appBarTitle,
	appBarSubtitle,
	buttonInfo,
	taskId,
	processParam,
	finishedParam,
}) => {
	const { refreshAgents, refreshTickets } = useData();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [activeModel, setActiveModel] = useState(sessionStorage.getItem('activeModel'));
	const [activeModelEnv, setActiveModelEnv] = useState(sessionStorage.getItem('activeModelEnv'));
	const initialTime = 10; // in seconds
	const [timeLeft, setTimeLeft] = useState(initialTime);

	const [progressBarPercent, setProgressBarPercent] = useState(0);
	const navigate = useNavigate();
	const { getTaskStatus } = useStatusBackend();

	const [process, setProcess] = useState(0);
	const [finishedProcessing, setFinishedProcessing] = useState(0);

	const timerId = useRef();

	const location = useLocation();
	// const { handleLogout } = useSetAuthCookie();
	const { agentLogout } = useContext(AuthContext);

	const theme = useTheme();
	const [openDialog, setOpenDialog] = useState(false);
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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

	const authLogout = async () => {
		agentLogout();
		navigate('/', { replace: true });
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

	const handleClickDialogOpen = () => {
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleAgentCreated = () => {
		handleDialogClose();
		refreshAgents();
	};

	const handleTicketCreated = () => {
		handleDialogClose();
		refreshTickets();
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
					ml: `${drawerWidth}px`,
				}}
			>
				<Box
					sx={{
						height: AppBarHeight,
						display: 'flex',
						alignItems: appBarSubtitle !== '' ? 'flex-start' : 'center',
						justifyContent: 'space-between',
						py: { xs: 1, md: 3 },
						px: { xs: 2, md: 5 },
					}}
				>
					<Box
						sx={{ display: 'flex', alignItems: appBarSubtitle !== '' ? 'flex-start' : 'center' }}
					>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { md: 'none' } }}
						>
							<Menu />
						</IconButton>

						<Box sx={{ display: 'flex', flexDirection: 'column', color: '#1B1D1F' }}>
							<Typography variant="h2">{appBarTitle}</Typography>
							{appBarSubtitle !== '' && (
								<Typography
									variant="subtitle2"
									sx={{
										letterSpacing: '-0.03em',
										lineHeight: 1.9,
										color: '#545555',
									}}
								>
									{appBarSubtitle}
								</Typography>
							)}
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center' }}>

						<CircularButton
							sx={{ mr: 1 }}
							onClick={handleClickDialogOpen}
						>
							{buttonInfo.icon}
							{buttonInfo.label}
						</CircularButton>

						<IconButton
							aria-label="logout"
							onClick={authLogout}
						>
							<LogOut
								color="#585858"
								size={22}
							/>
						</IconButton>
					</Box>
				</Box>
			</AppBar>

			<Box
				component="nav"
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
				aria-label="mailbox folders"
			>
				{/* Drawer used for mobile/small screens */}
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
						display: { xs: 'block', md: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							alignItems: 'center',
							backgroundColor: '#FFF',
							borderRight: '1px solid #F4F4F4',
						},
					}}
				>
					<SidebarItems />
				</Drawer>

				{/* Drawer used for laptop/medium screens */}
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', md: 'block' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							alignItems: 'center',
							backgroundColor: '#FFF',
							borderRight: '1.5px solid #E5EFE9',
						},
					}}
					open
				>
					<SidebarItems />
				</Drawer>
			</Box>

			<Dialog
				open={openDialog}
				TransitionComponent={Transition}
				onClose={handleDialogClose}
				// maxWidth={'xl'}
				// fullWidth
				// fullScreen={fullScreen}
				PaperProps={{
					sx: {
						width: '100%',
						maxWidth: 'unset',
						height: 'calc(100% - 64px)',
						maxHeight: 'unset',
						margin: 0,
						background: '#f1f4f2',
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						padding: 2,
					},
				}}
				sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
			>
				{/* {!fullScreen && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							position: 'absolute',
							left: 12,
							top: 12,
						}}
					>
						<IconButton
							aria-label="close dialog"
							onClick={handleDialogClose}
							sx={{
								background: '#FFF',
								'&:hover': {
									background: '#f1f4f2',
									color: '#000',
								},
							}}
						>
							<X />
						</IconButton>
					</Box>
				)} */}
				<Box sx={{ maxWidth: '650px', margin: '14px auto 0px', textAlign: 'center' }}>
					<IconButton
						aria-label="close dialog"
						onClick={handleDialogClose}
						sx={{
							width: '40px',
							height: '40px',
							position: 'fixed',
							right: '26px',
							top: 'calc(64px + 26px)',
							color: '#545555',
							transition: 'all 0.2s',
							'&:hover': {
								color: '#000',
							},
						}}
					>
						<X size={20} />
					</IconButton>

					{appBarTitle.toLowerCase().includes('agent list') && (
						<AddAgent handleAgentCreated={handleAgentCreated} />
					)}
					{appBarTitle.toLowerCase().includes('ticket list') && (
						<AddTicket handleTicketCreated={handleTicketCreated} />
					)}
				</Box>

				{/* <h1>{"Use Google's location service?"}</h1>
				<Box>
					<h6 id="alert-dialog-slide-description">
						Let Google help apps determine location. This means sending anonymous location data to
						Google, even when no apps are running.
					</h6>
				</Box>
				<Box>
					<Button onClick={handleDialogClose}>Disagree</Button>
					<Button onClick={handleDialogClose}>Agree</Button>
				</Box> */}
			</Dialog>
		</Box>
	);
};
