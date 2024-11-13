import {
	Box,
	Chip,
	Dialog,
	Drawer,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import { Layout } from '../../../components/layout';
import { WhiteContainer } from '../../../components/white-container';
import { ChevronDown, MailPlus, Pencil, Search, TicketPlus, Trash2, X } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { useData } from '../../../context/DataContext';
import { Transition } from '../../../components/sidebar';
import { SearchTextField } from '../../agent/Agents';
import { useQueueBackend } from '../../../hooks/useQueueBackend';
import { TicketDetailContainer } from '../../ticket/TicketDetailContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { getQueriesForElement } from '@testing-library/react';
import { AuthContext } from '../../../context/AuthContext';

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
