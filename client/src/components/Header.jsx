import React from 'react';
import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';



export default function Header() {

  const {currentUser} = useSelector(state=>state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set('searchTerm', searchTerm);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);

  }

  useEffect (()=>{
    const urlparams = new URLSearchParams(location.search);
    const searchtermFromUrl = urlparams.get('searchTerm');

    if(searchtermFromUrl){
      setSearchTerm(searchtermFromUrl);
    }
  },[])
  return (
   <header className='bg-slate-200 shadow-md'>
     <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/' >
    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
      <span className='text-slate-500'>Pro</span>
      <span className='text-slate-700'>Estate</span>
    </h1>
    </Link>
    <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
      <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64 '
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button>
        <FaSearch className='text-slate-600' />
      </button>
     
    
    </form>
    <ul className='flex gap-4'>
      <Link to='/' >
        <li className='hidden sm:inline text-slave-700 hover:text-bold'>Home</li>
      </Link>
      <Link to='/about'>
      <li className='hidden sm:inline text-slave-700 hover:text-bold'>About</li>
      </Link>
      <Link to='/profile'>
      {currentUser ?(
        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
      ):(
        <li className=' text-slave-700 hover:text-bold'>SignIn</li>
      )}
      
      </Link>
    </ul>
    </div>
   </header>
  )
}

