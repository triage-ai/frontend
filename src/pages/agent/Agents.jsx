import {
	Box,
	Dialog,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	inputLabelClasses,
	styled,
} from '@mui/material';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { Ellipsis, Pencil, Search, Trash2, UserRoundPlus, X } from 'lucide-react';
import { useAgentsBackend } from '../../hooks/useAgentsBackend';
import { useContext, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { AddAgent } from './AddAgent';
import { DeleteAgent } from './DeleteAgent';
import { useDepartmentsBackend } from '../../hooks/useDepartmentsBackend';

export const SearchTextField = styled('input')({
	width: '100%',
	height: '42px',
	border: '1.5px solid #E5EFE9',
	borderRadius: '12px',
	padding: '10px',
	paddingLeft: '36px',
	fontWeight: 500,
	fontSize: '0.9375rem',
	color: '#000',
	position: 'relative',
	zIndex: 1,
	background: 'transparent',
	'&:hover': {
		background: 'transparent',
		borderColor: '#22874E',
	},
	'&::placeholder': {
		fontWeight: 500,
		color: '#575757',
	},
	'&:focus': {
		outline: 'none',
		borderColor: '#22874E',
	},
});

export const Agents = () => {
	const { agents, refreshAgents } = useData();
	const { getAllDepartments } = useDepartmentsBackend();

	const [departments, setDepartments] = useState([]);
	const [selectedAgent, setSelectedAgent] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [buttonClicked, setButtonClicked] = useState('');

	useEffect(() => {
		refreshAgents();

		getAllDepartments()
			.then(depts => {
				setDepartments(depts.data);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	const handleDialogOpen = (agent, button) => {
		setSelectedAgent(agent);
		setButtonClicked(button);

		if (button === 'edit') {
			setOpenDialog(true);
		} else if (button === 'delete') {
			setOpenDeleteDialog(true);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleAgentEdited = () => {
		handleDialogClose();
		refreshAgents();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshAgents();
	};

	return (
		<Layout
			title={'Agent List'}
			subtitle={'View your agents and add new ones.'}
			buttonInfo={{
				label: 'Add new agent',
				icon: <UserRoundPlus size={20} />,
			}}
		>
			<WhiteContainer noPadding>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
					<Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
						<SearchTextField
							type="text"
							label="Search"
							variant="filled"
							placeholder="Search"
							disabled
							sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
						/>
						<Box
							sx={{
								width: '42px',
								height: '40px',
								position: 'absolute',
								top: 0,
								left: 0,
								zIndex: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Search
								size={20}
								color="#575757"
							/>
						</Box>
					</Box>

					{/* <TextField
						size="small"
						defaultValue={''}
						select
						sx={{
							width: '20%',
							ml: 1,
							'& fieldset': {
								border: '1.5px solid #E5EFE9',
								borderRadius: '12px',
							},
							'& .MuiSelect-select': {
								fontSize: '0.9375rem',
								fontWeight: 500,
								fontFamily:
									"Mont, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
							},
							// '& .MuiSelect-select span::before': {
							// 	content: "'-- Select --'",
							// 	color: '#575757',
							// 	opacity: 1,
							// 	fontSize: '0.9375rem',
							// 	fontWeight: 500,
							// 	fontFamily:
							// 		"Mont, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
							// },
							'& .MuiInputBase-root': {
								color: '#000',
								minHeight: '42px',

								'&:hover': {
									'& fieldset': {
										borderColor: '#22874E',
									},
								},

								'&.Mui-focused': {
									'& fieldset': {
										borderColor: '#22874E',
									},
								},
							},
						}}
						//   value={country}
						//   onChange={(e) => setCountry(e.target.value)}
					>
						<MenuItem value="">
							<Typography variant="subtitle2">- Choose department -</Typography>
						</MenuItem>

						{departments.map(option => (
							<MenuItem
								key={option.dept_id}
								value={option.dept_id}
							>
								{option.name}
							</MenuItem>
						))}
					</TextField> */}
				</Box>

				<Table>
					<TableHead>
						<TableRow
							sx={{
								background: '#F1F4F2',
								'& .MuiTypography-overline': {
									color: '#545555',
								},
							}}
						>
							<TableCell>
								<Typography variant="overline">Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Username</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Department</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Email</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Phone</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="overline"></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{agents.map(agent => (
							<TableRow
								key={agent.agent_id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
									'& .MuiTableCell-root': {
										color: '#1B1D1F',
										fontWeight: 500,
										letterSpacing: '-0.02em',
									},
								}}
							>
								<TableCell
									component="th"
									scope="row"
								>
									{agent.firstname + ' ' + agent.lastname}
								</TableCell>
								<TableCell>{agent.username}</TableCell>
								<TableCell>{agent.department.name}</TableCell>
								<TableCell>{agent.email}</TableCell>
								<TableCell>{agent.phone}</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="right"
								>
									<Stack
										direction="row"
										spacing={0.5}
										sx={{ justifyContent: 'flex-end' }}
									>
										<IconButton
											sx={{
												'&:hover': {
													background: '#f3f6fa',
													color: '#105293',
												},
											}}
											onClick={() => handleDialogOpen(agent, 'edit')}
										>
											<Pencil size={18} />
										</IconButton>

										<IconButton
											sx={{
												'&:hover': {
													background: '#faf3f3',
													color: '#921010',
												},
											}}
											onClick={() => handleDialogOpen(agent, 'delete')}
										>
											<Trash2 size={18} />
										</IconButton>
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</WhiteContainer>

			{buttonClicked === 'edit' && (
				<Dialog
					open={openDialog}
					TransitionComponent={Transition}
					onClose={handleDialogClose}
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

						<AddAgent
							handleAgentEdited={handleAgentEdited}
							editAgent={selectedAgent}
						/>
					</Box>
				</Dialog>
			)}

			{buttonClicked === 'delete' && (
				<Dialog
					open={openDeleteDialog}
					onClose={handleDeleteDialogClose}
					PaperProps={{
						sx: {
							maxWidth: '500px',
							background: '#f1f4f2',
							py: 2,
							px: 3,
							m: 2,
							borderRadius: '10px',
						},
					}}
				>
					<Box sx={{ textAlign: 'center' }}>
						<Box sx={{ width: '100%', textAlign: 'right', pb: 2 }}>
							<IconButton
								aria-label="close dialog"
								onClick={handleDeleteDialogClose}
								sx={{
									width: '40px',
									height: '40px',
									color: '#545555',
									transition: 'all 0.2s',
									'&:hover': {
										color: '#000',
									},
								}}
							>
								<X size={20} />
							</IconButton>
						</Box>

						<DeleteAgent
							editAgent={selectedAgent}
							handleDelete={handleDelete}
							handleClose={handleDeleteDialogClose}
						/>
					</Box>
				</Dialog>
			)}
		</Layout>
	);
};
