import { useNavigate } from 'react-router-dom';

import {login} from '../services/AuthService.mjs';

const LoginPage = () => {

    const navigate = useNavigate();

    const handleLogin = async(loginName) => {

        if (loginName === "dev") {
            await login("snotpart@gmail.com", "%E4i&lS!CEU1aJ");
        } else if (loginName === "patrick") {
            console.log(await login("patrick.menninger@gmail.com", "1@yk%B%580usYf"));
        }

        navigate("/", {replace: true});
    }

  return (
    <div>
        <button onClick={() => handleLogin("patrick")}>Login Patrick</button>
        <button onClick={() => handleLogin("dev")}>Login Dev</button>
    </div>
  )
}

export default LoginPage