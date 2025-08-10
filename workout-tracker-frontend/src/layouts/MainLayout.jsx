import { Outlet } from 'react-router-dom'

import NavigationBar from '../components/NavigationBar'

const MainLayout = () => {
  return (
    <div className="h-100 flex flex-col bg-main-900">
        <div className="overflow-y-auto pb-20">
            <Outlet />
        </div>
        <div>
            <NavigationBar />
        </div>
    </div>
  )
}

export default MainLayout