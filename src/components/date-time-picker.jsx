import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid';
import { CustomInput } from './custom-select';
dayjs.extend(utc)

export const CustomDateTimePicker = ({ defaultValue, onChange }) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Due Date"
                timezone='UTC'
                defaultValue={defaultValue ? dayjs.utc(defaultValue) : null}
                onError={(e) => { console.log(e) }}
                onChange={onChange}
                slotProps={{ field: { clearable: true }, textField: { variant: 'filled', fullWidth: true } }}
                slots={{ textField: CustomInput }}
            />
        </LocalizationProvider>
    )

}
