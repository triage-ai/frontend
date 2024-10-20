import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { useSLABackend } from '../../hooks/useSLABackend';
import { useScheduleBackend } from '../../hooks/useScheduleBackend';
import { CustomFilledInput } from '../../components/custom-input';
import { useDepartmentBackend } from '../../hooks/useDepartmentBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';

export const AddDepartment = ({ handleClose }) => {
	const { getAllSLAs } = useSLABackend();
	const { getAllSchedules } = useScheduleBackend();
	const { createDepartment } = useDepartmentBackend();
	const { refreshDepartments } = useData();

	const sendNotification = useNotification();

	const [slas, setSlas] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [departmentData, setDepartmentData] = useState({
		sla_id: '',
		schedule_id: '',
		email_id: '',
		manager_id: '',
		name: '',
		signature: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		getAllSLAs()
			.then(slas => {
				const slaData = slas.data;
				const formattedSlas = slaData.map(sla => {
					return { value: sla.sla_id, label: sla.name };
				});
				setSlas(formattedSlas);
			})
			.catch(err => {
				console.error(err);
			});

		getAllSchedules()
			.then(schedules => {
				const schedulesData = schedules.data;
				const formattedSchedules = schedulesData.map(schedule => {
					return {
						value: schedule.schedule_id,
						label: schedule.name,
						sublabel: schedule.description.charAt(0).toUpperCase() + schedule.description.slice(1),
					};
				});
				setSchedules(formattedSchedules);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		const { name, sla_id, schedule_id, manager_id, email_id, signature } = departmentData;
		const isValid =
			name !== '' &&
			sla_id !== '' &&
			schedule_id !== '' &&
			manager_id !== '' &&
			email_id !== '' &&
			signature !== '';

		setIsFormValid(isValid);
	}, [departmentData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setDepartmentData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addDepartment = () => {
		createDepartment(departmentData)
			.then(res => {
				refreshDepartments();
				handleClose();
				sendNotification({ msg: 'Department created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new department.
			</Typography>

			<Stack
				spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={departmentData.name}
					name="name"
					mb={2}
					fullWidth
				/>

				<CustomSelect
					label="SLA"
					onChange={handleInputChange}
					value={departmentData.sla_id}
					name="sla_id"
					mb={2}
					fullWidth
					options={slas}
				/>

				<CustomSelect
					label="Schedule"
					onChange={handleInputChange}
					value={departmentData.schedule_id}
					name="schedule_id"
					mb={2}
					fullWidth
					options={schedules}
				/>

				<CustomFilledInput
					label="Manager Id"
					onChange={handleInputChange}
					value={departmentData.manager_id}
					name="manager_id"
					mb={2}
					fullWidth
				/>

				<CustomFilledInput
					label="Email"
					onChange={handleInputChange}
					value={departmentData.email_id}
					name="email_id"
					mb={2}
					fullWidth
				/>

				<CustomFilledInput
					label="Signature"
					onChange={handleInputChange}
					value={departmentData.signature}
					name="signature"
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
					onClick={addDepartment}
					disabled={!isFormValid}
				>
					Create department
				</CircularButton>
			</Stack>
		</Box>
	);
};
