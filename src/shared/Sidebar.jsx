import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Explore', path: '/dashboard', icon: '🔍' },
    { name: 'My Reports', path: '/my-reports', icon: '📋' },
    { name: 'Companies', path: '/companies', icon: '🏢' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

