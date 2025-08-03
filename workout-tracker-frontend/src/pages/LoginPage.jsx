import { useNavigate } from 'react-router-dom';

import {login} from '../services/AuthService.mjs';

const LoginPage = () => {

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();

        console.log(await login("patrick.menninger@gmail.com", "1@yk%B%580usYf"));

        navigate("/", {replace: true});
    }

  return (
    <div>
        <button onClick={(e) => handleLogin(e)}>Login</button>
    </div>
  )
}

export default LoginPage