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
	Typography,
} from '@mui/material';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { ChevronDown, Pencil, Search, TicketPlus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { AddTicket } from './AddTicket';
import { SearchTextField } from '../agent/Agents';
import { usePriorityBackend } from '../../hooks/usePriorityBackend';
import { useQueuesBackend } from '../../hooks/useQueueBackend';
import { TicketDetailContainer } from './TicketDetailContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { getQueriesForElement } from '@testing-library/react';

export const Tickets = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();

	const { tickets, refreshTickets, queues, queueIdx, setQueueIdx, refreshQueues, totalTickets } =
		useData();
	const { getAllPriorities } = usePriorityBackend();

	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [ticketList, setTicketList] = useState([]);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});

	useEffect(() => {
		getPriorityList();
		refreshQueues();
	}, []);

	useEffect(() => {
		getTicketList();
	}, [page, size, queues, queueIdx]);

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
			refreshTickets(size, page + 1);
		}
	};

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = e => {
		setSize(e.target.value);
		setPage(0);
	};

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
		if (priorities.length > 0 && tickets) {
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

	const handleDialogOpen = (event, ticket) => {
		event.stopPropagation();

		setSelectedTicket(ticket);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		refreshTickets(size, page + 1);
	};

	const handleQueueChange = e => {
		setPage(0);
		setSize(10);
		setQueueIdx(e.target.value.queue_id - 1);
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
		<Layout
			title={'Ticket List'}
			subtitle={'View your tickets and add new ones'}
			buttonInfo={{
				label: 'Add new ticket',
				icon: <TicketPlus size={20} />,
			}}
		>
			<WhiteContainer noPadding>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						py: 1.75,
						px: 2.25,
					}}
				>
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
								value={queues.length ? queues[queueIdx] : ''}
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
											{item.title}
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
										value={queue}
									>
										<Typography variant="subtitle2">{queue.title}</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
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
								<TableCell>{ticket.user.name}</TableCell>
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

					<AddTicket
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
				<TicketDetailContainer
					ticketInfo={selectedTicket}
					openEdit={handleDialogOpen}
					closeDrawer={toggleDetailDrawer(false)}
				/>
			</Drawer>
		</Layout>
	);
};
