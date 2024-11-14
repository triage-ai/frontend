import { MailPlus, Pencil, Trash2, X } from 'lucide-react';
import { Layout } from '../../../components/layout';
import { WhiteContainer } from '../../../components/white-container';
import { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { Table, TableCell, Typography, TableHead, TableRow, Stack, TableBody, IconButton, Drawer, Dialog, Box } from '@mui/material';
import { useEmailBackend } from '../../../hooks/useEmailBackend';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailDetail } from './EmailDetail';
import { Transition } from '../../../components/sidebar';
import { AddEmail } from './AddEmail';

export const Emails = () => {
	const { emails, refreshEmails } = useData();

	const [openDetail, setOpenDetail] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const navigate = useNavigate();
	const { emailId } = useParams();

	const [selectedEmail, setSelectedEmail] = useState({});

	useEffect(() => {
		refreshEmails();
	}, []);

	return (
		<Layout
			title={'Emails'}
			subtitle={'View all registered email addresses'}
			buttonInfo={{
				label: 'Add new email',
				icon: <MailPlus size={20} />,
				hidden: true,
			}}
		>
			<WhiteContainer noPadding>
			{emails.length !== 0 && (
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
									<Typography variant='overline'>Email</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='overline'>From Name</Typography>
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
							{emails.map((email) => (
								<TableRow
									key={email.email_id}
									// onClick={toggleDetailDrawer(true, email)}
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
										{email.email}
									</TableCell>
									<TableCell>{email.email_from_name}</TableCell>
									<TableCell>{email.notes}</TableCell>
									<TableCell>{email.created.replace('T', ' ')}</TableCell>
									<TableCell>{email.updated.replace('T', ' ')}</TableCell>
									<TableCell component='th' scope='row' align='right'>
										<Stack
											direction='row'
											// spacing={0.5}
											sx={{ justifyContent: 'flex-end' }}
										>
											<IconButton 
												// onClick={(event) => handleDialogOpen(event, template)}
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
		</Layout>
	);
};
