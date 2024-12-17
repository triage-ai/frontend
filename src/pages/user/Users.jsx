import { Box, Dialog, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { Mail, Pencil, Search, Trash2, UserRoundPlus, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Layout } from '../../components/layout';
import { Transition } from '../../components/sidebar';
import { WhiteContainer } from '../../components/white-container';
import { AuthContext } from '../../context/AuthContext';
import formatDate from '../../functions/date-formatter';
import { useUserBackend } from '../../hooks/useUserBackend';
import { AddUser } from './AddUser';
import { DeleteUser } from './DeleteUser';

export const SearchTextField = styled('input')({
	width: '100%',
	height: '42px',
	border: '1.5px solid #E5EFE9',
	borderRadius: '12px',
	padding: '10px',
	paddingLeft: '36px',
	fontWeight: 500,
	fontSize: '0.9375rem',
	color: '#000',
	position: 'relative',
	zIndex: 1,
	background: 'transparent',
	'&:hover': {
		background: 'transparent',
		borderColor: '#22874E',
	},
	'&::placeholder': {
		fontWeight: 500,
		color: '#575757',
	},
	'&:focus': {
		outline: 'none',
		borderColor: '#22874E',
	},
});

export const Users = () => {
	const { getAllUsersBySearch, resendConfirmationEmail } = useUserBackend();
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [totalUsers, setTotalUsers] = useState(0);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [buttonClicked, setButtonClicked] = useState('');
	const [search, setSearch] = useState('');
	const { agentAuthState, permissions } = useContext(AuthContext);

	useEffect(() => {
		refreshUsers();
	}, [page, size]);

	const handleChangePage = (e, newValue) => {
		setPage(newValue);
	};

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value);
	};

	const handleSearchChange = (e) => {
		setSearch(e.target.value);
	};

	const handleSearch = (e) => {
		if (e.key === 'Enter') {
			refreshUsers();
		}
	};

	const resendEmail = (user_id) => {
		//Do some notification here
		resendConfirmationEmail(user_id).catch((error) => {
			console.error(error);
		});
		// window.location.reload();
	};

	const refreshUsers = () => {
		getAllUsersBySearch(search, page + 1, size)
			.then((res) => {
				setUsers(res.data.items);
				setTotalUsers(res.data.total);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handleDialogOpen = (user, button) => {
		setSelectedUser(user);
		setButtonClicked(button);

		if (button === 'edit') {
			setOpenDialog(true);
		} else if (button === 'delete') {
			setOpenDeleteDialog(true);
		}
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleEdited = () => {
		handleDialogClose();
		refreshUsers();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshUsers();
	};

	return (
		<Layout
			title={'User List'}
			subtitle={'View your users and add new ones'}
			buttonInfo={{
				label: 'Add user',
				icon: <UserRoundPlus size={20} />,
				hidden: permissions.hasOwnProperty('user.create')
			}}
			AddResource={AddUser}
			refreshResource={refreshUsers}
		>
			<WhiteContainer noPadding>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
					<Box sx={{ position: 'relative', width: '20%', opacity: 1 }}>
						<SearchTextField
							type='text'
							label='Search'
							variant='filled'
							placeholder='Search'
							onKeyDown={handleSearch}
							onChange={handleSearchChange}
							sx={{ '&:hover': { borderColor: '#E5EFE9' } }}
						/>
						<Box
							sx={{
								width: '42px',
								height: '40px',
								position: 'absolute',
								top: 0,
								left: 0,
								zIndex: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Search size={20} />
						</Box>
					</Box>
				</Box>

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
								<Typography variant='overline'>Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant='overline'>Status</Typography>
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
						{users.map((user) => (
							<TableRow
								key={user.user_id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
									'& .MuiTableCell-root': {
										color: '#1B1D1F',
										fontWeight: 500,
										letterSpacing: '-0.02em',
									},
								}}
							>
								<TableCell>{user.firstname + ' ' + user.lastname}</TableCell>
								<TableCell>{user.status === 0 ? 'Complete' : user.status === 1 ? 'Pending' : 'Guest'}</TableCell>
								<TableCell>{formatDate(user.created, 'MM-DD-YY hh:mm A')}</TableCell>
								<TableCell>{formatDate(user.updated, 'MM-DD-YY hh:mm A')}</TableCell>
								<TableCell component='th' scope='row' align='right'>
									<Stack direction='row' spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
										{permissions.hasOwnProperty('user.edit') && (
												<IconButton
													sx={{
														'&:hover': {
															background: '#f3f6fa',
															color: '#105293',
														},
													}}
													onClick={() => handleDialogOpen(user, 'edit')}
												>
													<Pencil size={18} />
												</IconButton>
										)}

										{permissions.hasOwnProperty('user.delete') && (
											<IconButton
												sx={{
													'&:hover': {
														background: '#faf3f3',
														color: '#921010',
													},
												}}
												onClick={() => handleDialogOpen(user, 'delete')}
											>
												<Trash2 size={18} />
											</IconButton>
										)}
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Box>
					<TablePagination
						component='div'
						count={totalUsers}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={size}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box>
			</WhiteContainer>

			{buttonClicked === 'edit' && (
				<Dialog
					open={openDialog}
					TransitionComponent={Transition}
					onClose={handleDialogClose}
					PaperProps={{
						sx: {
							width: '100%',
							maxWidth: 'unset',
							height: 'calc(100% - 64px)',
							maxHeight: 'unset',
							margin: 0,
							background: '#f1f4f2',
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							padding: 2,
						},
					}}
					sx={{ '& .MuiDialog-container': { alignItems: 'flex-end' } }}
				>
					<Box sx={{ maxWidth: '650px', margin: '14px auto 0px', textAlign: 'center' }}>
						<IconButton
							aria-label='close dialog'
							onClick={handleDialogClose}
							sx={{
								width: '40px',
								height: '40px',
								position: 'fixed',
								right: '26px',
								top: 'calc(64px + 26px)',
								color: '#545555',
								transition: 'all 0.2s',
								'&:hover': {
									color: '#000',
								},
							}}
						>
							<X size={20} />
						</IconButton>

						<AddUser handleEdited={handleEdited} editUser={selectedUser} />
					</Box>
				</Dialog>
			)}

			{buttonClicked === 'delete' && (
				<Dialog
					open={openDeleteDialog}
					onClose={handleDeleteDialogClose}
					PaperProps={{
						sx: {
							maxWidth: '500px',
							background: '#f1f4f2',
							py: 2,
							px: 3,
							m: 2,
							borderRadius: '10px',
						},
					}}
				>
					<Box sx={{ textAlign: 'center' }}>
						<Box sx={{ width: '100%', textAlign: 'right', pb: 2 }}>
							<IconButton
								aria-label='close dialog'
								onClick={handleDeleteDialogClose}
								sx={{
									width: '40px',
									height: '40px',
									color: '#545555',
									transition: 'all 0.2s',
									'&:hover': {
										color: '#000',
									},
								}}
							>
								<X size={20} />
							</IconButton>
						</Box>

						<DeleteUser editUser={selectedUser} handleDelete={handleDelete} handleClose={handleDeleteDialogClose} />
					</Box>
				</Dialog>
			)}
		</Layout>
	);
};
