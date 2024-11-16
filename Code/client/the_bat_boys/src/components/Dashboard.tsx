import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import './Dashboard.css';

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
            <h1 className="dashboard-title">Welcome to the Dashboard</h1>

            <button className="dashboard-button summary-button" onClick={handleSummaryClick}>
                Summary View
            </button>
            {showSummaryTable && (
                <table className="dashboard-table summary-table">
                    <thead>
                        <tr className="dashboard-table-header">
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
                    <tbody className="dashboard-table-body">
                        {/* Add rows here */}
                    </tbody>
                </table>
            )}

            <button className="dashboard-button detailed-button" onClick={handleDetailedClick}>
                Detailed View
            </button>
            {showDetailedTable && (
                <table className="dashboard-table detailed-table">
                    <thead>
                        <tr className="dashboard-table-header">
                            <th>Member</th>
                            <th>Cooperation</th>
                            <th>Conceptual</th>
                            <th>Practical</th>
                            <th>Work Ethic</th>
                            <th>Average</th>
                        </tr>
                    </thead>
                    <tbody className="dashboard-table-body">
                        {/* Add rows here */}
                    </tbody>
                </table>
            )}

            <p className="dashboard-footer-space"> </p>
        </div>
    );
};

export default Dashboard;
