import {
    Box,
    FormControl,
    MenuItem,
    Select,
    Stack,
    styled,
    TextField,
    Typography,
    Autocomplete,
    Popper,
    CircularProgress
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
    ChevronDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTicketBackend } from '../../hooks/useTicketBackend';
import { useAgentBackend } from '../../hooks/useAgentsBackend';
import { useProrityBackend } from '../../hooks/usePriorityBackend';
import { useStatusBackend } from '../../hooks/useStatusBackend';
import { useSLABackend } from '../../hooks/useSLABackend';
import { useDepartmentBackend } from '../../hooks/useDepartmentBackend';
import { useTopicBackend } from '../../hooks/useTopicBackend';
import { useGroupBackend } from '../../hooks/useGroupBackend';
import { CircularButton } from '../../components/sidebar';
// import { useCategoryBackend } from '../../hooks/useCategoryBackend';

dayjs.extend(utc)


export const ArraySelect = styled((props) => {
    const { name, field, array, formData, handleFormChange, nullable } = props

    return (
        <FormControl
            sx={{ m: 1, minWidth: 120 }}
            size="small"
        >
            <Select
                name={name}
                displayEmpty
                value={array.length ? formData[name] ?? '' : ''}
                onChange={handleFormChange}
                renderValue={item => (
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ color: '#1B1D1F' }}
                        >
                            {item ? item : 'None'}
                        </Typography>
                    </Box>
                )}
                IconComponent={props => (
                    <ChevronDown
                        {...props}
                        size={17}
                        color="#1B1D1F"
                    />
                )}
                sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                        borderRadius: '8px',
                        borderColor: '#E5EFE9',
                    },
                }}
            >
                {array.map((x, y) => (
                    <MenuItem
                        key={y}
                        value={x[field]}
                    >
                        <Typography variant="subtitle2">{x[field]}</Typography>
                    </MenuItem>
                ))}
                {nullable && <MenuItem
                    key={array.length + 1}
                    value={''}
                >
                    <Typography variant="subtitle2">{'None'}</Typography>
                </MenuItem>}
            </Select>
        </FormControl>
    )
})({

});

export const EditTicket = ({ ticket, updateCurrentTicket }) => {

    const { updateTicket } = useTicketBackend();
    const { getAgentBySearch } = useAgentBackend();
    const { getAllPriorities } = useProrityBackend();
    const { getAllStatuses } = useStatusBackend();
    const { getAllSLAs } = useSLABackend();
    const { getAllDepartments } = useDepartmentBackend();
    const { getAllTopics } = useTopicBackend();
    const { getAllGroups } = useGroupBackend();
    // const { getAllCategories } = useCategoryBackend();

    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [slas, setSLAs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [topics, setTopics] = useState([]);
    const [groups, setGroups] = useState([]);
    const [agentOptions, setAgentOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [circleLoading, setCircleLoading] = useState(false)

    const [formData, setFormData] = useState({
        'status': ticket.status?.name,
        'priority': ticket.priority?.priority_desc,
        'sla': ticket.sla?.name,
        'dept': ticket.dept?.name,
        'topic': ticket.topic?.topic,
        'group': ticket.group?.name,
        'agent': ticket.agent,
        'due_date': ticket.due_date
    });

    const origTicketData = {
        'status': ticket.status?.name,
        'priority': ticket.priority?.priority_desc,
        'sla': ticket.sla?.name,
        'dept': ticket.dept?.name,
        'topic': ticket.topic?.topic,
        'group': ticket.group?.name,
        'agent': ticket.agent,
        'due_date': ticket.due_date
    };

    useEffect(() => {
        getStatusList();
        getPriorityList();
        getSLAList();
        getDepartmentList();
        getTopicList();
        getGroupList();
        // eslint-disable-next-line
    }, []);

    // eslint-disable-next-line
    useEffect(() => {
        setLoading(JSON.stringify(origTicketData) === JSON.stringify(formData))
        // eslint-disable-next-line
    }, [formData])


    const getPriorityList = () => {
        getAllPriorities()
            .then(({ data }) => {
                setPriorities(data);
            })
            .catch(err => alert('Could not get priority list'));
    }

    const getGroupList = () => {
        getAllGroups()
            .then(({ data }) => {
                setGroups(data);
            })
            .catch(err => alert('Could not get group list'));
    }

    const getStatusList = () => {
        getAllStatuses()
            .then(({ data }) => {
                setStatuses(data)
            })
            .catch(err => alert('Could not get status list'));
    }

    const getSLAList = () => {
        getAllSLAs()
            .then(({ data }) => {
                setSLAs(data)
            })
            .catch(err => alert('Could not get sla list'));
    }

    const getDepartmentList = () => {
        getAllDepartments()
            .then(({ data }) => {
                setDepartments(data)
            })
            .catch(err => alert('Could not get department list'));
    }

    const getTopicList = () => {
        getAllTopics()
            .then(({ data }) => {
                setTopics(data)
            })
            .catch(err => alert('Could not get topic list'));
    }

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAgentSearchChange = (e) => {
        if (e?.target?.value) {
            getAgentBySearch(e.target.value)
                .then((res) => {
                    setAgentOptions(res.data)
                })
                .catch(err => alert('Agent search failed'));
        }
    }

    const handleDueDateChange = (newValue) => {
        setFormData({ ...formData, 'due_date': newValue ? newValue.utc().format('YYYY-MM-DDTHH:mm:ss') : null })
    }

    const handleAgentChange = (e, newValue) => {
        setFormData({ ...formData, 'agent': newValue })
    }

    const handleSave = async () => {
        try {
            const updates = {
                'status_id': statuses.find(x => x.name === formData.status).status_id,
                'priority_id': priorities.find(x => x.priority_desc === formData.priority).priority_id,
                'sla_id': slas.find(x => x.name === formData.sla).sla_id,
                'dept_id': departments.find(x => x.name === formData.dept).dept_id,
                'topic_id': topics.find(x => x.topic === formData.topic).topic_id,
                'group_id': formData.group || formData.group === 'None' ? groups.find(x => x.name === formData.group).group_id : null,
                'agent_id': formData.agent ? formData.agent.agent_id : null,
                'due_date': formData.due_date
            }
            setCircleLoading(true);
            await updateTicket(ticket.ticket_id, updates)
                .then((res) => {
                    updateCurrentTicket(res.data);
                })
                .catch(err => alert('Error while updating ticket status'));
            setCircleLoading(false);
            setLoading(true);
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    };

    return (
        <Stack>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Status<span style={{ color: 'red' }}> *</span>
                </Typography>
                <ArraySelect
                    name="status"
                    field="name"
                    array={statuses}
                    formData={formData}
                    handleFormChange={handleFormChange}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Priority<span style={{ color: 'red' }}> *</span>
                </Typography>
                <ArraySelect
                    name="priority"
                    field="priority_desc"
                    array={priorities}
                    formData={formData}
                    handleFormChange={handleFormChange}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    SLA<span style={{ color: 'red' }}> *</span>
                </Typography>
                <ArraySelect
                    name="sla"
                    field="name"
                    array={slas}
                    formData={formData}
                    handleFormChange={handleFormChange}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Department<span style={{ color: 'red' }}> *</span>
                </Typography>
                <ArraySelect
                    name="dept"
                    field="name"
                    array={departments}
                    formData={formData}
                    handleFormChange={handleFormChange}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Topic<span style={{ color: 'red' }}> *</span>
                </Typography>
                <ArraySelect
                    name="topic"
                    field="topic"
                    array={topics}
                    formData={formData}
                    handleFormChange={handleFormChange}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Group
                </Typography>
                <ArraySelect
                    name="group"
                    field="name"
                    array={groups}
                    formData={formData}
                    handleFormChange={handleFormChange}
                    nullable
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Agent
                </Typography>

                <Autocomplete
                    disablePortal
                    options={agentOptions}
                    getOptionLabel={item => item ? item.firstname + ' ' + item.lastname : ''}
                    // getOptionLabel={item => item?.fullname ?? ''}
                    value={formData.agent ?? ''}
                    type="text"
                    name="agent"
                    size="small"
                    onInputChange={handleAgentSearchChange}
                    filterOptions={(x) => x}
                    onChange={handleAgentChange}
                    sx={{
                        width: 250,
                        m: 1,
                        '& .MuiInputBase-root': {
                            fontWeight: 600,
                        },
                        '.MuiOutlinedInput-notchedOutline': {
                            borderRadius: '8px',
                            borderColor: '#E5EFE9',
                        },
                    }}
                    PopperComponent={(props) => (<Popper {...props} style={{ maxWidth: 400 }} placement='bottom-start' />)}
                    renderOption={(props, item) => (
                        <li {...props} key={item.email} >
                            {item.firstname + " " + item.lastname}&nbsp;<span style={{ color: 'grey', fontSize: 10 }}>{item.email}</span>
                        </li>
                    )}
                    renderInput={(params) => (<TextField {...params} slotProps={{ style: { fontWeight: 600 } }} />)}
                />

            </Box>

            <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ px: 2.25 }}
            >
                <Typography
                    variant="caption"
                    className="text-muted"
                    fontWeight={600}
                    minWidth={85}
                >
                    Due Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        timezone='UTC'
                        defaultValue={ticket.due_date ? dayjs(formData.due_date) : null}
                        onChange={handleDueDateChange}
                        slotProps={{ field: { clearable: true } }}
                        sx={{
                            width: 275,
                            m: 1,
                            '& .MuiInputBase-root': {
                                fontWeight: 600,
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                                borderRadius: '8px',
                                borderColor: '#E5EFE9',
                            },
                        }}
                    />
                </LocalizationProvider>

            </Box>

            <CircularButton
                sx={{ mt: 6, py: 2, px: 6, width: 250 }}
                onClick={() =>
                    handleSave()
                }
                disabled={loading || circleLoading}
            >
                {circleLoading ? (
                    <CircularProgress
                        size={22}
                        thickness={5}
                        sx={{ color: '#FFF' }}
                    />
                ) : (
                    'Save Changes'
                )}
            </CircularButton>


        </Stack>
    )
}
