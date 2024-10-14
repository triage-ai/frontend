import {
	Box,
	Button,
	Grid,
	CircularProgress,
	Dialog,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Checkbox,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	inputLabelClasses,
	styled,
} from '@mui/material';
import { AlignRight, Settings, Settings2 } from 'lucide-react';
import jstz from 'jstz';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useContext, useEffect, useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import { useLocation } from 'react-router-dom';
import { SearchTextField } from '../agent/Agents';

const handleSave = async (data, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings) => {
	try {
		var updates = [];
		Object.entries(data).forEach((k) => {
			console.log(settingsData);
			var row = settingsData[k[0]];
			row.value = k[1];
			updates.push(row);
		});
        console.log(updates)
		setCircleLoading(true);
		await updateSettings(updates);
		await refreshSettings();
		setCircleLoading(false);
		setLoading(true);
		// window.location.reload();
	} catch (err) {
		console.error('Error saving settings:', err);
	}
};

const Header = ({ headers, components }) => {
	const [menuState, setMenuState] = useState(headers[0].id);

	const handleMenuChange = (newMenuState) => {
		setMenuState(newMenuState);
	};

	return (
		<Box>
			{/* Tab Bar */}
			<Box sx={{ display: 'flex', borderBottom: '1px solid lightgrey' }}>
				{headers.map((header) => {
					return (
						<Button
							onClick={() => handleMenuChange(header.id)}
							variant={menuState === header.id ? 'contained' : 'text'}
							style={{ textTransform: 'none' }}
						>
							{header.label}
						</Button>
					);
				})}
			</Box>
			{/* Tab Content */}
			<Box sx={{ padding: 2 }}>{components[menuState]}</Box>
		</Box>
	);
};

export const SystemMenu = (props) => {
	const { settingsData } = props;

	const headers = [
		{ id: 1, label: 'General Settings' },
		{ id: 2, label: 'Date and Time Options' },
		{ id: 3, label: 'System Languages' },
		{ id: 4, label: 'Attachment Storage and Settings' },
	];

	const components = {
		1: <GeneralSettings {...props} />,
		2: <DateAndTime {...props} />,
		3: <SystemLanguages {...props} />,
		4: <Attachments {...props} />,
	};
	return <Header headers={headers} components={components} />;
};

const GeneralSettings = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		helpdesk_status: settingsData.helpdesk_status.value,
		helpdesk_url: settingsData.helpdesk_url.value || '',
		helpdesk_name: settingsData.helpdesk_name.value || '',
		default_department: settingsData.default_department.value,
		force_http: settingsData.force_http.value,
		collision_avoidance_duration: settingsData.collision_avoidance_duration.value || '',
		default_page_size: settingsData.default_page_size.value,
		default_log_level: settingsData.default_log_level.value,
		purge_logs: settingsData.purge_logs.value,
		show_avatars: settingsData.show_avatars.value || '',
		enable_rich_text: settingsData.enable_rich_text.value || '',
		allow_system_iframe: settingsData.allow_system_iframe.value || '',
		embedded_domain_whitelist: settingsData.embedded_domain_whitelist.value || '',
		acl: settingsData.acl.value || '',
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
		console.log(event)

		setFormState({
			...formState,
			[event.target.name]: (event.target.checked ? 'on' : 'off'),
		});
    

		setLoading(false);
	};

	return (
		<Box p={3}>
			<Stack direction='row' spacing={2} alignItems='center'>
				<Typography variant='subtitle1'>Help Desk Status:</Typography>
				<RadioGroup row value={formState.helpdesk_status} onChange={handleChange} name='helpdesk_status'>
					<FormControlLabel value='online' control={<Radio />} label='Online' />
					<FormControlLabel value='offline' control={<Radio />} label='Offline' />
				</RadioGroup>
			</Stack>

			<Stack spacing={2} sx={{ maxWidth: 600, mt: 2 }}>
				<TextField label='Helpdesk URL' name='helpdesk_url' value={formState.helpdesk_url} onChange={handleChange} />

				<TextField label='Helpdesk Name/Title' name='helpdesk_name' value={formState.helpdesk_name} onChange={handleChange} />

				<FormControl>
					<Typography variant='subtitle1'>Default Department:</Typography>
					<Select name='default_department' value={formState.default_department} onChange={handleChange}>
						<MenuItem value='Support'>Support</MenuItem>
						<MenuItem value='Sales'>Sales</MenuItem>
						<MenuItem value='HR'>HR</MenuItem>
					</Select>
				</FormControl>

				<Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='subtitle1'>Force HTTP:</Typography>
					<FormControlLabel
						name='force_http'
						control={<Checkbox checked={formState.force_http === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Force all requests through HTTPS.'
					/>
				</Stack>

				<Stack spacing={2}>
					<Typography variant='subtitle1'>Collision Avoidance Duration:</Typography>
					<Stack direction='row' spacing={2} alignItems='center'>
						<TextField
							type='number'
							name='collision_avoidance_duration'
							value={formState.collision_avoidance_duration}
							onChange={handleChange}
							sx={{ width: 60 }}
						/>
						<Typography variant='subtitle1'>minutes</Typography>
					</Stack>
				</Stack>

				<FormControl>
					<Typography variant='subtitle1'>Default Page Size:</Typography>
					<Select name='default_page_size' value={formState.default_page_size} onChange={handleChange} sx={{ width: 80 }}>
						<MenuItem value='5'>5</MenuItem>
						<MenuItem value='10'>10</MenuItem>
						<MenuItem value='15'>15</MenuItem>
						<MenuItem value='20'>20</MenuItem>
						<MenuItem value='25'>25</MenuItem>
						<MenuItem value='30'>30</MenuItem>
						<MenuItem value='35'>35</MenuItem>
						<MenuItem value='40'>40</MenuItem>
						<MenuItem value='45'>45</MenuItem>
						<MenuItem value='50'>50</MenuItem>
					</Select>
				</FormControl>

				<FormControl>
					<Typography variant='subtitle1'>Default Log Level:</Typography>
					<Select name='default_log_level' value={formState.default_log_level} onChange={handleChange}>
						<MenuItem value='DEBUG'>DEBUG</MenuItem>
						<MenuItem value='WARN'>WARN</MenuItem>
						<MenuItem value='ERROR'>ERROR</MenuItem>
					</Select>
				</FormControl>

				<FormControl>
					<Typography variant='subtitle1'>Purge Logs:</Typography>
					<Select name='purge_logs' value={formState.purge_logs} onChange={handleChange}>
						<MenuItem value='0'>Never Purge Logs</MenuItem>
						<MenuItem value='1'>After 1 month</MenuItem>
						<MenuItem value='2'>After 2 months</MenuItem>
						<MenuItem value='3'>After 3 months</MenuItem>
						<MenuItem value='4'>After 4 months</MenuItem>
						<MenuItem value='5'>After 5 months</MenuItem>
						<MenuItem value='6'>After 6 months</MenuItem>
						<MenuItem value='7'>After 7 months</MenuItem>
						<MenuItem value='8'>After 8 months</MenuItem>
						<MenuItem value='9'>After 9 months</MenuItem>
						<MenuItem value='10'>After 10 months</MenuItem>
						<MenuItem value='11'>After 11 months</MenuItem>
						<MenuItem value='12'>After 12 months</MenuItem>
					</Select>
				</FormControl>

				<Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='subtitle1'>Show Avatars:</Typography>
					<FormControlLabel
						name='show_avatars'
						control={<Checkbox checked={formState.show_avatars === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Show avatars on thread view.'
					/>
				</Stack>

				<Stack direction='row' spacing={0.4} alignItems='center'>
					<Typography variant='subtitle1'>Enable Rich Text:</Typography>
					<FormControlLabel
						name='enable_rich_text'
						control={<Checkbox checked={formState.enable_rich_text === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Enable html in thread entries and email correspondence.'
					/>
				</Stack>

				<TextField label='Allow System iFrame' name='allow_system_iframe' value={formState.allow_system_iframe} onChange={handleChange} />

				<TextField
					label='Embedded Domain Whitelist'
					name='embedded_domain_whitelist'
					value={formState.embedded_domain_whitelist}
					onChange={handleChange}
				/>

				<TextField label='ACL' name='acl' value={formState.acl} onChange={handleChange} />

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
	);
};

const DateAndTime = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		default_timezone: settingsData.default_timezone.value,
		date_and_time_format: settingsData.date_and_time_format.value,
		default_schedule: settingsData.default_schedule.value,
	});
	var TimeZoneArray = Intl.supportedValuesOf('timeZone');
	TimeZoneArray.push('UTC');

	const handleChange = (entry) => {
		console.log(entry);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};


	const handleLocationDetect = () => {
		const timezone = jstz.determine();
		console.log(timezone.name());
		handleChange({ target: { name: 'default_timezone', value: timezone.name() } });
	};

	return (
		<Box p={3}>
			<Stack spacing={2} sx={{ maxWidth: 600, mt: 2 }}>
				<Stack direction='row' spacing={2} alignItems='center'>
					<FormControl>
						<Typography variant='subtitle1'>Default Time Zone:</Typography>
						<Select name='default_timezone' value={formState.default_timezone} onChange={handleChange}>
							{TimeZoneArray.map((zone) => {
								return <MenuItem value={zone}>{zone}</MenuItem>;
							})}
						</Select>
					</FormControl>

					<Button type='button' onClick={handleLocationDetect} variant='contained'>
						Auto Detect
					</Button>
				</Stack>

				<FormControl>
					<Typography variant='subtitle1'>Date and Time Format:</Typography>
					<Select name='date_and_time_format' value={formState.date_and_time_format} onChange={handleChange}>
						<MenuItem value='Locale Defaults'>Locale Defaults</MenuItem>
						<MenuItem value='Locale Defaults, 24-Hour Time'>Locale Defaults, 24-Hour Time</MenuItem>
					</Select>
				</FormControl>

				<FormControl>
					<Typography variant='subtitle1'>Default Schedule:</Typography>
					<Select name='default_schedule' value={formState.default_schedule} onChange={handleChange}>
						<MenuItem value='24/5'>24/5</MenuItem>
						<MenuItem value='24/7'>24/7</MenuItem>
						<MenuItem value='Monday - Friday 8am - 5pm with U.S. Holidays'>Monday - Friday 8am - 5pm with U.S. Holidays</MenuItem>
					</Select>
				</FormControl>

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
	);
};

const SystemLanguages = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		primary_langauge: settingsData.primary_langauge.value,
		secondary_langauge: settingsData.secondary_langauge.value,
	});

	const handleChange = (entry) => {
		console.log(entry);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};


	return (
		<Box p={3}>
			<Stack spacing={2} sx={{ maxWidth: 600, mt: 2 }}>
				<FormControl>
					<Typography variant='subtitle1'>Primary Language:</Typography>
					<Select name='primary_langauge' value={formState.primary_langauge} onChange={handleChange}>
						<MenuItem value='English - US (English)'>English - US (English)</MenuItem>
					</Select>
				</FormControl>

				<FormControl>
					<Typography variant='subtitle1'>Secondary Language:</Typography>
					<Select name='secondary_langauge' value={formState.secondary_langauge} onChange={handleChange}>
						<MenuItem value='--Add a Langauge--'>--Add a Langauge--</MenuItem>
                        <MenuItem value='English - US (English)'>English - US (English)</MenuItem>
					</Select>
				</FormControl>

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
	);
};

const Attachments = (props) => {
	const { settingsData } = props;
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [loading, setLoading] = useState(true);
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		store_attachments: settingsData.store_attachments.value,
		agent_max_file_size: settingsData.agent_max_file_size.value,
		login_required: settingsData.login_required.value,
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
				<FormControl>
					<Typography variant='subtitle1'>Store Attachments:</Typography>
					<Select name='store_attachments' value={formState.store_attachments} onChange={handleChange}>
						<MenuItem value='database'>In the database</MenuItem>
					</Select>
				</FormControl>

				<FormControl>
					<Typography variant='subtitle1'>Agent Maximum File Size:</Typography>
					<Select name='agent_max_file_size' value={formState.agent_max_file_size} onChange={handleChange}>
						<MenuItem value='512 kb'>512 kb</MenuItem>
						<MenuItem value='1 mb'>1 mb</MenuItem>
						<MenuItem value='2 mb'>2 mb</MenuItem>
					</Select>
				</FormControl>

				<Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='subtitle1'>Login Required:</Typography>
					<FormControlLabel
						name='login_required'
						control={<Checkbox checked={formState.login_required === 'on' ? true : false} onChange={handleCheckBox} />}
						label='Require login to view any attachments.'
					/>
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
	);
};

export const CompanyMenu = (props) => {
	const { settingsData } = props;

	const headers = [
		{ id: 1, label: 'Basic Information' },
		// { id: 2, label: 'Site Pages' },
		// { id: 3, label: 'Logos' },
		// { id: 4, label: 'Login Backdrop' },
	];

	const components = {
		1: <BasicInformation {...props} />,
		// 2: <SitePages {...props} />,
		// 3: <Logos {...props} />,
		// 4: <LoginBackdrop {...props} />
	};
	return <Header headers={headers} components={components} />;
};

const BasicInformation = (props) => {
	const { settingsData } = props;
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	const { refreshSettings } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
	const [formState, setFormState] = useState({
		company_name: settingsData.company_name.value || '',
		website: settingsData.website.value || '',
		phone_number: settingsData.phone_number.value || '',
		address: settingsData.address.value || '',
	});

	const handleChange = (entry) => {
		console.log(formState);
		setFormState({
			...formState,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ pb: 2 }}>
				Company Information
			</Typography>
			<Stack spacing={2} sx={{ maxWidth: 400, maxHeight: 1000 }}>
				<TextField label='Company Name' name='company_name' value={formState.company_name} onChange={handleChange} />
				<TextField label='Website' name='website' value={formState.website} onChange={handleChange} />
				<TextField label='Phone Number' name='phone_number' value={formState.phone_number} onChange={handleChange} />
				<TextField label='Address' multiline rows={3} name='address' value={formState.address} onChange={handleChange} sx={{ pb: 2 }} />
				<Button
					variant='contained'
					onClick={() => handleSave(formState, setLoading, setCircleLoading, settingsData, updateSettings, refreshSettings)}
					disabled={loading || circleLoading}
				>
					{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
				</Button>
			</Stack>
		</Box>
	);
};

// const SitePages = () => {
//     return (
//         <Box>
//         <Typography variant='h6'>Site Pages</Typography>
//         <FormControl fullWidth margin='normal'>
//             <InputLabel>Landing Page</InputLabel>
//             <Select
//                 name='landing_page'
//                 // value={formState.landingPage}
//                 // onChange={handleChange}
//             >
//                 <MenuItem value='Landing'>Landing</MenuItem>
//                 <MenuItem value='Home'>Home</MenuItem>
//             </Select>
//         </FormControl>
//         <FormControl fullWidth margin='normal'>
//             <InputLabel>Offline Page</InputLabel>
//             <Select
//                 name='offline_page'
//                 // value={formState.offlinePage}
//                 // onChange={handleChange}
//                 >
//                 <MenuItem value='Offline'>Offline</MenuItem>
//                 <MenuItem value='Error'>Error</MenuItem>
//             </Select>
//         </FormControl>
//         <FormControl fullWidth margin='normal'>
//             <InputLabel>Default Thank-You Page</InputLabel>
//             <Select
//                 name='thank_you_page'
//                 // value={formState.thankYouPage}
//                 // onChange={handleChange}
//                 >
//                 <MenuItem value='Thank You'>Thank You</MenuItem>
//                 <MenuItem value='Success'>Success</MenuItem>
//             </Select>
//         </FormControl>
//         <Button variant='contained'>
//                 Save Changes
//         </Button>
//     </Box>
//     )
// }

// const Logos = () => {
//     return (
//         <Box>
//         <Typography variant='h6'>Company Logos</Typography>
//         <Grid container spacing={2}>
//             <Grid item xs={12}>
//                 <Button variant='contained' component='label'>
//                     Upload Logo
//                     <input hidden accept='image/*' type='file' />
//                 </Button>
//             </Grid>
//             {(
//                 <Grid item xs={12}>
//                     <Typography>Selected File: </Typography>
//                 </Grid>
//             )}
//         </Grid>
//     </Box>
//     )
// }

// const LoginBackdrop = () => {
//     return (
//         <Box>
//         <Typography variant='h6'>Login Backdrop</Typography>
//         <Grid container spacing={2}>
//             <Grid item xs={12}>
//                 <Button variant='contained' component='label'>
//                     Upload Backdrop Image
//                     <input hidden accept='image/*' type='file'/>
//                 </Button>
//             </Grid>
//             {(
//                 <Grid item xs={12}>
//                     <Typography>Selected File:</Typography>
//                 </Grid>
//             )}
//         </Grid>
//     </Box>
//     )
// }

export const TicketMenu = (props) => {
	return <p>This is a test of Ticket Settings</p>;
};

export const AgentMenu = (props) => {
	return <p>This is a test of Agent Settings</p>;
};

export const TaskMenu = (props) => {
	return <p>This is a test of Task Settings</p>;
};

export const UserMenu = (props) => {
	return <p>This is a test of User Settings</p>;
};

export const KnowledgebaseMenu = (props) => {
	return <p>This is a test of Knowledgebase Settings</p>;
};
