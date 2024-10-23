import { useEffect, useState } from 'react';
import { CustomSelect } from '../../components/custom-select';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { AddGroup } from './AddGroup';
import { useData } from '../../context/DataContext';

export const GroupSelect = ({ handleInputChange, value }) => {
	const { formattedGroups, refreshGroups } = useData();
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	useEffect(() => {
		refreshGroups();
	}, []);

	const openDialog = () => {
		setOpenCreateDialog(true);
	};

	const handleClose = () => {
		setOpenCreateDialog(false);
	};

	return (
		<>
			<CustomSelect
				label="Group"
				onChange={handleInputChange}
				value={value}
				name="group_id"
				mb={2}
				fullWidth
				addNewButton
				handleAddBtnClick={openDialog}
				options={formattedGroups}
			/>

			<Dialog
				open={openCreateDialog}
				onClose={handleClose}
				PaperProps={{
					// component: 'form',
					// onSubmit: event => {
					// 	event.preventDefault();
					// 	const formData = new FormData(event.currentTarget);
					// 	const formJson = Object.fromEntries(formData.entries());
					// 	const email = formJson.email;
					// 	console.log(email);
					// 	handleClose();
					// },
					sx: {
						maxWidth: '500px',
						background: '#f1f4f2',
						py: 2,
						px: 3,
						m: 2,
						borderRadius: '10px',
					},
				}}
			>
				<Box sx={{ textAlign: 'center' }}>
					<Box
						sx={{
							width: '100%',
							textAlign: 'right',
							// pb: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ width: '40px', height: '40px' }} />

						<Typography
							variant="h2"
							sx={{ lineHeight: 1.3, textAlign: 'center' }}
						>
							Create new group
						</Typography>

						<IconButton
							aria-label="close dialog"
							onClick={handleClose}
							sx={{
								width: '40px',
								height: '40px',
								color: '#545555',
								transition: 'all 0.2s',
								'&:hover': {
									color: '#000',
								},
							}}
						>
							<X size={20} />
						</IconButton>
					</Box>

					<AddGroup handleClose={handleClose} />
				</Box>
			</Dialog>
		</>
	);
};
