import {
	Box,
	Chip,
	Dialog,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { Pencil, Search, TicketPlus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { AddTicket } from './AddTicket';
import { SearchTextField } from '../agent/Agents';
import { useProrityBackend } from '../../hooks/usePriorityBackend';

export const Tickets = () => {
	const { tickets, refreshTickets } = useData();
	const { getAllPriorities } = useProrityBackend();

	const [selectedAgent, setSelectedAgent] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [ticketList, setTicketList] = useState([]);

	useEffect(() => {
		getPriorityList();
		refreshTickets();
	}, []);

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

	const handleDialogOpen = agent => {
		setSelectedAgent(agent);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	// const handleAgentEdited = () => {
	// 	handleDialogClose();
	// 	refreshAgents();
	// };

	return (
		<Layout
			title={'Ticket List'}
			subtitle={'View your tickets and add new ones.'}
			buttonInfo={{
				label: 'Add new ticket',
				icon: <TicketPlus size={20} />,
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
										<IconButton onClick={() => handleDialogOpen(ticket)}>
											<Pencil size={18} />
										</IconButton>

										<IconButton onClick={() => handleDialogOpen(ticket)}>
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
		</Layout>
	);
};
