import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	FormControlLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from '@mui/material';
import { handleSave } from './SettingsMenus';
import { StyledSelect } from './GeneralSettings';
import { CircularButton } from '../../components/sidebar';



export const TicketSettings = props => {
	const { settingsData } = props;
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
    const [formState, setFormState] = useState({
        // default_ticket_number_format: settingsData.default_ticket_number_format.value,
        // default_ticket_number_sequence: settingsData.default_ticket_number_sequence.value,
        // top_level_ticket_counts: settingsData.top_level_ticket_counts.value,
        // default_status: settingsData.default_status.value,
        // default_priority: settingsData.default_priority.value,
        // default_sla: settingsData.default_sla.value,
        // default_help_topic: settingsData.default_help_topic.value,
        // lock_semantics: settingsData.lock_semantics.value,
        // default_ticket_queue: settingsData.default_ticket_queue.value,
        // max_open_tickets: settingsData.max_open_tickets.value,
        // human_verification: settingsData.human_verification.value,
        // collaborator_tickets_visibility: settingsData.collaborator_tickets_visibility.value,
        // claim_on_response: settingsData.claim_on_response.value,
        // auto_refer_on_close: settingsData.auto_refer_on_close.value,
        // require_help_topic_to_close: settingsData.require_help_topic_to_close.value,
        // allow_external_images: settingsData.allow_external_images.value,
	});

    const handleChange = (entry) => {
		console.log(entry);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const handleCheckBox = (event) => {
		console.log(event)


		setFormState({
			...formState,
			[event.target.name]: (event.target.checked ? 'on' : 'off'),
		});
    

		setLoading(false);
	};

    return (
        <Box p={3}>
			<Stack spacing={2} sx={{ maxWidth: 600, mt: 2 }}>
                <TextField label='Default Ticket Number Format' name='default_ticket_number_format' value={formState.default_ticket_number_format} onChange={handleChange} />

                <Typography variant='subtitle1'>Default Ticket Number Sequence:</Typography>
                <Select name='default_ticket_number_sequence' value={formState.default_ticket_number_sequence} onChange={handleChange} sx={{ width: 200 }}>
                    <MenuItem value='Random'>Random</MenuItem>
                    <MenuItem value='Incrementing'>Incrementing</MenuItem>
                </Select>

                <Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='subtitle1'>Top-Level Ticket Counts:</Typography>
					<FormControlLabel
						name='top_level_ticket_counts'
						control={<Checkbox checked={formState.top_level_ticket_counts === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable'
					/>
				</Stack>

                <Typography variant='subtitle1'>Default Status:</Typography>
                <Select name='default_status' value={formState.default_status} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='Open'>Open</MenuItem>
                </Select>

                <Typography variant='subtitle1'>Default Priority:</Typography>
                <Select name='default_priority' value={formState.default_priority} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='Low'>Low</MenuItem>
                    <MenuItem value='Normal'>Normal</MenuItem>
                    <MenuItem value='High'>High</MenuItem>
                    <MenuItem value='Emergency'>Emergency</MenuItem>
                </Select>

                <Typography variant='subtitle1'>Default SLA:</Typography>
                <Select name='default_sla' value={formState.default_sla} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='None'>None</MenuItem>
                    <MenuItem value='Default'>Default SLA (18 Hours - Active)</MenuItem>
                </Select>

                <Typography variant='subtitle1'>Default Help Topic:</Typography>
                <Select name='default_help_topic' value={formState.default_help_topic} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='None'>None</MenuItem>
                    <MenuItem value='Feedback'>Feedback</MenuItem>
                    <MenuItem value='General Inquiry'>General Inquiry</MenuItem>
                    <MenuItem value='Report a Problem'>Report a Problem</MenuItem>
                    <MenuItem value='Report a Problem / Access Issue'>Report a Problem / Access Issue</MenuItem>
                </Select>

                <Typography variant='subtitle1'>Lock Semantics:</Typography>
                <Select name='lock_semantics' value={formState.lock_semantics} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='Disabled'>Disabled</MenuItem>
                    <MenuItem value='Lock on view'>Lock on view</MenuItem>
                    <MenuItem value='Lock on activity'>Lock on activity</MenuItem>
                </Select>

                <Typography variant='subtitle1'>Default Ticket Queue:</Typography>
                <Select name='default_ticket_queue' value={formState.default_ticket_queue} onChange={handleChange} sx={{ width: 350 }}>
                    <MenuItem value='Open'>Open</MenuItem>
                    <MenuItem value='Open / Open'>Open / Open</MenuItem>
                    <MenuItem value='My Tickets / Assigned to Me'>My Tickets / Assigned to Me</MenuItem>
                    <MenuItem value='Closed / Today'>Closed / Today</MenuItem>
                    <MenuItem value='Open / Answered'>Open / Answered</MenuItem>
                    <MenuItem value='My Tickets / Assigned to Teams'>My Tickets / Assigned to Teams</MenuItem>
                    <MenuItem value='Closed / Yesterday'>Closed / Yesterday</MenuItem>
                    <MenuItem value='Open / Overdue'>Open / Overdue</MenuItem>
                    <MenuItem value='My Tickets'>My Tickets</MenuItem>
                    <MenuItem value='Closed / This Week'>Closed / This Week</MenuItem>
                    <MenuItem value='Closed'>Closed</MenuItem>
                    <MenuItem value='Closed / This Month'>Closed / This Month</MenuItem>
                    <MenuItem value='Closed / This Quarter'>Closed / This Quarter</MenuItem>
                    <MenuItem value='Closed / This Year'>Closed / This Year</MenuItem>
                </Select>

                <Stack spacing={2}>
					<Typography variant='subtitle1'>Maximum Open Tickets:</Typography>
					<Stack direction='row' spacing={2} alignItems='center'>
						<TextField
							type='number'
							name='max_open_tickets'
							value={formState.max_open_tickets}
							onChange={handleChange}
							sx={{ width: 80 }}
						/>
						<Typography variant='subtitle1'>per end user</Typography>
					</Stack>
				</Stack>

                <Stack spacing={2}>
                    <Stack direction='row' spacing={10.3} alignItems='center'>
                        <Typography variant='subtitle1'>Human Verification:</Typography>
                        <FormControlLabel
                            name='human_verification'
                            control={<Checkbox checked={formState.human_verification === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable CAPTCHA on new web tickets'
                        />
                    </Stack>

                    <Stack direction='row' spacing={2} alignItems='center'>
                        <Typography variant='subtitle1'>Collaborator Tickets Visibility:</Typography>
                        <FormControlLabel
                            name='collaborator_tickets_visibility'
                            control={<Checkbox checked={formState.collaborator_tickets_visibility === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable'
                        />
                    </Stack>

                    <Stack direction='row' spacing={10.2} alignItems='center'>
                        <Typography variant='subtitle1'>Claim on Response:</Typography>
                        <FormControlLabel
                            name='claim_on_response'
                            control={<Checkbox checked={formState.claim_on_response === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable'
                        />
                    </Stack>

                    <Stack direction='row' spacing={10} alignItems='center'>
                        <Typography variant='subtitle1'>Auto-refer on Close:</Typography>
                        <FormControlLabel
                            name='auto_refer_on_close'
                            control={<Checkbox checked={formState.auto_refer_on_close === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable'
                        />
                    </Stack>

                    <Stack direction='row' spacing={3} alignItems='center'>
                        <Typography variant='subtitle1'>Require Help Topic to Close:</Typography>
                        <FormControlLabel
                            name='require_help_topic_to_close'
                            control={<Checkbox checked={formState.require_help_topic_to_close === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable'
                        />
                    </Stack>

                    <Stack direction='row' spacing={8} alignItems='center'>
                        <Typography variant='subtitle1'>Allow External Images:</Typography>
                        <FormControlLabel
                            name='allow_external_images'
                            control={<Checkbox checked={formState.allow_external_images === 'on' ? true : false} onChange={handleCheckBox} />}
                            label='Enable'
                        />
                    </Stack>
                </Stack>


                <Button
					variant='contained'
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
					sx={{ width: 200 }}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</Button>




            </Stack>
        </Box>
    )
}