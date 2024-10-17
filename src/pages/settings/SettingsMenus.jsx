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
	Tabs,
	Tab,
} from '@mui/material';
import { AlignRight, Settings, Settings2 } from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useContext, useEffect, useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
import { useLocation } from 'react-router-dom';
import { SearchTextField } from '../agent/Agents';
import { GeneralSettings } from './GeneralSettings';
import zIndex from '@mui/material/styles/zIndex';
import { DateAndTime } from './DateTimeSettings';
import { SystemLanguages } from './SystemLanguages';
import { Attachments } from './AttachmentsSettings';
import { BasicInformation } from './CompanyBasicInfo';

export const handleSave = async (
	data,
	setLoading,
	setCircleLoading,
	settingsData,
	updateSettings,
	refreshSettings
) => {
	try {
		var updates = [];
		Object.entries(data).forEach(k => {
			console.log(settingsData);
			var row = settingsData[k[0]];
			row.value = k[1];
			updates.push(row);
		});
		console.log(updates);
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

const StyledTabs = styled(props => (
	<Tabs
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))({
	'& .Mui-selected': {
		color: '#22874E',
	},
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '2px',
	},
	'& .MuiTabs-indicatorSpan': {
		width: '100%',
		height: '2px',
		backgroundColor: '#22874E',
	},
});

const Header = ({ headers, components }) => {
	// const [menuState, setMenuState] = useState(headers[0].id);
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// const handleMenuChange = newMenuState => {
	// 	setMenuState(newMenuState);
	// };

	return (
		<Box>
			{/* Tab Bar */}
			<Box
				sx={{
					display: 'flex',
					mb: 4,
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant="scrollable"
					scrollButtons="auto"
					sx={{
						position: 'relative',
						width: '100%',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: '100%',
							height: '2px',
							background: '#E5EFE9',
							zIndex: -1,
						},
					}}
				>
					{headers.map(header => (
						<Tab
							label={header.label}
							sx={{ textTransform: 'none', p: 0, mr: 5 }}
						/>
					))}
				</StyledTabs>
			</Box>

			{/* Tab Content */}
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</WhiteContainer>
		</Box>
	);
};

export const SystemMenu = props => {
	const { settingsData } = props;

	const headers = [
		{ id: 1, label: 'General Settings' },
		{ id: 2, label: 'Date and Time Options' },
		{ id: 3, label: 'System Languages' },
		{ id: 4, label: 'Attachment Storage and Settings' },
	];

	const components = [
		<GeneralSettings {...props} />,
		<DateAndTime {...props} />,
		<SystemLanguages {...props} />,
		<Attachments {...props} />,
	];

	return (
		<Header
			headers={headers}
			components={components}
		/>
	);
};

export const CompanyMenu = props => {
	const { settingsData } = props;

	const headers = [
		{ id: 1, label: 'Basic Information' },
		// { id: 2, label: 'Site Pages' },
		// { id: 3, label: 'Logos' },
		// { id: 4, label: 'Login Backdrop' },
	];

	const components = [
		<BasicInformation {...props} />,
		// 2: <SitePages {...props} />,
		// 3: <Logos {...props} />,
		// 4: <LoginBackdrop {...props} />
	];

	return (
		<Header
			headers={headers}
			components={components}
		/>
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

export const TicketMenu = props => {
	return <p>This is a test of Ticket Settings</p>;
};

export const AgentMenu = props => {
	return <p>This is a test of Agent Settings</p>;
};

export const TaskMenu = props => {
	return <p>This is a test of Task Settings</p>;
};

export const UserMenu = props => {
	return <p>This is a test of User Settings</p>;
};

export const KnowledgebaseMenu = props => {
	return <p>This is a test of Knowledgebase Settings</p>;
};
