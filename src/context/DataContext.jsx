import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAgentsBackend } from '../hooks/useAgentsBackend';
import { useTicketsBackend } from '../hooks/useTicketsBackend';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const { getAllAgents } = useAgentsBackend();
	const { getAllTickets } = useTicketsBackend();

	const [agents, setAgents] = useState([]);
	const [tickets, setTickets] = useState([]);

	const refreshAgents = useCallback(() => {
		getAllAgents().then(agentList => {
			setAgents(agentList.data);
		});
	}, [getAllAgents]);

	const refreshTickets = useCallback(() => {
		getAllTickets().then(ticketList => {
			setTickets(ticketList.data);
		});
	}, [getAllTickets]);

	return (
		<DataContext.Provider
			value={{
				agents,
				refreshAgents,
				tickets,
				refreshTickets,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
