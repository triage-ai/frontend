import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { MailPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomSelect } from '../../components/custom-select';
import { Layout } from '../../components/layout';
import { CircularButton } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { useData } from '../../context/DataContext';
import { useSettingsBackend } from '../../hooks/useSettingsBackend';
// import { useTemplateBackend } from '../../hooks/useTemplateBackend';

const EmailSelect = ({ handleInputChange, value, label, name }) => {
	const { formattedEmails, refreshEmails } = useData();

	useEffect(() => {
		refreshEmails();
	}, []);

	return (
		<>
			<CustomSelect label={label} onChange={handleInputChange} value={value} name={name} mb={2} fullWidth options={formattedEmails} />
		</>
	);
};

// const TemplateSelect = ({ handleInputChange, value, label, name }) => {
// 	const { formattedTemplates, refreshTemplates } = useData();

// 	useEffect(() => {
// 		refreshTemplates();
// 	}, []);

// 	return (
// 		<>
// 			<CustomSelect label={label} onChange={handleInputChange} value={value} name={name} mb={2} fullWidth options={formattedTemplates} />
// 		</>
// 	);
// };

const handleSave = (settingsFormData, setLoading, setCircleLoading, UpdateSettings, refreshSettings, settings) => {
	try {
		var temp = settings;
		temp.default_alert_email.value = settingsFormData.default_alert_email.toString();
		temp.default_system_email.value = settingsFormData.default_system_email.toString();
		temp.admin_email.value = settingsFormData.admin_email.toString();

		var settings_update = [];
		settings_update.push(temp.default_system_email, temp.default_alert_email, temp.admin_email);

		settings_update = settings_update.map((item) => ({
			...item,
			value: item.value === '' ? null : item.value,
		}));
		// var template_map = {};

		// Object.entries(templateFormData).forEach((value) => {
		// 	if (value[1] !== '') {
		// 		template_map[value[1]] = value[0];
		// 	}
		// });

		// var template_updates = [];
		// var template_update = [...templates];

		// template_update.map((template) => {
		// 	if (template.template_name in template_map) {
		// 		template.code_name = template_map[template.template_name];
		// 		template_updates.push(template);
		// 	}
		// });

		setCircleLoading(true);
		UpdateSettings(settings_update)
			.then((res) => {
				refreshSettings();
			})
			.catch((err) => {
				console.error(err);
			});

		// bulkUpdateTemplate(template_updates)
		// 	.then((res) => {
		// 		refreshTemplates();
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});

		setCircleLoading(false);
		setLoading(true);
	} catch (err) {
		console.error('Error with saving settings:', err);
	}
};

export const EmailSettings = () => {
	const [loading, setLoading] = useState(true);
	const { updateSettings } = useSettingsBackend();
	// const { bulkUpdateTemplate, updateTemplate } = useTemplateBackend();
	const { settings, refreshSettings, templates, refreshTemplates } = useData();
	const [circleLoading, setCircleLoading] = useState(false);
	const [validForm, setValidForm] = useState(false);
	const [settingsFormData, settingsSetFormData] = useState({
		default_system_email: '',
		default_alert_email: '',
		admin_email: '',
	});
	// const [templateFormData, templateSetFormData] = useState({
	// 	user_new_activity_notice: '',
	// 	user_new_message_auto_response: '',
	// 	user_new_ticket_auto_reply: '',
	// 	user_new_ticket_auto_response: '',
	// 	user_new_ticket_notice: '',
	// 	user_overlimit_notice: '',
	// 	user_reponse_template: '',
	// 	agent_internal_activity_alert: '',
	// 	agent_new_message_alert: '',
	// 	agent_new_ticket_alert: '',
	// 	agent_overdue_ticket_alert: '',
	// 	agent_ticket_assignment_alert: '',
	// 	agent_ticket_transfer_alert: '',
	// 	task_new_activity_alert: '',
	// 	task_new_activity_notice: '',
	// 	task_new_task_alert: '',
	// 	task_overdue_task_alert: '',
	// 	task_task_assignment_alert: '',
	// 	task_task_transfer_alert: '',
	// });

	useEffect(() => {
		refreshSettings();
		refreshTemplates();
	}, []);

	useEffect(() => {
		settingsSetFormData({
			default_system_email: settings?.default_system_email?.value ?? '',
			default_alert_email: settings?.default_alert_email?.value ?? '',
			admin_email: settings?.admin_email?.value ?? '',
		});
	}, [settings]);

	// useEffect(() => {
	// 	const updatedFormData = { ...templateFormData };

	// 	templates.forEach((template) => {
	// 		if (updatedFormData.hasOwnProperty(template.code_name)) {
	// 			updatedFormData[template.code_name] = template.template_name;
	// 		}
	// 	});

	// 	templateSetFormData(updatedFormData);
	// }, [templates]);

	// useEffect(() => {
	// 	const isValid = validateSave();
	// 	setValidForm(isValid);
	// }, [templateFormData]);

	const handleChangeSettings = (entry) => {
		settingsSetFormData({
			...settingsFormData,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	// const handleChangeTemplates = (entry) => {
	// 	templateSetFormData({
	// 		...templateFormData,
	// 		[entry.target.name]: entry.target.value,
	// 	});

	// 	setLoading(false);
	// };

	// const handleClearTemplate = (event, template) => {
	// 	event.stopPropagation();
	// 	templateSetFormData({
	// 		...templateFormData,
	// 		[template] : ''
	// 	})
	// 	var templateToClear = templates.find((item) => item.code_name === template);
	// 	templateToClear.code_name = null;
	// 	updateTemplate(templateToClear)
	// 		.then((res) => {
	// 			refreshTemplates();
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 		});
	// };

	// const validateSave = () => {
	// 	const values = Object.values(templateFormData).filter(value => value !== '');
	// 	const hasDuplicates = values.length !== new Set(values).size;
	// 	return hasDuplicates
	// }

	return (
		<Layout
			title={'Email Settings'}
			subtitle={'Email settings and options'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
		>
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>
					<Typography variant='subtitle1'>Note: Some of these global settings can be changed at the department level</Typography>

					<Typography variant='h4' pb={2}>
						Email Selection
					</Typography>

					<Stack sx={{ maxWidth: 400, pb: 2 }}>
						<EmailSelect
							handleInputChange={handleChangeSettings}
							value={settingsFormData?.default_system_email}
							name='default_system_email'
							label='Default System Email'
						/>

						<EmailSelect
							handleInputChange={handleChangeSettings}
							value={settingsFormData?.default_alert_email}
							name='default_alert_email'
							label='Default Alert Email'
						/>

						<EmailSelect handleInputChange={handleChangeSettings} value={settingsFormData?.admin_email} name='admin_email' label='Admin Email' />
					</Stack>

					{/* <Typography variant='h4'>Email Templates</Typography>
					<Typography variant='subtitle1'>Note: Clicking 'x' on a selected template will automatically remove the template from that alert and save</Typography>

					<Stack sx={{ maxWidth: 400, pb: 2 }}>
						<Typography variant='subtitle1'>Ticket End-User Templates</Typography>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_new_activity_notice}
								name='user_new_activity_notice'
								label='New Activity Notice'
							/>

							{templates.find((item) => item.code_name === 'user_new_activity_notice') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_new_activity_notice')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_new_message_auto_response}
								name='user_new_message_auto_response'
								label='New Message Auto-Response'
							/>

							{templates.find((item) => item.code_name === 'user_new_message_auto_response') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_new_message_auto_response')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_new_ticket_auto_reply}
								name='user_new_ticket_auto_reply'
								label='New Ticket Auto-Reply'
							/>

							{templates.find((item) => item.code_name === 'user_new_ticket_auto_reply') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_new_ticket_auto_reply')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_new_ticket_auto_response}
								name='user_new_ticket_auto_response'
								label='New Ticket Auto-Response'
							/>

							{templates.find((item) => item.code_name === 'user_new_ticket_auto_response') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_new_ticket_auto_response')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_new_ticket_notice}
								name='user_new_ticket_notice'
								label='New Ticket Notice'
							/>

							{templates.find((item) => item.code_name === 'user_new_ticket_notice') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_new_ticket_notice')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_overlimit_notice}
								name='user_overlimit_notice'
								label='Overlimit Notice'
							/>

							{templates.find((item) => item.code_name === 'user_overlimit_notice') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_overlimit_notice')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.user_reponse_template}
								name='user_reponse_template'
								label='Response/Reply Template'
							/>

							{templates.find((item) => item.code_name === 'user_reponse_template') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'user_reponse_template')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Typography variant='subtitle1'>Ticket Agent Templates</Typography>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_internal_activity_alert}
								name='agent_internal_activity_alert'
								label='Internal Activity Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_internal_activity_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_internal_activity_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_new_message_alert}
								name='agent_new_message_alert'
								label='New Message Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_new_message_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_new_message_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_new_ticket_alert}
								name='agent_new_ticket_alert'
								label='New Ticket Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_new_ticket_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_new_ticket_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_overdue_ticket_alert}
								name='agent_overdue_ticket_alert'
								label='Overdue Ticket Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_overdue_ticket_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_overdue_ticket_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_ticket_assignment_alert}
								name='agent_ticket_assignment_alert'
								label='Ticket Assignment Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_ticket_assignment_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_ticket_assignment_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.agent_ticket_transfer_alert}
								name='agent_ticket_transfer_alert'
								label='Ticket Transfer Alert'
							/>

							{templates.find((item) => item.code_name === 'agent_ticket_transfer_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'agent_ticket_transfer_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Typography variant='subtitle1'>Task Email Templates</Typography>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_new_activity_alert}
								name='task_new_activity_alert'
								label='New Activity Alert'
							/>

							{templates.find((item) => item.code_name === 'task_new_activity_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_new_activity_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_new_activity_notice}
								name='task_new_activity_notice'
								label='New Activity Notice'
							/>

							{templates.find((item) => item.code_name === 'task_new_activity_notice') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_new_activity_notice')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_new_task_alert}
								name='task_new_task_alert'
								label='New Task Alert'
							/>

							{templates.find((item) => item.code_name === 'task_new_task_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_new_task_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_overdue_task_alert}
								name='task_overdue_task_alert'
								label='Overdue Task Alert'
							/>

							{templates.find((item) => item.code_name === 'task_overdue_task_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_overdue_task_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_task_assignment_alert}
								name='task_task_assignment_alert'
								label='Task Assignment Alert'
							/>

							{templates.find((item) => item.code_name === 'task_task_assignment_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_task_assignment_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack>

						<Stack direction='row' alignItems='center' spacing={0.5} pb={2}>
							<TemplateSelect
								handleInputChange={handleChangeTemplates}
								value={templateFormData?.task_task_transfer_alert}
								name='task_task_transfer_alert'
								label='Task Transfer Alert'
							/>

							{templates.find((item) => item.code_name === 'task_task_transfer_alert') && (
								<IconButton
									sx={{ borderRadius: '8px' }}
									aria-label='edit'
									onClick={(event) => handleClearTemplate(event, 'task_task_transfer_alert')}
								>
									<X size={16} />
								</IconButton>
							)}
						</Stack> */}

					<CircularButton
						sx={{ py: 2, px: 6, width: 250 }}
						onClick={() => handleSave(settingsFormData, setLoading, setCircleLoading, updateSettings, refreshSettings, settings)}
						disabled={loading || circleLoading}
					>
						{circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
					</CircularButton>

					{validForm && (
						<Typography variant='subtitle1' color='red'>
							Error: Cannot select the same template for multiple alert scenarios
						</Typography>
					)}
				</Box>
			</WhiteContainer>
		</Layout>
	);
};
