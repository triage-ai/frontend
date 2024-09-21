import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
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
	UserRound
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModelBackend } from '../hooks/useModelBackend';
import LogoHorizontal from '../assets/logo-horizontal-primary.svg';

const ModelSelector = styled(Box)(({ theme }) => ({
	width: '55px',
	height: '55px',
	border: '1.5px solid #EFEFEF',
	borderRadius: '12px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginBottom: '20px',
	position: 'relative',
	cursor: 'pointer',

	'& h5': {
		color: '#000',
	},
}));

export const CustomTextField = styled(TextField)({
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
		border: '2px solid #EFEFEF',
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
		title: 'Profile',
		icon: (
			<UserRound
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

export const SidebarItems = () => {
	const [path, setPath] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [models, setModels] = useState([]);
	const [open, setOpen] = useState(false);

	const menuSelectorOpen = Boolean(anchorEl);
	const { getAllDevModels } = useModelBackend();

	let location = useLocation();

	// useEffect(() => {
	// 	getAllDevModels()
	// 		.then(res => {
	// 			const { models } = res.data;
	// 			setModels(models);
	// 		})
	// 		.catch(res => {
	// 			console.log(res.response);
	// 		});
	// }, []);

	useEffect(() => {
		setPath(location.pathname);
	}, [location, setPath]);

	const activeRoute = route => {
		return route === path.replace('/', '');
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const setActiveModel = (model, environment) => {
		sessionStorage.setItem('activeModel', model);
		sessionStorage.setItem('activeModelEnv', environment);
		dispatchEvent(new Event('storage'));
		handleDialogClose();
	};

	const getModelBackgroundColor = () => {
		const activeEnv = sessionStorage.getItem('activeModelEnv');
		if (activeEnv) {
			if (activeEnv === 'dev') {
				return '#CABDFF';
			} else if (activeEnv === 'prod') {
				return '#B5E4CA';
			}
		}

		return '#7A8087';
	};

	return (
		<>
			<Drawer variant="permanent">
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
						{/* <ModelSelector
							aria-haspopup="true"
							aria-expanded={menuSelectorOpen ? 'true' : undefined}
							sx={{ backgroundColor: getModelBackgroundColor() }}
							onClick={handleClick}
						>
							<Typography
								variant="h5"
								sx={{ fontSize: '1.75rem', fontWeight: 600, color: '#FFF' }}
							>
								{sessionStorage.getItem('activeModel') &&
									sessionStorage.getItem('activeModel').charAt(0).toUpperCase()}
							</Typography>
							<ModelSelector
								sx={{
									width: '50px',
									height: '50px',
									position: 'absolute',
									zIndex: -1,
									border: 0,
									top: '6px',
									opacity: 0.6,
									backgroundColor: getModelBackgroundColor(),
								}}
							/>
							<ModelSelector
								sx={{
									width: '45px',
									height: '45px',
									position: 'absolute',
									zIndex: -1,
									border: 0,
									top: '14px',
									opacity: 0.4,
									backgroundColor: getModelBackgroundColor(),
								}}
							/>
						</ModelSelector>

						<Dialog
							open={open}
							onClose={handleDialogClose}
							slotProps={{ backdrop: { style: { backgroundColor: 'rgba(244, 244, 244, 0.8)' } } }}
							PaperProps={{
								component: 'form',
								style: {
									maxWidth: '400px',
									backgroundColor: '#FCFCFC',
									boxShadow:
										'0px 0px 14px -4px rgba(0, 0, 0, 0.05), 0px 32px 48px -8px rgba(0, 0, 0, 0.1)',
									borderRadius: '16px',
									padding: '26px 24px 24px',
								},
								onSubmit: event => {
									event.preventDefault();
									const formData = new FormData(event.currentTarget);
									const formJson = Object.fromEntries(formData.entries());
									const name = formJson.name;
									setActiveModel(name, 'dev');
									handleDialogClose();
								},
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<TableColorBox />
									<Typography
										variant="h6"
										sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
									>
										Create model
									</Typography>
								</Box>

								<IconButton
									size="small"
									aria-label="close"
									color="inherit"
									sx={{
										width: '36px',
										height: '36px',
										background: '#EFEFEF',
										borderRadius: '25px',
									}}
									onClick={handleDialogClose}
								>
									<X size={20} />
								</IconButton>
							</Box>

							<Divider sx={{ my: '24px', borderColor: '#EFEFEF' }} />

							<DialogContent sx={{ p: 0 }}>
								<Typography
									variant="body1"
									sx={{ fontSize: '0.9375rem', fontWeight: 500, color: '#6F767E', mb: '8px' }}
								>
									Please give your new model a name
								</Typography>

								<CustomTextField
									autoFocus
									margin="dense"
									name="name"
									label="Model name"
									type="text"
									fullWidth
									variant="filled"
								/>
							</DialogContent>
							<DialogActions sx={{ p: 0 }}>
								<Button
									variant="contained"
									disableElevation
									type="submit"
									sx={{
										border: 0,
										background: '#22874E',
										color: '#FFF',
										textTransform: 'unset',
										fontSize: '0.9375rem',
										fontWeight: 700,
										borderRadius: '12px',
										p: '10px 18px',
										transition: 'all 0.3s',
										mt: '24px',
										'&:hover': {
											background: '#29b866',
										},
									}}
								>
									Create model
								</Button>
							</DialogActions>
						</Dialog>

						<ModelSelectorMenu
							devModels={models}
							anchorEl={anchorEl}
							open={menuSelectorOpen}
							handleClose={handleClose}
							handleClickOpen={handleClickOpen}
						/> */}

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
											sx={{ display: 'block', mt: index !== 0 && 0.2 }}
										>
											<ListItemButton
												component={Link}
												to={'/' + item.title.toLowerCase()}
												selected={activeRoute(item.title.toLowerCase())}
												// disabled={item.title !== 'Agents'}
												// disabled={item.title !== 'Agents' && item.title !== 'Tickets'}
												disabled={item.title !== 'Agents' && item.title !== 'Tickets' && item.title !== 'Profile'}
												sx={{
													minHeight: 42,
													alignItems: 'center',
													justifyContent: 'flex-start',
													px: 1,
													pl: 0.7,
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
														},
														'.MuiListItemIcon-root, .MuiTypography-root': {
															color: '#1A4A13',
														},
													},
												}}
												disableRipple
											>
												<ListItemIcon
													sx={{
														width: '38px',
														minWidth: '38px',
														height: '38px',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '8px',
														color: '#575757',
														transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
													}}
												>
													{item.icon}
												</ListItemIcon>
												{
													<Typography
														variant="subtitle2"
														sx={{
															fontWeight: 600,
															color: '#575757',
															letterSpacing: '-0.05em',
															transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
															mt: '3px',
														}}
													>
														{item.title}
													</Typography>
												}
											</ListItemButton>
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
