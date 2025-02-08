<script lang="ts">
  let formData = {
    fullName: '',
    email: '',
    username: '',
    role: '',
    contact: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  };

  const handleGoogleSignUp = async () => {
    // Implement Google sign-up logic here
    console.log('Google sign-up clicked');
  };
</script>

<div class="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <div class="bg-blue-200 rounded-lg shadow-lg overflow-hidden">
      <div class="lg:grid lg:grid-cols-2">
        <div class="p-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Create a new Account</h2>
            <p class="mt-2 text-sm text-gray-600">Sign up now and unlock exclusive access!</p>
          </div>

          <!-- Social Sign-up Buttons -->
          <div class="space-y-4 mb-8">
            <button 
              on:click={handleGoogleSignUp}
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-blue-200 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  id="fullName"
                  bind:value={formData.fullName}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  bind:value={formData.email}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Username -->
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  bind:value={formData.username}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Role -->
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  bind:value={formData.role}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              <!-- Contact -->
              <div>
                <label for="contact" class="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="tel"
                  id="contact"
                  bind:value={formData.contact}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Specialization -->
              <div>
                <label for="specialization" class="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  bind:value={formData.specialization}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  bind:value={formData.password}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Confirm Password -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  bind:value={formData.confirmPassword}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <a href="/login" class="text-sm text-blue-600 hover:text-blue-500">
                Have an account? Login
              </a>
            </div>
          </form>
        </div>

        <!-- Illustration Section -->
        <div class="hidden lg:block relative">
          <div class="h-full bg-gradient-to-br from-cyan-500 to-blue-500 p-8">
            <div class="h-full flex items-center justify-center">
              <img
                src="/tele1.jpg"
                alt="Medical consultation illustration"
                class="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>