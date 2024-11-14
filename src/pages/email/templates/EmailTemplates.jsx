import { Drawer, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { MailPlus, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/layout';
import { WhiteContainer } from '../../../components/white-container';
import { useData } from '../../../context/DataContext';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';
import { TemplateDetail } from './TemplateDetail';

export const EmailTemplates = () => {
	const [templateList, setTemplateList] = useState([]);
	const { templates, refreshTemplates, refreshAgents } = useData();
	const { getAllTemplates } = useTemplateBackend();

	const [openDetail, setOpenDetail] = useState(false);
	const navigate = useNavigate();
	const { templateId } = useParams();

	const [selectedTemplate, setSelectedTemplate] = useState({});

	useEffect(() => {
		if (templates.length > 0 && templateId) {
			const template = {
				template_id: parseInt(templateId, 10),
			};
			setOpenDetail(true);
			setSelectedTemplate(template);
		}
	}, [templates, templateId]);

	useEffect(() => {
		refreshTemplates();
	}, []);


	const toggleDetailDrawer =
	(newOpen, template = null) =>
	() => {
		if (newOpen) {
			navigate('/email/templates/' + template.template_id);
		} else {
			navigate('/email/templates');
		}
		setOpenDetail(newOpen);
		setSelectedTemplate(template);
		refreshTemplates();
	};

	return (
		<Layout
			title={'Templates'}
			subtitle={'View all email templates'}
			buttonInfo={{
				label: 'Add new template',
				icon: <MailPlus size={20} />,
				hidden: true,
			}}
		>
			<WhiteContainer noPadding>
				{templates.length !== 0 && (
					<Table>
						<TableHead>
							<TableRow
								sx={{
									background: '#F1F4F2',
									'& .MuiTypography-overline': {
										color: '#545555',
									},
								}}
							>
								<TableCell>
									<Typography variant='overline'>Template Name</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Notes</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Created</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>Updated</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography variant='overline'></Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{templates.map((template) => (
								<TableRow
									key={template.ticket_id}
									onClick={toggleDetailDrawer(true, template)}
									sx={{
										'&:last-child td, &:last-child th': { border: 0 },
										'& .MuiTableCell-root': {
											color: '#1B1D1F',
											fontWeight: 500,
											letterSpacing: '-0.02em',
										},
										'&:hover': {
											background: '#f9fbfa',
											cursor: 'pointer',
										},
									}}
								>
									<TableCell component='th' scope='row' sx={{ maxWidth: '200px' }}>
										{template.code_name}
									</TableCell>
									<TableCell>{template.notes}</TableCell>
									<TableCell>{template.created.replace('T', ' ')}</TableCell>
									<TableCell>{template.updated.replace('T', ' ')}</TableCell>
									<TableCell component='th' scope='row' align='right'>
										<Stack
											direction='row'
											// spacing={0.5}
											sx={{ justifyContent: 'flex-end' }}
										>
											<IconButton
											// onClick={(event) => handleDialogOpen(event, ticket)}
											>
												<Pencil size={18} />
											</IconButton>

											<IconButton
											// onClick={(event) => handleDialogOpen(event, ticket)}
											>
												<Trash2 size={18} />
											</IconButton>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</WhiteContainer>

			<Drawer
				open={openDetail}
				anchor={'right'}
				onClose={toggleDetailDrawer(false)}
				PaperProps={{
					sx: {
						minWidth: 700,
						maxWidth: 735,
						margin: '12px',
						height: 'calc(100vh - 24px)',
						borderRadius: '24px',
						background: '#F1F4F2',
					},
				}}
			>
				<TemplateDetail templateInfo={selectedTemplate} closeDrawer={toggleDetailDrawer(false)}/>
			</Drawer>
		</Layout>
	);
};
