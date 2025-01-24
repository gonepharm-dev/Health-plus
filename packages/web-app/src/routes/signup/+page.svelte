<script lang="ts">
  // Form field state variables
  let fullName = '';
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let specialization = '';
  let contactNumber = '';
  let role = '';
  let isLoading = false;
  let apiResponse: { message: string } | null = null;

  // Error state object
  let errors = {
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    contactNumber: '',
    role: '',
    apiError: ''
  };

  // Validation functions (previous validations remain the same)
  function validateFullName() {
    if (!fullName) {
      errors.fullName = 'Full name is required';
      return false;
    }
    if (fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      return false;
    }
    errors.fullName = '';
    return true;
  }

  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email is required';
      return false;
    }
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email';
      return false;
    }
    errors.email = '';
    return true;
  }

  function validateUsername() {
    if (!username) {
      errors.username = 'Username is required';
      return false;
    }
    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      return false;
    }
    errors.username = '';
    return true;
  }

  function validatePassword() {
    if (!password) {
      errors.password = 'Password is required';
      return false;
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
      return false;
    }
    if (!/(?=.*[0-9])/.test(password)) {
      errors.password = 'Password must contain at least one number';
      return false;
    }
    errors.password = '';
    return true;
  }

  function validateConfirmPassword() {
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      return false;
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
      return false;
    }
    errors.confirmPassword = '';
    return true;
  }

  function validateRole() {
    if (!role) {
      errors.role = 'Role is required';
      return false;
    }
    errors.role = '';
    return true;
  }

  function validateContactNumber() {
    if (!contactNumber) {
      errors.contactNumber = 'Contact number is required';
      return false;
    }
    // Basic number validation
    if (!/^\d+$/.test(contactNumber)) {
      errors.contactNumber = 'Please enter a valid contact number';
      return false;
    }
    errors.contactNumber = '';
    return true;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    // Reset previous API errors
    errors.apiError = '';
    apiResponse = null;

    // Validate all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isRoleValid = validateRole();
    const isContactNumberValid = validateContactNumber();

    // Proceed only if all validations pass
    if (isFullNameValid && isEmailValid && isUsernameValid && 
        isPasswordValid && isConfirmPasswordValid && 
        isRoleValid && isContactNumberValid) {
      
      isLoading = true;

      try {
        const response = await fetch('/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username,
            full_name: fullName,
            password,
            passwordConfirm: confirmPassword,
            specialization,
            contact_number: parseInt(contactNumber, 10),
            role
          })
        });

        const data = await response.json();

        if (!response.ok) {
          errors.apiError = data.message || 'Registration failed';
          apiResponse = { message: 'error' };
        } else {
          apiResponse = { message: 'success' };
          // Reset form or redirect
          resetForm();
        }
      } catch (error) {
        console.error('Registration error:', error);
        errors.apiError = 'Network error. Please try again.';
        apiResponse = { message: 'error' };
      } finally {
        isLoading = false;
      }
    }
  }

  function resetForm() {
    fullName = '';
    email = '';
    username = '';
    password = '';
    confirmPassword = '';
    specialization = '';
    contactNumber = '';
    role = '';
    errors = {
      fullName: '', email: '', username: '', 
      password: '', confirmPassword: '', 
      specialization: '', contactNumber: '', role: '',
      apiError: ''
    };
  }
</script>

<!-- ==================== MAIN LAYOUT ==================== -->
<main class="min-h-screen bg-[#DBEAFE] flex items-center justify-center p-4">
  <div class="flex flex-col md:flex-row w-full max-w-5xl justify-between items-center gap-8">
    
    <!-- ==================== SIGNUP FORM SECTION ==================== -->
    <div class="bg-[#A8CCFD]/50 backdrop-blur-sm rounded-3xl p-4 md:p-8 w-full md:w-1/2 max-w-md shadow-lg">
      <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">Create Your Account</h1>
      
      <form class="space-y-4 md:space-y-6" on:submit={handleSubmit}>
        <!-- Name and Email Fields Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <!-- Full Name Input -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              bind:value={fullName}
              on:blur={validateFullName}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.fullName}
              <p class="text-red-500 text-xs mt-1">{errors.fullName}</p>
            {/if}
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              on:blur={validateEmail}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.email}
              <p class="text-red-500 text-xs mt-1">{errors.email}</p>
            {/if}
          </div>
        </div>

        <!-- Username and Role Fields Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="username"
              bind:value={username}
              on:blur={validateUsername}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.username}
              <p class="text-red-500 text-xs mt-1">{errors.username}</p>
            {/if}
          </div>

          <!-- Role Input -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              id="role"
              bind:value={role}
              on:blur={validateRole}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Role</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="admin">Admin</option>
            </select>
            {#if errors.role}
              <p class="text-red-500 text-xs mt-1">{errors.role}</p>
            {/if}
          </div>
        </div>

        <!-- Contact and Specialization Fields Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <!-- Contact Number Input -->
          <div>
            <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              bind:value={contactNumber}
              on:blur={validateContactNumber}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.contactNumber}
              <p class="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
            {/if}
          </div>

          <!-- Specialization Input -->
          <div>
            <label for="specialization" class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              id="specialization"
              bind:value={specialization}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Password Fields Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              bind:value={password}
              on:blur={validatePassword}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.password}
              <p class="text-red-500 text-xs mt-1">{errors.password}</p>
            {/if}
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              bind:value={confirmPassword}
              on:blur={validateConfirmPassword}
              class="w-full px-3 py-2 text-sm md:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {#if errors.confirmPassword}
              <p class="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            {/if}
          </div>
        </div>

        <!-- API Error Message -->
        {#if errors.apiError}
          <div class="text-red-500 text-sm text-center">
            {errors.apiError}
          </div>
        {/if}

        <!-- Form Actions -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full sm:w-1/2 mx-auto block bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm md:text-base disabled:opacity-50"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <!-- Login Link -->
        <div class="text-center text-xs md:text-sm text-gray-600">
          Already have an account? <a href="/login" class="text-[#7C3AED] hover:underline">Login here</a>
        </div>
      </form>
    </div>

    <!-- ==================== ILLUSTRATION SECTION ==================== -->
    <div class="hidden md:block w-full md:w-1/2 pl-0 md:pl-12">
      <div class="w-full max-w-md mx-auto">
        <img 
          src="/WhatsApp Image 2024-12-02 at 11.38.00_81f49ba2.jpg" 
          alt="Doctor Illustration" 
          class="w-full h-auto object-contain"
        />
      </div>
    </div>
  </div>
</main>

<style>
  /* Add any custom styles here if needed */
  @media (max-width: 640px) {
    :global(body) {
      font-size: 14px;
    }
  }
</style>