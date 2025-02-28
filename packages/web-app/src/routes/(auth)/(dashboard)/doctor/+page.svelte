<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Search, 
    Bell, 
    Plus, 
    ChevronRight, 
    MoreVertical, 
    Calendar, 
    ChevronDown, 
    TrendingUp,
    User,
    Heart,
    Stethoscope,
    Activity,
    Users,
    BarChart,
    LineChart,
    PieChart,
    TrendingDown,
    BarChart2,
    BarChart3,
    BarChart4,
    LineChartIcon,
    Presentation,
    GitGraph,
    ArrowRight,
    X
  } from 'lucide-svelte';
  
  // Updated Types
  type Appointment = {
    id: number;
    patient: string;
    icon: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Cancelled';
    statusClass: string;
  };
  
  type PatientCategory = {
    name: string;
    count: number;
    percentage: number;
  };
  
  // Updated Data
  const appointments: Appointment[] = [
    { 
      id: 1, 
      patient: 'John Smith', 
      icon: 'patient', 
      date: 'Jul 12th 2024', 
      status: 'Completed',
      statusClass: 'text-green-600'
    },
    { 
      id: 2, 
      patient: 'Sarah Johnson', 
      icon: 'emergency', 
      date: 'Jul 12th 2024', 
      status: 'Pending',
      statusClass: 'text-yellow-600'
    },
    { 
      id: 3, 
      patient: 'Michael Brown', 
      icon: 'emergency', 
      date: 'Jul 13th 2024', 
      status: 'Cancelled',
      statusClass: 'text-red-600'
    },
    { 
      id: 4, 
      patient: 'Emma Davis', 
      icon: 'patient', 
      date: 'Jul 13th 2024', 
      status: 'Pending',
      statusClass: 'text-yellow-600'
    },
    { 
      id: 5, 
      patient: 'James Wilson', 
      icon: 'patient', 
      date: 'Jul 14th 2024', 
      status: 'Completed',
      statusClass: 'text-green-600'
    },
    { 
      id: 6, 
      patient: 'Olivia Miller', 
      icon: 'emergency', 
      date: 'Jul 14th 2024', 
      status: 'Completed',
      statusClass: 'text-green-600'
    },
    { 
      id: 7, 
      patient: 'William Johnson', 
      icon: 'patient', 
      date: 'Jul 15th 2024', 
      status: 'Completed',
      statusClass: 'text-green-600'
    },
    { 
      id: 8, 
      patient: 'Sophia Garcia', 
      icon: 'emergency', 
      date: 'Jul 15th 2024', 
      status: 'Pending',
      statusClass: 'text-yellow-600'
    },
    { 
      id: 9, 
      patient: 'Lucas Martinez', 
      icon: 'patient', 
      date: 'Jul 16th 2024', 
      status: 'Cancelled',
      statusClass: 'text-red-600'
    },
    { 
      id: 10, 
      patient: 'Isabella Taylor', 
      icon: 'emergency', 
      date: 'Jul 16th 2024', 
      status: 'Pending',
      statusClass: 'text-yellow-600'
    }
  ];
  
  const patientCategories: PatientCategory[] = [
    { name: 'New Patients', count: 223, percentage: 30 },
    { name: 'Regular Checkups', count: 93, percentage: 15 },
    { name: 'Emergency Cases', count: 483, percentage: 55 }
  ];
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Chart data
  let donutChartElement: HTMLCanvasElement;
  let barChartElement: HTMLCanvasElement;
  
  // Add notification state and data
  let showNotifications = false;
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      message: "New appointment request from Sarah Johnson",
      time: "2 minutes ago",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      type: 'update',
      message: "Lab results uploaded for patient Mike Brown",
      time: "15 minutes ago",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      type: 'reminder',
      message: "Follow-up appointment with John Smith today at 2:00 PM",
      time: "1 hour ago",
      isRead: true,
      priority: "normal"
    },
    {
      id: 4,
      type: 'system',
      message: "System maintenance scheduled for tonight at 2 AM",
      time: "2 hours ago",
      isRead: true,
      priority: "low"
    }
  ];
  
  // Toggle notifications
  function toggleNotifications() {
    showNotifications = !showNotifications;
  }
  
  // Close notifications
  function closeNotifications() {
    showNotifications = false;
  }
  
  // Get priority color
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }
  
  // Add computed value for unread count
  $: unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Add these variables for the typing animation
  const searchWords = ['Doctors', 'Patients', 'Appointments', 'Messages', 'Reports'];
  let currentWordIndex = 0;
  let currentText = '';
  let isDeleting = false;
  let typingSpeed = 150;
  let deletingSpeed = 100;
  let pauseBeforeDelete = 1500;

  // Typing animation function
  function typeAnimation() {
    const currentWord = searchWords[currentWordIndex];
    
    if (isDeleting) {
      currentText = currentWord.substring(0, currentText.length - 1);
      typingSpeed = deletingSpeed;
    } else {
      currentText = currentWord.substring(0, currentText.length + 1);
      typingSpeed = 150;
    }

    if (!isDeleting && currentText === currentWord) {
      typingSpeed = pauseBeforeDelete;
      isDeleting = true;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % searchWords.length;
    }

    setTimeout(typeAnimation, typingSpeed);
  }
  
  onMount(() => {
    // This would be where we'd initialize charts with a library like Chart.js
    // For this example, we'll use CSS to create simple visualizations
    typeAnimation(); // Start the typing animation
  });
</script>

<svelte:head>
  <title>Doctor's Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Header -->
  <header class="bg-background shadow-sm p-4">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div class="flex items-center">
        <h1 class="text-xl font-semibold text-gray-800">Doctor</h1>
      </div>
      
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div class="relative flex-grow sm:flex-grow-0">
          <input 
            type="text" 
            placeholder="Search for {currentText}..." 
            class="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button 
              class="p-2 rounded-lg hover:bg-gray-100 relative"
              on:click={toggleNotifications}
            >
              <Bell class="h-6 w-6 text-gray-500" />
              <!-- Replace the dot with a count badge -->
              {#if unreadCount > 0}
                <span class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              {/if}
            </button>

            <!-- Notification Card -->
            {#if showNotifications}
              <div class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                  <div>
                    <h3 class="font-semibold text-gray-800">Notifications</h3>
                    <p class="text-xs text-gray-500">You have {notifications.filter(n => !n.isRead).length} unread messages</p>
                  </div>
                  <button 
                    class="text-gray-500 hover:text-gray-700 transition-colors"
                    on:click={closeNotifications}
                  >
                    <X class="h-5 w-5" />
                  </button>
                </div>

                <!-- Notification List -->
                <div class="max-h-[400px] overflow-y-auto">
                  {#each notifications as notification}
                    <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start gap-3">
                        <!-- Priority Indicator -->
                        <div class="mt-2">
                          <div class={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1">
                          <p class="text-sm text-gray-800 {notification.isRead ? '' : 'font-semibold'}">
                            {notification.message}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>

                        <!-- Unread Indicator -->
                        {#if !notification.isRead}
                          <div class="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>

                <!-- Footer -->
                <div class="p-4 text-center border-t border-gray-200 bg-gray-50">
                  <a href="/notifications" class="text-sm text-primary hover:text-primary/80 font-medium">
                    View all notifications
                  </a>
                </div>
              </div>
            {/if}
          </div>
          
          <button class="bg-secondary text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium w-full sm:w-auto justify-center">
            <span class="sm:hidden">Add New</span>
            <Plus class="h-5 w-5 ml-1" />
            <span class="hidden sm:inline">Schedule Appointment</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto py-6 px-4">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
      <p class="text-text">An any way to manage Patients with care and precision.</p>
    </div>
    
    <!-- Dashboard Rows -->
    <div class="space-y-6">
      <!-- First Row - Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Statistics Card -->
        <div class="bg-background rounded-xl overflow-hidden shadow-lg border border-primary">
          <div class="bg-primary p-4">
            <div class="flex items-center justify-between">
              <span class="bg-secondary text-white px-2 py-0.5 rounded-full text-xs font-medium">Statistics</span>
              <span class="text-white/90 text-xs font-medium">Feb 12th 2024</span>
            </div>
            <div class="mt-3">
              <p class="font-medium text-white">Patient Growth</p>
              <div class="flex items-baseline gap-2 mt-2">
                <p class="text-3xl font-bold text-white">25%</p>
                <p class="text-xs text-white/90">in 1 week</p>
              </div>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-600">Weekly Target</span>
              <span class="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: 75%"></div>
            </div>
            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-gray-600">Previous Week: 12.5%</span>
              <span class="text-gray-600">Target: 30%</span>
            </div>
          </div>
        </div>

        <!-- Patient Statistics Card -->
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-gray-800">Patient Statistics</h3>
            <button class="text-gray-500">
             
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-gray-800">1,293</span>
                <span class="ml-2 text-sm text-gray-500">active patients</span>
              </div>
              <div class="flex items-center mt-2">
                <div class="flex items-center text-green-500 text-sm">
                  <TrendingUp class="h-4 w-4" />
                  <span class="ml-1">+15% new patients this month</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-2">
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center gap-2">
                  <Stethoscope class="h-5 w-5 text-primary" />
                  <span class="text-sm text-gray-600">Check-ups</span>
                </div>
                <p class="text-xl font-semibold mt-1">482</p>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center gap-2">
                  <Activity class="h-5 w-5 text-secondary" />
                  <span class="text-sm text-gray-600">Emergency</span>
                </div>
                <p class="text-xl font-semibold mt-1">128</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Date & Patient Overview Combined -->
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <Calendar class="h-5 w-5 text-gray-500 mr-2" />
              <span class="text-sm text-gray-700">{new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
            </div>
            <button class="text-gray-500">
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <div class="flex items-baseline">
                <Users class="h-5 w-5 text-primary mr-2" />
                <span class="text-4xl font-bold text-text">1,293</span>
                <span class="ml-2 text-sm text-text/70">total patients</span>
              </div>
            </div>
            <div class="border-t pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Today's Appointments</p>
                  <p class="text-2xl font-semibold mt-1">24</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Available Slots</p>
                  <p class="text-2xl font-semibold mt-1">8</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-sm text-primary font-medium">View Schedule</span>
              <ChevronRight class="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row - Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Patient Visits Chart -->
        <div class="bg-white rounded-xl shadow p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-text">Patient Visits</h3>
            <div class="flex items-center space-x-2">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-primary rounded-full mr-1"></div>
                <span class="text-xs text-text">Regular Checkups</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-secondary rounded-full mr-1"></div>
                <span class="text-xs text-text">Emergency</span>
              </div>
            </div>
          </div>
          
          <div class="h-48 flex items-end space-x-1 sm:space-x-2">
            {#each months as month, i}
              <div class="flex-1 flex flex-col items-center">
                <div class="w-full flex flex-col items-center space-y-1">
                  <div class="w-full bg-primary rounded-t" style="height: {30 + Math.random() * 70}px"></div>
                  <div class="w-full bg-secondary rounded-t" style="height: {20 + Math.random() * 40}px"></div>
                </div>
                <div class="text-[10px] sm:text-xs text-text mt-2">{month}</div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Patient Categories -->
        <div class="bg-white rounded-xl shadow p-4">
          <h3 class="font-semibold text-text mb-4">Patient Categories</h3>
          
          <div class="space-y-6">
            {#each patientCategories as category}
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-text">{category.name} ({category.count})</span>
                </div>
                <div class="w-full bg-background rounded-full h-2.5">
                  <div class="bg-primary h-2.5 rounded-full" style="width: {category.percentage}%"></div>
                </div>
              </div>
            {/each}
          </div>
          
          <!-- Scale -->
          <div class="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-4">
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
          </div>
        </div>
      </div>

      <!-- Third Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Appointments -->
        <div class="bg-white rounded-xl shadow">
          <div class="p-4 flex justify-between items-center border-b">
            <div class="flex items-center space-x-2">
              <Calendar class="h-5 w-5 text-primary" />
              <h3 class="font-semibold text-gray-800">Recent Appointments</h3>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 rounded-full bg-green-600"></div>
                <span class="text-xs text-gray-600">Completed</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 rounded-full bg-yellow-600"></div>
                <span class="text-xs text-gray-600">Pending</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 rounded-full bg-red-600"></div>
                <span class="text-xs text-gray-600">Cancelled</span>
              </div>
              <button class="text-gray-500">
                <MoreVertical class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div class="divide-y">
            {#each appointments.slice(0, 6) as appointment}
              <div class="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <User class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{appointment.patient}</p>
                    <div class="flex items-center space-x-2">
                      <Calendar class="h-3 w-3 text-gray-400" />
                      <p class="text-xs text-gray-500">{appointment.date}</p>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium {appointment.statusClass}">{appointment.status}</p>
                  <p class="text-xs text-gray-500">ID: #{appointment.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            {/each}
          </div>
          
          <button class="w-full p-3 text-center text-sm text-primary font-medium hover:text-primary/80 transition-colors flex items-center justify-center border-t">
            <span>View All Appointments</span>
            <ChevronRight class="h-4 w-4 ml-1" />
          </button>
        </div>

        <!-- Medical Analytics Card -->
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-4 sm:p-6 bg-gradient-to-br from-background via-primary/20 to-secondary/20 relative">
            <div class="relative z-10">
              <!-- Header Section -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 mb-6">
                <div class="flex items-center space-x-2">
                  <Presentation class="h-6 w-6 text-primary" />
                  <h3 class="font-bold text-lg sm:text-xl text-text">Medical Analytics</h3>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="text-xs text-text/70">Live Updates</span>
                </div>
              </div>

              <!-- Analytics Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div class="flex items-center space-x-2 mb-2">
                    <BarChart class="h-5 w-5 text-primary" />
                    <h4 class="font-medium text-text">Patient Stats</h4>
                  </div>
                  <div class="flex items-center space-x-2">
                    <TrendingUp class="h-4 w-4 text-green-500" />
                    <p class="text-sm text-green-500">+12.5%</p>
                  </div>
                  <p class="text-xs text-text/70 mt-1">Updated 2h ago</p>
                </div>

                <div class="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div class="flex items-center space-x-2 mb-2">
                    <LineChart class="h-5 w-5 text-secondary" />
                    <h4 class="font-medium text-text">Treatment Trends</h4>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Activity class="h-4 w-4 text-blue-500" />
                    <p class="text-sm text-blue-500">Active</p>
                  </div>
                  <p class="text-xs text-text/70 mt-1">Real-time data</p>
                </div>

                <div class="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div class="flex items-center space-x-2 mb-2">
                    <PieChart class="h-5 w-5 text-primary" />
                    <h4 class="font-medium text-text">Demographics</h4>
                  </div>
                  <div class="flex items-center space-x-2">
                    <GitGraph class="h-4 w-4 text-purple-500" />
                    <p class="text-sm text-purple-500">Diverse</p>
                  </div>
                  <p class="text-xs text-text/70 mt-1">Updated today</p>
                </div>
              </div>

              <!-- Quick Access Links -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between bg-white/80 rounded-lg p-3 hover:bg-white/90 transition-all cursor-pointer">
                  <div class="flex items-center space-x-3 min-w-0">
                    <BarChart3 class="h-5 w-5 text-primary flex-shrink-0" />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text truncate">Weekly Analytics</p>
                      <p class="text-xs text-text/70 truncate">Performance metrics & insights</p>
                    </div>
                  </div>
                  <ArrowRight class="h-4 w-4 text-primary flex-shrink-0" />
                </div>

                <div class="flex items-center justify-between bg-white/80 rounded-lg p-3 hover:bg-white/90 transition-all cursor-pointer">
                  <div class="flex items-center space-x-3 min-w-0">
                    <BarChart4 class="h-5 w-5 text-secondary flex-shrink-0" />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text truncate">Monthly Reports</p>
                      <p class="text-xs text-text/70 truncate">Comprehensive analysis</p>
                    </div>
                  </div>
                  <ArrowRight class="h-4 w-4 text-primary flex-shrink-0" />
                </div>

                <div class="flex items-center justify-between bg-white/80 rounded-lg p-3 hover:bg-white/90 transition-all cursor-pointer">
                  <div class="flex items-center space-x-3 min-w-0">
                    <LineChartIcon class="h-5 w-5 text-primary flex-shrink-0" />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text truncate">Trend Analysis</p>
                      <p class="text-xs text-text/70 truncate">Pattern recognition & forecasting</p>
                    </div>
                  </div>
                  <ArrowRight class="h-4 w-4 text-primary flex-shrink-0" />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button class="flex-1 py-2.5 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                  <Presentation class="h-4 w-4 mr-2" />
                  <span>View Full Analytics</span>
                </button>
                <button class="sm:flex-initial px-4 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-all duration-300 flex items-center justify-center">
                  <GitGraph class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  /* Additional styles if needed */
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  /* Additional responsive styles */
  @media (max-width: 640px) {
    :global(.chart-container) {
      height: 200px !important;
    }
    
    :global(.analytics-grid) {
      gap: 1rem !important;
    }
    
    :global(.quick-access-link) {
      padding: 0.75rem !important;
    }
  }
</style>