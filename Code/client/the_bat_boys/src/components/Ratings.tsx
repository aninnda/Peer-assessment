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
  const [team, setTeam] = useState<string | null>(null);
  const [avgRatingTable, setAvgRatingTable] = useState<any[]>([]);

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
        console.log(response.data);
        setRole(response.data.role);
        setTeam(response.data.team);
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

        const initialRatings: { [key: string]: { cooperation: number, conceptual: number, practical: number, ethic: number, comments: string } } = {};
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
    if (team) {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/ratings", { withCredentials: true });
                setTeamMembers(response.data); // Set the fetched team members
            } catch (error) {
                console.error("Error fetching team members:", error);
            }
        };
        fetchTeamMembers();
    } else {
        console.log("Team name is not available");
    }
  }, [team]); 
const handleRatingChange = (student: string, category: string, value: number) => {
  setRatings((prevRatings: any) => ({
    ...prevRatings,
    [student]: {
      ...prevRatings[student],
      [category]: value,
    },
  }));
};
const handleCommentsChange = (student: string, value: string) => {
  setRatings((prevRatings: any) => ({
    ...prevRatings,
    [student]: {
      ...prevRatings[student],
      comments: value,
    },
  }));
};

  const handleSave = async () => {
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      const ratingData = {
        rater_username: studentUsername,
        rated_username: selectedStudent,
        rated_name: selectedStudent,
        team: team,
        ratings: ratings[selectedStudent],
        comments: ratings[selectedStudent]?.comments,
      };
      
      // Submit the rating to the backend
      await axios.post('http://localhost:3000/ratings', ratingData, { withCredentials: true });



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

  const fetchAvgRatings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/average-ratings', { withCredentials: true });
      setAvgRatingTable(response.data);
    } catch (error) {
      console.error("Error fetching ratings table:", error);
    }
  }
  useEffect(() => {
    fetchAvgRatings();
  }, []);


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
              {avgRatingTable.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td>{student.team}</td>
                    <td>{student.cooperation_avg}</td>
                    <td>{student.conceptual_avg}</td>
                    <td>{student.practical_avg}</td>
                    <td>{student.work_ethic_avg}</td>
                    <td>{student.overall_avg}</td>
                    <td>{student.peers_responded}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
         <button className="detailed-button" onClick={handleDetailedClick}>Detailed View</button>
        {showDetailedTable && selectedStudent && (
          <div>
            <h2>Team: {team}</h2>
            <h3>Student Username: {selectedStudent}</h3>
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
                {teamMembers.map((member: any) => (
                  <tr key={member.rater_username}>
                    <td>{member.rater_username}</td>
                    <td>{member.cooperation}</td>
                    <td>{member.conceptualContribution}</td>
                    <td>{member.practicalContribution}</td>
                    <td>{member.workEthic}</td>
                    <td>
                      {(
                        (member.cooperation + member.conceptualContribution + member.practicalContribution + member.workEthic) /
                        4
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Comments:</h4>
            <ul>
              {teamMembers.map((member: any) => (
                <li key={member.rater_username}>{member.comments}</li>
              ))}
            </ul>
          </div>
        )}
        <p></p>
      </div>
    );
  }

  if (role === 'student') {
    return (
      <div className="ratings-container">
        <Navbar />
        <div className="container_ratings">
          <h1>Student Rating</h1>
          {showConfirmation ? (
            <div className="confirmation-box">
              <p>Please confirm rating submission.</p>
              <button className="continue-rating-button" onClick={handleContinueRating}>Confirm Rating</button>
            </div>
          ) : selectedStudent ? (
            <div className="rating-box">
              <h2>Rate {selectedStudent}</h2>
              {['cooperation', 'conceptual', 'practical', 'ethic'].map((category, idx) => (
                <div key={idx}>
                  <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        className={ratings[selectedStudent][category] === num ? 'selected' : ''}
                        onClick={() => handleRatingChange(selectedStudent, category, num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  </div>
              ))}
              <div>
                <label>Comments</label>
                <textarea
                  value={ratings[selectedStudent]?.comments}
                  onChange={(e) => handleCommentsChange(selectedStudent, e.target.value)}
                />
              </div>
              <button className="save-button" onClick={handleSave} disabled={isSubmitting}>Save</button>
              </div>
          ) : (
            <div>
              <h2>Select a student to rate:</h2>
              <ul>
                {teamMembers.map((student) => (
                  <li key={student}>
                    {student}
                    <button className="rate-button" onClick={() => setSelectedStudent(student)}>Rate</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </div>
    );
  }
};
export default Ratings;