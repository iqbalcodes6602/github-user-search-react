import loadingImage from './assets/loading.svg';
import logo from './assets/logo.png';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('iqbalcodes6602');
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
          fetchRepos(currentPage, perPage); // Pass current page and per page to fetchRepos
        })
        .catch((error) => {
          console.error(error.message);
          setUserData(null);
          setError('User not found. Please check the username.');
          setUserRepos(null);
          setLoading(false);
        });
    }, 2000);
  }

  function fetchRepos(page, perPage) {
    fetch(`https://api.github.com/users/${user}/repos?page=${page}&per_page=${perPage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`User repositories not found (${response.status})`);
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
        setError('User repositories not found. Please check the username.');
        setLoading(false);
      });
  }

  useEffect(() => {
    if (userData) {
      fetchRepos(currentPage, perPage);
    }
  }, [currentPage, perPage]);

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container">

      {/* search section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: 'calc(100vw - 50px)', height: '90vh', backgroundColor: '' }}>
        <img style={{ width: '30%' }} src={logo} />
        <div style={{ margin: '2rem', minWidth: '50px', width: '20%' }}>
          <input
            className='search-input'
            style={{ height: '50px', width: '100%', border: 'none', borderBottom: '2px solid #0366d6', background: 'transparent', }}
            type="text"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </div>
        <div style={{ minWidth: '50px', width: '20%' }}>
          <button style={{ width: '100%' }} onClick={handleSubmit}>
            {loading ? <img style={{ height: '20px' }} src={loadingImage} alt="Loading" /> : 'Search'}
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* user data card */}
      <div>
        {userData && !error && (
          <div className="user-details" >
            <div style={{ height: 'auto', width: '50%', display:'flex', justifyContent: 'center', alignItems: 'center', }}>
              <img src={userData.avatar_url} alt="User Avatar" />
            </div>
            <div>
              <h2>{userData.login}</h2>
              <p>{userData.bio}</p>
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
          </div>
        )}
      </div>

      {/* users repos */}
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
                    {repo.fork && (
                      <span style={{ fontSize: '80%', backgroundColor: '#242424', padding: '2px 4px', borderRadius: '5px', margin: '0 10px 0 0' }}>Forked</span>
                    )}
                    {repo.language && (
                      <span style={{ fontSize: '80%', backgroundColor: '#242424', padding: '2px 4px', borderRadius: '5px' }}>{repo.language}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* pagination */}
      <div>
        {userRepos && userRepos.length > 0 && (
          <div>
            <div>
              <label htmlFor="perPage">Repos per page:</label>
              <select id="perPage" onChange={(e) => handlePerPageChange(Number(e.target.value))} value={perPage}>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span> Page {currentPage} </span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={userRepos.length < perPage || userData.public_repos / currentPage === perPage} >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
