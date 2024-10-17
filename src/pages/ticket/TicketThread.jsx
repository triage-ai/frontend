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

export const TicketThread = ({ ticket, closeDrawer }) => {
	const getEventValue = event => {
		const parsedData = JSON.parse(event.data);
		let value = '';

		// Loop through the keys to find the dynamic key
		for (const key in parsedData) {
			if (parsedData.hasOwnProperty(key)) {
				console.log(`Key: ${key}, Value: ${parsedData[key]}`);
				// You can also directly access the value like this:
				value = parsedData[key];
			}
		}

		return value;
	};

	useEffect(() => {
		// Loop through the events and update the event data
		if (ticket.thread && ticket.thread.events) {
			ticket.thread.events.forEach(event => {
				// Parse the event data (assuming it's JSON)
				let eventData = JSON.parse(event.data);

				// Loop through each key in the event data
				for (let key in eventData) {
					if (eventData.hasOwnProperty(key)) {
						event.field_updated = key;
						event.previous_value = eventData[key][0];
						event.updated_value = eventData[key][1];
					}
				}
			});
		}
	}, [ticket]);

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
				{ticket.thread.entries.map(entry => (
					<TimelineItem
						key={entry.entry_id}
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
									{entry.subject}
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
										{entry.body}
									</Typography>
								</Box>

								<Typography
									variant="caption"
									fontWeight={500}
								>
									<span className="text-muted">By</span> {entry.owner}
								</Typography>
							</Box>
						</TimelineContent>
					</TimelineItem>
				))}

				{ticket.thread.events.map(event => (
					<TimelineItem
						key={event.event_id}
						sx={{ marginBottom: '24px' }}
					>
						<TimelineSeparator>
							<TimelineDot
								sx={{ background: '#2FC76E', borderRadius: '3px', boxShadow: 'none', zIndex: 1 }}
							></TimelineDot>
						</TimelineSeparator>
						<TimelineContent paddingTop={0}>
							<Box>
								{event.field_updated && (
									<Typography
										variant="subtitle2"
										fontWeight={600}
										color="#1B1D1F"
									>
										<span style={{ textTransform: 'capitalize' }}>
											{event.field_updated.replace('_', ' ')}
										</span>{' '}
										updated to {event.updated_value}
									</Typography>
								)}

								<Typography
									variant="caption"
									fontWeight={500}
								>
									<span className="text-muted">By</span> {event.owner}
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
								// onChange={handleInputChange}
								// value={formData.email}
								name="subject"
								mb={1}
								fullWidth
							/>

							<CustomFilledInput
								label="Body"
								// onChange={handleInputChange}
								// value={formData.signature}
								name="body"
								fullWidth
								multiline
								rows={3}
								borderWidth={1}
								mb={1}
							/>

							<CircularButton
								sx={{ py: 2, px: 6 }}
								// onClick={handleNext}
								// disabled={isNextDisabled}
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
