import { Box, Stack, Typography } from '@mui/material';
import { CircularButton } from '../../components/sidebar';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { CustomFilledInput } from '../../components/custom-input';
import { useTopicBackend } from '../../hooks/useTopicBackend';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../hooks/useNotification';

export const AddTopic = ({ handleClose }) => {
	const { createTopic } = useTopicBackend();
	const { refreshTopics } = useData();

	const sendNotification = useNotification();

	const [topicData, setTopicData] = useState({
		name: '',
		permissions: '{}',
		notes: '',
	});

	const [isFormValid, setIsFormValid] = useState(false);

	useEffect(() => {
		const { name, permissions, notes } = topicData;
		const isValid = true;
		setIsFormValid(isValid);
	}, [topicData]);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setTopicData(prevFormData => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addTopic = () => {
		createTopic(topicData)
			.then(res => {
				refreshTopics();
				handleClose();
				sendNotification({ msg: 'Topic created successfully', variant: 'success' });
			})
			.catch(err => console.error(err));
	};

	return (
		<Box sx={{ px: 4 }}>
			<Typography
				variant="body1"
				sx={{ color: '#545555', mb: 3 }}
			>
				Provide the necessary information to create a new Topic.
			</Typography>

			<Stack
				// spacing={1.5}
				sx={{ alignItems: 'center' }}
			>
				<CustomFilledInput
					label="Name"
					onChange={handleInputChange}
					value={topicData.name}
					name="name"
					mb={2}
					fullWidth
				/>
			</Stack>

			<Stack
				direction={'row'}
				// spacing={1.5}
				sx={{ justifyContent: 'center', mt: 3.5, mb: 2 }}
			>
				<CircularButton
					sx={{
						background: 'transparent',
						color: '#22874E',
						fontWeight: 600,
						border: '1.5px solid #22874E',
						py: 2,
						px: 4,
						'Topics:hover': {
							background: '#FFF',
						},
					}}
					onClick={handleClose}
				>
					Cancel
				</CircularButton>

				<CircularButton
					sx={{ py: 2, px: 6 }}
					onClick={addTopic}
					disabled={!isFormValid}
				>
					Create Topic
				</CircularButton>
			</Stack>
		</Box>
	);
};
