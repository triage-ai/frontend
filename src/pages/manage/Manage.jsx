import { BriefcaseBusiness } from 'lucide-react';
import { Layout } from '../../components/layout';

export const Manage = ({ Menu }) => {

	return (
		<Layout
			title={'Manage'}
			subtitle={'Manage your resources'}
			buttonInfo={{
				label: 'Manage',
				icon: <BriefcaseBusiness size={20} />,
			}}
		>
		</Layout>
	);
};
