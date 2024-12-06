<script lang="ts">
    // Type definition for service items
    interface Service {
        title: string;
        description: string;
        icon: string;
        color: string;
    }

    // Services data array using $state
    let services = $state<Service[]>([
        {
            title: "Virtual Consultations",
            description: "Connect with healthcare providers from the comfort of your home through secure video appointments",
            icon: "🏥",
            color: "#4CAF50"
        },
        {
            title: "Mental Health Services", 
            description: "Access licensed therapists and mental health professionals for online counseling sessions",
            icon: "🧠",
            color: "#2196F3"
        },
        {
            title: "Prescription Management",
            description: "Get prescriptions reviewed and renewed online with electronic prescriptions sent to your preferred pharmacy",
            icon: "💊",
            color: "#9C27B0"
        },
        {
            title: "24/7 Medical Support",
            description: "Round-the-clock access to medical professionals for urgent care needs and medical advice",
            icon: "⏰",
            color: "#FF5722"
        },
        {
            title: "Specialist Referrals",
            description: "Easy referrals to specialists and seamless coordination of your healthcare needs",
            icon: "👨‍⚕️",
            color: "#03A9F4"
        },
        {
            title: "Secure Health Records",
            description: "Access your medical history, test results, and health documents in one secure platform",
            icon: "📋",
            color: "#607D8B"
        }
    ]);
</script>

<!-- Main Services Section -->
<section class="py-24 relative overflow-hidden ">
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(74,144,226,0.1)_0%,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(230,92,122,0.1)_0%,transparent_50%)] z-[1]"></div>
    
    <!-- Content Container -->
    <div class="max-w-7xl mx-auto px-6 relative z-[2]">
        <!-- Section Header -->
        <div class="text-center mb-16">
            <h2 class="text-[2.8rem] font-bold mb-4 text-black">Our Healthcare Services</h2>
            <p class="text-black text-lg max-w-xl mx-auto leading-relaxed">Experience modern healthcare solutions designed around you</p>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-[1000px]">
            {#each services as service}
                <!-- Individual Service Card -->
                <div class="bg-[#A8CCFD] backdrop-blur-lg rounded-2xl p-8 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] border border-white/20 shadow-lg hover:-translate-y-2.5 hover:rotate-x-[5deg] hover:shadow-xl">
                    <!-- Service Icon -->
                    <div class="icon-wrapper" style="--card-color: {service.color}">
                        <span class="icon text-4xl">{service.icon}</span>
                    </div>
                    <!-- Service Content -->
                    <div class="content">
                        <h3 class="text-xl font-bold">{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    /* Icon styles for desktop and mobile */
    .icon-wrapper :global(svg) {
        @apply text-white w-7 h-7 stroke-2 transition-transform duration-300 ease-in-out;
    }

    /* Hover animation for service cards */
    .service-card:hover .icon-wrapper :global(svg) {
        @apply scale-110;
    }

    /* Mobile-specific icon adjustments */
    @media (max-width: 768px) {
        .icon-wrapper :global(svg) {
            @apply w-6 h-6 stroke-[2.2];
        }
    }
</style>
