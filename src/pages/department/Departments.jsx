import {
	Box,
	Dialog,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	inputLabelClasses,
	styled,
} from '@mui/material';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { ChevronDown, Pencil, Search, Trash2, SquareUserRound, X, Plus } from 'lucide-react';
import { useDepartmentBackend } from '../../hooks/useDepartmentBackend';
import { useContext, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transition } from '../../components/sidebar';
import { AddDepartment } from './AddDepartment';
import { DeleteDepartment } from './DeleteDepartment';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import TablePagination from '@mui/material/TablePagination';

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

export const Departments = () => {
	const { getAllDepartmentsJoined, updateDepartment, removeDepartment } = useDepartmentBackend();
	const [page, setPage] = useState(0)
	const [size, setSize] = useState(10)
	const [totalDepartments, setTotalDepartments] = useState(0);
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [buttonClicked, setButtonClicked] = useState('');
    const [search, setSearch] = useState('');

	useEffect(() => {
        refreshDepartments()
    }, []);
	
	const handleChangePage = (e, newValue) => {
		console.log('page', e.target.value)
		console.log('size', size)
		console.log(departments.slice(page ? page*size - 1 : page*size, page*size + size))
		console.log(departments.length)
		setPage(newValue)
	}

	const handleChangeRowsPerPage = (e) => {
		setSize(e.target.value)
		setPage(0)
	}

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            refreshDepartments()
        }
    }

	const refreshDepartments = () => {

		getAllDepartmentsJoined(search, page + 1, size)
			.then(res => {
				setDepartments(res.data)
				setTotalDepartments(res.data.length)
			})
			.catch(err => {
				console.error(err);
			});
	}

	const handleDialogOpen = (department, button) => {
		setSelectedDepartment(department);
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
		refreshDepartments();
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
	};

	const handleDelete = () => {
		handleDeleteDialogClose();
		refreshDepartments();
	};

	return (
		<Layout
			title={'Department List'}
			subtitle={'View your departments and add new ones'}
			buttonInfo={{
				label: 'Add new department',
				icon: <Plus size={20} />,
			}}
            AddResource={AddDepartment}
			refreshResource={refreshDepartments}
		>
			<WhiteContainer noPadding>
				<Box sx={{ display: 'flex', alignItems: 'center', py: 1.75, px: 2.25 }}>
					<Box sx={{ position: 'relative', width: '20%', opacity: 0.2 }}>
						<SearchTextField
							disabled
							type="text"
							label="Search"
							variant="filled"
							placeholder="Search"
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
							<Search
								size={20}
							/>
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
								<Typography variant="overline">Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Agents</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Email Address</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Manager</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Created</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="overline"></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{departments.slice(page*size, page*size + size).map(department => (
							<TableRow
								key={department.dept_id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
									'& .MuiTableCell-root': {
										color: '#1B1D1F',
										fontWeight: 500,
										letterSpacing: '-0.02em',
									},
								}}
							>
								<TableCell>{department.name}</TableCell>
								<TableCell>{department.agent_count}</TableCell>
								<TableCell>{department.email_id}</TableCell>
								<TableCell>{department.manager_id ? department.manager?.firstname + ' ' +department.manager?.lastname : ''}</TableCell>
								<TableCell>{department.created}</TableCell>
								<TableCell
									component="th"
									scope="row"
									align="right"
								>
									<Stack
										direction="row"
										spacing={0.5}
										sx={{ justifyContent: 'flex-end' }}
									>
										<IconButton
											sx={{
												'&:hover': {
													background: '#f3f6fa',
													color: '#105293',
												},
											}}
											onClick={() => handleDialogOpen(department, 'edit')}
										>
											<Pencil size={18} />
										</IconButton>

										<IconButton
											sx={{
												'&:hover': {
													background: '#faf3f3',
													color: '#921010',
												},
											}}
											onClick={() => handleDialogOpen(department, 'delete')}
										>
											<Trash2 size={18} />
										</IconButton>
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Box>
				<TablePagination
					component="div"
					count={totalDepartments}
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
							aria-label="close dialog"
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

						<AddDepartment
							handleEdited={handleEdited}
							editDepartment={selectedDepartment}
						/>
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
								aria-label="close dialog"
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

						<DeleteDepartment
							editDepartment={selectedDepartment}
							handleDelete={handleDelete}
							handleClose={handleDeleteDialogClose}
						/>
					</Box>
				</Dialog>
			)}
		</Layout>
	);
};
