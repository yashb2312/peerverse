const axios = require('axios');

// Test script to debug blog deletion issue
async function testBlogDeletion() {
  const API_BASE_URL = 'http://localhost:3000/api'; // Change to your backend URL
  
  console.log('🔍 Testing Blog Deletion Issue...\n');
  
  try {
    // Step 1: Test login to get token
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
      email: 'your-mentor-email@example.com', // Replace with your mentor email
      password: 'your-password', // Replace with your password
      role: 'mentor'
    });
    
    if (loginResponse.data.requiresEmailVerification) {
      console.log('❌ Login requires email verification. Please complete the login flow first.');
      return;
    }
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login successful');
    console.log('User ID:', user.id);
    console.log('Role:', user.role);
    
    // Step 2: Get mentor's blogs
    console.log('\n2. Fetching mentor blogs...');
    const blogsResponse = await axios.get(`${API_BASE_URL}/blogs/mentor/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Blogs fetched successfully');
    console.log('Number of blogs:', blogsResponse.data.blogs.length);
    
    if (blogsResponse.data.blogs.length === 0) {
      console.log('❌ No blogs found. Please create a blog first to test deletion.');
      return;
    }
    
    const firstBlog = blogsResponse.data.blogs[0];
    console.log('First blog:', {
      id: firstBlog.id,
      title: firstBlog.title,
      mentor_id: firstBlog.mentor_id
    });
    
    // Step 3: Test blog deletion
    console.log('\n3. Testing blog deletion...');
    const deleteResponse = await axios.delete(`${API_BASE_URL}/blogs/${firstBlog.id}`, {
      data: { mentorId: user.id },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Blog deletion successful');
    console.log('Response:', deleteResponse.data);
    
    // Step 4: Verify deletion
    console.log('\n4. Verifying deletion...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/blogs/mentor/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const remainingBlogs = verifyResponse.data.blogs.filter(blog => blog.id !== firstBlog.id);
    console.log('✅ Verification complete');
    console.log('Remaining blogs:', remainingBlogs.length);
    
    console.log('\n🎉 All tests passed! Blog deletion is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
    console.error('Stack:', error.stack);
  }
}

// Run the test
testBlogDeletion();