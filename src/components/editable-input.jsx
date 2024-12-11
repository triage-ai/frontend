import { Box, InputBase, TextField, Typography, useTheme } from "@mui/material"
import { useState } from "react"

export const EditableInput = ({ value }) => {

    const [editMode, setEditMode] = useState(false)
    const { theme } = useTheme()

    return (
        <Box width='fit-content' >
            {
                editMode ?
                <TextField
                size="small"
                autoFocus
                onBlur={() => setEditMode(false)}
                value={value}
                sx={{
                    fontWeight: 600
                }}
                />
                :
                // <Typography contentEditable={true} variant="h3">
                //     {value}
                // </Typography>
                <EditableTypography value={value}/>
            }
        </Box>
    )
}

const InputBaseWithChildren = ({
    children,
    ...props
  }) => {
    let value = "";
    if (children) {
      if (typeof children == "string" || typeof children == "number") {
        value = children.toString();
      }
    }
  
    return (
      <InputBase
        {...props}
        className={""}
        value={value}
        inputProps={{ className: props.className }}
      />
    );
  };
  
  /**
   * Displaying like a `Typography`. But acting as an `input`
   */
  const EditableTypography = ({
    onChange: propsOnChange,
    ...props
  }) => {
    const [internalValue, setInternalValue] = useState("");
  
    const value = props.children || internalValue;
  
    const onChange = (value) => {
      if (propsOnChange) {
        propsOnChange(value);
      }
      setInternalValue(value);
    };
  
    const handleChange = (e) => {
      onChange(e.target.value);
    };
  
    return (
      <Typography
        {...props}
        children={value}
        component={InputBaseWithChildren}
        onChange={handleChange}
      />
    );
  };