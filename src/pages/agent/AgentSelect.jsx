import { useEffect, useState } from 'react';
import { CustomAutocomplete } from '../../components/custom-select';
import { Box, Dialog, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
// import { AddAgent } from './AddAgent';
import { useAgentBackend } from '../../hooks/useAgentBackend';

export const AgentSelect = ({ handleInputChange, value, ...props }) => {
	const { getAgentBySearch } = useAgentBackend();
	const [agentOptions, setAgentOptions] = useState([]);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);

	const { mt, mb, ...otherProps } = props;

	const handleAgentSearchChange = e => {
		if (e?.target?.value) {
			getAgentBySearch(e.target.value)
				.then(res => {
					setAgentOptions(res.data);
				})
				.catch(err => alert('Agent search failed'));
		}
	};

	const openDialog = () => {
		setOpenCreateDialog(true);
	};

	const handleClose = () => {
		setOpenCreateDialog(false);
	};

	return (
		<>
			<CustomAutocomplete
				label="Agent"
				onChange={handleInputChange}
				onInputChange={handleAgentSearchChange}
				name="agent"
				value={value}
				mb={2}
				fullWidth
				addNewButton
				handleAddBtnClick={openDialog}
				options={agentOptions}
				getOptionLabel={item => (item ? item.firstname + ' ' + item.lastname : '')}
				sx={{ marginBottom: mb }}
				renderOption={(props, item) => (
					<li
						{...props}
						key={item.email}
					>
						{item.firstname + ' ' + item.lastname}&nbsp;
						<span style={{ color: 'grey', fontSize: 10 }}>{item.email}</span>
					</li>
				)}
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
							Create new agent
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

					{/* <AddAgent handleClose={handleClose} /> */}
				</Box>
			</Dialog>
		</>
	);
};
