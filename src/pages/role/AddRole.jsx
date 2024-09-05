import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { useRolesBackend } from '../../hooks/useRolesBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';

export const AddRole = ({ handleClose }) => {
	const { createRole } = useRolesBackend();
	const { refreshRoles } = useData();

	const sendNotification = useNotification();

	const [roleData, setRoleData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = roleData;
		const isValid = name !== '' && notes !== '';
		setIsFormValid(isValid);
	}, [roleData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setRoleData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addRole = () => {
		createRole(roleData)
			.then(res => {
				refreshRoles();
				handleClose();
				sendNotification({ msg: 'Role created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new role.
			</Typography>

			<Stack
				spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={roleData.name}
					name="name"
					mb={2}
					fullWidth
				/>

				{/* <CustomSelect
					label="SLA"
					onChange={handleInputChange}
					value={roleData.sla_id}
					name="sla_id"
					mb={2}
					fullWidth
					options={slas}
				/> */}

				<CustomFilledInput
					label="Notes"
					onChange={handleInputChange}
					value={roleData.notes}
					name="notes"
					fullWidth
					multiline
					rows={3}
				/>
			</Stack>

			<Stack
				direction={'row'}
				spacing={1.5}
				sx={{ justifyContent: 'center', mt: 3.5, mb: 2 }}
			>
				<CircularButton
					sx={{
						background: 'transparent',
						color: '#22874E',
						fontWeight: 600,
						border: '1.5px solid #22874E',
						py: 2,
						px: 4,
						'&:hover': {
							background: '#FFF',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={addRole}
					disabled={!isFormValid}
				>
					Create role
				</CircularButton>
			</Stack>
		</Box>
	);
};
