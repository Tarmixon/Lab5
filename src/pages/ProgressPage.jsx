import React from 'react';
import Progress from '../components/Progress';
import Timer from '../components/Timer';

const ProgressPage = () => {
    return (
        <section>
            <h2>My Progress</h2>
            <Progress label="Listening" value={70} />
            <Progress label="Speaking" value={50} />
            <Progress label="Reading" value={80} />
            <Progress label="Writing" value={60} />
            <Timer />
        </section>
    );
};

export default ProgressPage;
