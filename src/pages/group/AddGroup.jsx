import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { useSLABackend } from '../../hooks/useSLABackend';
import { useScheduleBackend } from '../../hooks/useScheduleBackend';
import { CustomFilledInput } from '../../components/custom-input';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';
import { AgentSelect } from '../agent/AgentSelect';
import { SLASelect } from '../sla/SLASelect';
import { ScheduleSelect } from '../schedule/ScheduleSelect';
import CustomDataGrid from '../../components/data-grid';

export const AddGroup = ({ handleCreated, handleEdited, editGroup }) => {
	const { createGroup, updateGroup } = useGroupBackend();

	const sendNotification = useNotification();

	const [lead, setLead] = useState(null);
	const [isFormValid, setIsFormValid] = useState(false)

	const [members, setMembers] = useState([]);

	const [formData, setFormData] = useState({
		lead_id: '',
		name: '',
		notes: '',
	});

	const columns = [
		{
			field: "name",
			headerName: "Name",
			width: 180,
			editable: true,
			renderEditCell: (params) => {
				console.log(params)
				return <AgentSelect/>
			}
		}
	]

	const validateForm = () => {
		return formData.name !== ''
	}


	useEffect(() => {
		if (editGroup) {
			setFormData(editGroup)
			setLead(editGroup.lead)
		}

	}, [editGroup]);

	const prepareFormData = () => {
		const { lead_id, name, notes } = formData
		return {
			lead_id: lead_id === '' ? null : lead_id,
			name: name,
			notes: notes,
			...(editGroup && { group_id: formData.group_id })
		}
	}

	useEffect(() => {
		setIsFormValid(validateForm())
	}, [formData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleLeadChange = (e, newValue) => {
		setLead(newValue)
		setFormData(p => ({ ...p, lead_id: newValue?.agent_id ?? '' }))
	}

	const handleAction = () => {
		if (editGroup) {
			updateGroup(prepareFormData(formData))
				.then(res => {
					handleEdited();
				})
				.catch(err => console.error(err));
		} else {
			createGroup(prepareFormData(formData))
				.then(res => {
					handleCreated();
				})
				.catch(err => console.error(err));
		}
	};

	return (
		<>
			<Typography
				variant="h1"
				sx={{ mb: 1.5 }}
			>
				{editGroup ? 'Edit group' : 'Add new group'}
			</Typography>

			<Typography variant="subtitle2">
				{editGroup ? 'Edit the details for this group' : 'We will gather essential details about the new group. Complete the following steps to ensure accurate setup and access.'}
			</Typography>

			<Box
				sx={{
					background: '#FFF',
					m: 4,
					p: 4,
					pt: 3,
					borderRadius: '12px',
					textAlign: 'left',
				}}
			>
				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mb: 2 }}
				>
					Group information
				</Typography>

				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={formData.name}
					name="name"
					mb={2}
					fullWidth
				/>

				<AgentSelect
					name='lead'
					handleInputChange={handleLeadChange}
					value={lead ?? ''}
					mb={2}
				/>

				<CustomFilledInput
					label="Notes"
					onChange={handleInputChange}
					value={formData.notes}
					name="notes"
					fullWidth
					multiline
					rows={3}
				/>

				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mb: 2 }}
				>
					Members
				</Typography>

				<CustomDataGrid
					rows={members}
					setRows={setMembers}
					columns={columns}
				/>

			</Box>

			<Stack
				direction="row"
				spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={handleAction}
					disabled={!isFormValid}
				>
					{editGroup ? 'Edit' : 'Create'} group
				</CircularButton>
			</Stack>
		</>
	);
};

