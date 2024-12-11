import {
	Box,
	Chip,
	Dialog,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Select, Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography
} from '@mui/material';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { ChevronDown, Filter, Pencil, RotateCw, Search, TicketPlus, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledInput } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { Transition } from '../../components/sidebar';
import { TableRowsLoader } from '../../components/table-loader';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import formatDate from '../../functions/date-formatter';
import { SearchTextField } from '../agent/Agents';
import { AddTicket } from './AddTicket';
import { AdvancedSearch } from './AdvancedSearch';
import { TicketDetailContainer } from './TicketDetailContainer';

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export const Tickets = () => {
	const navigate = useNavigate();
	const { ticketId } = useParams();

	const { tickets, refreshTickets, queues, queueIdx, setQueueIdx, refreshQueues, totalTickets } =
		useData();
	const { permissions } = useContext(AuthContext);

	const [openDialog, setOpenDialog] = useState(false);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});
	const [loading, setLoading] = useState(true)
	const [openAdvancedSearch, setOpenAdvancedSearch] = useState(false)
	const [searchColumns, setSearchColumns] = useState([]);
	const [queueColumns, setQueueColumns] = useState([]);
	const [searchFilters, setSearchFilters] = useState([])
	const [searchSorts, setSearchSorts] = useState([])
	const [advancedSearchMode, setAdvancedSearchMode] = useState(false)

	const [queueConfig, setQueueConfig] = useState({page: 0, size: 10, filters: [], sorts: []})


	const columnFormatter = {
		1: (ticket) => (ticket.number),
		2: (ticket) => (formatDate(ticket.created, 'MM-DD-YY hh:mm A')),
		3: (ticket) => (ticket.title),
		4: (ticket) => (ticket.user ? ticket.user.firstname + ' ' + ticket.user.lastname : ''),
		5: (ticket) => (
			<Chip
				label={ticket.priority.priority_desc}
				sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
			/>
		),
		6: (ticket) => (ticket.status?.name),
		7: (ticket) => (formatDate(ticket.closed, 'MM-DD-YY hh:mm A')),
		8: (ticket) => (ticket.agent ? ticket.agent.firstname + ' ' + ticket.agent.lastname : ''),
		9: (ticket) => (ticket.due_date ? formatDate(ticket.due_date, 'MM-DD-YY hh:mm A') : formatDate(ticket.est_due_date, 'MM-DD-YY hh:mm A')),
		10: (ticket) => (formatDate(ticket.updated, 'MM-DD-YY hh:mm A')),
		11: (ticket) => (ticket.dept?.name),
		12: (ticket) => { },
		13: (ticket) => { },
		14: (ticket) => (ticket.group?.name),
	}

	useEffect(() => {
		refreshQueues();
	}, []);

	// useEffect(() => {
	// 	console.log(searchFilters)
	// 	console.log(queues)
	// }, [searchFilters])

	useEffect(() => {
		if (queues.length !== 0 && queueIdx !== -1) {
			setQueueColumns([...queues[queueIdx].columns])
			setSearchColumns([...queues[queueIdx].columns])

			setSearchFilters(structuredClone(queues[queueIdx].config.filters))

			setSearchSorts(structuredClone(queues[queueIdx].config.sorts))

			setQueueConfig(({size: 10, page: 0, filters: [...queues[queueIdx].config.filters], sorts: [...queues[queueIdx].config.sorts]}))
		}

	}, [queues, queueIdx])

	useEffect(() => {
		getTicketList();
	}, [queueConfig]);


	const handleTicketEdited = () => {
		handleDialogClose();
		getTicketList();
	};

	const handleTicketCreated = () => {
		handleDialogClose();
		getTicketList();
	};

	const getTicketList = async () => {
		if (queues.length !== 0) {
			setLoading(true)

			await refreshTickets(
				{filters: queueConfig.filters, sorts: queueConfig.sorts},
				queueConfig.size,
				queueConfig.page + 1)
				
			setLoading(false)
		}
	};


	const handleSubmitSearch = () => {
		setOpenAdvancedSearch(false)
		setAdvancedSearchMode(true)
		setQueueIdx(-1)

		setQueueColumns([...searchColumns])

		setQueueConfig(p => ({...p, filters: [...searchFilters], sorts: [...searchSorts]}))
	}

	const handleChangePage = (e, newValue) => {
		setQueueConfig(p => ({...p, page: newValue}))
	};

	const handleChangeRowsPerPage = e => {
		setQueueConfig(p => ({...p, page: 0, size: e.target.value}))
	};

	useEffect(() => {
		if (tickets.length > 0 && ticketId) {
			const ticket = {
				ticket_id: parseInt(ticketId, 10),
			};

			setOpenDetail(true);
			setSelectedTicket(ticket);
		}
	}, [tickets, ticketId]);

	const handleDialogOpen = (event, ticket) => {
		event.stopPropagation();

		setSelectedTicket(ticket);
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
		getTicketList()
	};

	const handleAdvancedSearchClose = () => {
		setOpenAdvancedSearch(false)
	}

	const handleQueueChange = e => {
		setQueueIdx(e.target.value.queue_id - 1);
		setAdvancedSearchMode(false)
	};

	const toggleDetailDrawer =
		(newOpen, ticket = null) =>
			() => {
				if (newOpen) {
					navigate('/tickets/id/' + ticket.ticket_id);
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
				label: 'Add ticket',
				icon: <TicketPlus size={20} />,
				hidden: permissions.hasOwnProperty('ticket.create')
			}}
			AddResource={AddTicket}
			refreshResource={getTicketList}
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
							sx={{ 
								m: 1,
								minWidth: 120,
								'& .MuiSelect-select': {
									alignContent: 'center'
								}
							}}
							size="small"
						>
							<Select
								displayEmpty
								value={advancedSearchMode ? '' : queues.length ? queues[queueIdx] : ''}
								onChange={handleQueueChange}
								input={<StyledInput />}
								renderValue={item => (
									<Box
										display={'flex'}
										alignItems={'center'}
										height={'100%'}
										sx={{

										}}
									>
										<Box
											width={'6px'}
											height={'6px'}
											borderRadius={'6px'}
											marginRight={1}
											sx={{ backgroundColor: advancedSearchMode ? '#D9D9D9' : '#29b866' }}
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
								IconComponent={props => (
									<ChevronDown
										{...props}
										size={17}
										color="#1B1D1F"
									/>
								)}
							>
								{queues.map((queue) => (
									<MenuItem
										key={queue.queue_id}
										value={queue}
									>
										<Typography variant="subtitle2">{queue.title}</Typography>
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<IconButton sx={{ borderRadius: '8px', border: advancedSearchMode ? '2px solid #29b866' : '1.5px solid #E5EFE9', mr: 1 }} onClick={() => setOpenAdvancedSearch(true)} >
							<Filter color={advancedSearchMode ? '#29b866' : 'currentColor'} size={20} />
						</IconButton>
						<IconButton sx={{ borderRadius: '8px', border: '1.5px solid #E5EFE9' }} onClick={() => getTicketList()} >
							<RotateCw size={20} />
						</IconButton>
					</Box>
				</Box>
				<TableContainer>
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
								{
									queues.length !== 0 ? queueColumns.map((column, idx) => (
										<TableCell key={idx} >
											<Typography key={idx} variant="overline">{column.name}</Typography>
										</TableCell>
									)) :
										<>
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
										</>
								}
								<TableCell align="right">
									<Typography variant="overline"></Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading ?
								<TableRowsLoader
									rowsNum={10}
									colNum={6}
								/>
								:
								tickets.map(ticket => (
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
										{
											queues.length !== 0 && queueColumns.map((column, idx) => (
												<TableCell key={idx} >
													{columnFormatter[column.default_column_id](ticket)}
												</TableCell>
											)
											)
										}
										{/* <TableCell
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
										<TableCell>{formatDate(ticket.updated, 'MM-DD-YY hh:mm A')}</TableCell>
										<TableCell>
											<Chip
												label={ticket.priority.priority_desc}
												sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }}
											/>
										</TableCell>
										<TableCell>{ticket.user.firstname + ' ' + ticket.user.lastname}</TableCell> */}
										{/* <TableCell>{ticket.user.firstname + ' ' + ticket.user.lastname}</TableCell> */}
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
												{permissions.hasOwnProperty('ticket.edit') && <IconButton onClick={event => handleDialogOpen(event, ticket)}>
													<Pencil size={18} />
												</IconButton>}
											</Stack>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
					<TablePagination
						component="div"
						count={totalTickets}
						page={queueConfig.page}
						onPageChange={handleChangePage}
						rowsPerPage={queueConfig.size}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</TableContainer>

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
						handleCreated={handleTicketCreated}
						handleEdited={handleTicketEdited}
						editTicket={selectedTicket}
					/>
				</Box>
			</Dialog>

			<Dialog
				open={openAdvancedSearch}
				onClose={() => { }}
				PaperProps={{
					sx: {
						minWidth: '700px',
						background: '#f1f4f2',
						py: 2,
						px: 3,
						m: 2,
						borderRadius: '10px',
					},
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Box
						sx={{
							width: '100%',
							textAlign: 'right',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ width: '40px', height: '40px' }} />

						<Typography
							variant="h2"
							sx={{ lineHeight: 1.3, textAlign: 'center' }}
						>
							Advanced Search
						</Typography>

						<IconButton
							aria-label="close dialog"
							onClick={handleAdvancedSearchClose}
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
					<AdvancedSearch 
						rows={searchColumns}
						setRows={setSearchColumns}
						filters={searchFilters}
						setFilters={setSearchFilters}
						sorts={searchSorts}
						setSorts={setSearchSorts}
						submitSearch={handleSubmitSearch}
					/>
				</Box>
			</Dialog>

			<Drawer
				open={openDetail}
				anchor={'right'}
				onClose={toggleDetailDrawer(false)}
				PaperProps={{
					sx: {
						// minWidth: 700,
						// maxWidth: 735,
						width: 700,
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
					type='agent'
				/>
			</Drawer>
		</Layout>
	);
};