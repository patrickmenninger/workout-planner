import api from '../services/APIClient.mjs';

const handleLogin = async(e) => {
    e.preventDefault();

    console.log(await api.login("patrick.menninger@gmail.com", "1@yk%B%580usYf"));
}

const HomePage = () => {
  return (
    <div>
        <button onClick={(e) => handleLogin(e)}>Login</button>
    </div>
  )
}

export default HomePage