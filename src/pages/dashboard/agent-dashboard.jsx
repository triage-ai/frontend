import {
	Box,
	Tab,
	Tabs,
	MenuItem,
	Stack,
	Typography,
	styled,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Settings2, Table } from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { useState, useEffect } from 'react';
import { StyledSelect } from '../settings/SettingsMenus';
import { CircularButton } from '../../components/sidebar';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';


const StyledTabs = styled((props) => <Tabs {...props} TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }} />)({
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
					variant='scrollable'
					scrollButtons='auto'
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
					{headers.map((header) => (
						<Tab label={header.label} sx={{ textTransform: 'none', p: 0, mr: 5 }} />
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

const calculateNewDate = (date, period) => {
	date = dayjs(date)
	switch (period) {
		case 'Up to today':
			return dayjs().format('MM-DD-YYYY');
		case 'One Week':
			return date.add(1, 'week').format('MM-DD-YYYY');
		case 'Two Weeks':
			return date.add(2, 'week').format('MM-DD-YYYY');
		case 'One Month':
			return date.add(1, 'month').format('MM-DD-YYYY');
		case 'One Quarter':
			return date.add(3, 'month').format('MM-DD-YYYY');
		default:
			return date;
	}
};



export const AgentDashboard = () => {
	const headers = [{ id: 1, label: 'Dashboard' }];

	const components = [<Dashboard />];

	return (
		<Layout
			title={'Dashboard'}
			subtitle={'Agent Dashboard'}
			buttonInfo={{
				label: 'Edit Dashboard',
				icon: <Settings2 size={20} />,
			}}
		>
			<Header headers={headers} components={components} />
		</Layout>
	);
};

const Dashboard = () => {
	const { getTicketBetweenDates } = useTicketBackend();
	const [selectedDate, setSelectedDate] = useState(dayjs().subtract(1, 'month'));
	const [selectedPeriod, setSelectedPeriod] = useState('Up to today');
	const [timeData, setTimeData] = useState([]);
	const [tabValue, setTabValue] = useState(0);
	const [ypoints, setypoints] = useState({ y1: [], y2: [], y3: [] });
	const headers = [{ id: 1, label: 'Department' }, { id: 2, label: 'Topics'}, { id: 3, label: 'Agent'}]
	const components = [<Department selectedDate={selectedDate} selectedPeriod={selectedPeriod}/>, <Topics selectedDate={selectedDate} selectedPeriod={selectedPeriod}/>, <Agent selectedDate={selectedDate} selectedPeriod={selectedPeriod}/>]

	const { departments, topics } = useData()
	console.log(departments)
	console.log(topics)
	
	const handleDateChange = (newDate) => {
		setSelectedDate(newDate);
	};

	const handleSelectChange = (event) => {
		setSelectedPeriod(event.target.value);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
	}

	const handleRefresh = async () => {
		try {
			var start_date = selectedDate
			var end_date = calculateNewDate(start_date, selectedPeriod)
			var points = [];
			var y1 = [];
			var y2 = [];
			var y3 = [];
			start_date = dayjs(start_date).format('MM-DD-YYYY');
			let graph_data = await getTicketBetweenDates(start_date, end_date);

			graph_data.data.map((data_point) => {
				points.push(new Date(data_point.date));
				y1.push(data_point.created);
				y2.push(data_point.updated);
				y3.push(data_point.overdue);
			});
			setTimeData([...points]);
			setypoints({ y1: y1, y2: y2, y3: y3 });

		} catch (err) {
			console.error('Error with retrieving the information', err);
		}
	};
	useEffect(() => {
		handleRefresh();
	}, []);

	const valueFormatter = (date) => (
		date.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
		})
	);


	const xAxisCommon = {
		data: timeData,
		scaleType: 'time',
		valueFormatter,
	};

	return (
		<Box>
			<Stack spacing={2} direction='row' alignItems='center' pb={3}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DemoContainer components={['DatePicker']}>
						<DatePicker label='Report Timeframe' value={selectedDate} onChange={handleDateChange} />
					</DemoContainer>
				</LocalizationProvider>

				<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
					Period:
				</Typography>

				<StyledSelect name='default_ticket_number_sequence' value={selectedPeriod} onChange={handleSelectChange} sx={{ width: 200 }}>
					<MenuItem value='Up to today'>Up to today</MenuItem>
					<MenuItem value='One Week'>One Week</MenuItem>
					<MenuItem value='Two Weeks'>Two Weeks</MenuItem>
					<MenuItem value='One Month'>One Month</MenuItem>
					<MenuItem value='One Quarter'>One Quarter</MenuItem>
				</StyledSelect>

				<CircularButton
					sx={{ py: 2, px: 6, width: 250 }}
					onClick={() => handleRefresh(selectedDate, calculateNewDate(selectedDate, selectedPeriod), getTicketBetweenDates)}
				>
					Refresh
				</CircularButton>
			</Stack>
			<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
				Ticket Activity
			</Typography>

			<Box sx={{ maxWidth: 800 }}>
				{
					timeData.length ? ( 
					<LineChart
						xAxis={[
							{
								...xAxisCommon,
								id: 'bottomAxis',
								scaleType: 'time',
								// tickInterval: (time) => time.getHours() === 0,
							},
						]}
						yAxis={[
							{
								id: 'linearAxis',
								scaleType: 'linear',
							}
						]}
						height={300}
						bottomAxis='bottomAxis'
						leftAxis="linearAxis"
						series={[
							{ curve: 'linear', yAxisId: 'linearAxis', label: 'Created', data: ypoints.y1 },
							// { curve: 'linear', , yAxisId: 'linearAxis', label: 'Updated', data: ypoints.y2 },
							// { curve: 'linear', yAxisId: 'linearAxis', label: 'Overdue', data: ypoints.y3 },
						]}
					/>
				) : (<p>No Results Found</p>)
				}
			</Box>

			<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
				Statistics
			</Typography>

			<Box>
				<StyledTabs value={tabValue} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
					<Tab label='Department' />
					<Tab label='Topics' />
					<Tab label='Agent' />
				</StyledTabs>
				
				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</Box>
			

		</Box>
	);
};


const Department = ({selectedPeriod, selectedDate}) => {
	const { getDashboardStats } = useTicketBackend()
	const [dashboardData, setDashboardData] = useState([])

	useEffect(() => {
		const start_date = dayjs(selectedDate).format('MM-DD-YYYY');
		const asyncFn = async () => { 
			let data = await getDashboardStats(start_date, calculateNewDate(selectedDate, selectedPeriod), 'department')
			setDashboardData(data) 
		}
		asyncFn()
		// console.log(dashboardData)
	}, []);

	
	return (
		<p>Department</p>
	)
}

const Topics = ({selectedPeriod, selectedDate}) => {
	return (
		<p>Topics</p>
	)
}

const Agent = ({selectedPeriod, selectedDate}) => {
	return (
		<p>Agent</p>
	)
}