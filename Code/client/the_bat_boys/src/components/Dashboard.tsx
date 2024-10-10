import Navbar from './Navbar';

const Dashboard = () => {

    return (
        <div className="dashboard-container">
            <Navbar />
            <h1>Welcome to the Dashboard</h1>
            <h2>Hello!</h2>
            <p>This is the dashboard where you can manage your content.</p>
        </div>
    );
};

export default Dashboard;