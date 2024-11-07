import Navbar from './Navbar';
import { useEffect, useState } from 'react';

const Dashboard = () => {

    const [showSummaryTable, setShowSummaryTable] = useState(false);
    const [showDetailedTable, setShowDetailedTable] = useState(false);

    const handleSummaryClick = () => {
        setShowSummaryTable(!showSummaryTable);
    };

    const handleDetailedClick = () => {
        setShowDetailedTable(!showDetailedTable);
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <h1>Welcome to the Dashboard</h1>
            <button onClick={handleSummaryClick}>Summary View</button>
            {showSummaryTable && (
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Full Name</th>
                            <th>Team</th>
                            <th>Cooperation</th>
                            <th>Conceptual contribution</th>
                            <th>Practical contribution</th>
                            <th>Work Ethic</th>
                            <th>Average</th>
                            <th>Peers who responded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Add rows here */}
                    </tbody>
                </table>
            )}
            <button onClick={handleDetailedClick}>Detailed View</button>
            {showDetailedTable && (
                <table>
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Cooperation</th>
                            <th>Conceptual</th>
                            <th>Practical</th>
                            <th>Work Ethic</th>
                            <th>Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Add rows here */}
                    </tbody>
                </table>
            )}
            <p> </p>
        </div>
    );
};

export default Dashboard;