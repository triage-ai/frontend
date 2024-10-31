import { Box, Select, Typography, styled, Tabs, Tab } from '@mui/material';
import { WhiteContainer } from '../../components/white-container';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { handleSave, StyledTabs, StyledSelect  } from '../settings/SettingsMenus';
import { Layout } from '../../components/layout';
import { Settings2 } from 'lucide-react';



const Header = ({ headers, components }) => {
	// const [menuState, setMenuState] = useState(headers[0].id);
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// const handleMenuChange = newMenuState => {
	// 	setMenuState(newMenuState);
	// };

	return (
		<Box>
			{/* Tab Bar */}
			<Box
				sx={{
					display: 'flex',
					mb: 4,
				}}
			>
				<StyledTabs
					value={tabValue}
					onChange={handleTabChange}
					variant='scrollable'
					scrollButtons='auto'
					sx={{
						position: 'relative',
						width: '100%',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: '100%',
							height: '2px',
							background: '#E5EFE9',
							zIndex: -1,
						},
					}}
				>
					{headers.map((header) => (
						<Tab label={header.label} sx={{ textTransform: 'none', p: 0, mr: 5 }} />
					))}
				</StyledTabs>
			</Box>

			{/* Tab Content */}
			<WhiteContainer noPadding>
				<Box sx={{ padding: 2 }}>{components[tabValue]}</Box>
			</WhiteContainer>
		</Box>
	);
};

export const Profile = () => {
	const headers = [
		{ id: 1, label: 'Account' },
		{ id: 2, label: 'Preferences' },
		{ id: 3, label: 'Signature' },
	];

	const components = [<Account />, <Preferences />, <Signature />];

	return (
		<Layout
		title={'Profile'}
		subtitle={'Edit your profile'}
		buttonInfo={{
			label: 'Edit Profile',
			icon: <Settings2 size={20} />,
			hidden: false
		}}
		>
			<Header headers={headers} components={components} />
		</Layout>
		
		
		
		
		
);
};




const Account = () => {
    return (
        <p>Account on Profile</p>
    )
}


const Preferences = () => {
    return (
        <p>Preferences on Profile</p>
    )
}

const Signature = () => {
    return (
        <p>Signature on Profile</p>
    )
}