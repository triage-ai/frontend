import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, timelineItemClasses, TimelineSeparator } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Stack, styled, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CloudUploadIcon, File, Paperclip, Send, X } from 'lucide-react';
import { MenuButton, RichTextReadOnly } from 'mui-tiptap';
import { useContext, useEffect, useState } from 'react';
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


const CustomInput = styled('input')({
	opacity: 0,
	position: 'absolute',
	boxSizing: 'border-box',
	bottom: 0,
	left: 0,
	width: '100%',
	height: '60px',
	cursor: 'pointer',
})

export const TicketThread = ({ ticket, closeDrawer, updateCurrentTicket, type }) => {
	const [formData, setFormData] = useState({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
	const [postDisabled, setPostDisabled] = useState(true);
	const [files, setFiles] = useState([]);
	const { createThreadEntry, createThreadEntryForUser } = useThreadsBackend();
	const { getPresignedURL, createAttachment } = useAttachmentBackend();
	const { permissions } = useContext(AuthContext);
	const { agentAuthState, userAuthState } = useContext(AuthContext);
	const editor = useEditor({
		extensions: [StarterKit],
		content: '',
		onUpdate({ editor }) {
			setFormData((prevFormData) => ({
				...prevFormData,
				body: editor.getHTML(),
			}));
		},
	});

	const getDirection = (agent_id, option1, option2) => {
		if ((agent_id && type === 'agent') || (!agent_id && type !== 'agent')) {
			return option1
		}
		else return option2
	}

	const handleSubmit = async () => {
		const threadEntryCreate = type === 'agent' ? createThreadEntry : createThreadEntryForUser;
		var newThreadEntry = { ...formData, thread_id: ticket.thread.thread_id };
		if (type === 'agent') {
			newThreadEntry.agent_id = agentAuthState.agent_id
		}
		else {
			newThreadEntry.user_id = userAuthState.user_id
		}

		var updatedTicket = { ...ticket };
		threadEntryCreate(newThreadEntry)
			.then((response) => {
				updatedTicket.thread.entries.push(response.data);
				editor.commands.setContent('')
				setFormData({ subject: null, body: '', type: 'A', editor: '', recipients: '' });
				return response.data.entry_id;
			})
			.then(async (entry_id) => {
				if (files.length !== 0) {
					const file_names = files.map((item) => item.name);
					await getPresignedURL({ attachment_names: file_names })
						.then(async (res) => {
							var presigned_urls = { ...res.data.url_dict };

							await awsFileUpload(presigned_urls, files, entry_id)
								.then((response) => {
									setFiles([]);
									updatedTicket.thread.entries.at(-1).attachments.push(...response)
								});

						})
				}
			})
			.then(() => {
				updateCurrentTicket(updatedTicket);
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

		const capitilize = (str) => {
			return str.split(' ').map(word => (word.charAt(0).toUpperCase() + word.substring(1))).join(' ')
		}

		var newValue = item.new_val;
		var prevValue = item.prev_val;

		if (item.field === 'due_date') {
			newValue = newValue ? formatDate(newValue, 'lll') : null;
			prevValue = prevValue ? formatDate(prevValue, 'lll') : null;
		}

		const field = capitilize(item.field.replace('_id', '').replace('_', ' '))

		if (item.type === 'A') {
			return (
				<Typography variant='subtitle2' fontWeight={600} color='#6c757d'>
					{field} set to&nbsp;
					<Typography variant='subtitle2' component="span" fontWeight={600} color='black'>
						{newValue}
					</Typography>
				</Typography>
			)
		}
		else if (item.type === 'R') {
			return (
				<Typography variant='subtitle2' fontWeight={600} color='#6c757d'>
					{field} unset from&nbsp;
					<Typography variant='subtitle2' component="span" fontWeight={600} color='black'>
						{prevValue}
					</Typography>
				</Typography>
			)
		}
		else {
			return (
				<Typography
					variant='subtitle2'
					fontWeight={600}
					color='#6c757d'
					sx={{
						display: "flex",
						flexWrap: "wrap",
						wordBreak: "break-word",
					}}
				>
					{field} updated from&nbsp;
					<Typography
						variant='subtitle2'
						fontWeight={600}
						component="span"
						sx={{
							color: "black",
						}}
					>
						{prevValue}
					</Typography>
					&nbsp;to&nbsp;
					<Typography
						variant='subtitle2'
						fontWeight={600}
						component="span"
						sx={{
							color: "black",
						}}
					>
						{newValue}
					</Typography>
				</Typography>
			)
		}
	}

	useEffect(() => {
		setPostDisabled(editor.isEmpty && files.length === 0);
	}, [formData, files]);

	return (
		<Box sx={{ height: '100%', width: '100%', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', position: 'relative' }}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '28px',

				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant='h6' fontWeight={600}>
						Ticket thread
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center' }}>

					<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={closeDrawer}>
						<X color='#6E7772' strokeWidth={1.5} />
					</IconButton>
				</Box>
			</Box>

			<Box sx={{ height: '100%', px: '28px', position: 'relative', overflowY: 'scroll' }}>


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
										<Typography variant='subtitle2' fontWeight={600} color='#1B1D1F' align={getDirection(item.agent_id, 'right', 'left')}>
											{item.subject}
										</Typography>
										<Box
											sx={{
												marginLeft: getDirection(item.agent_id, 'auto', 0),
												width: 'fit-content',
												'& .MuiPaper-rounded': {
													borderRadius: '8px'
												},
												'& .MuiAccordionSummary-root': {
													px: '12px',
													minHeight: 0,
													borderRadius: '8px'
												},
												'& .MuiAccordionSummary-content': {
													my: '12px'
												},
												"& .ProseMirror p": {
													fontSize: 'small',
													fontWeight: 500
												},
											}}
										>

											{item.attachments.length === 0 ?

												<Box
													sx={{
														padding: '12px',
														border: '1px solid #E5EFE9',
														borderRadius: '8px'
													}}
												>
													<RichTextReadOnly content={item.body} extensions={[StarterKit]} />
												</Box>
												:
												<Accordion
													disableGutters={true}
													elevation={0}
													sx={{
														border: '1px solid #E5EFE9',
													}}
												>
													<AccordionSummary >
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'space-between',
																alignItems: 'start',
																width: '100%'
															}}
														>
															<RichTextReadOnly content={item.body} extensions={[StarterKit]} />
															<Stack direction='row' ml={0.5} spacing={0.5} alignItems='center' color={'grey'}>
																<Typography fontSize='small'>
																	{item.attachments.length}
																</Typography>
																<Paperclip size={15} />
															</Stack>
														</Box>
													</AccordionSummary>
													<AccordionDetails>

														<Box
															sx={{
																display: 'flex',
																flexDirection: 'column',
																gap: 1,
															}}
														>
															{item.attachments.map((attachment, idx) => (
																<FileCard file={attachment} key={idx} />
															)
															)}
														</Box>
													</AccordionDetails>
												</Accordion>
											}
										</Box>
										<Box textAlign={getDirection(item.agent_id, 'right', 'left')}>

											<Typography variant='caption' fontWeight={500}>
												<span className='text-muted'>By</span> {item.owner}
												<span className='text-muted'> at {dayjs.utc(item.created).local().format('lll')}</span>
											</Typography>
										</Box>
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
										<Box width={'fit-content'} sx={{ marginLeft: item.agent_id ? 'auto' : 0 }}>
											{getEventText(item)}
										</Box>
										<Box width={'fit-content'} sx={{ marginLeft: item.agent_id ? 'auto' : 0 }}>
											<Typography variant='caption' fontWeight={500}>
												<span className='text-muted'>By</span> {item.owner}&nbsp;
												<span className='text-muted'>at {dayjs.utc(item.created).local().format('lll')}</span>
											</Typography>
										</Box>
									</Box>
								</TimelineContent>
							</TimelineItem>
						)
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

			{(type === 'user' || permissions.hasOwnProperty('ticket.edit')) && (
				<Box sx={{ px: '28px', py: '20px' }}>
					<RichTextEditorBox
						PostButton={
							<PostButton
								handleSubmit={handleSubmit}
								disabled={postDisabled}
							/>
						}
						editor={editor}
						footer={
							<Stack>
								{files.length !== 0 &&
									<Box sx={{ borderTop: '1.5px solid #E5EFE9', maxHeight: '200px', overflowY: 'scroll' }}>
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
									</Box>
								}

								<Stack
									justifyContent={'center'}
									direction={'row'}
									py={2}
									sx={{
										borderTop: '1.5px solid #E5EFE9',
									}}
									spacing={1}
									height='60px'
								>
									<CloudUploadIcon color="grey" />
									<Typography color="grey">
										Drop files to attach, or
										<label>
											<Link underline='none'> browse</Link>
										</label>
									</Typography>
								</Stack>
								<CustomInput type='file' onChange={(event) => handleFileUpload(event)} multiple />
							</Stack>
						}
					/>

					{/* <Box mt={2} width={'100%'} textAlign={'center'}>
						<CircularButton sx={{ py: 2, px: 6, width: 200 }} onClick={handleSubmit} disabled={postDisabled}>
							Post
						</CircularButton>
					</Box> */}
				</Box>
			)}
		</Box>
	);
};

const PostButton = ({ handleSubmit, disabled }) => {
	return (
		<Box border={disabled ? '1.5px solid #E5EFE9' : '1.5px solid #5a9ee5'} borderRadius='8px'>
			<IconButton
				onClick={handleSubmit}
				disabled={disabled}
			>
				<Send size={20} />
			</IconButton>
		</Box>
	)
}