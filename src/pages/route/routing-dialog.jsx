import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Typography,
	keyframes,
	styled,
} from '@mui/material';
import { CustomTextField } from '../../components/sidebar-items';
import { X } from 'lucide-react';
import { TableColorBox } from '../build/build';
import { MenuTab } from '../test/test';
import { useEffect, useState } from 'react';

const CustomMenuTab = styled(MenuTab)(() => ({
	padding: '8px 14px',
	borderRadius: '8px',
}));

const fadeIn = keyframes`   
from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`   
from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ActiveContentContainer = styled(Grid)(() => ({
	'&.show-container': {
		animation: `${fadeIn} 0.4s`,
	},
	'&.hide-container': {
		animation: `${fadeOut} 0.4s`,
		display: 'none',
	},
}));

const CustomFormControl = styled(FormControl)({
	m: 0,
	width: '100%',
	'& fieldset': { border: 'none' },
	'& input::placeholder': {
		fontSize: '0.9375rem',
		fontWeight: 600,
		opacity: 1,
		color: '#575757',
	},
	'& .MuiInputBase-root': {
		background: 'transparent',
		border: '2px solid #EFEFEF',
		borderRadius: '12px',
		fontWeight: 600,
		color: '#000',
		transition: 'all .3s',

		'&:before, &:after': {
			content: 'none',
			border: 0,
		},

		'&:hover': {
			background: 'transparent',
			borderColor: '#2B85FF',
			'&:before': {
				content: 'none',
			},
		},

		'&.Mui-focused': {
			borderColor: '#2B85FF',
		},
		// },
		// '& .MuiInputBase-input': {
		// 	padding: '10.5px 14px',
		// 	paddingLeft: '6px',
	},
});

export const RoutingDialog = ({ handleDialogClose, handleRouteTypeChange }) => {
	const [categories, setCategories] = useState([]);

	const [routeType, setRouteType] = useState('email');
	const [expertise, setExpertise] = useState('');
	const [level, setLevel] = useState('');
	const [email, setEmail] = useState('');
	const [slackToken, setSlackToken] = useState('');
	const [slackChannelId, setSlackChannelId] = useState('');

	useEffect(() => {
		setCategoryList();

		window.addEventListener('storage', () => {
			setCategoryList();
		});
	}, []);

	useEffect(() => {
		handleRouteTypeChange(routeType);
	}, [routeType]);

	const setCategoryList = () => {
		if (sessionStorage.getItem('categories')) {
			const activeModel = sessionStorage.getItem('activeModel');
			const parsedCategories = JSON.parse(sessionStorage.getItem('categories')).filter(
				category => category.model === activeModel
			);
			setCategories(parsedCategories);
		}
	};

	const handleExpertiseChange = event => {
		setExpertise(event.target.value);
	};

	const handleRadioChange = event => {
		setLevel(event.target.value);
	};

	const handleRouteChange = type => {
		setRouteType(type);
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
						Create route
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

			<Divider sx={{ my: '24px', borderColor: '#EFEFEF' }} />

			<DialogContent sx={{ p: 0 }}>
				{/* <Typography
					variant="body1"
					sx={{ fontSize: '0.9375rem', fontWeight: 500, color: '#6F767E', mb: '8px' }}
				>
					Please choose between the two routing types below
				</Typography> */}
				<Typography
					variant="body1"
					sx={{ fontSize: '0.9375rem', fontWeight: 500, color: '#6F767E', mb: '8px', ml: '2px' }}
				>
					Please provide the route level, area of expertise and type for the routing mechanism that
					will be created
				</Typography>

				<RadioGroup
					row
					aria-labelledby="demo-level-label"
					name="level"
					onChange={handleRadioChange}
					sx={{ mb: '8px' }}
				>
					<FormControlLabel
						value="team"
						control={<Radio />}
						label={<span style={{ fontWeight: 600 }}>Team</span>}
						sx={{ ml: 0 }}
					/>
					<FormControlLabel
						value="developer"
						control={<Radio />}
						label={<span style={{ fontWeight: 600 }}>Developer</span>}
					/>
				</RadioGroup>

				<CustomFormControl variant="filled">
					<InputLabel id="demo-simple-select-filled-label">Area of expertise</InputLabel>
					<Select
						labelId="demo-simple-select-filled-label"
						id="demo-simple-select-filled"
						name="expertise"
						value={expertise}
						onChange={handleExpertiseChange}
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						{categories.map(category => (
							<MenuItem
								key={category.name}
								value={category.name}
							>
								{category.name}
							</MenuItem>
						))}
					</Select>
				</CustomFormControl>

				<Box
					sx={{
						width: '100%',
						backgroundColor: '#F4F4F4',
						padding: '8px',
						borderRadius: '16px',
						display: 'flex',
						mt: '20px',
						mb: '12px',
					}}
				>
					<CustomMenuTab
						className={routeType === 'email' && 'active'}
						onClick={() => handleRouteChange('email')}
					>
						<Box>
							<Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
							>
								Routing type
							</Typography>
							<Typography
								variant="h6"
								sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
							>
								Email address
							</Typography>
						</Box>
					</CustomMenuTab>

					<CustomMenuTab
						className={routeType === 'slack' && 'active'}
						onClick={() => handleRouteChange('slack')}
					>
						<Box>
							<Typography
								variant="caption"
								sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#575757' }}
							>
								Routing type
							</Typography>
							<Typography
								variant="h6"
								sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}
							>
								Slack
							</Typography>
						</Box>
					</CustomMenuTab>
				</Box>

				<ActiveContentContainer
					item
					xs={12}
					className={routeType === 'email' ? 'show-container' : 'hide-container'}
				>
					{/* <Typography
						variant="body1"
						sx={{ fontSize: '0.9375rem', fontWeight: 500, color: '#6F767E', mb: '8px', ml: '2px' }}
					>
						Please provide the route type and email for the routing mechanism that will be created
					</Typography>

					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="row-radio-buttons-group"
						onChange={handleRadioChange}
						sx={{ mb: '8px' }}
					>
						<FormControlLabel
							value="team"
							control={<Radio />}
							label={<span style={{ fontWeight: 600 }}>Team</span>}
							sx={{ ml: 0 }}
						/>
						<FormControlLabel
							value="developer"
							control={<Radio />}
							label={<span style={{ fontWeight: 600 }}>Developer</span>}
						/>
					</RadioGroup> */}

					<CustomTextField
						autoFocus
						margin="dense"
						name="email"
						label="Email address"
						type="text"
						fullWidth
						variant="filled"
					/>
				</ActiveContentContainer>

				<ActiveContentContainer
					item
					xs={12}
					className={routeType === 'slack' ? 'show-container' : 'hide-container'}
				>
					<CustomTextField
						autoFocus
						margin="dense"
						name="slackToken"
						label="Slack token"
						type="text"
						fullWidth
						variant="filled"
					/>

					<CustomTextField
						autoFocus
						margin="dense"
						name="slackChannelId"
						label="Slack channel id"
						type="text"
						fullWidth
						variant="filled"
					/>
				</ActiveContentContainer>
			</DialogContent>
			<DialogActions sx={{ p: 0 }}>
				<Button
					variant="contained"
					disableElevation
					type="submit"
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
						mt: '24px',
						'&:hover': {
							background: '#0069f6',
						},
					}}
				>
					Create route
				</Button>
			</DialogActions>
		</>
	);
};
