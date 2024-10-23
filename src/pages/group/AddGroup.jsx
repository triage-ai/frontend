import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';

export const AddGroup = ({ handleClose }) => {
	const { createGroup } = useGroupBackend();
	const { refreshGroups } = useData();

	const sendNotification = useNotification();

	const [groupData, setGroupData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = groupData;
		const isValid = true;
		setIsFormValid(isValid);
	}, [groupData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setGroupData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addGroup = () => {
		createGroup(groupData)
			.then(res => {
				refreshGroups();
				handleClose();
				sendNotification({ msg: 'Group created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new Group.
			</Typography>

			<Stack
				// spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={groupData.name}
					name="name"
					mb={2}
					fullWidth
				/>
			</Stack>

			<Stack
				direction={'row'}
				// spacing={1.5}
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
						'Groups:hover': {
							background: '#FFF',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={addGroup}
					disabled={!isFormValid}
				>
					Create Group
				</CircularButton>
			</Stack>
		</Box>
	);
};
