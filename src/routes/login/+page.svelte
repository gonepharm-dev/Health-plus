<script lang="ts">
  // Form state variables
  let email = '';
  let password = '';
  let rememberMe = false;

  // Form constraints
  const EMAIL_MAX_LENGTH = 50;
  const PASSWORD_MIN_LENGTH = 8;
  const PASSWORD_MAX_LENGTH = 32;

  // Form validation function
  function validateForm() {
    if (!email || !password) {
      alert('Please fill in all fields');
      return false;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      alert(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return false;
    }
    return true;
  }

  // Handle form submission
  function handleSubmit(e: Event) {
    e.preventDefault();
    if (validateForm()) {
      // Add your login logic here
      console.log('Form submitted:', { email, rememberMe });
    }
  }
</script>

<!-- Main Container -->
<main class="min-h-screen bg-[#DBEAFE] flex items-center justify-center p-4">
  <div class="flex w-full max-w-5xl justify-between items-center">
    <!-- Login Card Section -->
    <div class="bg-[#A8CCFD] rounded-2xl p-12 shadow-md w-full max-w-md">
      <!-- Card Header -->
      <h1 class="text-2xl font-bold mb-8">Welcome back</h1>
      
      <!-- Login Form -->
      <form on:submit={handleSubmit} class="space-y-8">
        <!-- Input Fields Container -->
        <div class="flex gap-4">
          <!-- Email Field -->
          <div class="flex-1">
            <label for="email" class="block text-sm mb-4">Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              maxlength={EMAIL_MAX_LENGTH}
              required
              class="w-full px-3 py-2.5 bg-[#DBEAFE] border-none rounded-md focus:ring-0"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password Field -->
          <div class="flex-1">
            <label for="password" class="block text-sm mb-4">Password</label>
            <input
              type="password"
              id="password"
              bind:value={password}
              minlength={PASSWORD_MIN_LENGTH}
              maxlength={PASSWORD_MAX_LENGTH}
              required
              class="w-full px-3 py-2.5 bg-[#DBEAFE] border-none rounded-md focus:ring-0"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <!-- Action Button -->
        <button
          type="submit"
          class="w-1/2 mx-auto block bg-[#000080] text-white py-1.5 rounded-md hover:bg-blue-900 transition-colors"
        >
          Login
        </button>

        <!-- Additional Options -->
        <div class="flex items-center justify-between text-xs">
          <!-- Remember Me Checkbox -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember"
              bind:checked={rememberMe}
              class="h-3 w-3 text-[#00D001] focus:ring-0 border-gray-300 rounded"
            />
            <label for="remember" class="ml-1.5 text-gray-600">Remember me</label>
          </div>
          <!-- Password Recovery Link -->
          <a 
            href="/forgot-password" 
            class="text-gray-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <!-- Sign Up Section -->
        <div class="text-xs text-gray-600">
          Don't have an account? 
          <a 
            href="/signup" 
            class="hover:underline"
          >
            signup <span class="text-[#FF00FF]">here</span>
          </a>
        </div>
      </form>
    </div>

    <!-- Illustration Section (Hidden on Mobile) -->
    <div class="hidden md:block w-1/2 pl-12">
      <img 
        src="/WhatsApp Image 2024-12-02 at 11.38.00_81f49ba2.jpg" 
        alt="Login illustration" 
        class="w-full max-w-md"
      />
    </div>
  </div>
</main>

<style>
  /* Remove default focus outline and replace with custom styles */
  input {
    outline: none;
  }

  /* Custom focus styles */
  input:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 128, 0.1);
  }

  /* Ensure proper checkbox appearance across browsers */
  input[type="checkbox"] {
    accent-color: #00D001;
  }
</style>
