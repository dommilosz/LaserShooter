import {useEffect, useState} from "react";

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