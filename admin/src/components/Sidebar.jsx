import React, { useContext } from 'react';

import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';


const Sidebar = () => {
 

  return (
    <div className='min-h-screen bg-white border-r'>
     
        <ul className='text-[#515151] mt-5 space-y-4 md:space-y-0 md:flex md:flex-col'>
          <li>
            <NavLink
              to='/add'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.add_icon} alt='Dashboard Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Add Items</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/list'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.order_icon} alt='Appointment Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>List Items</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/orders'
              className={({ isActive }) =>
                `flex items-center gap-3 py-3.5 px-4 md:px-6 hover:bg-gray-100 ${
                  isActive ? 'bg-[#F2F3FF] border-r-4 border-primary font-semibold' : ''
                }`
              }
            >
              <img src={assets.order_icon} alt='Add Doctor Icon' className='w-5 h-5' />
              <p className='hidden md:inline-block'>Orders</p>
            </NavLink>
          </li>
       
        </ul>
    



    </div>
  );
};

export default Sidebar;
