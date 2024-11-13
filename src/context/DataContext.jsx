import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAgentBackend } from '../hooks/useAgentBackend';
import { useTicketBackend } from '../hooks/useTicketBackend';
import { useDepartmentBackend } from '../hooks/useDepartmentBackend';
import { useRoleBackend } from '../hooks/useRoleBackend';
import { useSettingsBackend } from '../hooks/useSettingsBackend';
import { useSLABackend } from '../hooks/useSLABackend';
import { usePriorityBackend } from '../hooks/usePriorityBackend';
import { useGroupBackend } from '../hooks/useGroupBackend';
import { useStatusBackend } from '../hooks/useStatusBackend';
import { useTopicBackend } from '../hooks/useTopicBackend';
import { useQueueBackend } from '../hooks/useQueueBackend';
import { useFormBackend } from '../hooks/useFormBackend';
import { NotebookPen } from 'lucide-react';
import { useScheduleBackend } from '../hooks/useScheduleBackend';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const { getAllAgents } = useAgentBackend();
	const { getTicketsbyAdvancedSearch } = useTicketBackend();
	const { getAllDepartments } = useDepartmentBackend();
	const { getAllRoles } = useRoleBackend();
	const { getAllSettings } = useSettingsBackend();
	const { getAllSLAs } = useSLABackend();
	const { getAllPriorities } = usePriorityBackend();
	const { getAllGroups } = useGroupBackend();
	const { getAllStatuses } = useStatusBackend();
	const { getAllTopics } = useTopicBackend();
	const { getQueuesForAgent } = useQueueBackend();
	const { getAllSchedules } = useScheduleBackend();
	const { getAllForms } = useFormBackend();

	const [agents, setAgents] = useState([]);
	const [tickets, setTickets] = useState([]);
	const [totalTickets, setTotalTickets] = useState(0);

	const [departments, setDepartments] = useState([]);
	const [formattedDepartments, setFormattedDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [formattedRoles, setFormattedRoles] = useState([]);
	const [settings, setSettings] = useState({});

	const [slas, setSLAs] = useState([]);
	const [formattedSLAs, setFormattedSLAs] = useState([]);

	const [priorities, setPriorities] = useState([]);
	const [formattedPriorities, setFormattedPriorities] = useState([]);

	const [groups, setGroups] = useState([]);
	const [formattedGroups, setFormattedGroups] = useState([]);

	const [statuses, setStatuses] = useState([]);
	const [formattedStatuses, setFormattedStatuses] = useState([]);

	const [topics, setTopics] = useState([]);
	const [formattedTopics, setFormattedTopics] = useState([]);

	const [queues, setQueues] = useState([])
	const [queueIdx, setQueueIdx] = useState([])

	const [schedules, setSchedules] = useState([])
	const [formattedSchedules, setFormattedSchedules] = useState([])

	const [forms, setForms] = useState([])
	const [formattedForms, setFormattedForms] = useState([])

	const refreshAgents = useCallback(() => {
		getAllAgents().then(agentList => {
			setAgents(agentList.data);
		});
	}, [getAllAgents]);

	const refreshTickets = useCallback((size = 10, page = 1) => {
		getTicketsbyAdvancedSearch({ ...queues[queueIdx].config, 'size': size, 'page': page }).then(ticketList => {
			const { items, total } = ticketList.data;
			setTotalTickets(total)
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

	const refreshSLAs = useCallback(() => {
		getAllSLAs()
			.then(slas => {
				const slasData = slas.data;
				const formattedSLAs = slasData.map(sla => {
					return { value: sla.sla_id, label: sla.name };
				});

				setSLAs(slasData);
				setFormattedSLAs(formattedSLAs);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllSLAs]);

	const refreshPriorities = useCallback(() => {
		getAllPriorities()
			.then(priority => {
				const priorityData = priority.data;
				const formattedPriorities = priorityData.map(priority => {
					return { value: priority.priority_id, label: priority.priority_desc };
				});

				setPriorities(priorityData);
				setFormattedPriorities(formattedPriorities);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllPriorities]);

	const refreshGroups = useCallback(() => {
		getAllGroups()
			.then(group => {
				const groupData = group.data;
				const formattedGroups = groupData.map(group => {
					return { value: group.group_id, label: group.name };
				});

				setGroups(groupData);
				setFormattedGroups(formattedGroups);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllGroups]);

	const refreshStatuses = useCallback(() => {
		getAllStatuses()
			.then(status => {
				const statusData = status.data;
				const formattedStatuses = statusData.map(status => {
					return { value: status.status_id, label: status.name };
				});

				setStatuses(statusData);
				setFormattedStatuses(formattedStatuses);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllStatuses]);

	const refreshTopics = useCallback(() => {
		getAllTopics()
			.then(topic => {
				const topicData = topic.data;
				const formattedTopics = topicData.map(topic => {
					return { value: topic.topic_id, label: topic.topic };
				});

				setTopics(topicData);
				setFormattedTopics(formattedTopics);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllTopics]);

	const refreshQueues = useCallback(() => {
		getQueuesForAgent()
			.then(res => {
				res.data.map(entry => {
					entry.config = JSON.parse(entry.config)
				})
				setQueues(res.data)
				setQueueIdx(0)
			})
			.catch(err => {
				console.error(err);
			});
	}, [getQueuesForAgent]);

	const refreshSchedules = useCallback(() => {
		getAllSchedules()
			.then(schedules => {
				const schedulesData = schedules.data;
				const formattedSchedules = schedulesData.map(schedule => {
					return {
						value: schedule.schedule_id,
						label: schedule.name,
						sublabel: schedule.description.charAt(0).toUpperCase() + schedule.description.slice(1),
					};
				});
				setSchedules(schedulesData)
				setFormattedSchedules(formattedSchedules);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllSchedules]);

	const refreshForms = useCallback(() => {
		getAllForms()
			.then(form => {
				const formData = form.data;
				const formattedForms = formData.map(form => {
					return { value: form.form_id, label: form.title };
				});

				setForms(formData);
				setFormattedForms(formattedForms);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllForms]);


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
				refreshSettings,
				slas,
				formattedSLAs,
				refreshSLAs,
				refreshPriorities,
				priorities,
				formattedPriorities,
				refreshGroups,
				formattedGroups,
				groups,
				refreshStatuses,
				statuses,
				formattedStatuses,
				refreshTopics,
				topics,
				formattedTopics,
				queues,
				queueIdx,
				setQueueIdx,
				refreshQueues,
				totalTickets,
				refreshSchedules,
				schedules,
				formattedSchedules,
				forms,
				formattedForms,
				refreshForms
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
