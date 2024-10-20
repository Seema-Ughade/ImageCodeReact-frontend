import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Edit, Trash2 } from 'lucide-react'; // Import the icons

const SingleImage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]); // State to hold submitted users
  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const navigate = useNavigate(); // Initialize navigate

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://imagecodereact-backennd.onrender.com/api/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // FormData to send the data
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('image', formData.image); // Image file

    try {
      const response = editingUserId 
        ? await axios.put(`https://imagecodereact-backennd.onrender.com/api/${editingUserId}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }) 
        : await axios.post('https://imagecodereact-backennd.onrender.com/api/', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

      console.log('Form Data Submitted:', response.data);
      setMessage(editingUserId ? 'User updated successfully!' : 'User created successfully!');

      // Update users state
      if (editingUserId) {
        setUsers(users.map(user => user._id === editingUserId ? response.data.user : user));
        setEditingUserId(null); // Reset editing state
      } else {
        setUsers([...users, { ...formData, id: response.data.user._id }]); // Add new user
      }

      // Reset form data
      setFormData({
        name: '',
        email: '',
        password: '',
        image: null,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error creating/updating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Optionally keep this blank for security
      image: null,
    });
    setEditingUserId(user._id); // Set the editing user ID
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://imagecodereact-backennd.onrender.com/api/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from state
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen flex justify-center items-start p-8">
      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mr-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">{editingUserId ? 'Edit User' : 'Demo Form'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!editingUserId} // Password is required only when creating a new user
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Upload Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-md mt-4 hover:bg-purple-700 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (editingUserId ? 'Update' : 'Submit')}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>

      {/* Display submitted users in a table */}
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-xl">
        <h2 className="text-lg font-semibold text-center mb-4 text-gray-700">Submitted Users</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition duration-200">
                <td className="border px-4 py-2">
                  {user.image && <img src={user.image} alt={user.name} className="w-10 h-10" />}
                </td>
                <td className="border px-4 py-2 text-gray-700">{user.name}</td>
                <td className="border px-4 py-2 text-gray-700">{user.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:underline mr-2 transition duration-200"
                  >
                    <Edit className="h-5 w-5 inline-block" />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:underline transition duration-200"
                  >
                    <Trash2 className="h-5 w-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end w-full mt-4">
        <button
          onClick={() => navigate('/')} // Navigate back to Dashboard
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      </div>
    </div>
  );
};

export default SingleImage;
