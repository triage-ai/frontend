import {
	Box,
	Chip,
	Dialog,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	styled,
	Typography,
	Button,
	CircularProgress,
	CssBaseline,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { ChevronDown, Pencil, Search, TicketPlus, Trash2, LogOut, Menu, X } from 'lucide-react';
import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition, CircularButton } from '../../components/sidebar';
// import { AddTicket } from './AddTicket';
import { SearchTextField } from '../agent/Agents';
import { usePriorityBackend } from '../../hooks/usePriorityBackend';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { useQueueBackend } from '../../hooks/useQueueBackend';
// import { TicketDetailContainer } from './TicketDetailContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { getQueriesForElement } from '@testing-library/react';
import { AppBarHeight } from '../../components/layout';
import { AuthContext } from '../../context/AuthContext';
import { UserTicketDetailContainer } from './UserTicketDetailContainer'
import { UserAddTicket } from './UserAddTicket'


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

const DrawerHeader = styled('div')(({ theme }) => ({
	height: `calc(${AppBarHeight} + 5px)`,
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const DrawerContentContainer = styled(Box)(() => ({
	width: '100%',
	minHeight: '100vh',
	background: '#f1f4f2',
}));

export const UserTickets = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();
	// const { getAllPriorities } = usePriorityBackend();
	const { getQueuesForUser } = useQueueBackend()
	const { getTicketsbyAdvancedSearchForUser } = useTicketBackend();

	const [ticketList, setTicketList] = useState([])
	const [totalTickets, setTotalTickets] = useState(0)

	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});

	const [queues, setQueues] = useState([]);
	const [queueIdx, setQueueIdx] = useState(0);
	const { userLogout } = useContext(AuthContext);

	const drawerWidth = 250;
	const appBarTitle = 'Ticket List'
	const appBarSubtitle = 'View your tickets'

	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);


	useEffect(() => {
		// getPriorityList();
		// refreshQueues();
		getQueueList()
	}, []);


	const getQueueList = () => {
		getQueuesForUser()
			.then(res => {
				res.data.map(entry => {
					entry.config = JSON.parse(entry.config)
				})
				setQueues(res.data)
				setQueueIdx(0)
			})
			.catch(err => {
				console.error(err);
			});
	}

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

	useEffect(() => {
		getTicketList();
	}, [page, size, queues, queueIdx])

	const handleTicketEdited = () => {
		handleDialogClose();
		getTicketList();
	};

	const handleTicketCreated = () => {
		handleDialogClose();
		getTicketList();
	};

	const getTicketList = () => {
		if (queues.length != 0) {
			getTicketsbyAdvancedSearchForUser({ ...queues[queueIdx].config, 'size': size, 'page': page + 1 })
				.then((res) => {
					setTicketList(res.data.items)
					setTotalTickets(res.data.total)
				})
		}
	}

	const handleChangePage = (e, newValue) => {
		setPage(newValue)
	}

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value)
		setPage(0)
	}

	useEffect(() => {
		if (ticketList.length > 0 && ticketId) {
			const ticket = {
				ticket_id: parseInt(ticketId, 10),
			};

			setOpenDetail(true);
			setSelectedTicket(ticket);
		}
	}, [ticketList, ticketId]);

	// useEffect(() => {
	// 	if (priorities.length > 0 && tickets) {
	// 		const mappedTicketsPriority = tickets.map(ticket => ({
	// 			...ticket,
	// 			priority: priorities.find(priority => priority.priority_id === ticket.priority_id),
	// 		}));
	// 		setTicketList(mappedTicketsPriority);
	// 	}
	// }, [tickets]);

	// const getPriorityList = () => {
	// 	getAllPriorities()
	// 		.then(res => {
	// 			setPriorities(res.data);
	// 		})
	// 		.catch(err => {
	// 			console.error(err);
	// 		});
	// };

	const handleDialogOpen = (event, ticket) => {
		event.stopPropagation();

		setSelectedTicket(ticket);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		// getTicketList(size, page + 1)
	};

	const handleQueueChange = (e) => {
		setPage(0)
		setSize(10)
		setQueueIdx(e.target.value)
	}

	const authLogout = async () => {
		userLogout();
		navigate('/', { replace: true });
	};

	const toggleDetailDrawer =
		(newOpen, ticket = null) =>
			() => {
				if (newOpen) {
					navigate('/user/tickets/' + ticket.ticket_id);
				} else {
					navigate('/user/tickets');
				}
				setOpenDetail(newOpen);
				setSelectedTicket(ticket);
			};

	return (

		<Box sx={{ display: 'flex', background: '#FFF' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
			>
				<Box
					sx={{
						height: AppBarHeight,
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						py: { xs: 1, md: 3 },
						px: { xs: 2, md: 5 },
					}}
				>
					<Box
						sx={{ display: 'flex', alignItems: 'flex-start' }}
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
							onClick={handleDialogOpen}
						>
							{<TicketPlus size={20} />}
							{'Add new ticket'}
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

			<DrawerContentContainer>
				<DrawerHeader />
				<Box
					sx={{
						height: `calc(100% - ${AppBarHeight})`,
						px: { xs: 2, md: 5 },
						zIndex: '4',
						position: 'relative'
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
						</Box>

						<Box
							display={'flex'}
							alignItems={'center'}
							sx={{ px: 2.25 }}
						>
							<Typography
								variant="caption"
								className="text-muted"
								fontWeight={600}
							>
								Queue
							</Typography>
							<FormControl
								sx={{ m: 1, minWidth: 120 }}
								size="small"
							>
								<Select
									displayEmpty
									value={queues.length ? queueIdx : ''}
									onChange={handleQueueChange}
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
												{item !== '' ? queues[item].title : ''}
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
									{queues.map((queue, idx) => (
										<MenuItem
											key={queue.queue_id}
											value={idx}
										>
											<Typography variant="subtitle2">{queue.title}</Typography>
										</MenuItem>
									))}
								</Select>
							</FormControl>
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
										<Typography variant="overline">Number</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Created</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Status</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Title</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="overline">Department</Typography>
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
										<TableCell>{ticket.number}</TableCell>
										<TableCell>{ticket.status.name}</TableCell>
										<TableCell>{ticket.created}</TableCell>
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
										<TableCell>{ticket.dept.name}</TableCell>
										<TableCell
											component="th"
											scope="row"
											align="right"
										>
											<Stack
												direction="row"
												// spacing={0.5}
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
						<TablePagination
							component="div"
							count={totalTickets}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={size}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
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

							<UserAddTicket
						handleTicketCreated={handleTicketCreated}
						handleTicketEdited={handleTicketEdited}
						editTicket={selectedTicket}
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
								background: '#F1F4F2',
							},
						}}
					>
						<UserTicketDetailContainer
							ticketInfo={selectedTicket}
							closeDrawer={toggleDetailDrawer(false)}
						/>
					</Drawer>
				</Box>
			</DrawerContentContainer>
		</Box>
	);
};
