import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrophy, FaUserFriends } from 'react-icons/fa';
function GamePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [showPendingChallenges, setShowPendingChallenges] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      fetchUserScore();
      fetchUsers();
    
      checkPendingChallenges();
    }
    
    setLoading(false);
  }, []);

  const fetchUserScore = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const response = await axios.get(`http://backend-production-2d2c.up.railway.app/score/get-score`, {
        params: { userId }
      });
      setUserScore(response.data);
    } catch (error) {
      console.error('Error fetching user score:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://backend-production-2d2c.up.railway.app/user/all');
      // Filter out the current user
      const currentUserId = parseInt(localStorage.getItem('userId'));
      const otherUsers = response.data.filter(user => user.userId !== currentUserId);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const checkPendingChallenges = async () => {
   
    try {
      
      
      // Simulated data for demonstration
      const myUserId = localStorage.getItem('userId');
      if (myUserId) {
        // Check if we have any stored challenges in sessionStorage
        const storedChallenges = sessionStorage.getItem('pendingChallenges');
        if (storedChallenges) {
          setPendingChallenges(JSON.parse(storedChallenges));
        }
      }
    } catch (error) {
      console.error('Error checking pending challenges:', error);
    }
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleOpenChallengeModal = () => {
    setShowChallengeModal(true);
  };

  const handleCloseChallengeModal = () => {
    setShowChallengeModal(false);
    setSelectedUser(null);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendChallenge = async () => {
    if (!selectedUser) return;
    
    try {
      const myUserId = localStorage.getItem('userId');
      if (!myUserId) {
        alert('You need to be logged in to send challenges');
        return;
      }

      const userId = localStorage.getItem('userId')
      
      const challengeData = {
        challangerId: selectedUser.userId,
        myUserId: userId,
        myScore: userScore

       
      };
      
      console.log(challengeData.challangerId);
      
      // Send challenge to the API
      await axios.post('http://backend-production-2d2c.up.railway.app/challange', challengeData);
      
      alert(`Challenge sent to ${selectedUser.userName}!`);
      handleCloseChallengeModal();
    } catch (error) {
      console.error('Error sending challenge:', error);
      alert('Failed to send challenge. Please try again.');
    }
  };

  const handleTogglePendingChallenges = () => {
    setShowPendingChallenges(!showPendingChallenges);
    if (!showPendingChallenges) {
      checkPendingChallenges();
    }
  };

  const handleAcceptChallenge = (challenge) => {
    // Store the challenge details in session storage
    sessionStorage.setItem('currentChallenge', JSON.stringify(challenge));
    
    // Navigate to the quiz page
    navigate('/quiz');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div className="header">
        <div className="user-info">
          <span>Welcome, {localStorage.getItem('userEmail')}</span>
          <div className="user-score">
            <FaTrophy style={{ color: '#FFD700', marginRight: '5px' }} />
            Score: {userScore}
          </div>
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="game-page">
        <h1 className="game-title">Welcome to the Quiz Challenge!</h1>
        
        <div className="game-description">
          <p>
            Get ready to test your knowledge with our interactive quiz. You'll be presented with
            questions and multiple-choice answers. Choose the correct answer to score points!
          </p>
          <p>
            Click the button below to start your quiz adventure or challenge a friend.
          </p>
        </div>
        
        <div className="game-buttons">
          <button className="btn btn-primary" onClick={handleStartQuiz}>
            Play Game
          </button>
          
          <button className="btn challenge-btn" onClick={handleOpenChallengeModal}>
            <FaUserFriends style={{ marginRight: '8px' }} />
            Challenge a Friend
          </button>
          
          <button 
            className={`btn notification-btn ${pendingChallenges.length > 0 ? 'has-notifications' : ''}`} 
            onClick={handleTogglePendingChallenges}
          >
            Pending Challenges
            {pendingChallenges.length > 0 && (
              <span className="notification-badge">{pendingChallenges.length}</span>
            )}
          </button>
        </div>
        
        {/* Challenge Modal */}
        {showChallengeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Challenge a Friend</h2>
              <p>Select a user to challenge:</p>
              
              <div className="user-list">
                {users.length > 0 ? (
                  users.map(user => (
                    <div 
                      key={user.userId}
                      className={`user-item ${selectedUser && selectedUser.userId === user.userId ? 'selected' : ''}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="user-avatar">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-name">{user.userName}</div>
                    </div>
                  ))
                ) : (
                  <p>No other users available to challenge</p>
                )}
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCloseChallengeModal}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSendChallenge}
                  disabled={!selectedUser}
                >
                  Send Challenge
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Pending Challenges Modal */}
        {showPendingChallenges && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Pending Challenges</h2>
              
              {pendingChallenges.length > 0 ? (
                <div className="challenge-list">
                  {pendingChallenges.map((challenge, index) => (
                    <div key={index} className="challenge-item">
                      <div className="challenge-info">
                        <p><strong>{challenge.challengerName || 'User ' + challenge.myUserId}</strong> has challenged you!</p>
                        <p>Their score: <strong>{challenge.myScore}</strong></p>
                      </div>
                      <div className="challenge-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleAcceptChallenge(challenge)}
                        >
                          Accept
                        </button>
                        <button className="btn btn-secondary">
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No pending challenges</p>
              )}
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleTogglePendingChallenges}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;