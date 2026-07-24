import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, User, Bell, LogOut } from 'lucide-react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  
  // State for dynamic user data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Fetch User Data from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMouseEnter = (id) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  // TOP ROW LINKS (Adapted for Intranet Support)
  const topRowLinks = [
    { label: 'MAIN WEBSITE', path: 'https://malutitvet.co.za' },
    { label: 'HELP DESK', path: '/support' },
    { label: 'SYSTEM ALERTS', path: '/alerts' }
  ];

  // QMS INTRANET NAVIGATION
  const documentsDropdown = [
    { label: 'View All Documents', path: '/documents' },
    { label: 'My Document Tracker', path: '/documents/tracker' },
    { label: 'Expired Documents', path: '/documents/expired' }
  ];

  const adminDropdown = [
    { label: 'Documents Awaiting Action', path: '/admin/pending' },
    { label: 'Overdue Documents', path: '/admin/overdue' },
    { label: 'User Management', path: '/admin/users' }
  ];

  const secondRowNav = [
    { id: 'dashboard', label: 'DASHBOARD', path: '/', dropdown: null, hasLink: true },
    { id: 'documents', label: 'DOCUMENTS', path: '/documents', dropdown: documentsDropdown, hasLink: true },
    { id: 'governance', label: 'GOVERNANCE', path: '/governance', dropdown: null, hasLink: true },
    { id: 'admin', label: 'ADMIN PANEL', path: '/admin', dropdown: adminDropdown, hasLink: true }
  ];

  const toggleMobileDropdown = (id) => {
    setMobileDropdownOpen(mobileDropdownOpen === id ? null : id);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  return (
    <>
      {/* TOP ROW - Desktop only */}
      <div className="top-row desktop-only">
        <div className="top-row-container">
          <div className="phone-number">
            <span className="phone-label">MALUTI TVET COLLEGE QMS:</span>
            <a href="tel:0343264888" className="phone-number-link">Internal Support: Ext 4888</a>
          </div>
          <div className="top-links">
            {topRowLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <a href={link.path} className="top-link">
                  {link.label}
                </a>
                {index < topRowLinks.length - 1 && <span className="top-link-separator">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="main-header">
        <div className="main-header-container">
          <a href="/" className="logo-wrapper" onClick={closeMobileMenu}>
            <img 
              src="/DhetLogo.png" 
              alt="DHET" 
              className="dhet-logo"
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/50x50/00B5E2/white?text=DHET';
              }} 
            />
            <img 
              src="/MalutiLogo.png" 
              alt="Maluti TVET" 
              className="logo" 
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/70x70/00B5E2/white?text=M'; 
              }} 
            />
            <div className="logo-text desktop-logo-text">
              <span className="college-name">Maluti TVET College</span>
              <span className="college-sub">QMS INTRANET</span>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="desktop-nav">
            {secondRowNav.map(item => (
              <div 
                key={item.id} 
                className="nav-item-wrapper"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.id)}
                onMouseLeave={() => item.dropdown && handleMouseLeave()}
              >
                {item.hasLink ? (
                  <a href={item.path} className="nav-link">
                    {item.label}
                    {item.dropdown && <span className="dropdown-arrow">▼</span>}
                  </a>
                ) : (
                  <button className={`nav-link dropdown-trigger ${activeDropdown === item.id ? 'active' : ''}`}
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}>
                    {item.label}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                )}
                {item.dropdown && activeDropdown === item.id && (
                  <div className="dropdown-menu">
                    {item.dropdown.map((subItem, idx) => (
                      <a key={idx} href={subItem.path} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SECTION: Notifications & Profile */}
          <div className="right-section hidden md:flex items-center gap-4">
             <button className="relative text-[#141632] hover:text-[#00B5E2] transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#009639]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-[#141632] leading-tight">
                  {userData ? (userData.fullName || userData.email) : "Loading..."}
                </p>
                <p className="text-xs text-[#00B5E2] font-semibold">
                  {userData ? (userData.role === 'SUPER_ADMIN' ? 'Super Admin' : userData.role) : ""}
                </p>
              </div>
              <div className="group relative">
                <div className="h-10 w-10 rounded-full bg-[#f0f7ff] flex items-center justify-center border-2 border-[#F2A900] cursor-pointer">
                  <User size={20} className="text-[#00B5E2]" />
                </div>
                {/* Desktop Sign Out Dropdown */}
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block transition-all">
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            {topRowLinks.map(link => (
              <a key={link.label} href={link.path} className="mobile-top-link" onClick={closeMobileMenu}>
                {link.label}
              </a>
            ))}
            
            <div className="mobile-divider"></div>
            
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#f0f7ff] flex items-center justify-center border-2 border-[#F2A900]">
                  <User size={24} className="text-[#00B5E2]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#141632]">
                    {userData ? (userData.fullName || userData.email) : "Loading..."}
                  </p>
                  <p className="text-xs text-[#00B5E2] font-semibold">
                    {userData ? (userData.role === 'SUPER_ADMIN' ? 'Super Admin' : userData.role) : ""}
                  </p>
                </div>
              </div>
              <button onClick={handleSignOut} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                <LogOut size={20} />
              </button>
            </div>
            
            <div className="mobile-divider"></div>
            
            {secondRowNav.map(item => (
              <div key={item.id} className="mobile-nav-item">
                <div className="mobile-nav-header" onClick={() => item.dropdown && toggleMobileDropdown(item.id)}>
                  {item.hasLink ? (
                    <a href={item.path} className="mobile-nav-link" onClick={(e) => {
                      if (item.dropdown) {
                        e.preventDefault();
                        toggleMobileDropdown(item.id);
                      } else {
                        closeMobileMenu();
                      }
                    }}>
                      {item.label}
                    </a>
                  ) : (
                    <span className="mobile-nav-link no-link">{item.label}</span>
                  )}
                  {item.dropdown && <ChevronDown size={18} className={`mobile-chevron ${mobileDropdownOpen === item.id ? 'open' : ''}`} />}
                </div>
                {item.dropdown && mobileDropdownOpen === item.id && (
                  <div className="mobile-submenu">
                    {item.dropdown.map((subItem, idx) => (
                      <a key={idx} href={subItem.path} className="mobile-submenu-link" onClick={closeMobileMenu}>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mobile-divider"></div>
            
            <div className="mobile-contact">
              <span>INTERNAL IT SUPPORT</span>
              <a href="tel:0343264888" onClick={closeMobileMenu}>Ext: 4888</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding-top: 130px; overflow-x: hidden; width: 100%; }
        .top-row { background: #00B5E2; height: 48px; padding: 0; position: fixed; top: 0; left: 0; width: 100%; z-index: 1001; display: flex; align-items: center; }
        .top-row-container { max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
        .phone-number { display: flex; align-items: center; gap: 0.5rem; }
        .phone-label { color: white; font-size: 0.75rem; font-weight: 600; }
        .phone-number-link { color: white; text-decoration: none; font-size: 0.85rem; font-weight: 700; }
        .phone-number-link:hover { color: #F2A900; }
        .top-links { display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap; }
        .top-link { color: white; text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.7rem; font-weight: 700; border-radius: 30px; transition: all 0.3s; }
        .top-link:hover { background-color: #F2A900; color: #141632; }
        .top-link-separator { color: rgba(255, 255, 255, 0.5); font-size: 0.7rem; }
        .main-header { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.08); position: fixed; top: 47px; left: 0; width: 100%; z-index: 1000; }
        .main-header-container { max-width: 1200px; margin: 0 auto; padding: 0.6rem 2rem; display: flex; justify-content: space-between; align-items: center; min-height: 80px; gap: 1rem; flex-wrap: nowrap; }
        .logo-wrapper { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; flex-shrink: 0; }
        .dhet-logo { height: 50px; width: auto; }
        .logo { height: 55px; width: auto; }
        .logo-text { display: flex; flex-direction: column; }
        .college-name { color: #141632; font-size: 1rem; font-weight: 800; }
        .college-sub { color: #00B5E2; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; }
        .desktop-nav { display: flex; gap: 0.25rem; flex-wrap: nowrap; justify-content: center; flex: 1; }
        .nav-item-wrapper { position: relative; }
        .nav-link { text-decoration: none; color: #333; font-weight: 600; padding: 0.6rem 1rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; border-radius: 30px; transition: all 0.3s; background: none; border: none; cursor: pointer; }
        .nav-link:hover { background: rgba(0, 181, 226, 0.1); color: #00B5E2; }
        .nav-link.active { background: #00B5E2; color: white; }
        .dropdown-arrow { font-size: 0.6rem; opacity: 0.7; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: white; box-shadow: 0 8px 20px rgba(0,0,0,0.15); border-radius: 12px; min-width: 240px; padding: 0.6rem 0; z-index: 1001; border-top: 3px solid #F2A900; margin-top: 0.5rem; }
        .dropdown-item { display: block; padding: 0.6rem 1.2rem; color: #333; text-decoration: none; font-size: 0.8rem; transition: all 0.2s; white-space: nowrap; }
        .dropdown-item:hover { background: #f0f7ff; color: #009639; padding-left: 1.5rem; }
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.3s; }
        .mobile-menu-btn:hover { background: rgba(0, 0, 0, 0.05); }
        .mobile-menu-overlay { position: fixed; top: 128px; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; visibility: hidden; opacity: 0; transition: all 0.3s ease; }
        .mobile-menu-overlay.open { visibility: visible; opacity: 1; }
        .mobile-menu { position: fixed; top: 128px; right: 0; bottom: 0; width: 100%; max-width: 100%; background: white; transform: translateX(100%); transition: transform 0.3s ease; overflow-y: auto; box-shadow: -12px 0 28px rgba(0,0,0,0.12); }
        .mobile-menu-overlay.open .mobile-menu { transform: translateX(0); }
        .mobile-menu-inner { padding: 1rem 0 2rem; }
        .mobile-top-link { display: block; text-decoration: none; padding: 0.8rem 1rem; margin: 0.25rem 1rem; text-align: center; font-weight: 700; border-radius: 40px; background: #00B5E2; color: white; font-size: 0.85rem; }
        .mobile-divider { height: 1px; background: #eee; margin: 0.75rem 1rem; }
        .mobile-nav-item { border-bottom: 1px solid #f5f5f5; }
        .mobile-nav-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; cursor: pointer; }
        .mobile-nav-link { flex: 1; text-decoration: none; color: #333; font-weight: 600; font-size: 0.9rem; display: block; }
        .mobile-chevron { transition: transform 0.3s ease; color: #999; }
        .mobile-chevron.open { transform: rotate(180deg); color: #F2A900; }
        .mobile-submenu { padding-left: 1rem; background: #fafafa; }
        .mobile-submenu-link { display: block; text-decoration: none; padding: 0.7rem 1rem; color: #666; font-size: 0.85rem; border-left: 2px solid transparent; }
        .mobile-submenu-link:active { background: #f0f0f0; color: #009639; border-left-color: #009639; }
        .mobile-contact { padding: 1rem; text-align: center; background: #f8f9fa; margin: 0.5rem 1rem; border-radius: 12px; }
        .mobile-contact span { display: block; font-size: 0.7rem; color: #666; margin-bottom: 0.25rem; }
        .mobile-contact a { color: #00B5E2; text-decoration: none; font-weight: 700; display: block; margin-top: 0.25rem; font-size: 0.9rem; }
        @media (min-width: 1181px) { .desktop-only { display: block; } }
        @media (min-width: 1181px) and (max-width: 1450px) {
          .main-header-container { padding-left: 1rem; padding-right: 1rem; gap: 0.5rem; }
          .desktop-logo-text { display: none; }
          .logo-wrapper { gap: 0.4rem; }
          .dhet-logo { height: 42px; }
          .logo { height: 48px; }
          .desktop-nav { gap: 0; }
          .nav-link { padding: 0.55rem 0.6rem; font-size: 0.68rem; }
        }
        @media (max-width: 1180px) {
          body { padding-top: 80px; }
          .desktop-only { display: none !important; }
          .main-header { top: 0; }
          .mobile-menu-overlay { top: 80px; }
          .mobile-menu { top: 80px; width: 100%; max-width: 100%; }
          .desktop-nav, .right-section { display: none; }
          .mobile-menu-btn { display: flex; }
          .main-header-container { padding: 0.5rem 1rem; min-height: 65px; }
          .dhet-logo { height: 35px; }
          .logo { height: 40px; }
          .logo-wrapper { gap: 0.5rem; }
        }
        @media (max-width: 768px) {
          .desktop-logo-text { display: none !important; }
          .logo-wrapper { gap: 0.5rem; }
          .dhet-logo { height: 38px; }
          .logo { height: 42px; }
        }
      `}</style>
    </>
  );
};

export default Header;