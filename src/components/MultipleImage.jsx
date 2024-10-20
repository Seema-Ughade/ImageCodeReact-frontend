import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Edit, Trash2 } from 'lucide-react'; // Import the icons

const MultipleImage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    images: [], // Change to array to handle multiple images
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]); // State to hold submitted users
  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const [imageInputs, setImageInputs] = useState(['']); // State to manage multiple image inputs
  const [showImageInput, setShowImageInput] = useState(false); // State to toggle image input visibility
  const navigate = useNavigate(); // Initialize navigate

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/mutipleimageroutes/new');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: Array.from(files) }); // Store selected files as an array
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageInputChange = (index, e) => {
    const newImageInputs = [...imageInputs];
    newImageInputs[index] = e.target.files[0]; // Store selected file
    setImageInputs(newImageInputs);
  };

  const handleAddImageInput = () => {
    setImageInputs([...imageInputs, '']); // Add a new input field
  };

  const handleRemoveImageInput = (index) => {
    const newImageInputs = imageInputs.filter((_, i) => i !== index); // Remove input field at index
    setImageInputs(newImageInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // FormData to send the data
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    
    // Append each image input to FormData
    imageInputs.forEach((image) => {
      if (image) {
        data.append('images', image); // Only append if there's an image
      }
    });

    try {
      const response = editingUserId 
        ? await axios.put(`http://127.0.0.1:5000/api/mutipleimageroutes${editingUserId}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }) 
        : await axios.post('http://127.0.0.1:5000/api/mutipleimageroutes', data, {
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
        images: [], // Reset images
      });
      setImageInputs(['']); // Reset image inputs
      setShowImageInput(false); // Hide image input after submission
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
      images: [], // Reset images on edit
    });
    setEditingUserId(user._id); // Set the editing user ID
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/mutipleimageroutes/${userId}`);
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
          {/* Button to toggle image input */}
          <div>
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)} // Toggle visibility of image input
              className="w-full bg-purple-600 text-white py-3 rounded-md mt-4 hover:bg-purple-700 transition-colors duration-300"
            >
              {showImageInput ? 'Hide Image Input' : 'Upload Images'}
            </button>
          </div>
          {showImageInput && ( // Conditionally render image inputs based on state
            <div>
              <label className="block text-sm font-medium text-gray-600">Upload Images:</label>
              {imageInputs.map((input, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="file"
                    name={`images-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageInputChange(index, e)} // Handle individual file input changes
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageInput(index)} // Remove input field
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageInput} // Add new input field
                className="bg-green-600 text-white py-2 px-4 rounded-md mt-2 hover:bg-green-700 transition-colors duration-300"
              >
                Add Another Image
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : editingUserId ? 'Update User' : 'Add User'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>

      {/* User List Section */}
{/* User List Section */}
<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Users</h2>
  <table className="min-w-full border-collapse">
    <thead>
      <tr>
        <th className="border-b py-2 text-left">Name</th>
        <th className="border-b py-2 text-left">Email</th>
        <th className="border-b py-2 text-left">Images</th>
        <th className="border-b py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id} className="border-b hover:bg-gray-100">
          <td className="py-2">{user.name}</td>
          <td className="py-2">{user.email}</td>
          <td className="py-2">
  {user.images && user.images.length > 0 ? (
    <div className="flex space-x-2">
      {user.images.map((image, index) => (
        <img key={index} src={image} alt={`User ${user.name} Image ${index + 1}`} className="w-10 h-10 object-cover rounded" />
      ))}
    </div>
  ) : (
    <span>No images</span>
  )}
</td>
          <td className="py-2">
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(user)} className="text-blue-500 hover:underline">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:underline">
                <Trash2 size={16} />
              </button>
            </div>
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

export default MultipleImage;
