import {
	AppBar,
	Avatar,
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
	keyframes,
	styled,
	useMediaQuery,
	useTheme,
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
import { TOS } from './tos';
import { PrivacyPolicy } from './privacy';

const pages = ['Demo', 'Features', 'Testimonials'];

const features = [
	{
		title: 'Build model',
		description: 'Craft a classifier quickly by answering a few questions about your operations.',
		image: Feature1,
	},
	{
		title: 'Fine-tune model',
		description:
			"Customize your model with your company's language, trained on your ticketing data.",
		image: Feature2,
	},
	{
		title: 'Test your model',
		description: "Utilize diverse testing environments to verify your classifier's accuracy.",
		image: Feature3,
	},
	{
		title: 'Add routing mechanisms',
		description:
			'Connect seamlessly to communication channels (Slack, email, etc.), directing tickets to the right experts instantly.',
		image: Feature4,
	},
];

const testimonials = [
	{
		description:
			'Ticket misallocation has been a recurring headache, but Triage AI dramatically improved our allocation accuracy.',
		position: 'Startup CEO',
		companyLogo: StealthIcon,
		company: 'Stealth',
	},
	{
		description:
			'Identifying sudden spikes in ticket volume is a struggle for us. Tools like Triage AI can accelerate our ability to detect and respond to such situations.',
		position: 'Operations Head',
		companyLogo: AmazonIcon,
		company: 'Amazon',
	},
	{
		description:
			'Our developers are spending excessive time dealing with out-of-scope tickets. Thanks to tools like Triage AI, we can reduce these inefficiencies.',
		position: 'Software Dev Manager',
		companyLogo: WorkdayIcon,
		company: 'Workday',
	},
	{
		description:
			'We often face challenges with long resolution times, impacting customer satisfaction. With solutions like Triage AI, we will observe significant enhancements in our performance metrics.',
		position: 'Support Lead',
		companyLogo: MongoIcon,
		company: 'MongoDB',
	},
];

const ChipButton = styled(Button)(({ theme }) => ({
	background: '#D0FFD6',
	borderRadius: 60,
	paddingLeft: '20px',
	paddingRight: '20px',
	paddingTop: 8,
	'&:hover': {
		background: '#e8ffeb',
	},
	'& .MuiTouchRipple-root span': {
		backgroundColor: '#68806b',
	},
}));

const OutlinedChipButton = styled(ChipButton)(() => ({
	background: 'unset',
	border: '1.5px solid #FFF',
	height: '42px',
	boxSizing: 'border-box',
	'&:hover': {
		background: '#e8ffeb1a',
	},
	'& .MuiTouchRipple-root span': {
		backgroundColor: '#68806b',
	},
}));

const ChipBubble = styled(Chip)(() => ({
	background: 'rgba(26, 74, 19, 0.35)',
	border: '1px solid #1A4A13',
	color: '#e8ffeb',
	paddingLeft: '20px',
	paddingTop: '10px',
	paddingRight: '20px',
	paddingBottom: '8px',
	'& .MuiChip-label': {
		padding: 0,
	},
}));

const ClickableAnchor = styled('a')(() => ({
	color: 'unset',
	textDecoration: 'none',
	display: 'flex',
	alignItems: 'flex-start',
	marginRight: '4px',
	'&:hover': {
		textDecoration: 'underline',
	},
}));

const FeatureItem = styled(Box)(() => ({
	minHeight: '480px',
	boxSizing: 'border-box',
	background: 'radial-gradient(circle, rgba(26, 74, 19, 0.25) 25%, rgba(26, 74, 19, 0.08) 100%)',
	border: '1px solid #0D250A',
	color: '#FFF',
	padding: '56px 24px',
	borderRadius: '55px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'flex-end',
	position: 'relative',
}));

const TestimonialContainer = styled(Box)(() => ({
	minHeight: '280px',
	boxSizing: 'border-box',
	background: 'rgba(26, 74, 19, 0.05)',
	border: '1px solid rgba(26, 74, 19, 0.65)',
	color: '#FFF',
	padding: '24px 32px',
	borderRadius: '35px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	textAlign: 'left',
	marginLeft: '10px',
	marginRight: '10px',
}));

const CorporateAvatar = styled(Box)(() => ({
	border: '1px solid #FFF',
	width: '40px',
	height: '40px',
	borderRadius: '50px',
	marginRight: '14px',
}));

const GradientDivider = styled(Box)(() => ({
	width: '100%',
	height: '1px',
	background:
		'radial-gradient(circle at 50%, rgba(208, 255, 214, 0.7) 0%, rgba(208, 255, 214, 0) 90%)',
	marginTop: '170px',
	marginBottom: '112px',
}));

const pulseAnimate = keyframes`
	100% {
		opacity: 0;
		transform: scale(2);
	}
`;

const PulseCircle = styled(Box, {
	shouldForwardProp: prop => prop < 0,
})(({ index }) => ({
	position: 'absolute',
	width: '100%',
	height: '100%',
	background: '#2ECC71',
	opacity: 0.8,
	borderRadius: 'inherit',
	animation: `${pulseAnimate} 4s ease-out infinite`,
	animationDelay: `calc(1s * ${index})`,
}));

export const Landing = () => {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [open, setOpen] = useState(false);
	const [legalsOpen, setLegalsOpen] = useState(false);
	const [legalsType, setLegalsType] = useState('');

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const handleLegalsOpen = type => {
		setLegalsOpen(true);
		setLegalsType(type);
	};
	const handleLegalsClose = () => {
		setLegalsOpen(false);
		setLegalsType('');
	};

	const navigate = useNavigate();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const handleOpenNavMenu = event => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const scrollToPage = page => {
		if (page && typeof page === 'string') {
			document.getElementById(page).scrollIntoView();
		}
	};

	const navigateSignUp = () => {
		navigate('/auth');
	};

	const navigateSignIn = () => {
		navigate('/login');
	};

	return (
		<Box sx={{ width: '100%', height: '100%', backgroundColor: '#050F04' }}>
			<AppBar
				position="static"
				sx={{ background: 'unset', boxShadow: 'unset' }}
			>
				<Container maxWidth="xl">
					<Toolbar
						disableGutters
						sx={{ height: '72px', justifyContent: { xs: 'space-between', md: 'center' } }}
					>
						<Box sx={{ width: '30%' }}>
							<img
								src={TriageMintLogo}
								alt="Triage Logo"
								style={{ display: 'block', height: '40px' }}
							/>
						</Box>

						<Box
							sx={{
								justifyContent: 'center',
								flexGrow: 1,
								display: { xs: 'none', md: 'flex' },
								gap: '24px',
							}}
						>
							{pages.map(page => (
								<Button
									key={page}
									href={'#' + page}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									<Typography
										variant="subtitle1"
										sx={{ fontWeight: 600, textTransform: 'none', width: 'fit-content' }}
									>
										{page}
									</Typography>
								</Button>
							))}
						</Box>

						<Box
							sx={{
								width: { xs: '70%', md: '30%' },
								display: 'flex',
								flexShrink: 0,
								alignItems: 'center',
								justifyContent: 'flex-end',
							}}
						>
							{/* <Tooltip title="Open settings">
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
								>
									<Avatar
										alt="Remy Sharp"
										src="/static/images/avatar/2.jpg"
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{settings.map(setting => (
									<MenuItem
										key={setting}
										onClick={handleCloseUserMenu}
									>
										<Typography textAlign="center">{setting}</Typography>
									</MenuItem>
								))}
							</Menu> */}

							<OutlinedChipButton
								sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}
								onClick={navigateSignIn}
							>
								<Typography
									variant="subtitle1"
									sx={{
										color: '#FFF',
										fontWeight: 600,
										textTransform: 'none',
										width: 'fit-content',
									}}
								>
									Log In
								</Typography>
							</OutlinedChipButton>

							<ChipButton onClick={navigateSignUp}>
								<Typography
									variant="subtitle1"
									sx={{
										color: '#000',
										fontWeight: 700,
										textTransform: 'none',
										width: 'fit-content',
									}}
								>
									Sign Up
								</Typography>
							</ChipButton>

							<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
								<IconButton
									size="large"
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={handleOpenNavMenu}
									color="inherit"
								>
									<MenuIcon />
								</IconButton>
								<Menu
									id="menu-appbar"
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
									sx={{
										display: { xs: 'block', md: 'none' },
									}}
								>
									{pages.map(page => (
										<MenuItem
											key={page}
											onClick={() => {
												handleCloseNavMenu();
												scrollToPage(page);
											}}
										>
											<Typography textAlign="center">{page}</Typography>
										</MenuItem>
									))}

									<MenuItem
										sx={{ display: { xs: 'inline-flex', sm: 'none' }, width: '100%' }}
										onClick={navigateSignIn}
									>
										<ChipButton sx={{ width: '100%' }}>
											<Typography
												variant="subtitle1"
												sx={{
													color: '#000',
													fontWeight: 600,
													textTransform: 'none',
												}}
											>
												Log In
											</Typography>
										</ChipButton>
									</MenuItem>
								</Menu>
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Container maxWidth="lg">
				<Box
					sx={{
						// height: 'calc(100vh - 72px)',
						textAlign: 'center',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: '90px',
						// justifyContent: 'center',
						// position: 'relative',
					}}
				>
					<ChipBubble
						label={
							<Typography
								variant="caption"
								sx={{
									fontSize: '0.8125rem',
									fontWeight: 600,
									p: 0,
									display: 'flex',
									alignItems: 'flex-start',
								}}
							>
								Backed by{' '}
								<ClickableAnchor
									href="https://www.antler.co/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										src={AntlerIcon}
										alt="Antler Icon"
										style={{ paddingTop: '1.5px', marginLeft: '4px' }}
									/>
									NTLER
								</ClickableAnchor>
								and Microsoft
							</Typography>
						}
					/>

					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: '3rem', sm: '4.5rem' },
							fontWeight: 600,
							lineHeight: 1.05,
							color: '#FFF',
							my: '24px',
						}}
					>
						Experience the Future of Customer Support
					</Typography>

					<Typography
						variant="h5"
						sx={{
							fontSize: { xs: '1.125rem', sm: '1.375rem' },
							color: '#FFF',
							opacity: 0.5,
							maxWidth: '65%',
							margin: '0 auto',
							mb: '44px',
						}}
					>
						Build, Fine-Tune, Test, and Deploy your own ticket classification system in a few
						clicks!
					</Typography>

					<ChipButton
						sx={{
							alignItems: 'flex-start',
						}}
						onClick={navigateSignUp}
					>
						<Typography
							variant="subtitle1"
							sx={{
								color: '#000',
								fontWeight: 700,
								textTransform: 'none',
								width: 'fit-content',
								mr: 0.5,
							}}
						>
							Sign Up
						</Typography>
						<ArrowUpRight color="#000" />
					</ChipButton>

					<Box
						id={pages[0]}
						sx={{
							width: '100%',
							pt: '120px',
							// paddingBottom: '58%',
							// boxSizing: 'border-box',
							// background: `url(${AppPreview})`,
							// backgroundRepeat: 'no-repeat',
							// backgroundPosition: 'top',
							// backgroundSize: '100%',
						}}
					>
						<Box
							sx={{ position: 'relative', cursor: 'pointer' }}
							onClick={handleOpen}
						>
							<Box
								sx={{
									width: '100%',
									height: '100%',
									background: 'rgba(204, 254, 212, 0.4)',
									position: 'absolute',
									left: '0',
									top: '0',
									filter: { xs: 'blur(15vh)', md: 'blur(30vh)' },
									zIndex: 0,
								}}
							/>

							<Box
								sx={{
									width: '100px',
									height: '100px',
									background: 'rgba(46, 204, 113, 0.25)',
									position: 'absolute',
									left: '50%',
									top: '50%',
									transform: 'translate(-50%, -50%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: '100px',
									zIndex: 2,
								}}
							>
								<Box
									sx={{
										width: '60px',
										height: '60px',
										background: '#1A4A13',
										border: '1px solid #FFF',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: '45px',
									}}
								>
									<Play style={{ fill: '#FFF', stroke: '#FFF', marginLeft: '2px' }} />
								</Box>
							</Box>

							<img
								src={AppPreview}
								alt="Triage AI preview"
								style={{ width: '100%', position: 'relative', zIndex: 1 }}
							/>
						</Box>

						<Dialog
							onClose={handleClose}
							open={open}
							fullScreen={fullScreen}
							PaperProps={{
								style: {
									backgroundColor: '#000',
									justifyContent: 'center',
									padding: '20px',
									borderRadius: '15px',
								},
							}}
							slotProps={{ backdrop: { style: { backgroundColor: 'rgba(5, 15, 4, 0.75)' } } }}
						>
							<IconButton
								onClick={handleClose}
								sx={{ justifyContent: 'flex-end' }}
							>
								<X
									color="#FFF"
									style={{ marginBottom: '20px', alignSelf: 'flex-end' }}
								/>
							</IconButton>
							<video
								controls
								autoPlay
							>
								<source
									src={ProductVideo}
									type="video/mp4"
								/>
								Your browser does not support HTML video.
							</video>
						</Dialog>
					</Box>

					<Box
						id={pages[1]}
						sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, mt: '142px', pt: '50px' }}
					>
						<Typography
							variant="h2"
							sx={{
								fontSize: { xs: '2.5rem', sm: '3.5rem' },
								fontWeight: 600,
								lineHeight: 1.3125,
								color: '#FFF',
							}}
						>
							Unlock Efficiency: Deploy AI-powered Customer Agents
						</Typography>

						<Typography
							variant="h5"
							sx={{
								fontSize: { xs: '1.125rem', sm: '1.375rem' },
								color: '#FFF',
								opacity: 0.5,
								maxWidth: '65%',
								margin: '0 auto',
								mt: '24px',
								mb: '44px',
							}}
						>
							Explore the Power of Triage AI's Cutting-Edge Capabilities
						</Typography>
					</Box>

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
											sx={{ lineHeight: '1.5', opacity: 0.5 }}
										>
											{feature.description}
										</Typography>
									</Box>
								</FeatureItem>
							</Grid>
						))}
					</Grid>

					<Typography
						id={pages[2]}
						variant="h1"
						sx={{
							fontSize: { xs: '3rem', sm: '4.5rem' },
							fontWeight: 600,
							lineHeight: 1.05,
							color: '#FFF',
							mt: '150px',
							pt: '50px',
							mb: '24px',
						}}
					>
						Beyond expectations
					</Typography>

					<Typography
						variant="h5"
						sx={{
							fontSize: { xs: '1.125rem', sm: '1.375rem' },
							color: '#FFF',
							opacity: 0.5,
							maxWidth: '65%',
							margin: '0 auto',
							mb: '44px',
						}}
					>
						See how Triage AI has resonated with its audience
					</Typography>

					<Marquee
						pauseOnHover={true}
						style={{ width: '100vw' }}
					>
						{testimonials.map((testimony, index) => (
							<TestimonialContainer
								key={index}
								sx={{ maxWidth: { xs: '350px', sm: '390px', md: '400px' } }}
							>
								<Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
									<Typography
										variant="subtitle2"
										sx={{ mr: 2, opacity: 0.8 }}
									>
										{testimony.description}
									</Typography>

									<Quote
										style={{ fill: '#FFF', flexShrink: 0, paddingTop: 3 }}
										size={18}
									/>
								</Box>

								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<CorporateAvatar
										sx={{
											background: 'url(' + testimony.companyLogo + ')',
											backgroundSize: 'contain',
										}}
									/>

									<Box sx={{ display: 'flex', flexDirection: 'column' }}>
										<Typography
											variant="subtitle2"
											sx={{ lineHeight: 1.5 }}
										>
											{testimony.position}
										</Typography>

										<Typography
											variant="subtitle2"
											sx={{ lineHeight: 1.5, opacity: 0.75 }}
										>
											{testimony.company}
										</Typography>
									</Box>
								</Box>
							</TestimonialContainer>
						))}
					</Marquee>

					<Box
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							pt: '140px',
						}}
					>
						<Box
							sx={{
								position: 'relative',
								width: '180px',
								height: '180px',
								borderRadius: '50%',
								zIndex: 5,
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									background: `url(${Collaborate})`,
									backgroundSize: 'contain',
									borderRadius: '50%',
									zIndex: 2,
								}}
							/>
							<PulseCircle index={0}></PulseCircle>
							<PulseCircle index={1}></PulseCircle>
							<PulseCircle index={2}></PulseCircle>
							<PulseCircle index={3}></PulseCircle>
						</Box>

						<Typography
							variant="h5"
							sx={{
								maxWidth: { xs: '100%', md: '45%' },
								mt: 12,
								fontWeight: 600,
								lineHeight: 1.3125,
								color: '#FFF',
							}}
						>
							We'll collaborate with you to seamlessly integrate Triage AI into your current
							ticketing workflow
						</Typography>
					</Box>

					<GradientDivider sx={{ mb: { xs: '70px' }, mt: { xs: '70px' } }} />

					<footer
						style={{
							width: '100%',
							// display: 'flex',
							// alignItems: 'flex-start',
							// justifyContent: 'space-between',
						}}
					>
						{/* <Box
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
							<Typography variant="subtitle1">Experience the future of customer support</Typography>
						</Box>

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
								<Typography
									variant="subtitle2"
									sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
								>
									{page}
								</Typography>
							))}
						</Box>

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

							<Typography
								variant="subtitle2"
								sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
							>
								Terms of Services
							</Typography>

							<Typography
								variant="subtitle2"
								sx={{ color: 'rgba(236, 255, 239, 0.6)', fontWeight: 600 }}
							>
								Privacy Policy
							</Typography>
						</Box>

						<a
							href="mailto:support@triageai.com"
							style={{ textDecoration: 'none' }}
						>
							<Box
								sx={{
									width: '320px',
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
