import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
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
  const handleFileUpload = (file) => {
    const storage = getStorage(app);

    // Makes filename unique
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',

      // Progress callback
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setFilePerc(Math.round(progress));
      },

      // Error callback
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },

      // Success callback
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          // Save image URL into form data
          setFormData((prev) => ({
            ...prev,
            avatar: downloadURL,
          }));
        });
      }
    );
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
      </form>

      {/* Future functionality */}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>
          Delete account
        </span>

        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error:''}</p>
      <p className='text-red-700 mt-5'>{updateSuccess ? 'Updated Successfully!': ''}</p>
    </div>
  );
}

export default Profile;