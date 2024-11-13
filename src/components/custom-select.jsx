import {
	Box,
	Button,
	MenuItem,
	TextField,
	Typography,
	alpha,
	styled,
	Autocomplete,
	Popper,
	Paper,
} from '@mui/material';
import { useEffect } from 'react';

export const CustomInput = styled(props => (
	<TextField
		slotProps={{
			input: {
				disableUnderline: true,
				...props.InputProps
			}
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		borderRadius: 12,
		backgroundColor: 'transparent',
		border: '1.5px solid #E5EFE9',
		transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
		fontSize: '0.9375rem',
		fontWeight: 500,
		textAlign: 'left',
		'&:hover': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
		'&.Mui-focused': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
	},
	'& label.Mui-focused': {
		color: '#545555',
	},
}));

const CustomMultibox = styled(props => <Autocomplete {...props} />)(({ theme }) => ({
	'& fieldset': {
		overflow: 'hidden',
		borderRadius: 12,
		backgroundColor: 'transparent',
		border: '1.5px solid #E5EFE9',
		transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
		fontSize: '0.9375rem',
		fontWeight: 500,
		textAlign: 'left',
		'&:hover': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
		'&.Mui-focused': {
			backgroundColor: 'transparent',
			borderColor: '#22874E',
		},
	},
	'& label.Mui-focused': {
		color: '#545555',
	},
}));

export const CustomSelect = ({
	label,
	options,
	halfWidth,
	addNewButton,
	handleAddBtnClick,
	...props
}) => {
	const { mt, mb, ...otherProps } = props;

	return (
		<CustomInput
			variant="filled"
			label={label}
			defaultValue=""
			select
			sx={{ mt: mt, mb: mb, width: halfWidth && '49%' }}
			{...otherProps}
		>
			<MenuItem value="">
				<Typography variant="subtitle2">- Choose {label.toLowerCase()} -</Typography>
			</MenuItem>

			{options?.map(option => (
				<MenuItem
					key={option.value}
					value={option.value}
					sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
				>
					{option.label}{' '}
					{option.sublabel && (
						<Typography
							variant="caption"
							sx={{ lineHeight: 1, color: '#545555' }}
						>
							({option.sublabel})
						</Typography>
					)}
				</MenuItem>
			))}

			{addNewButton && (
				<Box
					sx={{ px: 2, pb: 1, pt: 2, mt: 1, borderTop: '1px solid #E5EFE9', textAlign: 'center' }}
				>
					<Button
						sx={{
							backgroundColor: 'transparent',
							border: '1.5px solid #22874E',
							color: '#22874E',
							borderRadius: '12px',
							width: '100%',
							fontSize: '0.9375rem',
							fontWeight: 600,
							lineHeight: 1,
							textTransform: 'unset',
							padding: '12px 10px',
							transition: 'all 0.3s',
							'&:hover': {
								backgroundColor: '#f1f4f2',
							},
						}}
						onClick={handleAddBtnClick}
					>
						Add new {label.toLowerCase()}
					</Button>
				</Box>
			)}
		</CustomInput>
	);
};

export const CustomAutocomplete = ({
	label,
	options,
	halfWidth,
	addNewButton,
	handleAddBtnClick,
	getOptionLabel,
	onInputChange,
	renderOption,
	value,
	name,
	onChange,
	size,
	...props
}) => {
	const { mt, mb, ...otherProps } = props;

	return (
		<CustomMultibox
			{...otherProps}
			disablePortal
			options={options}
			value={value}
			mb={mb}
			getOptionLabel={getOptionLabel}
			type="text"
			name={name}
			size={size}
			onInputChange={onInputChange}
			filterOptions={x => x}
			onChange={onChange}
			// sx={{
			// 	width: 250,
			// 	m: 1,
			// 	'& .MuiInputBase-root': {
			// 		fontWeight: 600,
			// 	},
			// 	'.MuiOutlinedInput-notchedOutline': {
			// 		borderRadius: '8px',
			// 		borderColor: '#E5EFE9',
			// 	},
			// }}
			PopperComponent={props => (
				<Popper
					{...props}
					style={{ maxWidth: 400 }}
					placement="bottom-start"
				/>
			)}
			renderOption={renderOption}
			renderInput={props => (
				<CustomInput
					{...props}
					label={label}
					variant='filled'
				/>
			)}
		/>
	);
};
