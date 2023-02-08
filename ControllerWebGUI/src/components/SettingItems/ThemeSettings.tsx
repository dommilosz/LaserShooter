import React, {useContext} from "react";
import {FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {SettingItem} from "../../views/SettingsView";
import {ThemeContext} from "../../api/Theme";

export function ThemeSettings() {
    let [theme, setTheme] = useContext(ThemeContext);

    return <SettingItem>
        <Typography fontSize={18}>Appearance</Typography>
        <Typography>Theme: </Typography>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Theme</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={theme}
                label="Theme"
                onChange={(e) => {
                    setTheme(e.target.value)
                }}
            >
                <MenuItem value={"dark"}>Dark</MenuItem>
                <MenuItem value={"light"}>Light</MenuItem>
            </Select>
        </FormControl>
    </SettingItem>
}