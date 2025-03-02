import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FaSadTear, FaClock, FaTrophy, FaArrowLeft, FaHourglassEnd } from 'react-icons/fa';
import axios from 'axios';

function QuizPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState({ clues: [], cities: [] });
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [clueIndex, setClueIndex] = useState(0); // Track the current clue index
    const [funFact, setFunFact] = useState(''); // State for the fun fact

    // Check if user is logged in
    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch question from API
    const fetchQuestion = async () => {
        setLoading(true);
        setError(null);
        setTimeUp(false);

        try {
            const response = await axios.get('http://backend-production-2d2c.up.railway.app/city/generate-question');
            setQuestion(response.data);
            sessionStorage.setItem('id', response.data.id);
            setTimer(30); // Reset timer
            setSelectedOption(null);
            setShowFeedback(false);
            setShowConfetti(false);
            setClueIndex(0); // Reset clue index when fetching a new question
        } catch (err) {
            console.error('Error fetching question:', err);
            setError('Failed to load question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchScore = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const response = await axios.get("http://backend-production-2d2c.up.railway.app/score/get-score", {
                params: {
                    userId: userId
                }
            });
            setScore(response.data); // Assume response.data contains the user's score
        } catch (err) {
            console.error('Error fetching score:', err);
            setError('Failed to load score. Please try again.');
        }
    };

    // Initial question load
    useEffect(() => {
        fetchScore();
        fetchQuestion();
    }, []);

    // Timer effect
    useEffect(() => {
        if (loading || showFeedback) return;

        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(countdown);
                    if (!showFeedback) {
                        setTimeUp(true);
                        setShowFeedback(true);
                        setIsCorrect(false);
                    }
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [loading, showFeedback]);

    const handleOptionSelect = (option) => {
        if (!showFeedback && !timeUp) {
            setSelectedOption(option);
        }
    };

    const fetchFunFact = async () => {
        const questionId = sessionStorage.getItem('id');
        try {
            const response = await axios.get(`http://backend-production-2d2c.up.railway.app/city/fun-fact`, {
                params: {
                    id: questionId
                }
            });
            const funFacts = response.data;
            if (funFacts.length > 0) {
                // Randomly pick one fun fact
                const randomIndex = Math.floor(Math.random() * funFacts.length);
                setFunFact(funFacts[randomIndex]);
            }
        } catch (err) {
            console.error('Error fetching fun fact:', err);
            setFunFact('Failed to load fun fact.');
        }
    };


    const handleSubmit = async () => {
        if (selectedOption === null || showFeedback || timeUp) return;

        try {
            const clue = question.clues[clueIndex];

            // Store clue and selected answer in session storage
            sessionStorage.setItem('lastClue', clue);
            sessionStorage.setItem('lastAnswer', selectedOption);

            // Create URLSearchParams for sending data
            const params = new URLSearchParams();
            params.append('city', selectedOption);
            params.append('clue', clue);

            // Make API request to check the answer
            const response = await axios.post(
                "http://backend-production-2d2c.up.railway.app/city/check-answer",
                params, // Use URLSearchParams as request body
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' // Set appropriate Content-Type
                    }
                }
            );

            await fetchFunFact();  // Fetch the fun fact after submitting the answer

            const correct = response.data === true;
            setIsCorrect(correct);
            setShowFeedback(true);

            if (correct) {
                setScore(prevScore => prevScore + 10);
                setShowConfetti(true);
                const userId = localStorage.getItem('userId');

                // Update score through the API
                const scoreParams = new URLSearchParams();
                scoreParams.append('answer', true); // Send the value of `answer` correctly
                scoreParams.append('userId', userId);

                const scoreResponse = await axios.post("http://backend-production-2d2c.up.railway.app/score", scoreParams, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                // Optionally update the score in local state based on the API response
                setScore(scoreResponse.data);
            }

            setQuestionsAnswered(prev => prev + 1);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Handle bad request (400) specifically
                setShowFeedback(true);
                setIsCorrect(false); // Mark answer as incorrect
                setError('Incorrect answer.'); // Provide specific feedback
            } else {
                // Handle other errors
                console.error('Error checking answer:', err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data.message : 'An error occurred. Please try again.');
            }
        }
    };

    const handleNextQuestion = () => {
        fetchQuestion();
    };

    const handleBackToGame = () => {
        navigate('/game');
    };

    const handleGenerateAnotherClue = () => {
        if (clueIndex < question.clues.length - 1) {
            setClueIndex(prevIndex => prevIndex + 1); // Move to the next clue
        }
    };

    const getOptionLetter = (index) => {
        return String.fromCharCode(65 + index); // A, B, C, D
    };

    if (loading && questionsAnswered === 0) {
        return (
            <div className="container">
                <div className="quiz-container">
                    <h2>Loading question...</h2>
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && questionsAnswered === 0) {
        return (
            <div className="container">
                <div className="quiz-container">
                    <h2>Error</h2>
                    <p className="error-message">{error}</p>
                    <button className="btn btn-primary" onClick={fetchQuestion}>
                        Try Again
                    </button>
                    <button className="btn" onClick={handleBackToGame}>
                        Back to Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            <div className="quiz-container">
                <div className="quiz-header">
                    <button className="btn btn-secondary" onClick={handleBackToGame}>
                        <FaArrowLeft style={{ marginRight: '5px' }} /> Back
                    </button>
                    <div className="quiz-progress">
                        Questions Answered: {questionsAnswered}
                    </div>
                    <div className="quiz-score">
                        <FaTrophy style={{ marginRight: '5px', color: '#FFD700' }} />
                        Score: {score}
                    </div>
                </div>

                <div className="quiz-timer">
                    <FaClock style={{ marginRight: '5px' }} /> Time: {timer}s
                </div>

                <div className="question">
                    {/* Show only the current clue based on the clueIndex */}
                    {question.clues.length > 0 && <p>{question.clues[clueIndex]}</p>}
                    {clueIndex < question.clues.length - 1 && (
                        <button className="btn" onClick={handleGenerateAnotherClue}>
                            Generate Another Clue
                        </button>
                    )}
                </div>

                <div className="options">
                    {question.cities.map((city, index) => (
                        <div
                            key={index}
                            className={`option ${selectedOption === city ? 'selected' : ''} 
                ${showFeedback && isCorrect && selectedOption === city ? 'correct-answer' : ''}
                ${showFeedback && !isCorrect && selectedOption === city ? 'wrong-answer' : ''}`}
                            onClick={() => handleOptionSelect(city)}
                        >
                            <span className="option-letter">{getOptionLetter(index)}</span> {city}
                        </div>
                    ))}
                </div>

                <div className="feedback">
                    {showFeedback && (
                        timeUp ? (
                            <span style={{ color: 'orange' }}>
                                <FaHourglassEnd style={{ marginRight: '5px' }} /> Time's Up!
                            </span>
                        ) : isCorrect ? (
                            <span style={{ color: 'green' }}>Awesome! You got it right! 🎉</span>
                        ) : (
                            <span style={{ color: 'red' }}>
                                Oops! That's not correct <FaSadTear style={{ marginLeft: '5px' }} />
                            </span>
                        )
                    )}
                    {error && <div className="error-message">{error}</div>}
                    {/* Add the fun fact display here */}
                    {showFeedback && funFact && (
                        <div className="fun-fact">
                            Fun Fact: {funFact}
                        </div>
                    )}
                </div>

                <div className="buttons">
                    <button
                        className="btn"
                        onClick={handleNextQuestion}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Next Question'}
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={selectedOption === null || showFeedback || timeUp || loading}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;