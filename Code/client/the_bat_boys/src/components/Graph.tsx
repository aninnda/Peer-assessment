import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './Ratings.css'; 
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, scales } from 'chart.js';
import { _scaleRangesChanged, color } from 'chart.js/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
    const [averageRatings, setAverageRatings] = useState<{
        conceptual_avg: number | null;
        practical_avg: number | null;
        work_ethic_avg: number | null;
        cooperation_avg: number | null;
      }>({
        conceptual_avg: null,
        practical_avg: null,
        work_ethic_avg: null,
        cooperation_avg: null,
      });
    
      const [teamRatings, setTeamRatings] = useState<any[]>([]);
      const [role, setRole] = useState<string | null>(null);

      useEffect(() => {
        const fetchRoleAndData = async () => {
          try {
            const sessionResponse = await axios.get('http://localhost:3000/session', { withCredentials: true });
            setRole(sessionResponse.data.role);
    
            const graphResponse = await axios.get('http://localhost:3000/graph', { withCredentials: true });
            if (sessionResponse.data.role === 'student') {
              setAverageRatings(graphResponse.data);
            } else if (sessionResponse.data.role === 'instructor') {
              setTeamRatings(graphResponse.data);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchRoleAndData();
      }, []);
    
      const studentData = {
        labels: ['Conceptual Contribution', 'Practical Contribution', 'Work Ethic', 'Cooperation'],
        datasets: [
          {
            label: 'Average Ratings',
            data: [
              averageRatings.conceptual_avg,
              averageRatings.practical_avg,
              averageRatings.work_ethic_avg,
              averageRatings.cooperation_avg,
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 162, 235, 0.6)',
            ],
          },
        ],
      };
      
      const teamData = {
        labels: teamRatings.map(team => team.team),
        datasets: [
          {
            label: 'Conceptual Contribution',
            data: teamRatings.map(team => team.conceptual_avg),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Practical Contribution',
            data: teamRatings.map(team => team.practical_avg),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Work Ethic',
            data: teamRatings.map(team => team.work_ethic_avg),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Cooperation',
            data: teamRatings.map(team => team.cooperation_avg),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      };


      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Your average rating per component',
            color: 'white',
            font:{size: 15},
          },
        },
        scales: { 
            y: { beginAtZero: true, ticks: { color: 'white'}},
            x: { ticks: { color: 'white'}}
        },
      };
    
      const hasRatings = Object.values(averageRatings).some(value => value !== null);
    
      return (
        <div>
          <Navbar />
          <div className="graph-container">
            <h2>Average Ratings per Component</h2>
            {role === 'student' && hasRatings ? (
              <div className="chart-wrapper">
                <Bar data={studentData} options={options} />
              </div>
            ) : role === 'instructor' ? (
              <div className="chart-wrapper">
                <Bar data={teamData} options={options} />
              </div>
            ) : (
              <p>You have not yet been rated.</p>
            )}
          </div>
        </div>
      );
};

export default Graph;