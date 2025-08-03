import { Outlet } from 'react-router-dom'

import NavigationBar from '../components/NavigationBar'

const MainLayout = () => {
  return (
    <>
        <Outlet />
        <NavigationBar />
    </>
  )
}

export default MainLayout