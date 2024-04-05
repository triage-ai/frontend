import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	TextField,
	Typography,
	styled,
} from '@mui/material';
import triageIcon from '../assets/triage-icon.svg';
import { Blocks, ListChecks, Route, SlidersHorizontal, ToyBrick, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModelSelectorMenu } from './model-selector-menu';
import { useModelBackend } from '../hooks/useModelBackend';
import { TableColorBox } from '../pages/build/build';

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
		color: '#1B1D1F',
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
			borderColor: '#2B85FF',
			'&:before': {
				content: 'none',
			},
		},

		'&.Mui-focused': {
			borderColor: '#2B85FF',
		},
		// },
		// '& .MuiInputBase-input': {
		// 	padding: '10.5px 14px',
		// 	paddingLeft: '6px',
	},
});

export const SidebarItems = () => {
	const [path, setPath] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [models, setModels] = useState([]);
	const [open, setOpen] = useState(false);

	const menuSelectorOpen = Boolean(anchorEl);
	const { getAllDevModels } = useModelBackend();

	let location = useLocation();

	useEffect(() => {
		getAllDevModels()
			.then(res => {
				const { models } = res.data;
				setModels(models);
			})
			.catch(res => {
				console.log(res.response);
			});
	}, []);

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
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
						py: '18px',
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<ModelSelector
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
									Please provide a name for the new model that will be created
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
										background: '#2B85FF',
										color: '#FFF',
										textTransform: 'unset',
										fontSize: '0.9375rem',
										fontWeight: 700,
										borderRadius: '12px',
										p: '10px 18px',
										transition: 'all 0.3s',
										mt: '24px',
										'&:hover': {
											background: '#0069f6',
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
						/>

						<List sx={{ p: 0 }}>
							{['Build', 'Fine-tune', 'Playground', 'Route'].map((text, index) => (
								<ListItem
									key={text}
									disablePadding
									sx={{ display: 'block' }}
								>
									<ListItemButton
										component={Link}
										to={'/' + text.toLowerCase()}
										selected={activeRoute(text.toLowerCase())}
										sx={{
											minHeight: 48,
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											px: 1,
											'&:hover': {
												background: 'unset',
												'.MuiListItemIcon-root': {
													background: '#EFEFEF',
													color: '#1B1D1F',

													svg: {
														scale: '1.1',
													},
												},
												'.MuiTypography-root': {
													color: '#1B1D1F',
												},
											},
											'&.Mui-selected': {
												background: 'unset',
												'&:hover': {
													background: 'unset',
													svg: {
														scale: '1',
													},
												},
												'.MuiListItemIcon-root': {
													background: '#EFEFEF',
													color: '#1B1D1F',
												},
												'.MuiTypography-root': {
													color: '#1B1D1F',
												},
											},
										}}
										disableRipple
									>
										<ListItemIcon
											sx={{
												width: '40px',
												minWidth: '40px',
												height: '40px',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: '8px',
												color: '#575757',
												transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
											}}
										>
											{text.toLowerCase() === 'build' && <Blocks />}
											{text.toLowerCase() === 'fine-tune' && <SlidersHorizontal />}
											{text.toLowerCase() === 'playground' && <ToyBrick />}
											{text.toLowerCase() === 'route' && <Route />}
										</ListItemIcon>
										{
											<Typography
												variant="caption"
												sx={{
													fontWeight: 600,
													color: '#575757',
													mt: '3px',
													transition: 'all .125s cubic-bezier(.17,.67,.55,1.09)',
												}}
											>
												{text}
											</Typography>
										}
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Box>

					<img
						src={triageIcon}
						alt="Triage Logo Icon"
						style={{ width: '42px' }}
					/>
				</Box>
			</Drawer>
		</>
	);
};
