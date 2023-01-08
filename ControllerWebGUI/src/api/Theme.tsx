import {createTheme} from "@mui/material";
import {createContext, useLocalStorage} from "./hooks";
import {ThemeProvider as ThemeProvider_} from "@mui/material";

export function themeToPalette(theme:string){
    if(theme === "dark")
        return createTheme({
            palette: {
                mode: 'dark',
            },
        });

    return createTheme({
        palette: {
            mode: 'light',
        },
    });
}

export const ThemeContext = createContext<[string,(theme:string)=>any]>();
export function ThemeProvider({children}:{children:JSX.Element}){
    let [theme, setTheme] = useLocalStorage("theme","dark");
    let palette = themeToPalette(theme);

    return <ThemeContext.Provider value={[theme, setTheme]}>
        <ThemeProvider_ theme={palette}>{children}</ThemeProvider_>
    </ThemeContext.Provider>
}