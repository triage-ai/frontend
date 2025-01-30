import { Box, Button, Card, Chip, Grid, Skeleton, styled, Tab, Tabs, Typography } from '@mui/material';
import { TicketX } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import formatDate from '../../functions/date-formatter';
import { useTicketBackend } from '../../hooks/useTicketBackend';

export const StyledTabs = styled((props) => <Tabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />)({
	'& .Mui-selected': {
		color: '#22874E',
	},
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '2px',
	},
	'& .MuiTabs-indicatorSpan': {
		width: '100%',
		height: '2px',
		backgroundColor: '#22874E',
	},
});

const Header = ({ headers, components, ticket }) => {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};


	return (
		<Box sx={{ p: 4, background: '#fff', borderRadius: 2 }}>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h4' fontWeight='bold'>
					#{ticket.number} - "{ticket.title}"
				</Typography>
				<Typography variant='body2' color='textSecondary'>
					Created: {formatDate(ticket.created, 'MM-DD-YY hh:mm A')} · Updated: {formatDate(ticket.updated, 'MM-DD-YY hh:mm A')} · Priority: <Chip label={ticket.priority.priority_desc} sx={{ backgroundColor: ticket.priority.priority_color, px: '8px' }} />
				</Typography>
			</Box>
			{/* Tab Bar */}
			<Box
				sx={{
					display: 'flex',
					mb: 4,
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant='scrollable'
					scrollButtons='auto'
					sx={{
						position: 'relative',
						width: '100%',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: '100%',
							height: '2px',
							background: '#E5EFE9',
							zIndex: -1,
						},
					}}
				>
					{headers.map((header, idx) => (
						<Tab key={idx} label={header.label} sx={{ textTransform: 'none', p: 0, mr: 5 }} />
					))}
				</StyledTabs>
			</Box>

			{/* Tab Content */}
			<WhiteContainer noPadding>
				<Box>{components[tabValue]}</Box>
			</WhiteContainer>
		</Box>
	);
};

const DetailView = ({ ticket }) => {
	console.log(ticket);
	return (
		<Box>
			<Grid container spacing={3}>
				{/* Left Column */}
				<Grid item xs={6}>
					<Card sx={{ p: 2 }}>
						<Typography variant='subtitle1' fontWeight='bold'>
							User
						</Typography>
						<Typography variant='body2'>{ticket.user.firstname + ' ' + ticket.user.lastname}</Typography>
					</Card>
					<Card sx={{ p: 2, mt: 2 }}>
						<Typography variant='subtitle1' fontWeight='bold'>
							Due Date
						</Typography>
						<Typography variant='body2'>{ticket.due_date ? formatDate(ticket.due_date, 'MM-DD-YY hh:mm A') : 'Not Set'}</Typography>
					</Card>
				</Grid>

				{/* Right Column */}
				<Grid item xs={6}>
					<Card sx={{ p: 2 }}>
						<Typography variant='subtitle1' fontWeight='bold'>
							Assigned To
						</Typography>
						<Typography variant='body2'>{ticket.agent ? ticket.agent.firstname + ' ' + ticket.agent.lastname : 'Not Assigned'}</Typography>
					</Card>
					<Card sx={{ p: 2, mt: 2 }}>
						<Typography variant='subtitle1' fontWeight='bold'>
							Department
						</Typography>
						<Typography variant='body2'>{ticket.dept.name}</Typography>
					</Card>
				</Grid>

			</Grid>
            <Grid item xs={6} display="flex-grow" justifyContent="center" alignItems="center">
                <Card sx={{ p: 2, mt: 2 }}>
                    <Typography variant='subtitle1' fontWeight='bold'>
                        Extra Details
                    </Typography>

                </Card>
            </Grid>


			<Box sx={{ mt: 4, textAlign: 'right' }}>
				<Button variant='contained' color='primary' sx={{ mr: 2 }}>
					Edit
				</Button>
			</Box>
		</Box>
	);
};

const ThreadView = ({ ticket }) => {
	return <Typography>Coming Soon</Typography>;
};

export const GuestTicketView = () => {
	const { getTicketByNumberForGuest } = useTicketBackend();
	const { guestAuthState } = useContext(AuthContext);
	const [ticket, setTicket] = useState(null);
	const [value, setValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const headers = [
		{ id: 1, label: 'Details' },
		{ id: 2, label: 'Thread' },
	];
    const components = [<DetailView ticket={ticket} />, <ThreadView ticket={ticket} />];

	useEffect(() => {
		setLoading(true);
		if (guestAuthState.isAuth === true) {
			getTicketByNumberForGuest(guestAuthState.ticket_number)
				.then((response) => response.data)
				.then((ticket) => {
					ticket = preProcessTicket(ticket);
					setTicket(ticket);
				});
		}
		setLoading(false);
	}, []);

	function datetime_sort(a, b) {
		return new Date(a.created).getTime() - new Date(b.created).getTime();
	}

	function preProcessTicket(ticket) {
		if (ticket.thread && ticket.thread.events) {
			ticket.thread.events.forEach((event) => {
				let eventData = JSON.parse(event.data);

				event.field = eventData.field;
				event.prev_val = eventData.prev_val;
				event.new_val = eventData.new_val;

				if (eventData.hasOwnProperty('new_id')) {
					event.prev_id = eventData.prev_id;
					event.new_id = eventData.new_id;
				}
			});
		}
		if (ticket.thread) {
			let events_and_entries = ticket.thread.entries.concat(ticket.thread.events);
			ticket.thread.events_and_entries = events_and_entries.sort(datetime_sort);
		}
		return ticket;
	}

	const updateTicket = (newTicket) => {
		newTicket = preProcessTicket(newTicket);
		setTicket(newTicket);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<WhiteContainer noPadding>
			{loading ? (
				<Box
					sx={{
						width: '100%',
						// height: '60vh', // whitecontainer min height
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: '65%',
					}}
				>
					<Skeleton variant='rounded' width={210} height={60} />
					<Skeleton variant='rounded' width={210} height={60} />
					<Skeleton variant='rounded' width={210} height={60} />
				</Box>
			) : !ticket ? (
				<Box
					sx={{
						width: '100%',
						height: '60vh', // whitecontainer min height
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: '65%',
					}}
				>
					<TicketX size={80} />
					<Typography fontWeight={600} variant='h2'>
						Session expired
					</Typography>
					<Typography variant='subtitle2'>Head back to our home page to check a ticket's status or make a new ticket</Typography>
				</Box>
			) : (
				<Header headers={headers} components={components} ticket={ticket} />
			)}
		</WhiteContainer>
	);
};
