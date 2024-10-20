import { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useSettingsBackend } from '../../../hooks/useSettingsBackend';
import { Box, Checkbox, CircularProgress, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { CustomTextField } from '../../../components/sidebar-items';
import { handleSave } from '../SettingsMenus';
import { CustomFilledInput } from '../../../components/custom-input';
import { StyledSelect } from '../SettingsMenus';
import { CircularButton } from '../../../components/sidebar';

export const UserTemplates = props => {
    return (
        <p>User Templates</p>
    )
}