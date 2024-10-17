import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineItem,
	timelineItemClasses,
	TimelineSeparator,
} from '@mui/lab';
import { Box, IconButton, Typography } from '@mui/material';
import { Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useThreadsBackend } from '../../hooks/useThreadsBackend'

export const TicketThread = ({ ticket, closeDrawer, updateCurrentTicket }) => {
	const [formData, setFormData] = useState({'subject': '', 'body': '', 'type': 'A', 'editor': '', 'recipients': ''});
	const [postDisabled, setPostDisabled] = useState(true)
	const { createThreadEntry } = useThreadsBackend();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value
		}));
	}

	const handleSubmit = () => {
		const newThreadEntry = { ...formData, 'thread_id': ticket.thread.thread_id }
		var updatedTicket = { ...ticket }
		createThreadEntry(newThreadEntry)
			.then((response) => {
				updatedTicket.thread.entries.push(response.data)
				updateCurrentTicket(updatedTicket)
				setFormData({...formData, 'subject':'', 'body':''})
			})
			.catch(err => {
				alert('Error while creating thread entry')
				console.log(err)
			});
	}

	useEffect(() => {
		setPostDisabled(formData.subject === '' || formData.body === '')
	},[formData])


	return (
		<Box sx={{ height: '100%', padding: '28px', position: 'relative', overflowY: 'scroll' }}>
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
						variant="h6"
						fontWeight={600}
					>
						Ticket thread
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					{/* <IconButton
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
					/> */}

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

			<Timeline
				sx={{
					px: 0,
					position: 'relative',
					[`& .${timelineItemClasses.root}:before`]: {
						flex: 0,
						padding: 0,
					},
				}}
			>
				{ticket.thread.events_and_entries.map(item => item.entry_id ? (
					<TimelineItem
						key={"entry"+item.entry_id}
						sx={{ marginBottom: '24px' }}
					>
						<TimelineSeparator>
							<TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1 }} />
							<TimelineConnector sx={{ background: '#ecffef' }} />
						</TimelineSeparator>
						<TimelineContent paddingTop={0}>
							<Box>
								<Typography
									variant="subtitle2"
									fontWeight={600}
									color="#1B1D1F"
								>
									{item.subject}
								</Typography>

								<Box
									mt={1}
									mb={0.5}
									sx={{
										display: 'flex',
										alignItems: 'center',
										border: '1px solid #E5EFE9',
										borderRadius: '8px',
										padding: '8px 10px',
									}}
								>
									<Typography
										variant="caption"
										color="#1B1D1F"
										fontWeight={500}
									>
										{item.body}
									</Typography>
								</Box>

								<Typography
									variant="caption"
									fontWeight={500}
								>
									<span className="text-muted">By</span> {item.owner}
								</Typography>
							</Box>
						</TimelineContent>
					</TimelineItem>
				) : (
					<TimelineItem
						key={"event"+item.event_id}
						sx={{ marginBottom: '24px' }}
					>
						<TimelineSeparator>
							<TimelineDot
								sx={{ background: '#2FC76E', borderRadius: '3px', boxShadow: 'none', zIndex: 1 }}
							></TimelineDot>
						</TimelineSeparator>
						<TimelineContent paddingTop={0}>
							<Box>
								{item.field_updated && (
									<Typography
										variant="subtitle2"
										fontWeight={600}
										color="#1B1D1F"
									>
										<span style={{ textTransform: 'capitalize' }}>
											{item.field_updated.replace('_', ' ')}
										</span>{' '}
										updated from {item.previous_value} to {item.updated_value}
									</Typography>
								)}

								<Typography
									variant="caption"
									fontWeight={500}
								>
									<span className="text-muted">By</span> {item.owner}
								</Typography>
							</Box>
						</TimelineContent>
					</TimelineItem>
				))}


				<TimelineItem sx={{ marginBottom: '24px' }}>
					<TimelineSeparator>
						<TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1 }} />
					</TimelineSeparator>
					<TimelineContent paddingTop={0}>
						<Box>
							<CustomFilledInput
								label="Subject"
								onChange={handleInputChange}
								value={formData.subject}
								name="subject"
								mb={1}
								fullWidth
							/>

							<CustomFilledInput
								label="Body"
								onChange={handleInputChange}
								value={formData.body}
								name="body"
								fullWidth
								multiline
								rows={3}
								borderWidth={1}
								mb={1}
							/>

							<CircularButton
								sx={{ py: 2, px: 6 }}
								onClick={handleSubmit}
								disabled={postDisabled}
							>
								Post
							</CircularButton>
						</Box>
					</TimelineContent>
				</TimelineItem>

				<Box
					sx={{
						position: 'absolute',
						top: '24px',
						left: '5px',
						width: '2px',
						height: '100%',
						background: '#ecffef',
						zIndex: 0,
					}}
				/>
			</Timeline>
		</Box>
	);
};
