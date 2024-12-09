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
										width={'auto'}
										sx={{
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
													// alignItems: 'start',
													// width: '100%',
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
														<Stack direction='row' spacing={0.5} alignItems='center' color={'grey'}>
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
								<Box textAlign={item.agent_id ? 'right' : 'left'}>
									{item.field && (
										<Typography variant='subtitle2' fontWeight={600} color='#1B1D1F'>
											<span style={{ textTransform: 'capitalize' }}>{item.field.replace('_id', '').replace('_', ' ')}</span>{' '}
											{getEventText(item)}
										</Typography>
									)}
									{/* <Box textAlign={'right'}> */}
									<Typography variant='caption' fontWeight={500}>
										<span className='text-muted'>By</span> {item.owner}{' '}
										<span className='text-muted'>at {dayjs.utc(item.created).local().format('lll')}</span>
									</Typography>
									{/* </Box> */}
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
									footer={
										<Stack>
											{files.length !== 0 &&
												<Box sx={{ borderTop: '1.5px solid #E5EFE9' }}>
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


								<Box mt={2} width={'100%'} textAlign={'center'}>

									<CircularButton sx={{ py: 2, px: 6, width: 200 }} onClick={handleSubmit} disabled={postDisabled}>
										Post
									</CircularButton>
								</Box>
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