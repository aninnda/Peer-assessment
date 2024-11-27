import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
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
  const [teamData, setTeamData] = useState(false);
  const [teamsData, setTeamsData] = useState<{ [key: string]: any[] }>({});
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedStudentDetailed, setSelectedStudentDetailed] = useState(null);

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

  const downloadCSV = () => {
    window.open('http://localhost:3000/ratings/csv', '_blank');
  };

  useEffect(() => {
    fetch('/teams/ratings', { credentials: 'include' })  // Include session cookies
      .then((response) => response.json())
      .then((data) => {
        // Group data by team name
        const groupedByTeam = data.reduce((acc: { [key: string]: any[] }, rating: any) => {
          const { team } = rating;
          if (!acc[team]) acc[team] = [];
          acc[team].push(rating);
          return acc;
        }, {});
        setTeamsData(groupedByTeam);
      })
      .catch((error) => console.error('Error fetching data:', error));
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
      <div>
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
        {showDetailedTable && (
          <div>
          {/* Team: Bat Boys */}
          <div className="team-container">
            <h2>Team: Bat Boys</h2>
    
            {/* Student: Samy Mezimez */}
            <div className="student-container" style={{ marginLeft: '20px' }}>
              <h3>Student: Samy Mezimez</h3>
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Dylan</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
            </div>
    
            {/* Student: Dylan Moos */}
            <div className="student-container" style={{ marginLeft: '20px' }}>
              <h3>Student: Dylan Moos</h3>
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Samy</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
            </div>
          </div>
    
          {/* Team: Team 2 */}
          <div className="team-container">
            <h2>Team: Team 2</h2>
    
            {/* Student: Aymen Mefti */}
            <div className="student-container" style={{ marginLeft: '20px' }}>
              <h3>Student: Aymen Mefti</h3>
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Daniel</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
            </div>
    
            {/* Student: Daniel Pinto */}
            <div className="student-container" style={{ marginLeft: '20px' }}>
              <h3>Student: Daniel Pinto</h3>
              {/* Rated by Aymen */}
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Aymen</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
    
              {/* Rated by Karim */}
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Karim</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
            </div>
    
            {/* Student: Karim Naja */}
            <div className="student-container" style={{ marginLeft: '20px' }}>
              <h3>Student: Karim Naja</h3>
              <div className="rating-container" style={{ marginLeft: '40px' }}>
                <p><strong>Rated by:</strong> Daniel</p>
                <table border={1} cellPadding="5" style={{ width: '400px', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th>Cooperation</th>
                      <th>Conceptual</th>
                      <th>Practical</th>
                      <th>Work Ethic</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5</td>
                      <td>5.00</td>
                    </tr>
                  </tbody>
                </table>
                <p><strong>Comment:</strong> Great job!</p>
              </div>
            </div>
          </div>
        </div>
        )}
        <p></p>
      </div>
      <div>
        <button onClick={downloadCSV} style={{ marginTop: '20px' }}>
          Download CSV
        </button>
      </div>
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
                {teamMembers
                  .filter((student) => student !== studentUsername)
                  .map((student) => (
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