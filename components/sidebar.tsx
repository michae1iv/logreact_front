"use client";
import "./sidebars.css";

import Link from 'next/link';
import { useState } from 'react';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className={`sidebars ${isOpen ? 'open' : ''}`}>
        <div className="logo-details">
            <div className="logo_name">Logreact</div>
            <i onClick={() => setIsOpen(!isOpen)} id="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16" transform="translate(17, 22)">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
            </svg></i>
        </div>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center hover:bg-gray-700 rounded">
                <i className='bx-side'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-fill" viewBox="0 0 16 16" transform="translate(16, 16)">
                        <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
                    </svg>
                </i>
                <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip-side text-black">Dashboard</span>
          </li>
          <li>
            <Link href="/admin" className="flex items-center text-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-fill" viewBox="0 0 16 16" transform="translate(16, 16)">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
              </i>
              <span className="links_name">Admin Page</span>
            </Link>
            <span className="tooltip-side text-black">Admin Page</span>
          </li>
          <li>
            <Link href="/alerts" className="flex items-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-diamond-fill" viewBox="0 0 16 16" transform="translate(16, 16)">
                  <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
              </i>
              <span className="links_name">Alerts</span>
            </Link>
            <span className="tooltip-side text-black">Alerts</span>
          </li>
          <li>
            <Link href="/rules" className="flex items-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bar-chart-fill" viewBox="0 0 16 16" transform="translate(16, 16)">
                  <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/>
                </svg>
              </i>
              <span className="links_name">Rules</span>
            </Link>
            <span className="tooltip-side text-black">Rules</span>
          </li>
          <li>
            <Link href="/lists" className="flex items-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-plus-fill" viewBox="0 0 16 16" transform="translate(16, 16)">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0"/>
              </svg>
              </i>
              <span className="links_name">Lists</span>
            </Link>
            <span className="tooltip-side text-black">Lists</span>
          </li>
          <li>
            <Link href="/auth/login" className="flex items-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16" transform="translate(16, 16)">
                  <path fillRule="evenodd" d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                </svg>
              </i>
              <span className="links_name">Login</span>
            </Link>
            <span className="tooltip-side text-black">Login</span>
          </li>
          <li>
            <Link href="/auth/logout" className="flex items-center hover:bg-gray-700 rounded">
              <i className='bx-side'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" transform="translate(16, 16)">
                  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                </svg>
              </i>
              <span className="links_name">Logout</span>
            </Link>
            <span className="tooltip-side text-black">Logout</span>
          </li>
        </ul>
      </div>
    );
  };

export default Sidebar;