import { Box, IconButton, InputAdornment, Stack, styled, Tooltip, tooltipClasses, Typography } from '@mui/material';
import { CircleHelp, Eye, EyeOff, Pencil, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { CustomSelect } from '../../../components/custom-select';
import { CircularButton } from '../../../components/sidebar';
import { useEmailBackend } from '../../../hooks/useEmailBackend';

export const AddEmail = ({ handleCreated, handleEdited, editEmail }) => {
	const [isFormValid, setIsFormValid] = useState(false);
	const { updateEmail, createEmail } = useEmailBackend();
	const [passwordExists, setPasswordExists] = useState(true);
	const [emailChange, setEmailChange] = useState(true);
	const [editable, setEditable] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		email_from_name: '',
		notes: '',
		mail_server: '',
		status: 'Not Active',
	});

	const validateSubmit = () => {
		if (editEmail) {
			return !emailChange || (emailChange && formData.email && formData.password && formData.mail_server && validateEmail(formData.email));
		} else {
			return formData.email && formData.password && formData.mail_server && validateEmail(formData.email);
		}
	};

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: '#f5f5f9',
			color: 'rgba(0, 0, 0, 0.87)',
			fontSize: theme.typography.pxToRem(12),
			border: '1px solid #dadde9',
		},
	}));

	useEffect(() => {
		if (editEmail) {
			setFormData({
				email: editEmail.email,
				email_from_name: editEmail.email_from_name,
				notes: editEmail.notes,
				mail_server: editEmail.mail_server,
				status: editEmail.status,
			});
			setPasswordExists(false);
			setEmailChange(false);
		}
	}, [editEmail]);

	const handleChange = (entry) => {
		console.log(formData);
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
	};

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleAction = () => {
		if (editEmail) {
			try {
				var updates = { ...editEmail };
				if (!emailChange) {
					formData['password'] = editEmail.password;
					formData['status'] = editEmail.status;
				}
				Object.entries(formData).forEach((update) => {
					updates[update[0]] = update[1];
				});
				console.log(updates);
				updateEmail(updates)
					.then((res) => {
						handleEdited();
					})
					.catch((err) => console.error(err));
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				createEmail(formData)
					.then((res) => {
						handleCreated();
					})
					.catch((err) => console.error(err));
			} catch (error) {
				console.error(error);
			}
		}
	};

	useEffect(() => {
		const isValid = validateSubmit();
		setIsFormValid(isValid);
	}, [formData, emailChange]);

	const EmailChange = () => {
		setEmailChange(true);
		setPasswordExists(true);
		setEditable(false);
		setFormData((p) => ({
			...p,
			status: 'Not Active',
		}));
	};

	const ClearEmail = () => {
		setFormData((p) => ({
			...p,
			email: editEmail.email,
			password: '',
			status: editEmail.status,
		}));
		setEmailChange(false);
		setPasswordExists(false);
		setEditable(true);
	};

	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editEmail ? 'Edit email' : 'Add email'}
			</Typography>

			<Typography variant='subtitle2'>
				{editEmail ? 'Edit email information.' : 'Please fill out the following information for the new email.'}
			</Typography>

			<Box
				sx={{
					background: '#FFF',
					m: 4,
					p: 4,
					pt: 3,
					borderRadius: '12px',
					textAlign: 'left',
				}}
			>
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Required information
				</Typography>

				{editEmail ? (
					<Stack direction='row' alignItems='center' spacing={0.5}>
						{emailChange ? (
							<Stack direction='row' alignItems='center'>
								<CustomFilledInput label='Email Address' onChange={handleChange} value={formData?.email} name='email' fullWidth mb={2} />

								<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={ClearEmail}>
									<X size={16} />
								</IconButton>
							</Stack>
						) : (
							<Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
								{formData?.email}
							</Typography>
						)}

						{editable && (
							<IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={EmailChange}>
								<Pencil size={16} />
							</IconButton>
						)}

						<HtmlTooltip
							title={
								<React.Fragment>
									<Typography color='inherit'>Editiing Email Address</Typography>
									{'Changing the email will require you to update your password and re-verify the email!'}
									{" Hit the 'X' icon to cancel changes and restore the original email and password"}
								</React.Fragment>
							}
							placement='right'
							arrow
						>
							<CircleHelp size={20} />
						</HtmlTooltip>
					</Stack>
				) : (
					<CustomFilledInput label='Email Address' onChange={handleChange} value={formData?.email} name='email' fullWidth mb={2} />
				)}

				{passwordExists && (
					<Stack direction='row' alignItems='center' spacing={0.5}>
						<CustomFilledInput
							label='Password'
							onChange={handleChange}
							value={formData?.password}
							name='password'
							type={showPassword ? 'text' : 'password'}
							mb={2}
							fullWidth
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={(e) => e.preventDefault()}
										edge='end'
									>
										{showPassword ? <EyeOff /> : <Eye />}
									</IconButton>
								</InputAdornment>
							}
						/>

						<HtmlTooltip
							title={
								<React.Fragment>
									<Typography color='inherit'>Email Password</Typography>
									{'The password provided here will not be the regular password used to log in.'}
									{' This feature is only supported for Gmail. After creating a Gmail or if you have a Gmail already,'}
									{'make sure to enable 2FA under Account Settings > Security and head to'}{' '}
									<a href='https://myaccount.google.com/apppasswords'>this website</a>
									<br />
									<br />
									{'Pick a name that will specify this an App Password for this website and copy the password generated by Google.'}
									{' Paste this as the password into the box to the left.'}
								</React.Fragment>
							}
							placement='right'
							arrow
						>
							<CircleHelp size={20} />
						</HtmlTooltip>
					</Stack>
				)}

				<Typography variant='subtitle1' sx={{ mt: 2, mb: 1 }}>
					Email Server
				</Typography>
				<CustomSelect
					label='Email Server'
					onChange={handleChange}
					value={formData?.mail_server}
					name='mail_server'
					mb={2}
					fullWidth
					options={[{ label: 'smtp.gmail.com', value: 'smtp.gmail.com' }]}
				/>

				<Typography variant='h4' sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
					Optional information
				</Typography>

				<CustomFilledInput label='Email From Name' onChange={handleChange} value={formData?.email_from_name} name='email_from_name' fullWidth mb={2} />

				<CustomFilledInput label='Internal Notes' onChange={handleChange} value={formData?.notes} name='notes' fullWidth mb={2} />
			</Box>

			<Stack
				direction='row'
				// spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				<CircularButton sx={{ py: 2, px: 6 }} onClick={handleAction} disabled={!isFormValid}>
					{editEmail ? 'Edit' : 'Create'} email
				</CircularButton>
			</Stack>
		</>
	);
};
