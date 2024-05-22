import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Divider,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	styled,
} from '@mui/material';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Footer } from '../../components/footer';
import { CustomTextField } from '../../components/sidebar-items';
import { CategoryDialog } from './category-dialog';
import { useModelBackend } from '../../hooks/useModelBackend';

export const TableColorBox = styled(Box)(({ theme }) => ({
	width: '16px',
	height: '32px',
	background: '#CABDFF',
	borderRadius: '4px',
	marginRight: '16px',
}));

export const Build = ({ handleProgress }) => {
	const [activeModel, setActiveModel] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [categories, setCategories] = useState([]);
	const [finishedBuilding, setFinishedBuilding] = useState(false);

	const { createDataset } = useModelBackend();

	useEffect(() => {
		setCategoryList();

		window.addEventListener('storage', () => {
			setCategoryList();
		});
	}, []);

	const setCategoryList = () => {
		const activeModel = sessionStorage.getItem('activeModel');
		setActiveModel(activeModel);

		if (sessionStorage.getItem('categories')) {
			const parsedCategories = JSON.parse(sessionStorage.getItem('categories')).filter(
				category => category.model === activeModel
			);
			setCategories(parsedCategories);
		}
	};

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const submitBuild = () => {
		setFinishedBuilding(false);

		createDataset(categories)
			.then(res => {
				handleProgress(res.data.task_id, 'build');
				setFinishedBuilding(true);
				console.log(res.data.task_id);
			})
			.catch(err => {
				setFinishedBuilding(true);
				console.log(err);
			});
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
				Ticket categories
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
							Add categories for <span style={{ textTransform: 'capitalize' }}>{activeModel}</span>
						</Typography>
					</Box>

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
						onClick={handleDialogOpen}
					>
						<Plus
							size={24}
							style={{ marginRight: '10px' }}
						/>
						Create category
					</Button>
				</Box>

				<Table
					aria-label="simple table"
					sx={{ width: 'calc(100% + 24px)' }}
				>
					<TableHead>
						<TableRow>
							<TableCell sx={{ pl: 0, borderColor: '#EFEFEF' }}>
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
									Ticket Category Description
								</Typography>
							</TableCell>
							<TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Ticket Category Use Cases Overview
								</Typography>
							</TableCell>
							<TableCell
								align="right"
								sx={{ borderColor: '#EFEFEF' }}
							></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{categories.map(category => (
							<TableRow
								key={category.name}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell
									component="th"
									scope="row"
									sx={{ pl: 0, borderColor: '#EFEFEF' }}
								>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
									>
										{category.name}
									</Typography>
								</TableCell>
								<TableCell sx={{ borderColor: '#EFEFEF' }}>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
									>
										{category.question1.slice(0, 100).trim() + '...'}
									</Typography>
								</TableCell>
								<TableCell sx={{ borderColor: '#EFEFEF' }}>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
									>
										{category.useCases.toString().slice(0, 100).trim() + '...'}
									</Typography>
								</TableCell>
								<TableCell
									align="right"
									sx={{
										borderColor: '#EFEFEF',
										width: { xs: '30%', sm: '25%', md: '20%', lg: '15%' },
									}}
								>
									<IconButton
										aria-label="edit"
										sx={{
											background: '#EFEFEF',
											color: '#575757',
											padding: '10px',
											mr: '12px',
											'&:hover': {
												color: '#2B85FF',
											},
										}}
									>
										<Pencil size={18} />
									</IconButton>

									<IconButton
										aria-label="delete"
										sx={{
											background: '#EFEFEF',
											color: '#575757',
											padding: '10px',
											'&:hover': {
												color: '#ff7474',
											},
										}}
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}

						{categories.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									component="th"
									scope="row"
									sx={{ pl: 0 }}
								>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
									>
										Model <span style={{ textTransform: 'capitalize' }}>{activeModel}</span> does
										not currently contain any added categories
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Box>

			<Footer
				text={categories.length + ' categories created'}
				buttonText={'Build base model'}
				buttonDisabled={finishedBuilding}
				handleClick={submitBuild}
			/>

			<Dialog
				open={openDialog}
				onClose={handleDialogClose}
				slotProps={{ backdrop: { style: { backgroundColor: 'rgba(244, 244, 244, 0.8)' } } }}
				PaperProps={{
					component: 'form',
					style: {
						minWidth: '500px',
						maxWidth: '500px',
						backgroundColor: '#FCFCFC',
						boxShadow:
							'0px 0px 14px -4px rgba(0, 0, 0, 0.05), 0px 32px 48px -8px rgba(0, 0, 0, 0.1)',
						borderRadius: '16px',
						padding: '26px 24px 24px',
					},
					// onSubmit: event => {
					// 	debugger;
					// 	event.preventDefault();
					// 	const formData = new FormData(event.currentTarget);
					// 	const formJson = Object.fromEntries(formData.entries());
					// 	const name = formJson.name;
					// 	// setActiveModel(name);
					// 	handleDialogClose();
					// },
				}}
			>
				<CategoryDialog handleDialogClose={handleDialogClose} />
			</Dialog>
		</Box>
	);
};
