import { Typography } from '@mui/material';
import { MailPlus } from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';

export const EmailDiagnostic = (props) => {
	return (
		<Layout
			title={'Test Outgoing Email'}
			subtitle={'Use the following form to test whether your Outgoing Email settings are properly established'}
			buttonInfo={{
				label: 'Add email',
				icon: <MailPlus size={20} />,
				hidden: false,
			}}
		>
			<WhiteContainer noPadding>
				<Typography variant='h4' color='gray' sx={{ padding: 2 }}>
					Coming soon
				</Typography>
			</WhiteContainer>
		</Layout>
	);
};
