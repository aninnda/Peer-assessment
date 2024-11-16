import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Ratings.css';
import axios from 'axios';

const Ratings: React.FC = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>([]); // Members of the student's team
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [ratings, setRatings] = useState<any>({});
  const [comments, setComments] = useState<string>('');
  const [role, setRole] = useState<string | null>(null);
  const [studentUsername, setStudentUsername] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // Show confirmation message
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state
  const [ratingTable, setRatingTable] = useState<any[]>([]);
  const [showSummaryTable, setShowSummaryTable] = useState(false);
  const [showDetailedTable, setShowDetailedTable] = useState(false);

  const handleSummaryClick = () => {
    setShowSummaryTable(!showSummaryTable);
  };

  const handleDetailedClick = () => {
    setShowDetailedTable(!showDetailedTable);
  };

  // Fetch the user's session (role and username)
  useEffect(() => {
    const fetchRoleAndUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/session", { withCredentials: true });
        setRole(response.data.role);
        setStudentUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchRoleAndUser();
  }, []);

  // Fetch students and their ratings data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", { withCredentials: true });
        setStudents(response.data.map((user: { username: string }) => user.username));

        const initialRatings: { [key: string]: any } = {};
        response.data.forEach((user: { username: string }) => {
          initialRatings[user.username] = {
            cooperation: 0,
            conceptual: 0,
            practical: 0,
            ethic: 0,
            comments: ''
          };
        });
        setRatings(initialRatings);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch the student's team
  useEffect(() => {
    const fetchTeam = async () => {
      if (studentUsername) {
        try {
          const response = await axios.get(`http://localhost:3000/teams`, { withCredentials: true });
          const team = response.data.selectedStudents;

          setTeamMembers(team.filter((member: string) => member !== studentUsername));
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      }
    };
    fetchTeam();
  }, [studentUsername]);

  const handleSave = async () => {
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3000/ratings', {
        rater_username: studentUsername,
        rated_username: selectedStudent,
        team_name: '',
        ratings: ratings[selectedStudent],
        comments: comments,
      }, { withCredentials: true });

      setShowConfirmation(true);
      await fetchRatingTable();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueRating = () => {
    setShowConfirmation(false);
    setSelectedStudent(null);
  };

  const fetchRatingTable = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ratings', { withCredentials: true });
      setRatingTable(response.data);
    } catch (error) {
      console.error("Error fetching ratings table:", error);
    }
  };

  if (role !== 'instructor' && role !== 'student') {
    return (
      <div className="unauthorized-container">
        <Navbar />
        <p className="unauthorized-message">You are not authorized to view this page.</p>
      </div>
    );
  }

  if (role === 'instructor') {
    return (
      <div className="dashboard-container">
        <Navbar />
        <h1 className="dashboard-title">Welcome to the Dashboard</h1>
        <button className="summary-button" onClick={handleSummaryClick}>Summary View</button>
        {showSummaryTable && (
          <table className="ratings-table summary-view">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Team</th>
                <th>Cooperation</th>
                <th>Conceptual Contribution</th>
                <th>Practical Contribution</th>
                <th>Work Ethic</th>
                <th>Average</th>
                <th>Peers who Responded</th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows here */}
            </tbody>
          </table>
        )}
        <button className="detailed-button" onClick={handleDetailedClick}>Detailed View</button>
        {showDetailedTable && (
          <table className="ratings-table detailed-view">
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
      </div>
    );
  }

  if (role === 'student') {
    return (
      <div className="ratings-container">
        <Navbar />
        <h1 className="ratings-title">Student Ratings</h1>
        {showConfirmation ? (
          <div className="confirmation-box">
            <h2>Rating Submitted Successfully!</h2>
            <p>Your rating has been successfully sent.</p>
            <button className="continue-rating-button" onClick={handleContinueRating}>Continue Rating</button>
          </div>
        ) : selectedStudent ? (
          <div className="rating-box">
            <h2>Rate {selectedStudent}</h2>
            {['Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic'].map((category, idx) => (
              <div key={idx} className="rating-category">
                <label>{category}</label>
                <div className="rating-scale">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      className={`rating-button ${ratings[selectedStudent][category.toLowerCase().replace(' ', '')] === num ? 'selected' : ''}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="comments-box">
              <label>Comments</label>
              <textarea
                className="comments-textarea"
                value={ratings[selectedStudent]?.comments}
              />
            </div>
            <button className="save-button" onClick={handleSave} disabled={isSubmitting}>Save</button>
          </div>
        ) : (
          <div className="team-members-list">
            <h2>Select a student to rate:</h2>
            <ul>
              {teamMembers.map((student) => (
                <li key={student} className="team-member">
                  {student}
                  <button className="rate-button" onClick={() => setSelectedStudent(student)}>Rate</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
};

export default Ratings;
