import { MailPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../components/layout';
import { WhiteContainer } from '../../../components/white-container';

export const Emails = (props) => {
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);

	const [openDialog, setOpenDialog] = useState(false);
	const [priorities, setPriorities] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('');
	const [ticketList, setTicketList] = useState([]);
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({});

	return (
		<Layout
			title={'Emails'}
			subtitle={'View all registered email addresses'}
			buttonInfo={{
				label: 'Add new email',
				icon: <MailPlus size={20} />,
				hidden: true,
			}}
		>
			<WhiteContainer noPadding>
				<p>Emails</p>
			</WhiteContainer>
		</Layout>
	);
};
