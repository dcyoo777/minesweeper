import React, {useEffect} from 'react';

function useClickOutside({handler}: {handler: () => void}) {

    const ref = React.useRef<any>();

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handler, ref]);

    return ref
}

export default useClickOutside;
