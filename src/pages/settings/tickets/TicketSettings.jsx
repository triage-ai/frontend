import { Box, Checkbox, CircularProgress, FormControlLabel, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { CircleHelp } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { CustomTextField } from '../../../components/sidebar-items';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { PrioritySelect } from '../../priority/PrioritySelect';
import { SLASelect } from '../../sla/SLASelect';
import { StatusSelect } from '../../status/StatusSelect';
import { TopicSelect } from '../../topic/TopicSelect';
import { handleSave, StyledSelect } from '../SettingsMenus';

const storedAuthState = localStorage.getItem('agentAuthState');


export const TicketSettings = (props) => {
	const { settingsData } = props;
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		default_ticket_number_format: settingsData.default_ticket_number_format.value,
		default_ticket_number_sequence: settingsData.default_ticket_number_sequence.value,
		top_level_ticket_counts: settingsData.top_level_ticket_counts.value,
		status_id: settingsData.default_status_id.value,
		priority_id: settingsData.default_priority_id.value,
		sla_id: settingsData.default_sla_id.value,
		topic_id: settingsData.default_topic_id.value,
		lock_semantics: settingsData.lock_semantics.value,
		default_ticket_queue: settingsData.default_ticket_queue.value,
		max_open_tickets: settingsData.max_open_tickets.value,
		human_verification: settingsData.human_verification.value,
		collaborator_tickets_visibility: settingsData.collaborator_tickets_visibility.value,
		claim_on_response: settingsData.claim_on_response.value,
		auto_refer_on_close: settingsData.auto_refer_on_close.value,
		require_help_topic_to_close: settingsData.require_help_topic_to_close.value,
		allow_external_images: settingsData.allow_external_images.value,
	});

	const handleChange = (entry) => {
		setFormState(formState => ({
			...formState,
			[entry.target.name]: entry.target.value,
		}));

		setLoading(false);
	};

	const handleCheckBox = (event) => {

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
			fontSize: theme.typography.pxToRem(12),
			border: '1px solid #dadde9',
		},
	}));

	return (
		<Box p={3} maxwidth={600}>
			<Stack>
				<Stack direction='row' alignItems='center' spacing={8}>
					<CustomFilledInput
						label='Default Ticket Number Format'
						name='default_ticket_number_format'
						value={formState.default_ticket_number_format}
						onChange={handleChange}
						maxWidth={400}
					/>

					<HtmlTooltip
						title={
							<React.Fragment>
								<Typography color='inherit'>Ticket Number Format</Typography>
								{"This sequence will be used to generated ticket numbers. Use hash signs ('#')"}
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
					Default Ticket Number Sequence
				</Typography>
				<StyledSelect
					name='default_ticket_number_sequence'
					value={formState.default_ticket_number_sequence}
					onChange={handleChange}
					sx={{ width: 200 }}
				>
					<MenuItem value='Random'>Random</MenuItem>
					<MenuItem value='Incrementing'>Incrementing</MenuItem>
				</StyledSelect>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Top-Level Ticket Counts
					</Typography>
					<FormControlLabel
						name='top_level_ticket_counts'
						control={<Checkbox checked={formState.top_level_ticket_counts === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<Stack sx={{ width: 200 }}>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Default Status
					</Typography>
					<StatusSelect
						handleInputChange={handleChange}
						value={formState.status_id}
						sx={{ width: 200 }}
					/>
				</Stack>

				<Stack sx={{ width: 200 }}>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Default Priority
					</Typography>
					<PrioritySelect
						handleInputChange={handleChange}
						value={formState.priority_id}
						sx={{ width: 200 }}
					/>
				</Stack>

				<Stack sx={{ width: 200 }}>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Default SLA
					</Typography>
					<SLASelect
						handleInputChange={handleChange}
						value={formState.sla_id}
					/>
				</Stack>

				<Stack sx={{ width: 200 }}>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Default Help Topic
					</Typography>
					<TopicSelect
						handleInputChange={handleChange}
						value={formState.topic_id}
						sx={{ width: 200 }}
					/>
				</Stack>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Lock Semantics
				</Typography>
				<StyledSelect name='lock_semantics' value={formState.lock_semantics} onChange={handleChange} sx={{ width: 350 }}>
					<MenuItem value='Disabled'>Disabled</MenuItem>
					<MenuItem value='Lock on view'>Lock on view</MenuItem>
					<MenuItem value='Lock on activity'>Lock on activity</MenuItem>
				</StyledSelect>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
					Default Ticket Queue
				</Typography>
				<StyledSelect name='default_ticket_queue' value={formState.default_ticket_queue} onChange={handleChange} sx={{ width: 350 }}>
					<MenuItem value='Open'>Open</MenuItem>
					<MenuItem value='Closed'>Closed</MenuItem>
					<MenuItem value='Unanswered'>Unanswered</MenuItem>
					<MenuItem value='Overdue'>Overdue</MenuItem>
					<MenuItem value='My Tickets'>My Tickets</MenuItem>
					<MenuItem value='Today'>Today</MenuItem>
					<MenuItem value='This Week'>This Week</MenuItem>
					<MenuItem value='This Month'>This Month</MenuItem>
					<MenuItem value='This Year'>This Year</MenuItem>
				</StyledSelect>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Maximum Open Tickets
					</Typography>

					<Stack direction='row' spacing={2} alignItems='center'>
						<CustomTextField
							type='number'
							name='max_open_tickets'
							value={formState.max_open_tickets}
							onChange={handleChange}
							sx={{
								width: 80,
								'& .MuiInputBase-root': {
									borderWidth: 1,
									fontWeight: 500,
								},
							}}
						/>
						<Typography variant='subtitle1'>per end user</Typography>
					</Stack>
				</Stack>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Human Verification
					</Typography>
					<FormControlLabel
						name='human_verification'
						control={<Checkbox checked={formState.human_verification === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable CAPTCHA on new web tickets'
					/>
				</Stack>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Collaborator Tickets Visibility
					</Typography>
					<FormControlLabel
						name='collaborator_tickets_visibility'
						control={<Checkbox checked={formState.collaborator_tickets_visibility === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Claim on Response
					</Typography>
					<FormControlLabel
						name='claim_on_response'
						control={<Checkbox checked={formState.claim_on_response === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Auto-refer on Close
					</Typography>
					<FormControlLabel
						name='auto_refer_on_close'
						control={<Checkbox checked={formState.auto_refer_on_close === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<Stack>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Require Help Topic to Close
					</Typography>
					<FormControlLabel
						name='require_help_topic_to_close'
						control={<Checkbox checked={formState.require_help_topic_to_close === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<Stack sx={{ pb: 3 }}>
					<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 1.5 }}>
						Allow External Images
					</Typography>
					<FormControlLabel
						name='allow_external_images'
						control={<Checkbox checked={formState.allow_external_images === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</CircularButton>
			</Stack>
		</Box>
	);
};
