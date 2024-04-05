import {
	Box,
	FormControlLabel,
	IconButton,
	Switch,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Pencil } from 'lucide-react';

export const EmailTable = ({ routes }) => {
	return (
		<>
			<TableHead>
				<TableRow>
					<TableCell sx={{ pl: 0, borderColor: '#EFEFEF', width: '30%' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Email address
						</Typography>
					</TableCell>
					<TableCell sx={{ borderColor: '#EFEFEF' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Level
						</Typography>
					</TableCell>
					<TableCell sx={{ borderColor: '#EFEFEF' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Status
						</Typography>
					</TableCell>
					<TableCell sx={{ borderColor: '#EFEFEF' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Area of expertise
						</Typography>
					</TableCell>
					{/* <TableCell sx={{ borderColor: '#EFEFEF' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Email
						</Typography>
					</TableCell>
					<TableCell sx={{ borderColor: '#EFEFEF' }}>
						<Typography
							variant="caption"
							sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9A9FA5' }}
						>
							Slack
						</Typography>
					</TableCell> */}
					<TableCell
						align="right"
						sx={{ borderColor: '#EFEFEF' }}
					></TableCell>
				</TableRow>
			</TableHead>

			<TableBody>
				{routes.map(
					(routeArray, index) =>
						typeof routeArray[1] !== 'string' &&
						routeArray[1].map(route => (
							<TableRow
								key={route + index}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell
									component="th"
									scope="row"
									sx={{ pl: 0, borderColor: '#EFEFEF', width: '30%' }}
								>
									<Typography
										variant="body1"
										sx={{
											fontSize: '0.9375rem',
											fontWeight: 600,
											color: '#1B1D1F',
											wordWrap: 'break-word',
										}}
									>
										{route}
									</Typography>
								</TableCell>
								<TableCell sx={{ borderColor: '#EFEFEF' }}>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
									>
										{'Developer'}
									</Typography>
								</TableCell>
								<TableCell sx={{ borderColor: '#EFEFEF', alignItems: 'center' }}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Box
											sx={{
												width: '6px',
												height: '6px',
												background: '#83BF6E',
												mr: 0.5,
												borderRadius: '20px',
												mb: 0.2,
											}}
										/>
										<Typography
											variant="body1"
											sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
										>
											{'Active'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell sx={{ borderColor: '#EFEFEF' }}>
									<Typography
										variant="body1"
										sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
									>
										{routeArray[0]}
									</Typography>
								</TableCell>
								{/* <TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="body1"
									sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
								>
									{route.fat}
								</Typography>
							</TableCell>
							<TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="body1"
									sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
								>
									{route.calories}
								</Typography>
							</TableCell>
							<TableCell sx={{ borderColor: '#EFEFEF' }}>
								<Typography
									variant="body1"
									sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#575757' }}
								>
									{route.fat}
								</Typography>
							</TableCell> */}
								<TableCell
									align="right"
									sx={{ borderColor: '#EFEFEF' }}
								>
									<IconButton
										aria-label="edit"
										sx={{
											background: '#EFEFEF',
											color: '#575757',
											padding: '10px',
											mr: '12px',
											'&:hover': {
												color: '#2B85FF',
											},
										}}
									>
										<Pencil size={18} />
									</IconButton>

									{/* <Switch defaultChecked /> */}
								</TableCell>
							</TableRow>
						))
				)}

				{routes.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={5}
							component="th"
							scope="row"
							sx={{ pl: 0 }}
						>
							<Typography
								variant="body1"
								sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1B1D1F' }}
							>
								No email routing mechanisms have been added yet
							</Typography>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</>
	);
};
