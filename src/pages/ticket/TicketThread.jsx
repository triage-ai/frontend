import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab';
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, styled, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CloudUploadIcon, File, X } from 'lucide-react';
import { RichTextReadOnly } from 'mui-tiptap';
import { useContext, useState } from 'react';
import { RichTextEditorBox } from '../../components/rich-text-editor';
import { CircularButton } from '../../components/sidebar';
import { AuthContext } from '../../context/AuthContext';
import formatDate from '../../functions/date-formatter';
import humanFileSize from '../../functions/file-size-formatter';
import { useAttachmentBackend } from '../../hooks/useAttachmentsBackend';
import { useThreadsBackend } from '../../hooks/useThreadBackend';
import { FileCard } from './FileCard';
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
dayjs.extend(utc);

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export const TicketThread = ({ ticket, closeDrawer, updateCurrentTicket }) => {
	const [formData, setFormData] = useState({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
	const [postDisabled, setPostDisabled] = useState(true);
	const [files, setFiles] = useState([]);
	const { createThreadEntry } = useThreadsBackend();
	const { getPresignedURL, createAttachment } = useAttachmentBackend();
	const { permissions } = useContext(AuthContext);
	const editor = useEditor({
		extensions: [StarterKit],
		content: '',
		onUpdate({ editor }) {
			setFormData((prevFormData) => ({
				...prevFormData,
				body: editor.getHTML(),
			}));
			setPostDisabled(editor.isEmpty);
		},
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		const newThreadEntry = { ...formData, thread_id: ticket.thread.thread_id };
		var attachments = []
		var updatedTicket = { ...ticket };
		createThreadEntry(newThreadEntry)
			.then((response) => {
				updatedTicket.thread.entries.push(response.data);
				// updateCurrentTicket(updatedTicket); 
				setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
				return response.data.entry_id;
			})
			.then((entry_id) => {
				const file_names = files.map((item) => item.name);
				getPresignedURL({ attachment_names: file_names })
				.then(async (res) => {
					var presigned_urls = { ...res.data.url_dict };

					await awsFileUpload(presigned_urls, files, entry_id)
					.then((response) => {
						setFiles([]);
						updatedTicket.thread.entries.at(-1).attachments.push(...response)
						updateCurrentTicket(updatedTicket);
					});

				})		
			})
			.catch((err) => {
				alert('Error while creating thread entry');
				console.error(err);
			});
	};

	const awsFileUpload = async (presigned_urls, files, entry_id) => {
		var attachments = []
		await Promise.all(Object.entries(presigned_urls).map(([fileName, url]) => {
			const file = files.find((f) => f.name === fileName);

			try {
				return axios
					.put(url, file, {
						headers: {
							'Content-Type': file.type,
							'Content-Disposition': `inline; filename="${fileName}"`,
						},
					})
					.then(async (res) => {
						await createAttachment({
							object_id: entry_id,
							type: file.type,
							name: fileName,
							inline: 1,
							link: url.split('?')[0],
							size: file.size,
						})
						.then(res => {
							attachments.push(res.data)
						});
					})
					.catch((err) => {
						console.error(`Error creating attachment in db for ${fileName}: `, err);
					})
			} catch (error) {
				console.error(`Error uploading ${fileName}:`, error.message);
			}
		}))
		return attachments
		
	}

	const handleFileUpload = (event) => {
		const length = event.target.files.length;
		var tempArray = [];
		for (let i = 0; i < length; i++) {
			tempArray.push(event.target.files[i]);
		}
		setFiles((p) => [...p, ...tempArray]);
		event.target.value = '';
	};

	const handleDeleteFile = (idx) => {
		setFiles((p) => [...p.slice(0, idx), ...p.slice(idx + 1)]);
	};

	// useEffect(() => {
	// 	console.log(files);
	// }, [files]);

	function getEventText(item) {
		var newValue = item.new_val;
		var prevValue = item.prev_val;

		if (item.field === 'due_date') {
			newValue = newValue ? formatDate(newValue, 'lll') : null;
			prevValue = prevValue ? formatDate(prevValue, 'lll') : null;
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
		setPostDisabled(formData.body === '' && files.length === 0);
	}, [formData, files]);

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
										<Stack direction='column' width='100%'>
											<RichTextReadOnly sx={{fontWeight: 500}} content={item.body} extensions={[StarterKit]} />
											<Typography variant='caption' color='#1B1D1F' fontWeight={500}>
												{item.body}
											</Typography>
											{(item.body && item.attachments.length !== 0) && (<Box border='1px solid #E5EFE9' height={0} width='100%' my={1}/>)}
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: 2,
													alignItems: 'flex-start'
												}}
											>
												{(item.attachments && item.attachments.length !== 0) && 
													item.attachments.map((attachment, idx) => (
														<FileCard file={attachment} key={idx} />
													)
												)}
											</Box>
										</Stack>
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
							<RichTextEditorBox
									editor={editor}
								/>
								{/* <RichTextEditor 
								editor={editor}
							>
								<LinkBubbleMenu /> need to figure out why the link bubble menu doesn't work
							</RichTextEditor> */}

								<List dense>
									{files.map((file, idx) => (
										<ListItem
											key={idx}
											secondaryAction={
												<IconButton edge='end' aria-label='delete' onClick={() => handleDeleteFile(idx)}>
													<X />
												</IconButton>
											}
										>
											<ListItemAvatar>
												<Avatar>
													<File />
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={file.name} secondary={humanFileSize(file.size, true, 1)} />
										</ListItem>
									))}
								</List>

								<Stack maxWidth={200} spacing={1}>
									<Button component='label' role={undefined} variant='contained' tabIndex={-1} startIcon={<CloudUploadIcon />}>
										Upload files
										<VisuallyHiddenInput type='file' onChange={(event) => handleFileUpload(event)} multiple />
									</Button>

								<CircularButton sx={{ py: 2, px: 6, mt: 2 }} onClick={handleSubmit} disabled={postDisabled}>
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
