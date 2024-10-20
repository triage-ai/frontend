import {
	Box,
	Checkbox,
	Chip,
	Dialog,
	Drawer,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Stack,
	Step,
	StepConnector,
	StepLabel,
	Stepper,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Button,
	FormControl,
	Grid,
	MenuItem,
	Select,
	stepConnectorClasses,
	styled,
} from '@mui/material';
import {
	BadgeAlert,
	CalendarClock,
	Check,
	ChevronDown,
	CircleAlert,
	Eye,
	EyeOff,
	FileText,
	Info,
	MessageSquareText,
	Network,
	NotepadText,
	OctagonAlert,
	Pencil,
	Plus,
	Search,
	TicketPlus,
	Trash2,
	TriangleAlert,
	User,
	X,
} from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { SearchTextField } from '../agent/Agents';
import { useProrityBackend } from '../../hooks/usePriorityBackend';
import { useNavigate, useParams } from 'react-router-dom';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { useStatusBackend } from '../../hooks/useStatusBackend';
import { CustomFilledInput } from '../../components/custom-input';
import { useEffect, useState } from 'react';
import { CircularButton } from '../../components/sidebar';
import { useRolesBackend } from '../../hooks/useRoleBackend';
import { useAgentBackend } from '../../hooks/useAgentsBackend';
import { DepartmentSelect } from '../department/DepartmentSelect';
import { RoleSelect } from '../role/RoleSelect';

const CircularTab = styled(Tab)(() => ({
	width: '44px',
	height: '44px',
	minWidth: '44px',
	minHeight: '44px',
	borderRadius: '50px',
	background: '#FFF',
	border: '1px solid #E5EFE9',
	padding: 0,
	color: '#6E7772',
	transition: 'border-color 0.3s',
	'&.Mui-selected': {
		border: '1.25px solid #22874E',
		color: '#22874E',
	},
	'&:hover': {
		border: '1.25px solid #22874E',
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			sx={{
				width: 'calc(100% - 80px)',
				background: '#fff',
				borderTopLeftRadius: '24px',
				borderBottomLeftRadius: '24px',
			}}
			{...other}
		>
			{value === index && children}
		</Box>
	);
}

export const TicketDetailContainer = ({ ticketInfo, closeDrawer }) => {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ height: '100%' }}>
			<Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
				<Tabs
					orientation="vertical"
					variant="scrollable"
					value={value}
					onChange={handleChange}
					aria-label="Vertical tabs example"
					sx={{ padding: '24px 18px' }}
					TabIndicatorProps={{
						style: { display: 'none' },
					}}
				>
					<CircularTab
						icon={
							<NotepadText
								size={22}
								strokeWidth={1.5}
							/>
						}
						aria-label="Details"
						sx={{ marginBottom: '12px' }}
					/>

					<CircularTab
						icon={
							<MessageSquareText
								size={22}
								strokeWidth={1.5}
							/>
						}
						aria-label="Details"
					/>
				</Tabs>
				<TabPanel
					value={value}
					index={0}
				>
					<TicketDetail
						ticketInfo={ticketInfo}
						closeDrawer={closeDrawer}
					/>
				</TabPanel>
				<TabPanel
					value={value}
					index={1}
				>
					Item Two
				</TabPanel>
			</Box>
		</Box>
	);
};


export const UserDashboard = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();

	const { tickets, refreshTickets } = useData();
	const { getAllPriorities } = useProrityBackend();

	const [selectedAgent, setSelectedAgent] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [ticketList, setTicketList] = useState([]);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState(false);

	useEffect(() => {
		getPriorityList();
		refreshTickets();
	}, []);

	useEffect(() => {
		if (ticketList.length > 0 && ticketId) {
			const ticket = {
				ticket_id: parseInt(ticketId, 10),
			};

			setOpenDetail(true);
			setSelectedTicket(ticket);
		}
	}, [ticketList, ticketId]);

	useEffect(() => {
		if (priorities.length > 0 && tickets.length > 0) {
			const mappedTicketsPriority = tickets.map(ticket => ({
				...ticket,
				priority: priorities.find(priority => priority.priority_id === ticket.priority_id),
			}));
			setTicketList(mappedTicketsPriority);
		}
	}, [tickets]);

	const getPriorityList = () => {
		getAllPriorities()
			.then(res => {
				setPriorities(res.data);
			})
			.catch(err => {
				console.error(err);
			});
	};

	const handleDialogOpen = (event, agent) => {
		event.stopPropagation();

		setSelectedAgent(agent);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const toggleDetailDrawer =
		(newOpen, ticket = null) =>
		() => {
			if (newOpen) {
				navigate('/tickets/' + ticket.ticket_id);
			} else {
				navigate('/tickets');
			}
			setOpenDetail(newOpen);
			setSelectedTicket(ticket);
		};

	return (
		<>
			<WhiteContainer noPadding>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
					<Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
						<SearchTextField
							type="text"
							label="Search"
							variant="filled"
							placeholder="Search"
							disabled
							sx={{ '&:hover': { borderColor: '#bcc2bf' } }}
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
								<Typography variant="overline">Title</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Number</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Last updated</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Priority</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">From</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="overline"></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ticketList.map(ticket => (
							<TableRow
								key={ticket.ticket_id}
								onClick={toggleDetailDrawer(true, ticket)}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
									'& .MuiTableCell-root': {
										color: '#1B1D1F',
										fontWeight: 500,
										letterSpacing: '-0.02em',
									},
									'&:hover': {
										background: '#f9fbfa',
										cursor: 'pointer',
									},
								}}
							>
								<TableCell
									component="th"
									scope="row"
									sx={{ maxWidth: '200px' }}
								>
									{ticket.title}
									<Typography
										variant="subtitle2"
										sx={{
											fontSize: '0.75rem',
											lineHeight: 1.2,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: '-webkit-box',
											WebkitBoxOrient: 'vertical',
											WebkitLineClamp: 2,
										}}
									>
										{ticket.description}
									</Typography>
								</TableCell>
								<TableCell>{ticket.number}</TableCell>
								<TableCell>{ticket.updated.replace('T', ' ')}</TableCell>
								<TableCell>
									<Chip
										label={ticket.priority.priority_desc}
										sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
									/>
								</TableCell>
								<TableCell>{ticket.user_id}</TableCell>
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
										<IconButton onClick={event => handleDialogOpen(event, ticket)}>
											<Pencil size={18} />
										</IconButton>

										<IconButton onClick={event => handleDialogOpen(event, ticket)}>
											<Trash2 size={18} />
										</IconButton>
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</WhiteContainer>

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

					<AddTicket
						// handleAgentEdited={handleAgentEdited}
						editAgent={selectedAgent}
					/>
				</Box>
			</Dialog>

			<Drawer
				open={openDetail}
				anchor={'right'}
				onClose={toggleDetailDrawer(false)}
				PaperProps={{
					sx: {
						minWidth: 700,
						maxWidth: 735,
						margin: '12px',
						height: 'calc(100vh - 24px)',
						borderRadius: '24px',
						background: '#F2F4F2',
					},
				}}
			>
				<TicketDetailContainer
					ticketInfo={selectedTicket}
					closeDrawer={toggleDetailDrawer(false)}
				/>
			</Drawer>
</>
	);
};


const IconBox = styled(Box)(() => ({
	height: '35px',
	width: '35px',
	background: '#EAFAF1',
	borderRadius: '8px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#6e917d',
	marginRight: '12px',
}));

export const TicketDetail = ({ ticketInfo, closeDrawer }) => {
	const { getPriorityColor } = useProrityBackend();
	const { getTicketById, updateTicket } = useTicketBackend();
	const { getAllStatuses } = useStatusBackend();

	const [ticket, setTicket] = useState(null);
	const [statusList, setStatusList] = useState([]);

	const handleStatusChange = event => {
		const updatedTicket = { ...ticket };
		const newStatusName = event.target.value;
		const newStatus = statusList.find(status => status.name === newStatusName);
		const newStatusJSON = {
			status_id: newStatus.status_id,
			name: newStatus.name,
			state: newStatus.state,
			properties: newStatus.properties,
		};
		updatedTicket.status = newStatusJSON;

		const statusUpdate = {
			status: newStatusJSON,
		};
		updateTicket(updatedTicket.ticket_id, statusUpdate)
			.then(() => {
				setTicket(updatedTicket);
			})
			.catch(err => alert('Error while updating ticket status'));
	};

	useEffect(() => {
		getAllStatuses()
			.then(({ data }) => {
				setStatusList(data);
			})
			.catch(err => alert('Could not get status list'));
	}, []);

	useEffect(() => {
		if (ticketInfo) {
			getTicketById(ticketInfo.ticket_id).then(ticket => {
				console.log(ticket.data);
				setTicket(ticket.data);
			});
		}
	}, [ticketInfo]);

	const getPriorityIcon = priority => {
		switch (priority) {
			case 'low':
				return (
					<BadgeAlert
						size={20}
						color={getPriorityColor(priority)}
					/>
				);

			case 'normal':
				return (
					<CircleAlert
						size={20}
						color={getPriorityColor(priority)}
					/>
				);

			case 'hight':
				return (
					<OctagonAlert
						size={20}
						color={getPriorityColor(priority)}
					/>
				);

			case 'emergency':
				return (
					<TriangleAlert
						size={20}
						color={getPriorityColor(priority)}
					/>
				);

			default:
				return (
					<BadgeAlert
						size={20}
						color={getPriorityColor(priority)}
					/>
				);
		}
	};

	return (
		<Box sx={{ height: '100%', padding: '28px', position: 'relative' }}>
			{ticket && (
				<>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: '24px',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography
								variant="subtitle2"
								mr={0.5}
							>
								Ticket number
							</Typography>
							<Typography
								variant="h6"
								fontWeight={600}
							>
								#{ticket.number}
							</Typography>
							<Typography
								variant="h6"
								mx={1}
							>
								•
							</Typography>
							{getPriorityIcon(ticket.priority.priority)}
							<Typography
								variant="overline"
								ml={0.5}
								sx={{ color: getPriorityColor(ticket.priority.priority) }}
							>
								{ticket.priority.priority_desc} priority
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<IconButton
								sx={{ border: '1px solid #E5EFE9', borderRadius: '8px' }}
								aria-label="edit"
							>
								<Pencil
									size={20}
									color="#6E7772"
								/>
							</IconButton>

							<Box
								sx={{ borderLeft: '1.5px solid #E5EFE9', height: '24px' }}
								ml={2.25}
								mr={1}
							/>

							<IconButton
								sx={{ borderRadius: '8px' }}
								aria-label="edit"
								onClick={closeDrawer}
							>
								<X
									color="#6E7772"
									strokeWidth={1.5}
								/>
							</IconButton>
						</Box>
					</Box>

					<Box
						position={'relative'}
						mb={12}
					>
						<Box
							display={'flex'}
							alignItems={'center'}
							justifyContent={'space-between'}
							bgcolor={'#fff'}
							position={'relative'}
							zIndex={1}
							sx={{ p: '20px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
						>
							<Box
								display={'flex'}
								flexDirection={'column'}
							>
								<Typography
									variant="caption"
									mb={'6px'}
									className="text-muted"
								>
									Ticket Title
								</Typography>

								<Typography
									variant="h6"
									fontWeight={600}
									lineHeight={1}
								>
									{ticket.title}
								</Typography>
							</Box>

							<Box
								display={'flex'}
								alignItems={'center'}
							>
								<Typography
									variant="caption"
									className="text-muted"
									fontWeight={600}
								>
									Status
								</Typography>

								{/* <FormControl sx={{ m: 1 }}>
									<InputLabel id="demo-simple-select-label">Status</InputLabel>
									<Select
										labelId="demo-customized-select-label"
										id="demo-customized-select"
										value={ticket.status.state}
										// onChange={handleChange}
										input={<Input />}
									> */}
								<FormControl
									fullWidth
									sx={{ m: 1, minWidth: 120 }}
									size="small"
								>
									<Select
										displayEmpty
										value={ticket.status?.name || ''}
										onChange={handleStatusChange}
										renderValue={item => (
											<Box
												display={'flex'}
												alignItems={'center'}
											>
												<Box
													width={'6px'}
													height={'6px'}
													borderRadius={'6px'}
													marginRight={1}
													sx={{ backgroundColor: '#D9D9D9' }}
												/>

												<Typography
													variant="subtitle2"
													fontWeight={600}
													sx={{ color: '#1B1D1F' }}
												>
													{item}
												</Typography>
											</Box>
										)}
										sx={{
											'.MuiOutlinedInput-notchedOutline': {
												borderRadius: '8px',
												borderColor: '#E5EFE9',
											},
										}}
										IconComponent={props => (
											<ChevronDown
												{...props}
												size={17}
												color="#1B1D1F"
											/>
										)}
									>
										{statusList.map(status => (
											<MenuItem
												key={status.status_id}
												value={status.name}
											>
												<Typography variant="subtitle2">{status.name}</Typography>
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>

						<Box
							width={'100%'}
							height={'100%'}
							display={'flex'}
							alignItems={'flex-end'}
							justifyContent={'space-between'}
							position={'absolute'}
							top={'60%'}
							bgcolor={'#FCFEFD'}
							sx={{ p: '16px', border: '1px solid #E5EFE9', borderRadius: '8px' }}
						>
							<Box
								display={'flex'}
								alignItems={'center'}
							>
								<FileText
									color="#6E7772"
									strokeWidth={1.5}
								/>
								<Typography
									variant="subtitle2"
									ml={1}
									mb={'-4px'}
								>
									{ticket.description}
								</Typography>
							</Box>

							<Button
								variant="text"
								sx={{ color: '#22874E', marginBottom: '-7px' }}
							>
								<Typography
									variant="subtitle2"
									color={'#22874E'}
									textTransform={'none'}
									fontWeight={600}
								>
									Edit
								</Typography>
							</Button>
						</Box>
					</Box>

					<Grid
						container
						mb={'36px'}
					>
						<Grid
							item
							xs={4}
						>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<CalendarClock size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Due date
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.due_date
											? new Date(ticket.due_date)
													.toLocaleDateString('en-US', {
														day: '2-digit',
														month: 'short',
														year: 'numeric',
													})
													.replace(',', ' ')
											: 'Not set'}
									</Typography>
								</Box>
							</Box>
						</Grid>

						<Grid
							item
							xs={4}
						>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<Network size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Department
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.dept.name}
									</Typography>
								</Box>
							</Box>
						</Grid>

						<Grid
							item
							xs={4}
						>
							<Box
								display={'flex'}
								alignItems={'flex-start'}
							>
								<IconBox>
									<User size={18} />
								</IconBox>

								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										User
									</Typography>
									<Typography
										variant="subtitle2"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.user.name}
									</Typography>
								</Box>
							</Box>
						</Grid>
					</Grid>

					<Box
						mx={'-28px'}
						px={'28px'}
						py={'20px'}
						mb={'28px'}
						borderTop={'1px solid #E5EFE9'}
						borderBottom={'1px solid #E5EFE9'}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Box
							display={'flex'}
							alignItems={'center'}
						>
							<Typography
								variant="subtitle1"
								fontWeight={600}
								className="text-muted"
								mr={1}
							>
								Agent
							</Typography>

							<Typography
								variant="subtitle1"
								fontWeight={600}
								fontSize={'1.0625rem'}
							>
								{ticket.agent ? ticket.agent.name : 'Not assigned'}
							</Typography>
						</Box>

						<Button
							variant="outlined"
							sx={{
								border: '1px solid #E5EFE9',
								borderRadius: '8px',
								textTransform: 'none',
								color: '#1B1D1F',
							}}
						>
							<Typography
								variant="subtitle2"
								fontWeight={600}
								color={'#1B1D1F'}
								display={'flex'}
								alignItems={'center'}
								gap={'6px'}
							>
								<Plus size={16} />
								Assign agent
							</Typography>
						</Button>
					</Box>

					<Box>
						<Typography
							variant="subtitle1"
							fontWeight={700}
							mb={'21px'}
						>
							Extra information
						</Typography>

						<Grid container>
							<Grid
								item
								xs={6}
							>
								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										SLA
									</Typography>
									<Typography
										variant="subtitle1"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.sla.name}
									</Typography>
								</Box>
							</Grid>

							<Grid
								item
								xs={6}
							>
								<Box
									display={'flex'}
									flexDirection={'column'}
									alignItems={'flex-start'}
								>
									<Typography
										variant="overline"
										className="text-muted"
										sx={{ opacity: 0.7 }}
									>
										Topic
									</Typography>
									<Typography
										variant="subtitle1"
										color={'#1B1D1F'}
										fontWeight={600}
									>
										{ticket.topic.topic}
									</Typography>
								</Box>
							</Grid>

							{ticket.group && (
								<Grid
									item
									xs={6}
								>
									<Box
										display={'flex'}
										flexDirection={'column'}
										alignItems={'flex-start'}
									>
										<Typography
											variant="overline"
											className="text-muted"
											sx={{ opacity: 0.7 }}
										>
											Group
										</Typography>
										<Typography
											variant="subtitle1"
											color={'#1B1D1F'}
											fontWeight={600}
										>
											{ticket.group.name}
										</Typography>
									</Box>
								</Grid>
							)}

							{ticket.category && (
								<Grid
									item
									xs={6}
								>
									<Box
										display={'flex'}
										flexDirection={'column'}
										alignItems={'flex-start'}
									>
										<Typography
											variant="overline"
											className="text-muted"
											sx={{ opacity: 0.7 }}
										>
											Category
										</Typography>
										<Typography
											variant="subtitle1"
											color={'#1B1D1F'}
											fontWeight={600}
										>
											{ticket.category.name}
										</Typography>
									</Box>
								</Grid>
							)}
						</Grid>
					</Box>

					<Typography
						variant="caption"
						className="text-muted"
						width={'100%'}
						position={'absolute'}
						bottom={12}
						left={0}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
						gap={0.25}
						// sx={{ transform: 'translateX(-50%)' }}
					>
						<Info
							size={18}
							strokeWidth={1.25}
						/>{' '}
						Created {ticket.created} • Last updated {ticket.updated}
					</Typography>
				</>
			)}
		</Box>
	);
};


const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)',
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: '#58585833',
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
	color: '#58585833',
	display: 'flex',
	height: 22,
	alignItems: 'center',
	...(ownerState.active && {
		color: '#22874E',
	}),
	'& .QontoStepIcon-completedIcon': {
		color: '#22874E',
		zIndex: 1,
		fontSize: 18,
	},
	'& .QontoStepIcon-circle': {
		width: 8,
		height: 8,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
	},
}));

function QontoStepIcon(props) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot
			ownerState={{ active }}
			className={className}
		>
			{completed ? (
				<Check className="QontoStepIcon-completedIcon" />
			) : (
				<div className="QontoStepIcon-circle" />
			)}
		</QontoStepIconRoot>
	);
}

const steps = ['Information', 'Settings', 'Access', 'Authentication'];

export const AddTicket = ({ handleTicketCreated, handleAgentEdited, editAgent }) => {
	const { getAllRoles } = useRolesBackend();
	const { createAgent, updateAgent } = useAgentBackend();

	const [roles, setRoles] = useState([]);

	const [activeStep, setActiveStep] = useState(0);
	const [isNextDisabled, setIsNextDisabled] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		dept_id: '',
		role_id: '',
		email: '',
		username: '',
		phone: '',
		firstname: '',
		lastname: '',
		signature: '',
		timezone: '',
		admin: 0,
		password: '',
	});

	useEffect(() => {
		getAllRoles()
			.then(roles => {
				const rolesData = roles.data;
				const formattedRoles = rolesData.map(role => {
					return { value: role.role_id, label: role.name };
				});

				setRoles(formattedRoles);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		if (editAgent) {
			setFormData(editAgent);
		}
	}, [editAgent]);

	// Effect to check validation whenever formData or currentStep changes
	useEffect(() => {
		setIsNextDisabled(!validateCurrentStep());
	}, [formData, activeStep]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: name === 'admin' ? (e.target.checked ? 1 : 0) : value,
		}));
	};

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const validateStep1 = () => {
		const { firstname, lastname } = formData;
		return firstname !== '' && lastname !== '';
	};

	const validateStep2 = () => {
		const { admin, timezone, signature } = formData;
		return admin !== '' && timezone !== '' && signature !== '';
	};

	const validateStep3 = () => {
		const { dept_id, role_id } = formData;
		return dept_id !== '' && role_id !== '';
	};

	const validateStep4 = () => {
		const { email, username, password } = formData;

		if (editAgent) {
			return email !== '' && username !== '';
		}

		return email !== '' && username !== '' && password !== '';
	};

	// Function to validate current step
	const validateCurrentStep = () => {
		switch (activeStep) {
			case 0:
				return validateStep1();
			case 1:
				return validateStep2();
			case 2:
				return validateStep3();
			case 3:
				return validateStep4();
			default:
				return false;
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(show => !show);
	};

	const handleAction = () => {
		if (editAgent) {
			updateAgent(formData)
				.then(res => {
					handleAgentEdited();
				})
				.catch(err => console.error(err));
		} else {
			createAgent(formData)
				.then(res => {
					handleTicketCreated();
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<>
			<Typography
				variant="h1"
				sx={{ mb: 1.5 }}
			>
				Add new ticket
			</Typography>

			<Typography variant="subtitle2">
				We will gather essential details about the new agent. Complete the following steps to ensure
				accurate setup and access.
			</Typography>

			<Stepper
				alternativeLabel
				activeStep={activeStep}
				connector={<QontoConnector />}
				sx={{ my: 2 }}
			>
				{steps.map(label => (
					<Step key={label}>
						{/* <StepLabel StepIconComponent={QontoStepIcon} /> */}
						<StepLabel
							StepIconComponent={QontoStepIcon}
							sx={{
								'& .MuiStepLabel-label': {
									mt: '8px',
								},
							}}
						>
							{label}
						</StepLabel>
					</Step>
				))}
			</Stepper>

			{activeStep === 0 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Agent information
					</Typography>

					<CustomFilledInput
						label="First name"
						onChange={handleInputChange}
						value={formData.firstname}
						name="firstname"
						mb={2}
						halfWidth
						mr={'2%'}
					/>

					<CustomFilledInput
						label="Last name"
						onChange={handleInputChange}
						value={formData.lastname}
						name="lastname"
						mb={2}
						halfWidth
					/>

					<CustomFilledInput
						label="Phone (optional)"
						onChange={handleInputChange}
						value={formData.phone}
						name="phone"
						halfWidth
					/>
				</Box>
			)}

			{activeStep === 1 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Settings
					</Typography>

					<FormControlLabel
						control={
							<Checkbox
								onChange={handleInputChange}
								checked={formData.admin === 1}
								name="admin"
								sx={{
									'&.Mui-checked': {
										color: '#22874E',
									},
								}}
							/>
						}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Is administrator?
							</Typography>
						}
					/>

					<CustomFilledInput
						label="Timezone"
						onChange={handleInputChange}
						value={formData.timezone}
						name="timezone"
						mb={2}
						mt={2}
						halfWidth
						mr={'2%'}
					/>

					<CustomFilledInput
						label="Signature"
						onChange={handleInputChange}
						value={formData.signature}
						name="signature"
						fullWidth
						multiline
						rows={4}
					/>
				</Box>
			)}

			{activeStep === 2 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Access
					</Typography>

					{/* <CustomSelect
						label="Department"
						onChange={handleInputChange}
						value={formData.dept_id}
						name="dept_id"
						mb={2}
						fullWidth
						addNewButton
						handleAddBtnClick={openDialog}
						options={departments}
					/> */}

					<DepartmentSelect
						handleInputChange={handleInputChange}
						value={formData.dept_id}
					/>

					<RoleSelect
						handleInputChange={handleInputChange}
						value={formData.role_id}
					/>

					{/* <CustomSelect
						label="Role"
						onChange={handleInputChange}
						value={formData.role_id}
						name="role_id"
						fullWidth
						mb={2}
						addNewButton
						// handleAddBtnClick={openDialog}
						options={roles}
					/> */}
				</Box>
			)}

			{activeStep === 3 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Authentication
					</Typography>

					<CustomFilledInput
						label="Email"
						onChange={handleInputChange}
						value={formData.email}
						name="email"
						mb={2}
						fullWidth
					/>

					<CustomFilledInput
						label="Username"
						onChange={handleInputChange}
						value={formData.username}
						name="username"
						mb={2}
						halfWidth
						mr={'2%'}
					/>

					{!editAgent && (
						<CustomFilledInput
							label="Password"
							onChange={handleInputChange}
							value={formData.password}
							name="password"
							halfWidth
							type={showPassword ? 'text' : 'password'}
							autoComplete="new-password"
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={e => e.preventDefault()}
										edge="end"
									>
										{showPassword ? <EyeOff /> : <Eye />}
									</IconButton>
								</InputAdornment>
							}
						/>
					)}
				</Box>
			)}

			<Stack
				direction="row"
				spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				{activeStep !== 0 && (
					<CircularButton
						sx={{
							background: 'transparent',
							color: '#22874E',
							fontWeight: 600,
							border: '1.5px solid #22874E',
							py: 2,
							px: 4,
							'&:hover': {
								background: '#FFF',
							},
						}}
						onClick={handleBack}
					>
						Back
					</CircularButton>
				)}

				{activeStep !== steps.length - 1 && (
					<CircularButton
						sx={{ py: 2, px: 6 }}
						onClick={handleNext}
						disabled={isNextDisabled}
					>
						Next
					</CircularButton>
				)}

				{activeStep === steps.length - 1 && (
					<CircularButton
						sx={{ py: 2, px: 6 }}
						onClick={handleAction}
						disabled={isNextDisabled}
					>
						{editAgent ? 'Edit' : 'Create'} agent
					</CircularButton>
				)}
			</Stack>
		</>
	);
};