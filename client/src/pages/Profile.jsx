import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';

function Profile() {

  // Reference to the hidden file input
  // Allows us to trigger file selection when the profile image is clicked
  const fileRef = useRef(null);

  // Fetch logged-in user from Redux store
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Stores selected image file
  const [file, setFile] = useState(undefined);

  // Stores upload progress percentage
  const [filePerc, setFilePerc] = useState(0);

  // Tracks upload failures
  const [fileUploadError, setFileUploadError] = useState(false);

  // Stores updated form values before sending to backend
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError ] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  /*
    Whenever a new file is selected,
    automatically upload it to Firebase.
  */
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  /*
    Upload image to Firebase Storage

    Steps:
    1. Create Firebase Storage instance
    2. Generate unique file name
    3. Upload file
    4. Track upload progress
    5. Get public URL after upload
    6. Save URL in formData.avatar
  */
 const handleFileUpload = async (file) => {
  try {
    setFileUploadError(false);
    const sigRes = await fetch('/api/cloudinary/signature', {
      credentials: 'include',
    });
    const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

    const data = new FormData();
    data.append('file', file);
    data.append('api_key', apiKey);
    data.append('timestamp', timestamp);
    data.append('signature', signature);
    data.append('upload_preset', 'proEstate');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: data }
    );

    const json = await res.json();

    if (!json.secure_url) {
      throw new Error(json.error?.message || 'Image upload failed');
    }

    setFilePerc(100);
    setFormData((prev) => ({
      ...prev,
      avatar: json.secure_url,
    }));
  } catch (error) {
    console.log(error);
    setFileUploadError(true);
  }
};

  /*
    Updates formData whenever user changes
    username, email, or password.

    Example:
    username => { username: "john" }
    email => { email: "john@gmail.com" }
  */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  /*
    Sends updated profile information
    to backend API.

    Flow:
    1. Dispatch loading action
    2. Send updated data
    3. Handle failure
    4. Update Redux store on success
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `/api/user/update/${currentUser._id}`,
        {
          method: 'POST', // change to PUT if backend uses PUT
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      // Update Redux state with latest user data
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',

      });
      const data = await res.json();
      if(data.success ===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleShowListings = async ()=>{
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch( '/api/auth/signout' );
      const data = await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleListingDelete=async (listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });

      const data = await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=> prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        {/* Hidden file input */}
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Clicking image opens file picker */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        {/* Upload status */}
        <p className='text-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error uploading image
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>
              Uploading {filePerc}%
            </span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>
              Image uploaded successfully!
            </span>
          ) : (
            ''
          )}
        </p>

        {/* User information fields */}
        <input
          type='text'
          placeholder='Username'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />

        <input
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          onChange={handleChange}
          className='border p-3 rounded-lg'
        />

        {/* Submit profile updates */}
        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
          {loading ? 'Loading...' : 'update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
        Create Listing
        </Link>
      </form>

      {/* Future functionality */}
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
          Delete account
        </span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error:''}</p>
      <p className='text-red-700 mt-5'>{updateSuccess ? 'Updated Successfully!': ''}</p>
      <button onClick={handleShowListings}  className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'> {showListingsError? 'Error showing listings': ''}</p>

      {userListings && userListings.length>0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
      {userListings.map((listing)=>(
        <div key={listing._id} className=' border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
          
          <img 
          src={listing.imageUrls[0]} alt="listing cover" 
          className='h-16 w-16 object-contain' 
          />
          </Link>
          <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
          <p >{listing.name}</p>
          </Link>

          <div className='flex flex-col items-center'>
            <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700 uppercase'>Edit</button>
            </Link>
          </div>
        </div>
      ))}
      
      </div>}
    </div>
  );
}

export default Profile;