<script lang="ts">
    import type { UserRegistrationData } from '$lib/types/auth';
    
    export let formData: Partial<UserRegistrationData>;
</script>

<div class="space-y-6">
    <h3 class="text-lg font-medium text-gray-900">Review Your Information</h3>
    
    <dl class="divide-y divide-gray-200">
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formData.full_name}
            </dd>
        </div>
        
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formData.role}
            </dd>
        </div>
        
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formData.email}
            </dd>
        </div>
        
        {#if formData.role === 'doctor'}
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Specialization</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formData.specialization}
                </dd>
            </div>
        {/if}
    </dl>
</div>