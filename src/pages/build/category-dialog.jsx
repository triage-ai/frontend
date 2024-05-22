import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	Divider,
	IconButton,
	Step,
	StepConnector,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
	stepConnectorClasses,
	styled,
} from '@mui/material';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { CustomTextField } from '../../components/sidebar-items';
import { TableColorBox } from './build';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)',
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#CABDFF',
			// borderColor: '#784af4',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: '#CABDFF',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
	color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
	display: 'flex',
	height: 22,
	alignItems: 'center',
	...(ownerState.active && {
		color: '#CABDFF',
	}),
	'& .QontoStepIcon-completedIcon': {
		color: '#CABDFF',
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

export const CategoryDialog = ({ handleDialogClose }) => {
	const [activeStep, setActiveStep] = useState(0);
	const [name, setName] = useState('');
	const [question1, setQuestion1] = useState('');
	const [useCases, setUseCases] = useState(['', '', '']);

	const steps = [
		<span>Please name the new category</span>,
		<span>
			Explain how {<b>{name}</b>} tickets fit into your company/department's overall functions and
			responsibilities. Provide details about the broader context and challenges addressed by these
			tickets (Minimum 100 words).
		</span>,
		<span>
			List at least 3 different use cases for {<b>{name}</b>} tickets. These use cases should cover
			a diverse range of scenarios and issues addressed by this ticket type.
		</span>,
	];

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const saveCategory = () => {
		const categoryArray = sessionStorage.getItem('categories')
			? JSON.parse(sessionStorage.getItem('categories'))
			: [];
		const category = {
			name,
			question1,
			useCases,
			model: sessionStorage.getItem('activeModel'),
		};

		categoryArray.push(category);
		sessionStorage.setItem('categories', JSON.stringify(categoryArray));
		dispatchEvent(new Event('storage'));
		handleDialogClose();
	};

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<TableColorBox />
					<Typography
						variant="h6"
						sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
					>
						Create category
					</Typography>
				</Box>

				<IconButton
					size="small"
					aria-label="close"
					color="inherit"
					sx={{
						width: '36px',
						height: '36px',
						background: '#EFEFEF',
						borderRadius: '25px',
					}}
					onClick={handleDialogClose}
				>
					<X size={20} />
				</IconButton>
			</Box>

			{/* <Divider sx={{ my: '24px', borderColor: '#EFEFEF' }} /> */}

			<Stepper
				alternativeLabel
				activeStep={activeStep}
				connector={<QontoConnector />}
				sx={{ my: '24px' }}
			>
				{steps.map((label, index) => (
					<Step key={index}>
						<StepLabel StepIconComponent={QontoStepIcon} />
					</Step>
				))}
			</Stepper>

			<>
				<DialogContent sx={{ p: 0 }}>
					<Typography
						variant="body1"
						sx={{ fontSize: '0.9375rem', fontWeight: 500, color: '#6F767E', mb: '8px' }}
					>
						{steps[activeStep]}
					</Typography>

					{activeStep === 0 && (
						<CustomTextField
							autoFocus
							margin="dense"
							name="name"
							label="Category name"
							type="text"
							fullWidth
							variant="filled"
							value={name}
							onChange={event => {
								setName(event.target.value);
							}}
						/>
					)}

					{activeStep === 1 && (
						<CustomTextField
							autoFocus
							margin="dense"
							name="question1"
							label="Your answer"
							type="text"
							fullWidth
							variant="filled"
							value={question1}
							onChange={event => {
								setQuestion1(event.target.value);
							}}
							multiline
							minRows={4}
							maxRows={8}
						/>
					)}

					{activeStep === 2 && (
						<>
							{useCases.map((useCase, index) => (
								<CustomTextField
									key={index}
									autoFocus={index === 0}
									margin="dense"
									name="question2"
									label={'Use case ' + (index + 1)}
									type="text"
									fullWidth
									variant="filled"
									value={useCase}
									onChange={event => {
										const cases = [...useCases];
										cases[index] = event.target.value;
										setUseCases(cases);
									}}
									multiline
									minRows={2}
									maxRows={4}
								/>
							))}

							<Button
								variant="text"
								disableElevation
								sx={{
									border: 0,
									// background: '#2B85FF',
									// color: '#FFF',
									textTransform: 'unset',
									fontSize: '0.9375rem',
									fontWeight: 700,
									borderRadius: '12px',
									p: '10px 18px',
									transition: 'all 0.3s',
									mt: '2px',
								}}
								onClick={() => {
									const cases = [...useCases];
									cases.push('');
									setUseCases(cases);
								}}
								color="primary"
							>
								Add use case
							</Button>
						</>
					)}
				</DialogContent>

				<DialogActions
					sx={{
						p: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						mt: '24px',
					}}
				>
					{activeStep > 0 && (
						<Button
							variant="outlined"
							disableElevation
							sx={{
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
							onClick={handleBack}
						>
							Back
						</Button>
					)}

					{activeStep !== steps.length - 1 && (
						<Button
							variant="contained"
							disableElevation
							sx={{
								border: 0,
								background: '#2B85FF',
								color: '#FFF',
								textTransform: 'unset',
								fontSize: '0.9375rem',
								fontWeight: 700,
								borderRadius: '12px',
								p: '10px 18px',
								transition: 'all 0.3s',
								'&:hover': {
									background: '#0069f6',
								},
							}}
							onClick={handleNext}
						>
							Next
						</Button>
					)}

					{activeStep === steps.length - 1 && (
						<Button
							variant="contained"
							disableElevation
							sx={{
								border: 0,
								background: '#2B85FF',
								color: '#FFF',
								textTransform: 'unset',
								fontSize: '0.9375rem',
								fontWeight: 700,
								borderRadius: '12px',
								p: '10px 18px',
								transition: 'all 0.3s',
								'&:hover': {
									background: '#0069f6',
								},
							}}
							onClick={saveCategory}
						>
							Create category
						</Button>
					)}
				</DialogActions>
			</>
		</>
	);
};
