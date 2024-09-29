import {
	Box,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Stack,
	Step,
	StepConnector,
	StepLabel,
	Stepper,
	Typography,
	stepConnectorClasses,
	styled,
} from '@mui/material';
import { CustomFilledInput } from '../../components/custom-input';
import { useEffect, useState } from 'react';
import { CircularButton } from '../../components/sidebar';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useRolesBackend } from '../../hooks/useRolesBackend';
import { useAgentsBackend } from '../../hooks/useAgentsBackend';
import { DepartmentSelect } from '../department/DepartmentSelect';
import { RoleSelect } from '../role/RoleSelect';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)',
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#22874E',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: '#58585833',
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
	color: '#58585833',
	display: 'flex',
	height: 22,
	alignItems: 'center',
	...(ownerState.active && {
		color: '#22874E',
	}),
	'& .QontoStepIcon-completedIcon': {
		color: '#22874E',
		zIndex: 1,
		fontSize: 18,
	},
	'& .QontoStepIcon-circle': {
		width: 8,
		height: 8,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
	},
}));

function QontoStepIcon(props) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot
			ownerState={{ active }}
			className={className}
		>
			{completed ? (
				<Check className="QontoStepIcon-completedIcon" />
			) : (
				<div className="QontoStepIcon-circle" />
			)}
		</QontoStepIconRoot>
	);
}

const steps = ['Information', 'Settings', 'Access', 'Authentication'];

export const AddTicket = ({ handleTicketCreated, handleAgentEdited, editAgent }) => {
	const { getAllRoles } = useRolesBackend();
	const { createAgent, updateAgent } = useAgentsBackend();

	const [roles, setRoles] = useState([]);

	const [activeStep, setActiveStep] = useState(0);
	const [isNextDisabled, setIsNextDisabled] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		dept_id: '',
		role_id: '',
		email: '',
		username: '',
		phone: '',
		firstname: '',
		lastname: '',
		signature: '',
		timezone: '',
		admin: 0,
		password: '',
	});

	useEffect(() => {
		getAllRoles()
			.then(roles => {
				const rolesData = roles.data;
				const formattedRoles = rolesData.map(role => {
					return { value: role.role_id, label: role.name };
				});

				setRoles(formattedRoles);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		if (editAgent) {
			setFormData(editAgent);
		}
	}, [editAgent]);

	// Effect to check validation whenever formData or currentStep changes
	useEffect(() => {
		setIsNextDisabled(!validateCurrentStep());
	}, [formData, activeStep]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: name === 'admin' ? (e.target.checked ? 1 : 0) : value,
		}));
	};

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const validateStep1 = () => {
		const { firstname, lastname } = formData;
		return firstname !== '' && lastname !== '';
	};

	const validateStep2 = () => {
		const { admin, timezone, signature } = formData;
		return admin !== '' && timezone !== '' && signature !== '';
	};

	const validateStep3 = () => {
		const { dept_id, role_id } = formData;
		return dept_id !== '' && role_id !== '';
	};

	const validateStep4 = () => {
		const { email, username, password } = formData;

		if (editAgent) {
			return email !== '' && username !== '';
		}

		return email !== '' && username !== '' && password !== '';
	};

	// Function to validate current step
	const validateCurrentStep = () => {
		switch (activeStep) {
			case 0:
				return validateStep1();
			case 1:
				return validateStep2();
			case 2:
				return validateStep3();
			case 3:
				return validateStep4();
			default:
				return false;
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(show => !show);
	};

	const handleAction = () => {
		if (editAgent) {
			updateAgent(formData)
				.then(res => {
					handleAgentEdited();
				})
				.catch(err => console.error(err));
		} else {
			createAgent(formData)
				.then(res => {
					handleTicketCreated();
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
				Add new ticket
			</Typography>

			<Typography variant="subtitle2">
				We will gather essential details about the new agent. Complete the following steps to ensure
				accurate setup and access.
			</Typography>

			<Stepper
				alternativeLabel
				activeStep={activeStep}
				connector={<QontoConnector />}
				sx={{ my: 2 }}
			>
				{steps.map(label => (
					<Step key={label}>
						{/* <StepLabel StepIconComponent={QontoStepIcon} /> */}
						<StepLabel
							StepIconComponent={QontoStepIcon}
							sx={{
								'& .MuiStepLabel-label': {
									mt: '8px',
								},
							}}
						>
							{label}
						</StepLabel>
					</Step>
				))}
			</Stepper>

			{activeStep === 0 && (
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
						Agent information
					</Typography>

					<CustomFilledInput
						label="First name"
						onChange={handleInputChange}
						value={formData.firstname}
						name="firstname"
						mb={2}
						halfWidth
						mr={'2%'}
					/>

					<CustomFilledInput
						label="Last name"
						onChange={handleInputChange}
						value={formData.lastname}
						name="lastname"
						mb={2}
						halfWidth
					/>

					<CustomFilledInput
						label="Phone (optional)"
						onChange={handleInputChange}
						value={formData.phone}
						name="phone"
						halfWidth
					/>
				</Box>
			)}

			{activeStep === 1 && (
				<Box
					sx={{
						background: '#FFF',
						m: 4,
						p: 4,
						pt: 3,
						borderRadius: '12px',
						textAlign: 'left',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Typography
						variant="h4"
						sx={{ fontWeight: 600, mb: 2 }}
					>
						Settings
					</Typography>

					<FormControlLabel
						control={
							<Checkbox
								onChange={handleInputChange}
								checked={formData.admin === 1}
								name="admin"
								sx={{
									'&.Mui-checked': {
										color: '#22874E',
									},
								}}
							/>
						}
						label={
							<Typography
								variant="subtitle1"
								sx={{ fontWeight: 500 }}
							>
								Is administrator?
							</Typography>
						}
					/>

					<CustomFilledInput
						label="Timezone"
						onChange={handleInputChange}
						value={formData.timezone}
						name="timezone"
						mb={2}
						mt={2}
						halfWidth
						mr={'2%'}
					/>

					<CustomFilledInput
						label="Signature"
						onChange={handleInputChange}
						value={formData.signature}
						name="signature"
						fullWidth
						multiline
						rows={4}
					/>
				</Box>
			)}

			{activeStep === 2 && (
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
						Access
					</Typography>

					{/* <CustomSelect
						label="Department"
						onChange={handleInputChange}
						value={formData.dept_id}
						name="dept_id"
						mb={2}
						fullWidth
						addNewButton
						handleAddBtnClick={openDialog}
						options={departments}
					/> */}

					<DepartmentSelect
						handleInputChange={handleInputChange}
						value={formData.dept_id}
					/>

					<RoleSelect
						handleInputChange={handleInputChange}
						value={formData.role_id}
					/>

					{/* <CustomSelect
						label="Role"
						onChange={handleInputChange}
						value={formData.role_id}
						name="role_id"
						fullWidth
						mb={2}
						addNewButton
						// handleAddBtnClick={openDialog}
						options={roles}
					/> */}
				</Box>
			)}

			{activeStep === 3 && (
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
						Authentication
					</Typography>

					<CustomFilledInput
						label="Email"
						onChange={handleInputChange}
						value={formData.email}
						name="email"
						mb={2}
						fullWidth
					/>

					<CustomFilledInput
						label="Username"
						onChange={handleInputChange}
						value={formData.username}
						name="username"
						mb={2}
						halfWidth
						mr={'2%'}
					/>

					{!editAgent && (
						<CustomFilledInput
							label="Password"
							onChange={handleInputChange}
							value={formData.password}
							name="password"
							halfWidth
							type={showPassword ? 'text' : 'password'}
							autoComplete="new-password"
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={e => e.preventDefault()}
										edge="end"
									>
										{showPassword ? <EyeOff /> : <Eye />}
									</IconButton>
								</InputAdornment>
							}
						/>
					)}
				</Box>
			)}

			<Stack
				direction="row"
				spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				{activeStep !== 0 && (
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
						onClick={handleBack}
					>
						Back
					</CircularButton>
				)}

				{activeStep !== steps.length - 1 && (
					<CircularButton
						sx={{ py: 2, px: 6 }}
						onClick={handleNext}
						disabled={isNextDisabled}
					>
						Next
					</CircularButton>
				)}

				{activeStep === steps.length - 1 && (
					<CircularButton
						sx={{ py: 2, px: 6 }}
						onClick={handleAction}
						disabled={isNextDisabled}
					>
						{editAgent ? 'Edit' : 'Create'} agent
					</CircularButton>
				)}
			</Stack>
		</>
	);
};
