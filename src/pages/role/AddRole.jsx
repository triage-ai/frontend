import { Box, Checkbox, deprecatedPropType, RoleControlLabel, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { useSLABackend } from '../../hooks/useSLABackend';
import { useScheduleBackend } from '../../hooks/useScheduleBackend';
import { CustomFilledInput } from '../../components/custom-input';
import { useRoleBackend } from '../../hooks/useRoleBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';
import { AgentSelect } from '../agent/AgentSelect';
import { SLASelect } from '../sla/SLASelect';
import { ScheduleSelect } from '../schedule/ScheduleSelect';
import { RoleSelect } from '../role/RoleSelect';
import { StatusSelect } from '../status/StatusSelect';
import { PrioritySelect } from '../priority/PrioritySelect';
import { GroupSelect } from '../group/GroupSelect';
import { DepartmentSelect } from '../department/DepartmentSelect';
import CustomDataGrid from '../../components/data-grid';
import { TransferList } from '../../components/transfer-list';

export const AddRole = ({ handleCreated, handleEdited, editRole }) => {
	const { createRole, updateRole, getRolePermissions } = useRoleBackend();

	const [isFormValid, setIsFormValid] = useState(false)

	const [permissions, setPermissions] = useState([]);
	const [allPermissions, setAllPermissions] = useState([])

	const [formData, setFormData] = useState({
		name: '',
		notes: '',
	});

	const validateRole = () => {
		return formData.name !== ''
	}

	useEffect(() => {
		if (editRole) {
			setFormData(editRole)
		}
	}, [editRole]);

	const prepareFormData = () => {
		const { name, notes } = formData
		return {
			name: name,
			notes: notes,
			...(editRole && { role_id: formData.role_id })
		}
	}

	useEffect(() => {
		getRolePermissions()
			.then(res => {
				setAllPermissions(res.data)
			})
			.catch(err => {
				console.error(err);
			});
	}, [])

	const permissionsFromString = (jsonString) => {
		var list;
		try {
			list = JSON.parse(jsonString)
		} catch (err) {
			return []
		}
		return Object.keys(list).map(name => {
			const match = allPermissions.find(item => item.name === name);
			return match ? { name: match.name, label: match.label } : null;
		}).filter(Boolean);
	}

	useEffect(() => {
		if (allPermissions.length > 0 && editRole) {
			setPermissions(permissionsFromString(editRole.permissions))
		}
	}, [allPermissions]);

	const formatPermissions = () => {
		const obj = permissions.reduce((acc, item) => {
			acc[item.name] = 1;
			return acc;
		}, {})
		return JSON.stringify(obj);
	}

	useEffect(() => {
		setIsFormValid(validateRole())
	}, [formData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleAction = () => {
		const data = {...prepareFormData(formData), permissions: formatPermissions()}
		if (editRole) {
			updateRole(data)
				.then(res => {
					handleEdited();
				})
				.catch(err => console.error(err));
		} else {
			createRole(data)
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
				{editRole ? 'Edit role' : 'Add new role'}
			</Typography>

			<Typography variant="subtitle2">
				{editRole ? 'Edit the details for this role' : 'We will gather essential details about the new role. Complete the following steps to ensure accurate setup and access.'}
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
					Role inroleation
				</Typography>

				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={formData.name}
					name="name"
					mb={2}
					fullWidth
				/>

				<CustomFilledInput
					label="Notes"
					onChange={handleInputChange}
					value={formData.notes}
					name="notes"
					mb={2}
					fullWidth
					rows={3}
				/>

				<Typography
					variant="h4"
					sx={{ fontWeight: 600, mb: 2 }}
				>
					Permissions
				</Typography>

				<TransferList
					right={permissions}
					setRight={setPermissions}
					allItems={allPermissions}
					formatter={(item) => item.label}
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
					{editRole ? 'Edit' : 'Create'} role
				</CircularButton>
			</Stack>
		</>
	);
};
