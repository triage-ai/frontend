import {
	Backdrop,
	Box,
	Collapse,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	TextField,
	Typography,
	styled,
} from '@mui/material';
import {
	Blocks,
	Headset,
	PanelLeft,
	Route,
	SlidersHorizontal,
	Ticket,
	ToyBrick,
	Settings,
	Lightbulb,
	UsersRound,
	ClipboardList,
	MonitorCog,
	Building2,
	Star,
	ChevronUp,
	ChevronDown,
} from 'lucide-react';
import { Fragment, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoHorizontal from '../assets/logo-horizontal-primary.svg';
import SubMenuHook from '../assets/submenu-hook.svg';
import { drawerWidth } from './sidebar';

export const CustomTextField = styled((props) => {
	return <TextField
		{...props}
	/>
})({
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
		background: 'transparent',
		border: '2px solid #E5EFE9',
		borderRadius: '12px',
		fontWeight: 600,
		color: '#000',
		transition: 'all .3s',

		'&:before, &:after': {
			content: 'none',
			border: 0,
		},

		'&:hover': {
			background: 'transparent',
			borderColor: '#22874E',
			'&:before': {
				content: 'none',
			},
		},

		'&.Mui-focused': {
			borderColor: '#22874E',
		},
		// },
		// '& .MuiInputBase-input': {
		// 	padding: '10.5px 14px',
		// 	paddingLeft: '6px',
	},
});

const StyledListItemBtn = styled(ListItemButton)({
	minHeight: 42,
	alignItems: 'center',
	justifyContent: 'flex-start',
	paddingLeft: 5.5,
	paddingRight: 8,
	borderRadius: '12px',
	'.MuiListItemIcon-root, .MuiTypography-root': {
		color: '#000',
	},
	'&:hover': {
		background: '#f1f4f2',
	},
	'&.Mui-selected': {
		background: '#ECFFEF',
		'&:hover': {
			background: '#ECFFEF',
			// cursor: 'default',
		},
		'.MuiListItemIcon-root, .MuiTypography-root': {
			color: '#1A4A13',
		},
		svg: {
			color: '#1A4A13',
		},
	},
});

const StlyedListItemIcon = styled(ListItemIcon)({
	width: '38px',
	minWidth: '38px',
	height: '38px',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '8px',
	color: '#575757',
	transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
});

const MenuItemTitle = styled(Typography)({
	fontWeight: 600,
	color: '#575757',
	letterSpacing: '-0.05em',
	transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
	mt: '3px',
});

const menuItems = [
	{
		title: 'Dashboard',
		icon: (
			<PanelLeft
				size={20}
				// strokeWidth={2}
			/>
		),
	},

	{ subheader: 'PEOPLE' },
	{
		title: 'Agents',
		icon: (
			<Headset
				size={20}
				// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Tickets',
		icon: (
			<Ticket
				size={20}
				// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Settings',
		icon: (
			<Settings
				size={20}
				// strokeWidth={2}
			/>
		),
	},

	{ subheader: 'PREVIOUS' },
	{
		title: 'Build',
		icon: (
			<Blocks
				size={20}
				// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Fine-tune',
		icon: (
			<SlidersHorizontal
				size={20}
				// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Playground',
		icon: (
			<ToyBrick
				size={20}
				// strokeWidth={2}
			/>
		),
	},
	{
		title: 'Route',
		icon: (
			<Route
				size={20}
				// strokeWidth={2}
			/>
		),
	},
];

const subMenuItems = [
	{
		title: 'System',
		icon: <MonitorCog size={20} />,
	},
	{
		title: 'Company',
		icon: <Building2 size={20} />,
	},
	{
		title: 'Tickets',
		icon: <Ticket size={20} />,
	},
	{
		title: 'Tasks',
		icon: <ClipboardList size={20} />,
	},
	{
		title: 'Agents',
		icon: <Headset size={20} />,
	},
	{
		title: 'Users',
		icon: <UsersRound size={20} />,
	},
	{
		title: 'Knowledgebase',
		icon: <Lightbulb size={20} />,
	},
];

// const urlCheck = new RegExp('')

export const SidebarItems = () => {
	const [path, setPath] = useState('');
	const [drawerTop, setDrawerTop] = useState(0); // State to store top position of the drawer
	const settingsRef = useRef(null); // Ref to the 'Settings' menu item
	const [settingsOpen, setSettingsOpen] = useState(false);

	const handleSettingsClick = () => {
		setSettingsOpen(!settingsOpen);

		// if (path.split('/')[1] === 'settings') {
		// 	setSettingsOpen(true);
		// } else {
		// 	setSettingsOpen(!settingsOpen);
		// }
	};

	let location = useLocation();

	useEffect(() => {
		setPath(location.pathname);

		if (location.pathname.split('/')[1] !== 'settings') {
			setSettingsOpen(false);
		} else {
			setSettingsOpen(true);
		}
	}, [location, setPath]);

	const activeRoute = route => {
		return route === path.replace('/', '');
	};

	return (
		<>
			<Drawer
				variant="permanent"
				sx={{ zIndex: '1100' }}
			>
				{/* <DrawerHeader /> */}
				<Box
					sx={{
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						pt: '26px',
						px: '16px',
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Box sx={{ width: '100%', px: 1 }}>
							<img
								src={LogoHorizontal}
								alt="Triage logo"
								style={{ width: '60%', objectFit: 'cover' }}
							/>
						</Box>

						<List
							sx={{ p: 0, mt: 4 }}
							dense={true}
						>
							{menuItems.map((item, index) => (
								<Fragment key={index}>
									{item?.subheader && (
										<ListSubheader sx={{ lineHeight: 'unset', mt: 3, mb: 1 }}>
											<Typography
												variant="overline"
												sx={{
													color: '#585858',
												}}
											>
												{item.subheader}
											</Typography>
										</ListSubheader>
									)}

									{!item?.subheader && (
										<ListItem
											disablePadding
											sx={{ display: 'block', mt: index !== 0 ? 0.2 : 0 }}
										>
											{item.title !== 'Settings' && (
												<StyledListItemBtn
													component={Link}
													to={'/' + item.title.toLowerCase()}
													selected={activeRoute(item.title.toLowerCase())}
													disabled={item.title !== 'Agents' && item.title !== 'Tickets'}
													disableRipple
												>
													<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

													<MenuItemTitle variant="subtitle2">{item.title}</MenuItemTitle>
												</StyledListItemBtn>
											)}

											{item.title === 'Settings' && (
												<>
													<StyledListItemBtn
														onClick={handleSettingsClick}
														selected={!settingsOpen && path.split('/')[1] === 'settings'}
														disableRipple
														sx={{ justifyContent: 'space-between' }}
													>
														<Box
															sx={{
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'flex-start',
															}}
														>
															<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>
															<MenuItemTitle variant="subtitle2">{item.title}</MenuItemTitle>
														</Box>
														{settingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
													</StyledListItemBtn>

													<Collapse
														in={settingsOpen}
														timeout="auto"
														unmountOnExit
													>
														<List
															sx={{
																p: 0,
																mt: 0.3,
																pl: 4.6,
																':before': {
																	content: '""',
																	position: 'absolute',
																	top: 0,
																	left: '24px',
																	bottom: '32px',
																	width: '2px',
																	borderRadius: '2px',
																	background: '#EFEFEF',
																},
															}}
															dense={true}
														>
															{subMenuItems.map((item, index) => (
																<ListItem
																	key={index}
																	disablePadding
																	sx={{
																		display: 'block',
																		mt: index !== 0 ? 0.2 : 0,
																		':before': {
																			content: '""',
																			position: 'absolute',
																			top: '12px',
																			left: '-13px',
																			width: '12px',
																			height: '12px',
																			background: `url(${SubMenuHook}) no-repeat 50% 50% / 100% auto`,
																		},
																	}}
																>
																	<StyledListItemBtn
																		component={Link}
																		to={'/settings/' + item.title.toLowerCase()}
																		selected={path.split('/')[2] === item.title.toLowerCase()}
																		sx={{ pl: 1 }}
																		disableRipple
																	>
																		<StlyedListItemIcon>{item.icon}</StlyedListItemIcon>

																		<MenuItemTitle variant="subtitle2">{item.title}</MenuItemTitle>
																	</StyledListItemBtn>
																</ListItem>
															))}
														</List>
													</Collapse>
												</>
											)}
										</ListItem>
									)}
								</Fragment>
							))}
						</List>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};
