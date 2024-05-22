import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/sidebar';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Divider,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	styled,
} from '@mui/material';
import { TableColorBox } from '../build/build';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Footer } from '../../components/footer';
import { CustomTextField } from '../../components/sidebar-items';
import { RoutingDialog } from './routing-dialog';
import { useRouteBackend } from '../../hooks/useRouteBackend';
import { EmailTable } from './email-table';
import { SlackTable } from './slack-table';

const TabButton = styled(Button)(() => ({
	color: '#575757',
	textTransform: 'unset',
	fontSize: '0.9375rem',
	fontWeight: 600,
	borderRadius: '8px',
	lineHeight: 1.2,
	padding: '10px 18px',
	letterSpacing: '-.01em',
	transition: 'all 0.3s',
	marginLeft: '12px',
	'&:hover': {
		color: '#1B1D1F',
		background: '#EFEFEF',
	},
	'&.active': {
		color: '#1B1D1F',
		background: '#EFEFEF',
	},
}));

export const Route = () => {
	const [open, setOpen] = useState(false);
	const [emailRoutes, setEmailRoutes] = useState([]);
	const [slackRoutes, setSlackRoutes] = useState([]);
	const [routeType, setRouteType] = useState('');
	const [tableRouteType, setTableRouteType] = useState('email');

	const { getEmailRoutes, getSlackRoutes, modifyRoutesByType } = useRouteBackend();

	useEffect(() => {
		if (tableRouteType === 'email') {
			getEmailRouteList();
		} else if (tableRouteType === 'slack') {
			getSlackRouteList();
		}
	}, [tableRouteType]);

	const getEmailRouteList = () => {
		getEmailRoutes()
			.then(res => {
				console.log(Object.entries(res.data.email_routes));
				// const routeList = [...emailRoutes];
				// routeList.push(res.data.email_routes);
				setEmailRoutes([...Object.entries(res.data.email_routes)]);
			})
			.catch(err => {
				console.error(err);
			});
	};

	const getSlackRouteList = () => {
		getSlackRoutes()
			.then(res => {
				console.log(res.data.slack_routes);
				// const routeList = [...slackRoutes];
				// routeList.push(res.data.slack_routes);
				// debugger;
				setSlackRoutes([...Object.entries(res.data.slack_routes)]);
			})
			.catch(err => {
				setSlackRoutes([]);
				console.error(err);
			});
	};

	const handleDialogOpen = () => {
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleRouteTypeChange = type => {
		setRouteType(type);
	};

	const modifyRoutes = initialData => {
		const completeData = { ...initialData, routeType: routeType };

		modifyRoutesByType(routeType, routeType === 'email' ? emailRoutes : slackRoutes, completeData)
			.then(res => {
				routeType === 'email' ? getEmailRouteList() : getSlackRouteList();
			})
			.catch(err => {
				console.error(err);
			});
	};

	return (
		<Box
			sx={{
				height: 'calc(100% - 80px)',
				p: '32px 25px',
				pb: 'calc(80px + 32px)',
				position: 'relative',
			}}
		>
			<Typography
				variant="h4"
				sx={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', mb: '24px' }}
			>
				Routing
			</Typography>

			<Box sx={{ width: '100%', background: '#FCFCFC', borderRadius: '10px', p: '24px' }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: '28px',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<TableColorBox />
							<Typography
								variant="h6"
								sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
							>
								Routing mechanisms
							</Typography>
						</Box>

						<TabButton
							variant="text"
							disableElevation
							onClick={() => setTableRouteType('email')}
							className={tableRouteType === 'email' ? 'active' : ''}
						>
							Email
						</TabButton>

						<TabButton
							variant="text"
							disableElevation
							onClick={() => setTableRouteType('slack')}
							sx={{ ml: 1 }}
							className={tableRouteType === 'slack' ? 'active' : ''}
						>
							Slack
						</TabButton>
					</Box>

					<Button
						variant="outlined"
						sx={{
							// border: '2px solid #2B85FF',
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
						onClick={handleDialogOpen}
					>
						<Plus
							size={24}
							style={{ marginRight: '10px' }}
						/>
						Add routing mechanism
					</Button>
				</Box>

				<Table
					aria-label="simple table"
					sx={{ width: 'calc(100% + 24px)', tableLayout: 'fixed' }}
				>
					{tableRouteType === 'email' && <EmailTable routes={emailRoutes} />}
					{tableRouteType === 'slack' && <SlackTable routes={slackRoutes} />}
				</Table>
			</Box>

			<Dialog
				open={open}
				onClose={handleDialogClose}
				slotProps={{ backdrop: { style: { backgroundColor: 'rgba(244, 244, 244, 0.8)' } } }}
				PaperProps={{
					component: 'form',
					style: {
						width: '450px',
						backgroundColor: '#FCFCFC',
						boxShadow:
							'0px 0px 14px -4px rgba(0, 0, 0, 0.05), 0px 32px 48px -8px rgba(0, 0, 0, 0.1)',
						borderRadius: '16px',
						padding: '26px 24px 24px',
					},
					onSubmit: event => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson = Object.fromEntries(formData.entries());
						// const name = formJson.name;
						modifyRoutes(formJson);
						// setActiveModel(name);
						handleDialogClose();
					},
				}}
			>
				<RoutingDialog
					handleDialogClose={handleDialogClose}
					handleRouteTypeChange={handleRouteTypeChange}
				/>
			</Dialog>
		</Box>
	);
};
