import {
	Box,
	Button,
	FormControl,
	Grid,
	IconButton,
	Input,
	MenuItem,
	Select,
	styled,
	Typography,
} from '@mui/material';
import {
	BadgeAlert,
	CalendarClock,
	CircleAlert,
	FileText,
	Network,
	OctagonAlert,
	Pencil,
	Plus,
	TriangleAlert,
	User,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProrityBackend } from '../../hooks/usePriorityBackend';
import { useTicketsBackend } from '../../hooks/useTicketsBackend';

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
	const { getTicketById } = useTicketsBackend();

	const [ticket, setTicket] = useState(null);

	// const handleChange = event => {
	// 	setStatus(event.target.value);
	// };

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

								<FormControl
									sx={{ m: 1 }}
									variant="standard"
								>
									<Select
										labelId="demo-customized-select-label"
										id="demo-customized-select"
										value={ticket.status.state}
										// onChange={handleChange}
										input={<Input />}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										<MenuItem value={10}>Ten</MenuItem>
										<MenuItem value={20}>Twenty</MenuItem>
										<MenuItem value={30}>Thirty</MenuItem>
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
										{new Date(ticket.due_date)
											.toLocaleDateString('en-US', {
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											})
											.replace(',', ' ')}
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
						textAlign={'center'}
						position={'absolute'}
						bottom={12}
						left={0}
						// sx={{ transform: 'translateX(-50%)' }}
					>
						Created {ticket.created} • Last updated {ticket.updated}
					</Typography>
				</>
			)}
		</Box>
	);
};
