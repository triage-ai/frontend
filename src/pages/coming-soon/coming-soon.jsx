import logo from '../../logo-icon.svg';
import '../../App.css';

import { Button, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { CheckCircle, Mail, X } from 'lucide-react';
import instaIcon from '../../assets/instagram-icon.svg';
import linkedInIcon from '../../assets/linkedin-icon.svg';
import { Fragment, useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/system';
import { useAddWaitlistEmail } from '../../hooks/useAddWaitlistEmail';
import { RedirectButton } from '../auth/auth';
import { useNavigate } from 'react-router-dom';

export const ComingSoon = () => {
	const { addWaitlistEmail } = useAddWaitlistEmail();
	const currentTheme = useTheme();
	const onlySmallScreen = useMediaQuery(currentTheme.breakpoints.down('md'));

	const [email, setEmail] = useState('');
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(false);
	const [added, setAdded] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const alreadyAdded = sessionStorage.getItem('emailAdded') === 'yes';
		setAdded(alreadyAdded);

		if (alreadyAdded) {
			setOpen(true);
		}
	}, []);

	const subscribeToWaitList = () => {
		if (email !== '' && validateEmail(email)) {
			addWaitlistEmail(email).then(() => {
				setOpen(true);
				setEmail('');
				sessionStorage.setItem('emailAdded', 'yes');
			});
		} else {
			setError(true);
		}
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const validateEmail = email => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const goToLogin = () => {
		navigate('/login');
	};

	const action = (
		<Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<X fontSize="small" />
			</IconButton>
		</Fragment>
	);

	return (
		<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
			<Box
				sx={{
					width: '400px',
					height: '100dvh',
					background: '#F4F4F4',
					display: { xs: 'none', md: 'flex' },
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 82px',
					boxSizing: 'border-box',
					flexShrink: 0,
					textAlign: 'center',
				}}
			>
				<img
					src={logo}
					className="App-logo"
					alt="logo"
					style={{ height: '100px', flexShrink: 0 }}
				/>

				<h2
					style={{
						fontSize: '2rem',
						lineHeight: 1.25,
						marginTop: '18px',
						marginBottom: '22px',
						// textAlign: 'left',
					}}
				>
					Welcome to <span style={{ textDecoration: 'underline' }}>Triage.ai</span>
				</h2>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '22px',
						// textAlign: 'left',
						fontSize: '0.875rem',
						color: '#7A8087',
					}}
				>
					<div>
						{/* <span style={{ display: 'inline-block', fontWeight: '600' }}>
									Where issues find solutions, in minutes.
								</span> */}

						<span style={{ display: 'inline-block', fontWeight: '600', marginBottom: '18px' }}>
							Experience the future of customer support with Triage.ai
						</span>

						<span style={{ display: 'inline-block', fontWeight: '600' }}>
							Build, Fine-Tune, Test, and Deploy your own ticket classification system in a few
							clicks!
						</span>
					</div>

					<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
						<CheckCircle
							color="#8CC279"
							size={22}
							style={{ flexShrink: 0 }}
						/>
						<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
							Auto-labels tickets
						</span>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
						<CheckCircle
							color="#8CC279"
							size={22}
							style={{ flexShrink: 0 }}
						/>
						<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
							Ensures accurate ticket assignment
						</span>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
						<CheckCircle
							color="#8CC279"
							size={22}
							style={{ flexShrink: 0 }}
						/>
						<span style={{ fontWeight: '500', marginLeft: '12px', marginTop: '2px' }}>
							Pinpoints areas experiencing a surge in ticket volume
						</span>
					</Box>
				</Box>
			</Box>

			<div
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#FCFCFC',
				}}
			>
				<header className="App-header">
					{/* {onlySmallScreen && (
						<img
							src={logo}
							className="App-logo"
							alt="logo"
						/>
					)} */}

					<Box
						sx={{
							width: '100%',
							padding: { xs: '20px 28px', md: '20px 40px' },
							boxSizing: 'border-box',
							position: 'absolute',
							top: 0,
							left: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<img
							src={logo}
							className="App-logo"
							alt="logo"
							style={{ visibility: onlySmallScreen ? 'visible' : 'hidden' }}
						/>

						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Already a member? <RedirectButton onClick={goToLogin}>Sign in</RedirectButton>
						</Typography>
					</Box>

					<h1
						style={{
							fontSize: '3rem',
							fontWeight: 600,
							color: '#1B1D1F',
							letterSpacing: '-0.03em',
							marginTop: '30px',
							marginBottom: '30px',
						}}
					>
						Coming Soon
					</h1>
					<p
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							color: '#1B1D1F',
							letterSpacing: '-0.01em',
							lineHeight: 1.2,
							marginTop: 0,
							marginBottom: '32px',
							textAlign: 'center',
						}}
					>
						<span style={{ textDecoration: 'underline' }}>Revolutionize support with AI</span>
						<br />
						<br />
						Our LLM-based, no-code platform automates ticket categorization and routing.
					</p>

					<hr style={{ width: '100%', border: '1px solid #EFEFEF', margin: 0 }} />

					<label
						style={{
							fontSize: '0.875rem',
							fontWeight: 600,
							color: '#1B1D1F',
							letterSpacing: '-0.01em',
							lineHeight: 1.2,
							marginTop: '32px',
							marginBottom: '8px',
						}}
						htmlFor="email"
					>
						Get notified when we launch
					</label>

					<TextField
						label=""
						id="email"
						placeholder="Your email"
						sx={{
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
								background: '#F4F4F4',
								border: error ? '2px solid #ff7474' : '2px solid transparent',
								borderRadius: '12px',
								fontWeight: 600,
								color: '#000',
								transition: 'all .3s',

								'&.Mui-focused': {
									background: '#FFF',
									borderRadius: '12px',
									border: '2px solid #EFEFEF',
								},
							},
							'& .MuiInputBase-input': {
								padding: '10.5px 14px',
								paddingLeft: '6px',
							},
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Mail color="#575757" />
								</InputAdornment>
							),
						}}
						value={email}
						onChange={event => {
							if (validateEmail(email)) {
								setError(false);
							}
							setEmail(event.target.value);
						}}
					/>

					<Button
						sx={{
							backgroundColor: '#2B85FF',
							color: '#FFF',
							borderRadius: '12px',
							width: '100%',
							fontSize: '0.9375rem',
							fontWeight: 600,
							lineHeight: 1,
							textTransform: 'unset',
							padding: '16.5px 10px',
							marginTop: '12px',
							marginBottom: '28px',
							transition: 'all 0.3s',
							'&:hover': {
								backgroundColor: '#0069f6',
							},
							'&:disabled': {
								color: 'unset',
								opacity: 0.4,
							},
						}}
						onClick={subscribeToWaitList}
						disabled={added}
					>
						Notify Me
					</Button>

					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '22px',
						}}
					>
						<a
							href="https://www.linkedin.com/company/tt-ai/"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={linkedInIcon}
								alt="LinkedIn Icon"
							/>
						</a>

						<a
							href="https://www.instagram.com/triage.ai/"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src={instaIcon}
								alt="Instagram Icon"
							/>
						</a>
					</div>
				</header>

				<Snackbar
					open={open}
					autoHideDuration={6000}
					message="Your email was added to our waitlist!"
					action={action}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					sx={{
						boxShadow: 'unset',
						'& .MuiSnackbarContent-message': {
							fontWeight: 500,
						},
					}}
				/>
			</div>
		</Box>
	);
};
