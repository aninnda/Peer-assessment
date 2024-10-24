import React, { useState } from 'react';
import Navbar from './Navbar';
import './Ratings.css';

const students = ['Student 1', 'Student 2', 'Student 3'];

const Ratings: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [ratings, setRatings] = useState<any>({
        'Student 1': { cooperation: 0, conceptual: 0, practical: 0, ethic: 0, comments: '' },
        'Student 2': { cooperation: 0, conceptual: 0, practical: 0, ethic: 0, comments: '' },
        'Student 3': { cooperation: 0, conceptual: 0, practical: 0, ethic: 0, comments: '' }
    });

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
