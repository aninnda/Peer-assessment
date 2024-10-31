import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './Ratings.css';


const Ratings: React.FC = () => {
    const [students, setStudents] = useState<string[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [ratings, setRatings] = useState<any>({});

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://localhost:3000/users"); // Adjust the endpoint as necessary
                const data = await response.json();
                setStudents(data.map((user: { username: string }) => user.username)); // Assuming users have a 'username' field
                const initialRatings: { [key: string]: { cooperation: number, conceptual: number, practical: number, ethic: number, comments: string } } = {};
                data.forEach((user: { username: string }) => {
                    initialRatings[user.username] = { cooperation: 0, conceptual: 0, practical: 0, ethic: 0, comments: '' };
                });
                setRatings(initialRatings); // Initialize ratings for fetched students
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);   

    const handleRatingChange = (category: string, value: number) => {
        if (selectedStudent) {
            setRatings((prevRatings: any) => ({
                ...prevRatings,
                [selectedStudent]: {
                    ...prevRatings[selectedStudent],
                    [category]: value
                }
            }));
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (selectedStudent) {
            setRatings((prevRatings: any) => ({
                ...prevRatings,
                [selectedStudent]: {
                    ...prevRatings[selectedStudent],
                    comments: e.target.value
                }
            }));
        }
    };

    const handleSave = () => {
        setSelectedStudent(null);
    };

    return (
        <div>
            <Navbar />
            <div className="container_ratings">
                <h1>Student Ratings</h1>
                {selectedStudent ? (
                    <div className="rating-box">
                        <h2>Rate {selectedStudent}</h2>
                        {['Cooperation', 'Conceptual Contribution', 'Practical Contribution', 'Work Ethic'].map((category, idx) => (
                            <div key={idx}>
                                <label>{category}</label>
                                <div className="rating-scale">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            className={ratings[selectedStudent][category.toLowerCase().replace(' ', '')] === num ? 'selected' : ''}
                                            onClick={() => handleRatingChange(category.toLowerCase().replace(' ', ''), num)}
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
                                value={ratings[selectedStudent].comments}
                                onChange={handleCommentChange}
                            />
                        </div>
                        <button onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <div>
                        <h2>Select a student to rate:</h2>
                        <ul>
                            {students.map((student) => (
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
};

export default Ratings;
