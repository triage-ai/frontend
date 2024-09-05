import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAgentsBackend } from '../hooks/useAgentsBackend';
import { useTicketsBackend } from '../hooks/useTicketsBackend';
import { useDepartmentsBackend } from '../hooks/useDepartmentsBackend';
import { useRolesBackend } from '../hooks/useRolesBackend';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const { getAllAgents } = useAgentsBackend();
	const { getAllOpenTickets } = useTicketsBackend();
	const { getAllDepartments } = useDepartmentsBackend();
	const { getAllRoles } = useRolesBackend();

	const [agents, setAgents] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [formattedDepartments, setFormattedDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [formattedRoles, setFormattedRoles] = useState([]);

	const refreshAgents = useCallback(() => {
		getAllAgents().then(agentList => {
			setAgents(agentList.data);
		});
	}, [getAllAgents]);

	const refreshTickets = useCallback(() => {
		getAllOpenTickets().then(ticketList => {
			const { items } = ticketList.data;
			setTickets(items);
		});
	}, [getAllOpenTickets]);

	const refreshDepartments = useCallback(() => {
		getAllDepartments()
			.then(depts => {
				const departmentsData = depts.data;
				const formattedDepts = departmentsData.map(dept => {
					return { value: dept.dept_id, label: dept.name };
				});

				setDepartments(departmentsData);
				setFormattedDepartments(formattedDepts);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllDepartments]);

	const refreshRoles = useCallback(() => {
		getAllRoles()
			.then(roles => {
				const rolesData = roles.data;
				const formattedRoles = rolesData.map(role => {
					return { value: role.role_id, label: role.name };
				});

				setRoles(rolesData);
				setFormattedRoles(formattedRoles);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllRoles]);

	return (
		<DataContext.Provider
			value={{
				agents,
				refreshAgents,
				tickets,
				refreshTickets,
				departments,
				formattedDepartments,
				refreshDepartments,
				roles,
				formattedRoles,
				refreshRoles,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
