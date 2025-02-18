<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import TypewriterText from '$lib/components/organisms/Steps/TypewriterText.svelte';
	import type { FormData, RegistrationStep } from '$lib/types/forms';
	import { STEPS, STEP_ORDER } from '$lib/config/steps';

	let currentStep: RegistrationStep = STEP_ORDER[0];
	let formData: FormData = {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: ''
	};

	let error = '';
	let isSubmitting = false;
	let isTypingComplete = false;
	let completedSteps = new Set<RegistrationStep>();
	let validationErrors: Partial<Record<RegistrationStep, string>> = {};

	const roles = [
		{ value: 'patient', label: 'Patient' },
		{ value: 'doctor', label: 'Doctor' }
	];

	function validateStep(step: RegistrationStep, value: string): boolean {
		const validation = STEPS[step].validation;
		if (!validation) return true;

		const error = validation(value);
		if (error) {
			validationErrors[step] = error;
			return false;
		}

		// Special case for password confirmation
		if (step === 'confirmPassword' && value !== formData.password) {
			validationErrors[step] = 'Passwords do not match';
			return false;
		}

		delete validationErrors[step];
		return true;
	}

	function handleTypewriterComplete() {
		isTypingComplete = true;
	}

	function moveToNextStep() {
		const currentValue = formData[currentStep];

		if (!validateStep(currentStep, currentValue)) {
			return;
		}

		const currentIndex = STEP_ORDER.indexOf(currentStep);
		if (currentIndex < STEP_ORDER.length - 1) {
			completedSteps.add(currentStep);
			completedSteps = completedSteps; // Trigger reactivity

			// Reset states for next step
			isTypingComplete = false;

			// Move to next step after a short delay
			setTimeout(() => {
				currentStep = STEP_ORDER[currentIndex + 1];
			}, 150);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !isSubmitting && isTypingComplete) {
			event.preventDefault();
			moveToNextStep();
		}
	}

	async function handleSubmit() {
		try {
			// Validate all steps before submission
			let isValid = true;
			for (const step of STEP_ORDER) {
				if (!validateStep(step, formData[step])) {
					isValid = false;
					break;
				}
			}

			if (!isValid) {
				error = 'Please fix all validation errors before submitting';
				return;
			}

			isSubmitting = true;
			// Add your submit logic here
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Form submitted:', formData);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex min-h-screen">
	<!-- Left Panel - Hidden on mobile -->
	<div class="hidden p-8 md:block md:w-1/3">
		<div class="flex h-full flex-col justify-between rounded-2xl bg-[#1D5DEC] p-8 text-white">
			<div class="px-2 pt-12">
				<h1 class="font-sm mb-14 text-xl">GONEP</h1>
				<p class="pt-12 text-5xl leading-tight">
					Start your <br /> journey with us.
				</p>
				<p class="mt-8 text-lg font-thin leading-snug text-gray-300">
					Get access to the best healthcare <br /> services and professional doctors <br /> in kenya
				</p>
			</div>

			<div class="w-full p-2">
				<div class="h-full rounded-lg bg-blue-700 p-6 dark:bg-gray-800">
					
					<p class="mb-6 leading-relaxed text-gray-200 dark:text-gray-300">
						Clinic at Hand brought quality healthcare right to my doorstep. It's a game-changer for
						rural communities like mine.
					</p>
					<div class="inline-flex items-center">
                        <img src="/doc.jpg" alt="" class="w-10 h-10 rounded-xl mr-3">
						<div class="flex flex-grow flex-col">
							<span class="title-font font-medium text-gray-200">John Mutiso</span>
							<span class="text-sm text-gray-200 dark:text-gray-400">Doctor</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel -->
	<div class="flex w-full flex-col p-8 md:w-2/3 md:p-12">

	</div>
</div>
