import logo from '../../assets/logo-white.svg';
import logoBlack from '../../assets/logo-black.svg';
import AppIcon from '../../assets/app-icon-black.png';
import '../../App.css';
import React, { useContext, useState } from 'react';

import {
	Box,
	Button,
	Chip,
	Container,
	Dialog,
	IconButton,
	Menu,
	MenuItem,
	Modal,
	Toolbar,
	Tooltip,
	Typography,
	styled,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { ArrowUpRight, MenuIcon, Play, Quote, X } from 'lucide-react';
import { useState } from 'react';
import TriageMintLogo from '../../assets/triage-logo-mint-white.svg';
import AntlerIcon from '../../assets/antler-icon.svg';
import AppPreview from '../../assets/app-preview.png';
import StealthIcon from '../../assets/stealth-icon.png';
import AmazonIcon from '../../assets/amazon-icon.jpeg';
import WorkdayIcon from '../../assets/workday-icon.webp';
import MongoIcon from '../../assets/mongo-icon.png';
import FooterCardBg from '../../assets/footer-card-bg.png';

import InstagramIcon from '../../assets/instagram-outline-icon.svg';
import MailIcon from '../../assets/mail-outline-icon.svg';
import LinkedInIcon from '../../assets/linkedIn-outline-icon.svg';

import Feature1 from '../../assets/feature1.png';
import Feature2 from '../../assets/feature2.png';
import Feature3 from '../../assets/feature3.png';
import Feature4 from '../../assets/feature4.png';

import ProductVideo from '../../assets/productVideo.mov';
import Collaborate from '../../assets/collaborate.png';

import Marquee from 'react-fast-marquee';
import { useNavigate } from 'react-router-dom';

const ProviderButton = styled(Box)({
	border: '2px solid #EFEFEF',
	padding: '10px',
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: '10px',
	cursor: 'pointer',
	transition: 'all 0.2s',
	'&:hover': {
		borderColor: '#1B1D1F',
	},
});

const CustomTextField = styled(TextField)({
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
});

const RedirectButton = styled('a')({
	cursor: 'pointer',
	color: '#1B1D1F',
	transition: 'color 0.3s',
	'&:hover': {
		color: '#22874E',
	},
});

export const Landing = () => {
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	return (
		<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#FCFCFC' }}>
			<Grid
				container
				spacing={{ xs: 6, md: 8, lg: 2 }}
			>
				<Grid
					xs={0}
					md={6}
					sx={{
						display: { xs: 'none', md: 'block' },
					}}
					item
				>
					<Box
						sx={{
							width: 'calc(100% - 8px)',
							height: 'calc(100dvh - 16px)',
							padding: '8px',
							paddingRight: 0,
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								background:
									'radial-gradient(130% 135% at 30% 10%, #0000 40%, #0da54d, #D0FFD6), #010312',
								display: { xs: 'none', md: 'flex' },
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								padding: { md: '34px', lg: '44px' },
								boxSizing: 'border-box',
								flexShrink: 0,
								textAlign: 'center',
								borderRadius: '16px',
							}}
						>
							<Typography
								variant="h1"
								sx={{
									fontSize: '3.75rem',
									background: 'radial-gradient(45% 100% at 50% 50%, #fff 50%, #ffffff80)',
									fontWeight: 600,
									letterSpacing: '-0.02em',
									color: '#FFF',
									textAlign: 'left',
									backgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									WebkitBackgroundClip: 'text',
									lineHeight: 1.1,
									width: { md: '100%', lg: '75%' },
								}}
							>
								Experience the future of customer support with Triage.ai
							</Typography>

							{/* <Box
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
							</Box> */}

					<Grid
						container
						// spacing={2}
					>
						{features.map((feature, index) => (
							<Grid
								key={feature.title}
								size={{ xs: 12, md: index + 1 === 1 || index + 1 === 4 ? 8 : 4 }}
							>
								<FeatureItem>
									<Box
										sx={{
											width: '100%',
											height: '285px',
											position: 'absolute',
											top: index + 1 === 1 || index + 1 === 4 ? 0 : 15,
											paddingX: '24px',
											boxSizing: 'border-box',
										}}
									>
										<Box
											sx={{
												height: '100%',
												width: '100%',
												borderRadius: '31px',
												display: 'flex',
												justifyContent: 'center',
												overflow: 'hidden',
											}}
										>
											<img
												src={feature.image}
												alt={'Feature ' + index + 1}
												style={{
													width:
														index + 1 === 1 || index + 1 === 4
															? { xs: '205%', md: '100%' }
															: 'unset',
												}}
											/>
										</Box>
									</Box>
									<Box
										sx={{
											width: { xs: '90%', md: index + 1 === 1 || index + 1 === 4 ? '60%' : '80%' },
										}}
									>
										<Typography
											variant="h5"
											sx={{ fontWeight: 600, letterSpacing: '-0.08em', mb: 1.75 }}
										>
											{feature.title}
										</Typography>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Labels tickets
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Triage AI automatically labels your tickets to streamline your support process
									</Typography>
								</Grid>

								<Grid
									item
									xs={4}
									sx={{ textAlign: 'left' }}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Split
											color="#fff"
											size={16}
											strokeWidth={2.2}
											style={{ opacity: 0.6, marginRight: '0.4rem' }}
										/>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Assigns tickets
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Ensures that tickets are accurately assigned to the appropriate members
									</Typography>
								</Grid>

								<Grid
									item
									xs={4}
									sx={{ textAlign: 'left' }}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.2rem' }}>
										<Activity
											color="#fff"
											size={16}
											strokeWidth={2.2}
											style={{ opacity: 0.6, marginRight: '0.4rem' }}
										/>
										<Typography
											variant="subtitle1"
											sx={{ color: '#FFF', lineHeight: 1.25, fontWeight: 500 }}
										>
											Identifies surges
										</Typography>
									</Box>

									<Typography
										variant="body2"
										sx={{ color: '#FFF', opacity: 0.6 }}
									>
										Pinpoints areas with an increased ticket activity for proactive management
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>

				<Grid
					xs={12}
					md={6}
					item
				>
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// backgroundColor: '#FCFCFC',
						}}
					>
						<header className="App-header">
							<Box
								sx={{
									width: '100%',
									padding: { xs: '20px 28px', md: '30px 40px' },
									boxSizing: 'border-box',
									position: 'absolute',
									top: 0,
									left: 0,
									display: 'flex',
									alignItems: { xs: 'center', md: 'flex-start' },
									justifyContent: 'space-between',
								}}
							>
								<Box sx={{ display: { xs: 'none', md: 'block' } }}>
									<img
										src={logo}
										className="App-logo"
										alt="logo"
									/>
								</Box>

								<Box sx={{ display: { xs: 'block', md: 'none' } }}>
									<img
										src={logoBlack}
										className="App-logo"
										alt="logo"
									/>
								</Box>

								{/* <Typography
									variant="caption"
									sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
								>
									Already a member? <RedirectButton onClick={goToLogin}>Sign in</RedirectButton>
								</Typography> */}
							</Box>

							<img
								src={AppIcon}
								className="App-logo"
								// style={{ width: '0px' }}
								alt="logo"
							/>

							{/* <h1
								style={{
									fontSize: '3rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.03em',
									marginTop: '30px',
									marginBottom: '30px',
								}}
							>
								Sign in
							</h1> */}

							{/* <p
								style={{
									fontSize: '0.875rem',
									fontWeight: 600,
									color: '#1B1D1F',
									letterSpacing: '-0.01em',
									lineHeight: 1.2,
									marginTop: 0,
									marginBottom: '20px',
									textAlign: 'center',
								}}
							>
								<Typography
									variant="h5"
									sx={{ fontWeight: 600, mb: 2 }}
								>
									Got questions?
								</Typography>

								<Typography
									variant="subtitle2"
									sx={{ color: '#FFF', fontWeight: 400, opacity: 0.5 }}
								>
									We're here to help! Reach out clicking this box, and our team will get back to you
									ASAP.
								</Typography>

								<img
									src={FooterCardBg}
									alt="Footer Card BG"
									style={{ position: 'absolute', right: 20, top: 20, height: '80%' }}
								/>
							</Box>
						</a> */}

						<Grid
							container
							// spacing={{ xs: 6, md: 8, lg: 2 }}
						>
							<Grid size={{ xs: 12, md: 4 }}>
								<Box
									sx={{
										width: '320px',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
										color: '#FFF',
										textAlign: 'left',
									}}
								>
									<img
										src={TriageMintLogo}
										alt="Triage Logo"
										style={{ width: '50%', marginBottom: '30px' }}
									/>
									<Typography variant="subtitle1">
										Experience the future of customer support
									</Typography>
								</Box>
							</Grid>

							<Grid
								size={{ xs: 6, md: 4, lg: 2 }}
								sx={{ display: 'flex', justifyContent: { xs: 'unset', md: 'center', lg: 'unset' } }}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
										color: '#FFF',
										gap: '26px',
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{ color: '#FFF', fontWeight: 600 }}
									>
										Product
									</Typography>

									{pages.map(page => (
										<Button
											key={page}
											variant="text"
											disableRipple
											href={'#' + page}
											sx={{
												ml: '-8px',
												textTransform: 'none',
												minWidth: 'unset',
												'&:hover': {
													background: '#e8ffeb0d',
												},
											}}
										>
											<Typography
												variant="subtitle2"
												sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
											>
												{page}
											</Typography>
										</Button>
									))}
								</Box>
							</Grid>

							<Grid
								size={{ xs: 6, md: 4, lg: 2 }}
								sx={{ display: 'flex', justifyContent: { xs: 'unset', md: 'center', lg: 'unset' } }}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start',
										color: '#FFF',
										gap: '26px',
									}}
								>
									<Typography
										variant="subtitle2"
										sx={{ color: '#FFF', fontWeight: 600 }}
									>
										Legals
									</Typography>

									<Button
										variant="text"
										disableRipple
										sx={{
											ml: '-8px',
											textTransform: 'none',
											minWidth: 'unset',
											'&:hover': {
												background: '#e8ffeb0d',
											},
										}}
										onClick={() => handleLegalsOpen('terms')}
									>
										<Typography
											variant="subtitle2"
											sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
										>
											Terms of Services
										</Typography>
									</Button>

									<Button
										variant="text"
										disableRipple
										sx={{
											ml: '-8px',
											textTransform: 'none',
											minWidth: 'unset',
											'&:hover': {
												background: '#e8ffeb0d',
											},
										}}
										onClick={() => handleLegalsOpen('privacy')}
									>
										<Typography
											variant="subtitle2"
											sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
										>
											Privacy Policy
										</Typography>
									</Button>
								</Box>
							</Grid>

							<Grid
								size={{ xs: 12, md: 12, lg: 4 }}
								sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'flex-end' } }}
							>
								<a
									href="mailto:shivam.p36181@gmail.com?cc=rayan.dabbagh@gmail.com"
									style={{ textDecoration: 'none' }}
								>
									<Box
										sx={{
											width: { xs: '100%', sm: '320px' },
											padding: '28px',
											background: 'rgba(26, 74, 19, 0.05)',
											border: '1px solid rgba(13, 37, 10, 0.65)',
											borderRadius: '22px',
											boxSizing: 'border-box',
											position: 'relative',
											textAlign: 'left',
											color: '#FFF',
										}}
									>
										<Typography
											variant="h5"
											sx={{ fontWeight: 600, mb: 2 }}
										>
											Got questions?
										</Typography>

										<Typography
											variant="subtitle2"
											sx={{ color: '#FFF', fontWeight: 400, opacity: 0.5 }}
										>
											We're here to help! Reach out clicking this box, and our team will get back to
											you ASAP.
										</Typography>

										<img
											src={FooterCardBg}
											alt="Footer Card BG"
											style={{ position: 'absolute', right: 20, top: 20, height: '80%' }}
										/>
									</Box>
								</a>
							</Grid>
						</Grid>

						<Dialog
							onClose={handleLegalsClose}
							open={legalsOpen}
							fullScreen={true}
							scroll="body"
							PaperProps={{
								style: {
									backgroundColor: '#000',
									color: '#FFF',
									justifyContent: 'center',
									padding: '20px',
									borderRadius: '15px',
									boxSizing: 'border-box',
								},
							}}
							slotProps={{ backdrop: { style: { backgroundColor: 'rgba(5, 15, 4, 0.75)' } } }}
						>
							<Box sx={{ width: '100%', display: 'grid' }}>
								<IconButton
									onClick={handleLegalsClose}
									sx={{ justifyContent: 'flex-end' }}
								>
									<X
										color="#FFF"
										style={{ marginBottom: '20px', justifySelf: 'flex-end' }}
									/>
								</IconButton>
							</Box>

							<Box sx={{ maxWidth: '580px', margin: '0 auto' }}>
								{legalsType === 'terms' && <TOS />}
								{legalsType === 'privacy' && <PrivacyPolicy />}
							</Box>
						</Dialog>
					</footer>

					<GradientDivider sx={{ mb: '70px', mt: { xs: '70px' } }} />

					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: '30px',
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{ color: '#FFF', fontWeight: 400, textAlign: 'left' }}
						>
							©{new Date().getFullYear()} Triage.ai <br />
							All rights reserved.
						</Typography>

						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<IconButton
								aria-label="instagram"
								href="https://www.instagram.com/triage.ai"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={InstagramIcon}
									alt="Instagram"
								/>
							</IconButton>

							<IconButton
								aria-label="email"
								href="mailto:shivam.p36181@gmail.com?cc=rayan.dabbagh@gmail.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={MailIcon}
									alt="Email"
								/>
							</IconButton>

							<IconButton
								aria-label="linked in"
								href="https://www.linkedin.com/company/triageaii"
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={LinkedInIcon}
									alt="LinkedIn"
								/>
							</IconButton>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};
