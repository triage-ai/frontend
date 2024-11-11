import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Box, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useThreadsBackend } from '../../hooks/useThreadBackend';
import { RichTextEditorBox } from '../../components/rich-text-editor';
import { useEditor } from '@tiptap/react';
import { LinkBubbleMenu, LinkBubbleMenuHandler } from 'mui-tiptap';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { AuthContext } from '../../context/AuthContext';

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
dayjs.extend(utc);

export const TicketThread = ({ ticket, closeDrawer, updateCurrentTicket }) => {
	const [formData, setFormData] = useState({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
	const [postDisabled, setPostDisabled] = useState(true);
	const { createThreadEntry } = useThreadsBackend();
	const { permissions } = useContext(AuthContext);
	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
			}),
			LinkBubbleMenuHandler,
		],
		content: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		// console.log(editor.getHTML()) for rich text editor
		const newThreadEntry = { ...formData, thread_id: ticket.thread.thread_id };
		var updatedTicket = { ...ticket };
		createThreadEntry(newThreadEntry)
			.then((response) => {
				updatedTicket.thread.entries.push(response.data);
				updateCurrentTicket(updatedTicket);
				setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
			})
			.catch((err) => {
				alert('Error while creating thread entry');
				console.log(err);
			});
	};

	function getEventText(item) {
		var newValue = item.new_val;
		var prevValue = item.prev_val;

		if (item.field === 'due_date') {
			newValue = newValue ? dayjs.utc(newValue).local().format('lll') : null;
			prevValue = prevValue ? dayjs.utc(prevValue).local().format('lll') : null;
		}

		if (item.type === 'A') {
			return `set to ${newValue}`;
		} else if (item.type === 'R') {
			return `unset from ${prevValue}`;
		} else {
			return `updated from ${prevValue} to ${newValue}`;
		}
	}

	useEffect(() => {
		setPostDisabled(formData.body === '');
	}, [formData]);

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
					<Typography variant='h6' fontWeight={600}>
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

					<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={closeDrawer}>
						<X color='#6E7772' strokeWidth={1.5} />
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
				{ticket.thread.events_and_entries.map((item) =>
					item.entry_id ? (
						<TimelineItem key={'entry' + item.entry_id} sx={{ marginBottom: '24px' }}>
							<TimelineSeparator>
								<TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1 }} />
								<TimelineConnector sx={{ background: '#ecffef' }} />
							</TimelineSeparator>
							<TimelineContent paddingTop={0}>
								<Box>
									<Typography variant='subtitle2' fontWeight={600} color='#1B1D1F'>
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
										<Typography variant='caption' color='#1B1D1F' fontWeight={500}>
											{item.body}
										</Typography>
									</Box>

									<Typography variant='caption' fontWeight={500}>
										<span className='text-muted'>By</span> {item.owner}{' '}
										<span className='text-muted'>at {dayjs.utc(item.created).local().format('lll')}</span>
									</Typography>
								</Box>
							</TimelineContent>
						</TimelineItem>
					) : (
						<TimelineItem key={'event' + item.event_id} sx={{ marginBottom: '24px' }}>
							<TimelineSeparator>
								<TimelineDot sx={{ background: '#2FC76E', borderRadius: '3px', boxShadow: 'none', zIndex: 1 }}></TimelineDot>
							</TimelineSeparator>
							<TimelineContent paddingTop={0}>
								<Box>
									{item.field && (
										<Typography variant='subtitle2' fontWeight={600} color='#1B1D1F'>
											<span style={{ textTransform: 'capitalize' }}>{item.field.replace('_id', '').replace('_', ' ')}</span>{' '}
											{getEventText(item)}
										</Typography>
									)}

									<Typography variant='caption' fontWeight={500}>
										<span className='text-muted'>By</span> {item.owner}{' '}
										<span className='text-muted'>at {dayjs.utc(item.created).local().format('lll')}</span>
									</Typography>
								</Box>
							</TimelineContent>
						</TimelineItem>
					)
				)}

				{permissions.hasOwnProperty('ticket.edit') && (
					<TimelineItem sx={{ marginBottom: '24px' }}>
						<TimelineSeparator>
							<TimelineDot sx={{ background: '#2FC76E', boxShadow: 'none', zIndex: 1 }} />
						</TimelineSeparator>
						<TimelineContent paddingTop={0}>
							<Box>
								<CustomFilledInput
									label='Response'
									onChange={handleInputChange}
									value={formData.body}
									name='body'
									fullWidth
									multiline
									rows={3}
									borderWidth={1}
									mb={1}
								/>
								{/* <RichTextEditor 
								editor={editor}
							>
								<LinkBubbleMenu /> need to figure out why the link bubble menu doesn't work
							</RichTextEditor> */}

								<CircularButton sx={{ py: 2, px: 6 }} onClick={handleSubmit} disabled={postDisabled}>
									Post
								</CircularButton>
							</Box>
						</TimelineContent>
					</TimelineItem>
				)}

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
