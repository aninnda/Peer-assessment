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
            <h1 className="dashboard-title">Welcome to the peer assessment website</h1>
        </div>
    );
};

export default Dashboard;
