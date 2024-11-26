import { Typography } from '@mui/material';
import { MailPlus } from 'lucide-react';
import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';

export const EmailBanlist = (props) => {
	return (
		<Layout
			title={'Banlist'}
			subtitle={'View all banned email addresses'}
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
