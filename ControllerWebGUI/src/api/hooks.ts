import React, {useEffect, useState} from "react";

export function useAppSize(){
    const [windowSize, setWindowSize] = useState<{width:number,height:number}>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: document.querySelector("body")?.clientWidth??0,
                height: document.querySelector("body")?.clientHeight??0,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}

export function useLocalStorage(key:string, initialValue:string) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value:any) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export function createContext<T>(){
    // @ts-ignore
    return React.createContext<T>(undefined);
}

export function useUpdate(){
    let [update,setUpdate] = useState(0);
    return ()=>{
        setUpdate(Math.random()*1000000);
    }
}

export function useUpdateV():[number, ()=>any]{
    let [update,setUpdate] = useState(0);
    return [update,()=>{
        setUpdate(Math.random()*1000000);
    }]
}