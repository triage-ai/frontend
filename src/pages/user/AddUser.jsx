import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    stepConnectorClasses,
    styled,
} from '@mui/material';
import { CustomFilledInput } from '../../components/custom-input';
import { CustomSelect } from '../../components/custom-select';
import { useEffect, useState } from 'react';
import { CircularButton } from '../../components/sidebar';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useRolesBackend } from '../../hooks/useRoleBackend';
import { useUserBackend } from '../../hooks/useUserBackend';
import { AddDepartment } from '../department/AddDepartment';
import { DepartmentSelect } from '../department/DepartmentSelect';
import { RoleSelect } from '../role/RoleSelect';
import { TransferList } from '../../components/transfer-list';

export const AddUser = ({ handleCreated, handleEdited, editUser }) => {
    const { createUser, updateUser } = useUserBackend();

    const [isFormValid, setIsFormValid] = useState(false)
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: ''
    });

    const validateForm = () => {
        return formData.firstname !== '' && formData.lastname !== '' && formData.email !== ''
    }

    useEffect(() => {
        const isValid = validateForm();
        setIsFormValid(isValid);
    }, [formData]);

    useEffect(() => {
        if (editUser) {
            setFormData(editUser);
        }
    }, [editUser]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handleAction = () => {
        if (editUser) {
            updateUser(formData)
                .then(res => {
                    handleEdited();
                })
                .catch(err => console.error(err));
        } else {
            createUser(formData)
                .then(res => {
                    handleCreated();
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <>
            <Typography
                variant="h1"
                sx={{ mb: 1.5 }}
            >
                {editUser ? 'Edit user' : 'Add new user'}
            </Typography>

            <Typography variant="subtitle2">
                {editUser ? 'Edit the details for this user' : 'We will gather essential details about the new user. Complete the following steps to ensure accurate setup and access.'}
            </Typography>



            <Box
                sx={{
                    background: '#FFF',
                    m: 4,
                    p: 4,
                    pt: 3,
                    borderRadius: '12px',
                    textAlign: 'left',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 600, mb: 2 }}
                >
                    User information
                </Typography>

                    <CustomFilledInput
                        label="First name"
                        onChange={handleInputChange}
                        value={formData.firstname}
                        name="firstname"
                        mb={2}
                        halfWidth
                        mr={'2%'}
                    />

                    <CustomFilledInput
                        label="Last name"
                        onChange={handleInputChange}
                        value={formData.lastname}
                        name="lastname"
                        mb={2}
                        halfWidth
                        mr={'2%'}
                    />

                    <CustomFilledInput
                        label="Email"
                        onChange={handleInputChange}
                        value={formData.email}
                        name="email"
                        mb={2}
                        halfWidth
                    />

            </Box>


            <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: 'center' }}
            >
                <CircularButton
                    sx={{ py: 2, px: 6 }}
                    onClick={handleAction}
                    disabled={!isFormValid}
                >
                    {editUser ? 'Edit' : 'Create'} user
                </CircularButton>
            </Stack>
        </>
    );
};
