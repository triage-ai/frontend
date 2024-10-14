import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useTicketsBackend = () => {
	const { agentAuthState } = useContext(AuthContext);

	const getAllOpenTickets = async () => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(
			process.env.REACT_APP_BACKEND_URL + 'ticket/search?status_id=1&order_by=created',
			config
		);
	};

	const getTicketById = async id => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + `ticket/id/${id}`, config);
	};

	const createTicket = async ticketInfo => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'ticket/create',
			ticketInfo,
			config
		);
	};

	const updateTicket = async (ticketId, ticketInfo) => {
		const config = {
			headers: { Authorization: `Bearer ${agentAuthState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'ticket/put/' + ticketId,
			ticketInfo,
			config
		);
	};

	return { getAllOpenTickets, getTicketById, createTicket, updateTicket };
};
