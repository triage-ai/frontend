import { Layout } from '../../components/layout';
import { WhiteContainer } from '../../components/white-container';
import { Pencil, Search, TicketPlus, Trash2, X, UserRoundPen } from 'lucide-react';

export const Profiles = () => {
    return (
        <Layout
			title={'Profile'}
			subtitle={'Edit your profile'}
			buttonInfo={{
				label: 'Edit Profile',
				icon: <UserRoundPen size={20} />,
			}}
        >
            <WhiteContainer noPadding></WhiteContainer>
		</Layout>
    )
}