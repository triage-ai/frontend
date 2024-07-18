import { Typography } from '@mui/material';
import { Layout } from '../../components/layout';

export const Dashboard = () => {
	return (
		<Layout
			title={'Hello, Bertrand Bruandet'}
			subtitle={"Here's what's going on today."}
		>
			<Typography>Dashboard</Typography>
		</Layout>
	);
};
