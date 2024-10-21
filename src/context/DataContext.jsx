import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAgentBackend } from '../hooks/useAgentsBackend';
import { useTicketBackend } from '../hooks/useTicketBackend';
import { useDepartmentBackend } from '../hooks/useDepartmentBackend';
import { useRolesBackend } from '../hooks/useRoleBackend';
import { useSettingsBackend } from '../hooks/useSettingsBackend';
import { NotebookPen } from 'lucide-react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const { getAllAgents } = useAgentBackend();
	const { getTicketsbyAdvancedSearch } = useTicketBackend();
	const { getAllDepartments } = useDepartmentBackend();
	const { getAllRoles } = useRolesBackend();
	const { getAllSettings} = useSettingsBackend();

	const [agents, setAgents] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [formattedDepartments, setFormattedDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [formattedRoles, setFormattedRoles] = useState([]);
	const [settings, setSettings] = useState({});

	const refreshAgents = useCallback(() => {
		getAllAgents().then(agentList => {
			setAgents(agentList.data);
		});
	}, [getAllAgents]);

	const refreshTickets = useCallback((advSearch) => {
		getTicketsbyAdvancedSearch(advSearch).then(ticketList => {
			const { items } = ticketList.data;
			setTickets(items);
		});
	}, [getTicketsbyAdvancedSearch]);

	const refreshSettings = useCallback(() => {
		getAllSettings().then(settingsList => {
			var formattedSettings = {}
			Object.values(settingsList.data).forEach(setting => {
				formattedSettings[setting.key] = setting
			})
			setSettings(formattedSettings);
		});
	}, [getAllSettings]);

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
				settings,
				refreshSettings
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
