  // import { useNavigate } from 'react-router-dom';
  // import { useEffect, useState } from 'react';

  // function HomePage() {
  //   const navigate = useNavigate();
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);

  //   useEffect(() => {
  //     // Check if user is logged in
  //     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //     setIsLoggedIn(loggedIn);
  //   }, []);

  //   const handlePlayGame = () => {
  //     navigate('/game');
  //   };

  //   const handleLogin = () => {
  //     navigate('/login');
  //   };

  //   const handleLogout = () => {
  //     localStorage.removeItem('isLoggedIn');
  //     localStorage.removeItem('userEmail');
  //     setIsLoggedIn(false);
  //   };

  //   return (
  //     <div>
  //       <div className="header">
  //         {isLoggedIn ? (
  //           <div className="user-info">
  //             <span>Welcome, {localStorage.getItem('userEmail')}</span>
  //             <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
  //           </div>
  //         ) : (
  //           <button className="btn" onClick={handleLogin}>Login</button>
  //         )}
  //       </div>
  //       <div className="container">
  //         <h1>Quiz Challenge</h1>
  //         <p>Test your knowledge with our interactive quiz!</p>
  //         <button 
  //           className="btn btn-primary" 
  //           onClick={handlePlayGame}
  //           style={{ fontSize: '1.2rem', padding: '0.8em 1.5em' }}
  //         >
  //           Play Game
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // export default HomePage;

  import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function HomePage() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    const handlePlayGame = () => {
        navigate('/game');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
    };

    const handleInvite = () => {
        // Get the current URL (without the path)
        const currentUrl = window.location.origin;
        const inviteMessage = `Join me for a fun quiz challenge at ${currentUrl}!`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(inviteMessage)
            .then(() => {
                setCopySuccess('Link copied!');
                setTimeout(() => setCopySuccess(''), 2000);
                
                // Open WhatsApp Web
                const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
                window.open(whatsappUrl, '_blank');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                setCopySuccess('Failed to copy');
            });
    };

    return (
        <div>
            <div className="header">
                {isLoggedIn ? (
                    <div className="user-info">
                        <span>Welcome, {localStorage.getItem('userEmail')}</span>
                        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <button className="btn" onClick={handleLogin}>Login</button>
                )}
            </div>
            <div className="container">
                <h1 className="game-title">Quiz Challenge</h1>
                <p className="game-description">Test your knowledge with our interactive quiz!</p>
                <div className="home-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={handlePlayGame}
                        style={{ fontSize: '1.2rem', padding: '0.8em 1.5em' }}
                    >
                        Play Game
                    </button>
                    
                    <button 
                        className="btn btn-secondary invite-btn"
                        onClick={handleInvite}
                        style={{ fontSize: '1.2rem', padding: '0.8em 1.5em', marginLeft: '1rem' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Invite Friends
                    </button>
                </div>
                
                {copySuccess && (
                    <div className="copy-notification" style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                        borderRadius: '4px',
                        fontWeight: '500'
                    }}>
                        {copySuccess}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;