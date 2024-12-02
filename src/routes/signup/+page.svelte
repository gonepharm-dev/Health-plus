<script lang="ts">
  // Form field state variables
  let fullName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';

  // Error state object
  let errors = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // ==================== VALIDATION FUNCTIONS ====================

  /**
   * Validates the full name field
   * @returns {boolean} - Returns true if valid, false otherwise
   */
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

  /**
   * Validates the email field using regex
   * @returns {boolean} - Returns true if valid, false otherwise
   */
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

  /**
   * Validates the password field with multiple criteria
   * @returns {boolean} - Returns true if valid, false otherwise
   */
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

  /**
   * Validates the confirm password field
   * @returns {boolean} - Returns true if valid, false otherwise
   */
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

  /**
   * Handles form submission and validates all fields
   * @param {Event} event - The form submission event
   */
  function handleSubmit(event: Event) {
    event.preventDefault();
    
    // Validate all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    // Proceed only if all validations pass
    if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      console.log('Form is valid, submitting...');
      // TODO: Add your API call or form submission logic here
    }
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

        <!-- Form Actions -->
        <button
          type="submit"
          class="w-full sm:w-1/2 mx-auto block bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm md:text-base"
        >
          Sign Up
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
