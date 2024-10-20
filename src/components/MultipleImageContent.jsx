import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Edit, Trash2 } from 'lucide-react'; // Import the icons

const MultipleImageContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    images: [], // Change to array to handle multiple images
    content: [], // Add content field
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]); // State to hold submitted users
  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const [imageInputs, setImageInputs] = useState(['']); // State to manage multiple image inputs
  const [contentInputs, setContentInputs] = useState(['']); // State to manage multiple content inputs
  const [showImageInput, setShowImageInput] = useState(false); // State to toggle image input visibility
  const [showContentInput, setShowContentInput] = useState(false); // State to toggle content input visibility
  const navigate = useNavigate(); // Initialize navigate

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://imagecodereact-backennd.onrender.com/api/MultipleImageContentroutes/new');
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

  const handleContentInputChange = (index, e) => {
    const newContentInputs = [...contentInputs];
    newContentInputs[index] = e.target.value; // Store input value
    setContentInputs(newContentInputs);
  };

  const handleAddImageInput = () => {
    setImageInputs([...imageInputs, '']); // Add a new input field
  };

  const handleRemoveImageInput = (index) => {
    const newImageInputs = imageInputs.filter((_, i) => i !== index); // Remove input field at index
    setImageInputs(newImageInputs);
  };

  const handleAddContentInput = () => {
    setContentInputs([...contentInputs, '']); // Add a new content input field
  };

  const handleRemoveContentInput = (index) => {
    const newContentInputs = contentInputs.filter((_, i) => i !== index); // Remove input field at index
    setContentInputs(newContentInputs);
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

    // Append each content input to FormData
    contentInputs.forEach((content) => {
      if (content) {
        data.append('content', content); // Only append if there's content
      }
    });

    try {
      const response = editingUserId 
        ? await axios.put(`https://imagecodereact-backennd.onrender.com/api/MultipleImageContentroutes/${editingUserId}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }) 
        : await axios.post('https://imagecodereact-backennd.onrender.com/api/MultipleImageContentroutes', data, {
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
        content: [], // Reset content
      });
      setImageInputs(['']); // Reset image inputs
      setContentInputs(['']); // Reset content inputs
      setShowImageInput(false); // Hide image input after submission
      setShowContentInput(false); // Hide content input after submission
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
      content: [], // Reset content on edit
    });
    setEditingUserId(user._id); // Set the editing user ID
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://imagecodereact-backennd.onrender.com/api/mutipleimageroutes/${userId}`);
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
            <>
              {imageInputs.map((input, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageInputChange(index, e)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageInput(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageInput}
                className="w-full bg-green-600 text-white py-2 rounded-md mt-2 hover:bg-green-700 transition-colors duration-300"
              >
                Add Another Image
              </button>
            </>
          )}
          {/* Button to toggle content input */}
          <div>
            <button
              type="button"
              onClick={() => setShowContentInput(!showContentInput)} // Toggle visibility of content input
              className="w-full bg-purple-600 text-white py-3 rounded-md mt-4 hover:bg-purple-700 transition-colors duration-300"
            >
              {showContentInput ? 'Hide Content Input' : 'Add Content'}
            </button>
          </div>
          {showContentInput && ( // Conditionally render content inputs based on state
            <>
              {contentInputs.map((input, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => handleContentInputChange(index, e)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveContentInput(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddContentInput}
                className="w-full bg-green-600 text-white py-2 rounded-md mt-2 hover:bg-green-700 transition-colors duration-300"
              >
                Add Another Content
              </button>
            </>
          )}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md mt-4 hover:bg-blue-700 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={loading}
          >
            {loading ? 'Loading...' : (editingUserId ? 'Update User' : 'Create User')}
          </button>
          {message && <p className="text-red-500 text-center mt-2">{message}</p>}
        </form>
      </div>

      {/* Users List Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl overflow-x-auto">
  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Users List</h2>
  {users.length === 0 ? (
    <p className="text-center text-gray-500">No users found.</p>
  ) : (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-gray-600">Name</th>
          <th className="px-4 py-2 text-left text-gray-600">Email</th>
          <th className="px-4 py-2 text-left text-gray-600">Images</th>
          <th className="px-4 py-2 text-left text-gray-600">Content</th>
          <th className="px-4 py-2 text-left text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id}>
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">
              {user.images && user.images.length > 0 ? (
                <div className="flex space-x-2">
                  {user.images.map((image, index) => (
                    <img
                      key={index}
                      src={image} // Assuming images are URLs. Adjust as needed based on your API response
                      alt={`User Image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <span>No images</span>
              )}
            </td>
            <td className="px-4 py-2">
  {user.content && user.content.length > 0 ? (
    <p className="text-sm text-gray-600">{user.content.join(', ')}</p>
  ) : (
    <span>No content</span>
  )}
</td>
            <td className="px-4 py-2">
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
  )}
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

export default MultipleImageContent;
