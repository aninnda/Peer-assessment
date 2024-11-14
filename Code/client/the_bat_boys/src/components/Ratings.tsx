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
  const [team_name, setTeamName] = useState<string | null>(null);

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
        setTeamName(response.data.team);
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

        // Initialize ratings for all students
        const initialRatings: { [key: string]: { cooperation: number, conceptual: number, practical: number, ethic: number, comments: string } } = {};
        response.data.forEach((user: { username: string }) => {
          initialRatings[user.username] = { cooperation: 0, conceptual: 0, practical: 0, ethic: 0, comments: '' };
        });
        setRatings(initialRatings);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);


  useEffect(() => {
    if (team_name) {
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
        console.error("Team name is not available");
    }
}, [team_name]); 



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

    setIsSubmitting(true); // Set submitting state to true to prevent multiple submissions
    try {

      const ratingData = {
        rater_username: studentUsername,
        rated_username: selectedStudent,
        team_name: team_name,
        ratings: ratings[selectedStudent],
        comments: ratings[selectedStudent]?.comments,
      };
      
      // Submit the rating to the backend
      await axios.post('http://localhost:3000/ratings', ratingData, { withCredentials: true });

      // Show confirmation message
      setShowConfirmation(true);
      await fetchRatingTable();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state after completion
    }
  };

  const handleContinueRating = () => {
    setShowConfirmation(false); // Hide confirmation message and continue
    setSelectedStudent(null); // Reset the selected student
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
      <div>
        <Navbar />
        You are not authorized to view this page.
      </div>
    )
  }

  if (role === 'instructor') {
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
  }



  if (role === 'student') {
    return (
      <div>
        <Navbar />
        <div className="container_ratings">
          <h1>Student Ratings</h1>
          {showConfirmation ? (
            <div className="confirmation-box">
              <h2>Rating Submitted Successfully!</h2>
              <p>Your rating has been successfully sent.</p>
              <button onClick={handleContinueRating}>Continue Rating</button>
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
              <button onClick={handleSave} disabled={isSubmitting}>Save</button>
            </div>
          ) : (
            <div>
              <h2>Select a student to rate:</h2>
              <ul>
                {teamMembers.map((student) => (
                  <li key={student}>
                    {student}
                    <button onClick={() => setSelectedStudent(student)}>Rate</button>
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

//   if (role === 'student') {
//     return (
//       <div>
//         <Navbar />
//         <div className="container_ratings">
//           <h1>Student Ratings</h1>
//           {showConfirmation ? (
//             <div className="confirmation-box">
//               <h2>Rating Submitted Successfully!</h2>
//               <p>Your rating has been successfully sent.</p>
//               <button onClick={handleContinueRating}>Continue Rating</button>
//             </div>
//           ) : selectedStudent ? (
//             <div className="rating-box">
//               <h2>Rate {selectedStudent}</h2>
//               {['Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic'].map((category, idx) => (
//                 <div key={idx}>
//                   <label>{category}</label>
//                   <div className="rating-scale">
//                     {[1, 2, 3, 4, 5].map((num) => (
//                       <button
//                         key={num}
//                         className={ratings[selectedStudent][category.toLowerCase().replace(' ', '')] === num ? 'selected' : ''}
//                       >
//                         {num}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//               <div>
//                 <label>Comments</label>
//                 <textarea
//                   value={ratings[selectedStudent]?.comments}
//                 />
//               </div>
//               <button onClick={handleSave} disabled={isSubmitting}>Save</button>
//             </div>
//           ) : (
//             <div>
//               <h2>Select a student to rate:</h2>
//               <ul>
//                 {teamMembers.map((student) => (
//                   <li key={student}>
//                     {student}
//                     <button onClick={() => setSelectedStudent(student)}>Rate</button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

  
// };

export default Ratings;
