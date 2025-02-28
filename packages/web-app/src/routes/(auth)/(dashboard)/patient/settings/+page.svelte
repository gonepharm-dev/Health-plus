<script lang="ts">
    import { updatePatientProfile } from '$lib/services/patientService';
    import { onMount } from 'svelte';
    import { User, Lock, Bell, Shield, UserCircle } from 'lucide-svelte';
    
    export let data;
    
    let activeTab = 'profile';
    let loading = false;
    let error = '';
    let success = '';
    
    // Profile form data
    let firstName = '';
    let lastName = '';
    let dateOfBirth = '';
    let gender = '';
    let address = '';
    let phone = '';
    let emergencyContact = '';
    let emergencyContactPhone = '';
    
    onMount(() => {
      if (data.profile) {
        const profile = data.profile;
        const user = data.user;
        
        // Split full name
        const nameParts = user.full_name?.split(' ') || ['', ''];
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
        
        // Format date for input
        dateOfBirth = profile.dateOfBirth || '';
        gender = profile.gender || '';
        address = profile.address || '';
        phone = user.contact_number?.toString() || '';
        emergencyContact = profile.emergencyContact || '';
        emergencyContactPhone = profile.emergencyContactPhone || '';
      }
    });
    
    async function handleUpdateProfile() {
      try {
        loading = true;
        error = '';
        success = '';
        
        if (!data.profile) {
          throw new Error('Profile not found');
        }
        
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Update profile
        await updatePatientProfile(data.profile.id, {
          dateOfBirth,
          gender,
          address,
          emergencyContact,
          emergencyContactPhone
        });
        
        // We would also update the user's name and phone, but that would be in a separate service call
        
        success = 'Profile updated successfully!';
      } catch (err) {
        console.error('Error updating profile:', err);
        error = 'Failed to update profile. Please try again.';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <h1 class="text-2xl font-bold">Settings</h1>
    
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="md:flex">
        <!-- Sidebar -->
        <div class="md:w-1/4 bg-gray-50 p-4">
          <nav class="space-y-1">
            <button 
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                {activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
              on:click={() => activeTab = 'profile'}
            >
              <UserCircle class="h-5 w-5 mr-2 {activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'}" />
              Profile Information
            </button>
            
            <button 
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                {activeTab === 'account' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
              on:click={() => activeTab = 'account'}
            >
              <User class="h-5 w-5 mr-2 {activeTab === 'account' ? 'text-blue-500' : 'text-gray-400'}" />
              Account Settings
            </button>
            
            <button 
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                {activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
              on:click={() => activeTab = 'security'}
            >
              <Lock class="h-5 w-5 mr-2 {activeTab === 'security' ? 'text-blue-500' : 'text-gray-400'}" />
              Security
            </button>
            
            <button 
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                {activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
              on:click={() => activeTab = 'notifications'}
            >
              <Bell class="h-5 w-5 mr-2 {activeTab === 'notifications' ? 'text-blue-500' : 'text-gray-400'}" />
              Notifications
            </button>
            
            <button 
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                {activeTab === 'privacy' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
              on:click={() => activeTab = 'privacy'}
            >
              <Shield class="h-5 w-5 mr-2 {activeTab === 'privacy' ? 'text-blue-500' : 'text-gray-400'}" />
              Privacy
            </button>
          </nav>
        </div>
        
        <!-- Main Content -->
        <div class="md:w-3/4 p-6">
          {#if error}
            <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          {/if}
          
          {#if success}
            <div class="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          {/if}
          
          {#if activeTab === 'profile'}
            <div>
              <h2 class="text-xl font-bold mb-4">Profile Information</h2>
              <p class="text-gray-600 mb-6">Update your personal information and emergency contacts.</p>
              
              <form on:submit|preventDefault={handleUpdateProfile} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- First Name -->
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      bind:value={firstName}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <!-- Last Name -->
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      bind:value={lastName}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <!-- Date of Birth -->
                  <div>
                    <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      bind:value={dateOfBirth}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <!-- Gender -->
                  <div>
                    <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      bind:value={gender}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <!-- Address -->
                  <div class="md:col-span-2">
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      bind:value={address}
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      bind:value={phone}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <!-- Emergency Contact -->
                  <div>
                    <label for="emergencyContact" class="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      bind:value={emergencyContact}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <!-- Emergency Contact Phone -->
                  <div>
                    <label for="emergencyContactPhone" class="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="emergencyContactPhone"
                      bind:value={emergencyContactPhone}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <!-- Submit Button -->
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          {:else if activeTab === 'account'}
            <div>
              <h2 class="text-xl font-bold mb-4">Account Settings</h2>
              <p class="text-gray-600 mb-6">Manage your account settings and preferences.</p>
              
              <!-- Account settings form would go here -->
              <p class="text-gray-500 italic">Account settings feature coming soon.</p>
            </div>
          {:else if activeTab === 'security'}
            <div>
              <h2 class="text-xl font-bold mb-4">Security</h2>
              <p class="text-gray-600 mb-6">Update your password and security settings.</p>
              
              <!-- Security form would go here -->
              <p class="text-gray-500 italic">Security settings feature coming soon.</p>
            </div>
          {:else if activeTab === 'notifications'}
            <div>
              <h2 class="text-xl font-bold mb-4">Notification Preferences</h2>
              <p class="text-gray-600 mb-6">Control how and when you receive notifications.</p>
              
              <!-- Notification settings form would go here -->
              <p class="text-gray-500 italic">Notification settings feature coming soon.</p>
            </div>
          {:else if activeTab === 'privacy'}
            <div>
              <h2 class="text-xl font-bold mb-4">Privacy Settings</h2>
              <p class="text-gray-600 mb-6">Manage your privacy preferences and data sharing settings.</p>
              
              <!-- Privacy settings form would go here -->
              <p class="text-gray-500 italic">Privacy settings feature coming soon.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>