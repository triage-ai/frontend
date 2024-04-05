import React, { useEffect, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	IconButton,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	styled,
} from '@mui/material';
import { Check, Copy, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { Footer } from '../../components/footer';
import { FineTuneRow } from './fine-tune-row';
import { TableColorBox } from '../build/build';
import { useModelBackend } from '../../hooks/useModelBackend';

export const FineTune = ({ handleProgress }) => {
	const activeModel = sessionStorage.getItem('activeModel');

	const [expanded, setExpanded] = useState(false);
	const [categories, setCategories] = useState([]);
	const [files, setFiles] = useState([]);
	const [finishedBuilding, setFinishedBuilding] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [copiedHeaders, setCopiedHeaders] = useState(false);

	const { createModel } = useModelBackend();

	useEffect(() => {
		if (sessionStorage.getItem('categories')) {
			const categorieList = JSON.parse(sessionStorage.getItem('categories')).filter(
				category => category.model === activeModel
			);
			setCategories(categorieList);
		}
	}, []);

	const handleChange = (open, panel) => {
		setExpanded(open ? panel : false);
	};

	const handleFileAdd = file => {
		const filesUploaded = [...files];
		filesUploaded.push(file);
		setFiles(filesUploaded);
	};

	const startFineTune = () => {
		setFinishedBuilding(false);

		createModel(['training_dataset.csv'])
			// createModel(files)
			.then(res => {
				console.log(res.data);
				handleProgress(res.data.task_id, 'fine-tune');
				setFinishedBuilding(true);
			})
			.catch(err => {
				// setFinishedBuilding(true);
				setFinishedBuilding(true);
				console.log(err);
			});
	};

	const handleError = isError => {
		setError(isError);
	};

	const handleErrorMessage = message => {
		setErrorMessage(message);
	};

	const handleSnackbarClose = () => {
		setError(false);
	};

	const copyHeaders = () => {
		navigator.clipboard.writeText('ticket_label	title	description	extra_info');
		setCopiedHeaders(true);
		setTimeout(function () {
			setCopiedHeaders(false);
		}, 2000);
	};

	return (
		<Box
			sx={{
				height: 'calc(100% - 80px)',
				p: '32px 25px',
				pb: 'calc(80px + 32px)',
				position: 'relative',
			}}
		>
			<Typography
				variant="h4"
				sx={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', mb: '24px' }}
			>
				Datasets
			</Typography>

			<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: '28px',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<TableColorBox />
						<Typography
							variant="h6"
							sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
						>
							Added categories
						</Typography>
					</Box>

					<Box>
						<Button
							variant="outlined"
							sx={{
								// border: '2px solid #2B85FF',
								border: 0,
								boxShadow: '0 0 0 2px #575757 inset',
								color: '#1B1D1F',
								textTransform: 'unset',
								fontSize: '0.9375rem',
								fontWeight: 700,
								borderRadius: '12px',
								p: '10px 18px',
								transition: 'all 0.3s',
								mr: 1,
								'&:hover': {
									background: '#575757',
									color: '#FFF',
									border: 0,
								},
							}}
							onClick={copyHeaders}
						>
							{!copiedHeaders && (
								<>
									<Copy
										size={24}
										style={{ marginRight: '10px' }}
									/>
									Copy headers
								</>
							)}

							{copiedHeaders && (
								<>
									<Check
										size={24}
										style={{ marginRight: '10px' }}
									/>
									Headers copied to clipboard
								</>
							)}
						</Button>

						<Button
							variant="outlined"
							sx={{
								// border: '2px solid #2B85FF',
								border: 0,
								boxShadow: '0 0 0 2px #2B85FF inset',
								color: '2B85FF',
								textTransform: 'unset',
								fontSize: '0.9375rem',
								fontWeight: 700,
								borderRadius: '12px',
								p: '10px 18px',
								transition: 'all 0.3s',
								'&:hover': {
									background: '#2B85FF',
									color: '#FFF',
									border: 0,
								},
							}}
						>
							<Download
								size={24}
								style={{ marginRight: '10px' }}
							/>
							Download sample file
						</Button>
					</Box>
				</Box>

				<Table
					aria-label="simple table"
					sx={{ width: 'calc(100% + 12px)', mx: '-12px' }}
				>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{
									border: 0,
									position: 'relative',
									'&:before': {
										content: '""',
										position: 'absolute',
										left: '12px',
										bottom: 0,
										width: '100%',
										height: '1px',
										background: '#EFEFEF',
									},
								}}
							/>

							<TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Category name
								</Typography>
							</TableCell>

							<TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Files
								</Typography>
							</TableCell>

							{/* <TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Question 2
								</Typography>
							</TableCell> */}

							<TableCell
								sx={{
									border: 0,
									position: 'relative',
									'&:before': {
										content: '""',
										position: 'absolute',
										right: '12px',
										bottom: 0,
										width: '100%',
										height: '1px',
										background: '#EFEFEF',
									},
								}}
							/>
						</TableRow>
					</TableHead>
					<TableBody>
						{categories.map((row, index) => (
							<FineTuneRow
								key={row.name}
								index={index}
								row={row}
								expanded={expanded}
								onOpenChange={handleChange}
								handleFileAdd={handleFileAdd}
								setSnackbarError={handleError}
								setSnackBarErrorMessage={handleErrorMessage}
								handleSnackbarClose={handleSnackbarClose}
							/>
						))}
					</TableBody>
				</Table>
			</Box>

			<Snackbar
				open={error}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				onClose={handleSnackbarClose}
				autoHideDuration={7000}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity="error"
					variant="filled"
					sx={{ width: '100%', borderRadius: '12px !important', '& .MuiAlert-icon': { py: '8px' } }}
				>
					<Typography
						variant="body1"
						sx={{ fontSize: '0.9375rem', fontWeight: 600 }}
					>
						{errorMessage}
					</Typography>
				</Alert>
			</Snackbar>

			<Footer
				text={files.length + ' datasets uploaded'}
				buttonText={'Start fine-tuning process'}
				buttonDisabled={finishedBuilding}
				handleClick={startFineTune}
			/>
		</Box>
	);
};
