import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {

    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

    useEffect(() => {
        let timerId: number | null = null;

            setSecondsElapsed(0); // Reset the timer
            timerId = window.setInterval(() => {
                setSecondsElapsed(prevSeconds => prevSeconds + 1);
            }, 1000);
        return () => {
            if (timerId !== null) {
                window.clearInterval(timerId);
            }
        };
    }, []);

    return (<p>Loading... Time elapsed: {secondsElapsed} seconds (I can promise results in 200 seconds)</p>);
};

export default Loading;
