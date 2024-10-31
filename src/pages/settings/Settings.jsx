
import { Settings2 } from 'lucide-react';
import { Layout } from '../../components/layout';
import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';


export const Settings = ({ Menu }) => {
	const { settings, refreshSettings } = useData();

	useEffect(() => {
		refreshSettings();
	}, []);

	return (
		<Layout
			title={'Settings'}
			subtitle={'Edit your settings'}
			buttonInfo={{
				label: 'Edit settings',
				icon: <Settings2 size={20} />,
			}}
		>
			{Object.keys(settings).length === 0 ? <></> : <Menu settingsData={settings} />}
		</Layout>
	);
};
