import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { CircularButton } from '../../components/sidebar';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';
import { useSLABackend } from '../../hooks/useSLABackend';

export const AddSLA = ({ handleClose }) => {
	const { createSLA } = useSLABackend();
	const { refreshSLAs } = useData();

	const sendNotification = useNotification();

	const [slaData, setSLAData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = slaData;
		const isValid = name !== '' && notes !== '';
		setIsFormValid(isValid);
	}, [slaData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setSLAData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addSLA = () => {
		createSLA(slaData)
			.then(res => {
				refreshSLAs();
				handleClose();
				sendNotification({ msg: 'SLA created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new SLA.
			</Typography>

			<Stack
				// spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={slaData.name}
					name="name"
					mb={2}
					fullWidth
				/>

				{/* <CustomSelect
					label="SLA"
					onChange={handleInputChange}
					value={slaData.sla_id}
					name="sla_id"
					mb={2}
					fullWidth
					options={slas}
				/> */}

				<CustomFilledInput
					label="Notes"
					onChange={handleInputChange}
					value={slaData.notes}
					name="notes"
					fullWidth
					multiline
					rows={3}
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
					onClick={addSLA}
					disabled={!isFormValid}
				>
					Create SLA
				</CircularButton>
			</Stack>
		</Box>
	);
};
