import * as React from 'react';
import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { Box, Checkbox, CircularProgress, FormControlLabel, MenuItem, Stack, Typography } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { CustomTextField } from '../../../components/sidebar-items';
import { handleSave } from '../SettingsMenus';
import { CustomFilledInput } from '../../../components/custom-input';
import { StyledSelect } from '../SettingsMenus';
import { CircularButton } from '../../../components/sidebar';
import { CircleHelp } from 'lucide-react';
import { styled } from '@mui/material/styles';


export const TaskSettings = props => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		default_task_number_format: settingsData.default_task_number_format.value,
		default_task_number_sequence: settingsData.default_task_number_sequence.value,
		default_task_priority: settingsData.default_task_priority.value,
	});

	const handleChange = (entry) => {
		console.log(formState);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const handleCheckBox = (event) => {
		console.log(event);

		setFormState({
			...formState,
			[event.target.name]: event.target.checked ? 'on' : 'off',
		});

		setLoading(false);
	};

	const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: '#f5f5f9',
			color: 'rgba(0, 0, 0, 0.87)',
			maxWidth: 200,
			fontSize: theme.typography.pxToRem(12),
			border: '1px solid #dadde9',
		},
	}));

	return (
		<Box p={3} maxWidth={600}>
			<Stack>
				<Stack direction='row' alignItems='center' spacing={8}>
					<CustomFilledInput
						label='Default Task Number Format'
						name='default_task_number_format'
						value={formState.default_task_number_format}
						onChange={handleChange}
						maxWidth={400}
					/>

					<HtmlTooltip
						title={
							<React.Fragment>
								<Typography color='inherit'>Task Number Format</Typography>
								{"This sequence will be used to generated task numbers. Use hash signs ('#')"}
								{' where digits will be expected in the sequence.'}{' '}
								<b>
									{'Anything other than hash signs'}
									{' will be preserved in the format.'}
								</b>
								<br />
								<br />
								{'For example, for six-digit only formats, use ######. This could produce a number like 123456.'}
							</React.Fragment>
						}
						placement='right'
						arrow
					>
						<CircleHelp size={20} />
					</HtmlTooltip>
				</Stack>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Task Number Sequence
				</Typography>
				<StyledSelect
					name='default_task_number_sequence'
					value={formState.default_task_number_sequence}
					onChange={handleChange}
					sx={{ width: 200 }}
				>
					<MenuItem value='Random'>Random</MenuItem>
					<MenuItem value='Incrementing'>Incrementing</MenuItem>
				</StyledSelect>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Priority
				</Typography>
				<StyledSelect name='default_task_priority' value={formState.default_task_priority} onChange={handleChange} sx={{ width: 350, mb: 4 }}>
					<MenuItem value='Low'>Low</MenuItem>
					<MenuItem value='Normal'>Normal</MenuItem>
					<MenuItem value='High'>High</MenuItem>
					<MenuItem value='Emergency'>Emergency</MenuItem>
				</StyledSelect>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</CircularButton>
			</Stack>
		</Box>
	)
};