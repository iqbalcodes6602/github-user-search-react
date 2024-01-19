// App.js
import { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('iqbalcodes6602');
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      fetch(`https://api.github.com/users/${user}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`User not found (${response.status})`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setUserData(data);
          setError(null);          
          fetchRepos()
        })
        .catch((error) => {
          console.error(error.message);
          setUserData(null);
          setError('User not found. Please check the username.');
          setLoading(false);
        });
    }, 2000);
  }
  function fetchRepos() {
    fetch(`https://api.github.com/users/${user}/repos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`User not found (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserRepos(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setUserRepos(null);
        setError('User not found. Please check the username.');
        setLoading(false);
      });
  }
  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button onClick={handleSubmit}>Click</button>
      </div>

      {loading &&
        <p style={{ color: "red" }}>
          Loading...<img src='./' />
        </p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {userData && !error && (
          <div className="user-details">
            <img src={userData.avatar_url} alt="User Avatar" />
            <h2>{userData.login}</h2>
            <p>
              Followers: {userData.followers} | Following: {userData.following}
            </p>
            <p>
              Public Repos: {userData.public_repos} | Public Gists: {userData.public_gists}
            </p>
            <p>
              <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                Visit Profile
              </a>
            </p>
          </div>
        )}
      </div>

      <div>
        {userRepos && userRepos.length > 0 && (
          <div className="repos-list">
            <h2>User Repositories</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'left' }}>
              {userRepos.map((repo) => (
                <div key={repo.id} style={{ width: '45%', backgroundColor: 'rgb(25 25 25)', margin: '10px', minHeight: '50px', padding: '15px', borderRadius: '10px' }}>
                  <div>
                    <a style={{ fontSize: '120%', color: '#0366d6' }} href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>&nbsp;&nbsp;
                    <span style={{ fontSize: '70%', border: '2px solid #242424', borderRadius: '50px', padding: '4px 8px', fontWeight: '700' }}>{repo.visibility.charAt(0).toUpperCase() + repo.visibility.slice(1)}</span>
                  </div>
                  <div style={{ margin: '10px 0px' }}>{repo.description}</div>
                  <div style={{ margin: '10px 0px' }}>
                    {
                      (repo.fork)
                      &&
                      <span style={{ fontSize: '80%', backgroundColor: '#242424', padding: '2px 4px', borderRadius: '5px', margin: '0 10px 0 0' }}>Forked</span>
                    }
                    {
                      (repo.language)
                      &&
                      <span style={{ fontSize: '80%', backgroundColor: '#242424', padding: '2px 4px', borderRadius: '5px' }}>{repo.language}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
