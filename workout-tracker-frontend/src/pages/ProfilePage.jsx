import { logout } from '../services/AuthService.mjs'
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';

const ProfilePage = () => {

    async function handleLogout() {
        await logout();
        window.location.reload();
    }

  return (
    <div>
        ProfilePage
        <button onClick={() => handleLogout()}>Logout</button>
    </div>
  )
}

export default ProfilePage