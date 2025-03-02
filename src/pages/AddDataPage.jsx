import { useState } from 'react';
import axios from 'axios';

function AddDataPage() {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [clues, setClues] = useState('');
    const [funFact, setFunFact] = useState('');
    const [trivia, setTrivia] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const data = {
            city: city,
            country: country,
            clues: clues.split(','),
            funFact: funFact.split(','),
            trivia: trivia.split(',')
        };

        try {
            const response = await axios.post('https://backend-production-2d2c.up.railway.app/city', data);

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            setError('An error occurred while submitting the data.');
        }
    };

    return (
        <div className="container">
            <div className="quiz-container">
                <h2>Add Data for a New City</h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Data successfully added!</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter the city"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Enter the country"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clues">Clues (comma separated)</label>
                        <input
                            type="text"
                            id="clues"
                            value={clues}
                            onChange={(e) => setClues(e.target.value)}
                            placeholder="Enter clues separated by commas"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="funFact">Fun Facts (comma separated)</label>
                        <input
                            type="text"
                            id="funFact"
                            value={funFact}
                            onChange={(e) => setFunFact(e.target.value)}
                            placeholder="Enter fun facts separated by commas"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="trivia">Trivia (comma separated)</label>
                        <input
                            type="text"
                            id="trivia"
                            value={trivia}
                            onChange={(e) => setTrivia(e.target.value)}
                            placeholder="Enter trivia separated by commas"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn">
                        Submit Data
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddDataPage;
