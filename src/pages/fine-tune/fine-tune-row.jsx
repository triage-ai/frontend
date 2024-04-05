import {
	Alert,
	Box,
	Button,
	Collapse,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Snackbar,
	TableCell,
	TableRow,
	Typography,
	styled,
} from '@mui/material';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	// '&:nth-of-type(4n + 1)': {
	// 	backgroundColor: '#F4F4F4',
	// },
	// hide last border
	'&:last-child td, &:last-child th': {},
}));

export const VisuallyHiddenInput = styled('input')({
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

const allowedExtensions = ['csv'];

export const FineTuneRow = ({
	row,
	index,
	expanded,
	onOpenChange,
	handleFileAdd,
	setSnackbarError,
	setSnackBarErrorMessage,
}) => {
	const [files, setFiles] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(expanded === row.name);
	}, [expanded]);

	const handleFileUpload = async e => {
		if (!e.target.files) {
			return;
		}

		const file = e.target.files[0];

		if (!file) {
			return;
		}

		const fileExtension = file.type.split('/')[1];
		if (!allowedExtensions.includes(fileExtension)) {
			setSnackbarError(true);
			setSnackBarErrorMessage('Please upload a .csv file');
			return;
		}

		// 1. create url from the file
		const fileUrl = URL.createObjectURL(file);

		// 2. use fetch API to read the file
		const response = await fetch(fileUrl);

		// 3. get the text from the response
		const text = await response.text();

		// 4. split the text by newline
		const lines = text.split('\n');

		// 5. map through all the lines and split each line by comma.
		const data = lines.map(line => line.replaceAll('"', '').split(','));

		const headers = data[0];

		if (headers.length === 4) {
			if (
				!headers[0].includes('ticket_label') ||
				!headers[1].includes('title') ||
				!headers[2].includes('description') ||
				!headers[3].includes('extra_info')
			) {
				setSnackbarError(true);
				setSnackBarErrorMessage('The uploaded file does not follow the header format needed');
				return;
			}
		} else {
			setSnackbarError(true);
			setSnackBarErrorMessage('The uploaded file does not follow the header format needed');
			return;
		}

		const uploadedFiles = [...files];

		const fileObj = {
			name: file.name,
			category: row.name,
			size: (file.size / (1024 * 1024)).toFixed(2),
		};
		uploadedFiles.push(fileObj);
		setFiles(uploadedFiles);
		onOpenChange(true, row.name);
		handleFileAdd(fileObj);
	};

	return (
		<>
			<StyledTableRow
				key={row.name}
				sx={{
					backgroundColor: open ? '#f4f4f4' : 'unset',
					// cursor: 'pointer',
					'&:hover .category-title': {
						color: '#2B85FF',
					},
					'&:last-child td, &:last-child th': { border: 0 },
					'& > *': {
						borderBottom: 'unset',
					},
				}}
				// onClick={() => onOpenChange(!open, row.name)}
			>
				<TableCell
					sx={{
						border: 0,
						borderColor: '#EFEFEF',
						borderTopLeftRadius: '14px',
						// pl: 0,
						width: '50px',
						cursor: 'pointer',
					}}
					onClick={() => onOpenChange(!open, row.name)}
				>
					<IconButton
						aria-label="expand row"
						size="small"
						// onClick={() => onOpenChange(!open, row.name)}
					>
						{open ? <ChevronUp /> : <ChevronDown />}
					</IconButton>
				</TableCell>

				<TableCell sx={{ border: 0, borderColor: '#EFEFEF' }}>
					<Typography
						variant="body1"
						className="category-title"
						sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
					>
						{row.name}
					</Typography>
				</TableCell>

				{/* <TableCell sx={{ border: 0, borderColor: '#EFEFEF' }}>
					<Typography
						variant="body1"
						sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
					>
						Something something something something
					</Typography>
				</TableCell>
				<TableCell sx={{ border: 0, borderColor: '#EFEFEF' }}>
					<Typography
						variant="body1"
						sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
					>
						Whatever else is something something something
					</Typography>
				</TableCell> */}

				<TableCell sx={{ border: 0, borderColor: '#EFEFEF' }}>
					<Typography
						variant="body1"
						sx={{
							fontSize: '0.9375rem',
							fontWeight: 600,
							color: '#575757',
						}}
					>
						{files.length > 0 ? files.length + ' files uploaded' : 'No files uploaded'}
					</Typography>
				</TableCell>

				<TableCell
					align="right"
					sx={{ border: 0, borderColor: '#EFEFEF', borderTopRightRadius: '14px' }}
				>
					<Button
						variant="outlined"
						component="label"
						sx={{
							// border: '2px solid #2B85FF',
							border: 0,
							boxShadow: open ? '0 0 0 2px #9A9FA5 inset' : '0 0 0 2px #EFEFEF inset',
							color: '#1B1D1F',
							textTransform: 'unset',
							fontSize: '0.9375rem',
							fontWeight: 700,
							borderRadius: '12px',
							p: '10px 18px',
							transition: 'all 0.3s',
							'&:hover': {
								boxShadow: open ? '0 0 0 2px #575757 inset' : '0 0 0 2px #9A9FA5 inset',
								background: 'unset',
								color: '#1B1D1F',
								border: 0,
							},
						}}
					>
						Upload datasets
						<VisuallyHiddenInput
							type="file"
							accept=".csv"
							onChange={handleFileUpload}
						/>
					</Button>
				</TableCell>
			</StyledTableRow>

			{files.length > 0 && (
				<TableRow
					key={index}
					sx={{
						'&:last-child td, &:last-child th': {
							border: 0,
							'&:before': {
								height: 0,
							},
						},
					}}
				>
					<TableCell
						sx={{
							pt: 0,
							pb: open ? 1 : 0,
							px: 1,
							border: 0,
							background: open ? '#f4f4f4' : 'unset',
							borderRadius: '0 0 14px 14px',
							position: 'relative',
							'&:before': {
								content: '""',
								position: 'absolute',
								left: '12px',
								bottom: 0,
								width: 'calc(100% - 24px)',
								height: '1px',
								background: '#EFEFEF',
							},
						}}
						colSpan={6}
					>
						<Collapse
							in={open}
							timeout="auto"
							unmountOnExit
						>
							<Box sx={{ backgroundColor: '#FCFCFC', borderRadius: '6px', p: 2, width: '40%' }}>
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#575757' }}
								>
									Files uploaded
								</Typography>

								<List sx={{ px: 0, pt: 0.8, pb: 0 }}>
									{files.map((file, index) => (
										<ListItem
											key={index}
											sx={{ p: 0, borderTop: index !== 0 ? '1px solid #EFEFEF' : 0 }}
											secondaryAction={
												<IconButton
													edge="end"
													aria-label="delete"
													sx={{
														// background: '#EFEFEF',
														color: '#575757',
														padding: '10px',
														transition: 'all 0.3s',
														'&:hover': {
															color: '#ff7474',
														},
													}}
												>
													<Trash2 size={20} />
												</IconButton>
											}
										>
											<ListItemText
												primary={
													<Typography
														variant="subtitle1"
														sx={{ fontWeight: 600, mb: -0.8 }}
													>
														{file.name}
													</Typography>
												}
												secondary={
													<Typography
														variant="caption"
														sx={{ fontWeight: 400, color: '#9A9FA5' }}
													>
														{file.size}mb
													</Typography>
												}
											/>
										</ListItem>
									))}
								</List>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};
