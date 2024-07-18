import axios from 'axios';
import { useSetAuthCookie } from './useSetAuthCookie';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useTicketsBackend = () => {
	const { authState } = useContext(AuthContext);

	const getAllTickets = async () => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.get(process.env.REACT_APP_BACKEND_URL + 'ticket/get', config);
	};

	const createTicket = async ticketInfo => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.post(
			process.env.REACT_APP_BACKEND_URL + 'ticket/create',
			ticketInfo,
			config
		);
	};

	const updateTicket = async ticketInfo => {
		const config = {
			headers: { Authorization: `Bearer ${authState.token}` },
		};

		return await axios.put(
			process.env.REACT_APP_BACKEND_URL + 'ticket/put/' + ticketInfo.ticket_id,
			ticketInfo,
			config
		);
	};

	return { getAllTickets, createTicket, updateTicket };
};
