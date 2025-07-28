<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { UserType, GroupType, LaboratoryType, OrganizationType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface CreateUserMutation {
  createUser: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    firstName?: string;
    lastName?: string;
    error?: string;
  };
}

interface CreateUserMutationVariables {
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    isActive: boolean;
    isBlocked: boolean;
    groupUid?: string;
    laboratoryUids?: string[];
    activeLaboratoryUid?: string;
    profilePicture?: string;
    phoneNumber?: string;
    jobTitle?: string;
    department?: string;
    employeeId?: string;
  };
}

interface AssignUserToLaboratoriesMutation {
  assignUserToLaboratories: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    error?: string;
  };
}

interface AssignUserToLaboratoriesMutationVariables {
  userUid: string;
  laboratoryUids: string[];
  activeLaboratoryUid?: string;
}

interface SendWelcomeEmailMutation {
  sendWelcomeEmail: {
    __typename: "SuccessType" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface SendWelcomeEmailMutationVariables {
  userUid: string;
  includeTemporaryPassword: boolean;
}

const CreateUserEnhancedDocument = `
  mutation CreateUserEnhanced($payload: EnhancedUserCreateInputType!) {
    createUserEnhanced(payload: $payload) {
      ... on UserType {
        uid
        firstName
        lastName
        email
        userName
        isActive
        isBlocked
        mobilePhone
        businessPhone
        jobTitle
        department
        employeeId
        profilePicture
        activeLaboratoryUid
        groups {
          uid
          name
        }
        laboratories {
          uid
          name
          code
        }
        createdAt
        updatedAt
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const ValidateUserDataDocument = `
  mutation ValidateUserData($payload: UserValidationInputType!) {
    validateUserData(payload: $payload) {
      ... on UserValidationResultType {
        emailAvailable
        usernameAvailable
        employeeIdAvailable
        suggestions
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const UploadProfilePictureDocument = `
  mutation UploadProfilePicture($payload: ProfilePictureUploadInputType!) {
    uploadProfilePicture(payload: $payload) {
      ... on ProfilePictureUploadResultType {
        user {
          uid
          firstName
          lastName
          profilePicture
        }
        profilePictureUrl
        message
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const AssignUserToLaboratoriesDocument = `
  mutation AssignUserToLaboratories($userUid: String!, $laboratoryUids: [String!]!, $activeLaboratoryUid: String) {
    assignUserToLaboratories(userUid: $userUid, laboratoryUids: $laboratoryUids, activeLaboratoryUid: $activeLaboratoryUid) {
      ... on UserType {
        uid
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const SendWelcomeEmailDocument = `
  mutation SendWelcomeEmail($userUid: String!, $includeTemporaryPassword: Boolean!) {
    sendWelcomeEmail(userUid: $userUid, includeTemporaryPassword: $includeTemporaryPassword) {
      ... on SuccessType {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();

// Fetch required data
userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups);

// Mock data - in real implementation, these would come from GraphQL queries
const laboratories = ref<LaboratoryType[]>([
  { 
    uid: "lab1", 
    name: "Central Laboratory", 
    organizationUid: "org1",
    code: "CENTRAL",
    email: "central@lab.com"
  },
  { 
    uid: "lab2", 
    name: "Branch Laboratory", 
    organizationUid: "org1",
    code: "BRANCH",
    email: "branch@lab.com"
  },
  { 
    uid: "lab3", 
    name: "Research Laboratory", 
    organizationUid: "org1",
    code: "RESEARCH",
    email: "research@lab.com"
  },
]);

const organizations = ref<OrganizationType[]>([
  { uid: "org1", name: "Main Organization", setupName: "felicity" }
]);

const departments = ref([
  "Administration", "Laboratory", "Quality Control", "Research", "IT Support", "Billing", "Other"
]);

const jobTitles = ref([
  "Laboratory Director", "Laboratory Manager", "Laboratory Technician", 
  "Quality Control Analyst", "Research Scientist", "IT Administrator", 
  "Billing Coordinator", "Administrative Assistant", "Other"
]);

// Multi-step form state
const currentStep = ref(1);
const totalSteps = 4;
const processing = ref(false);
const createdUser = ref<UserType | null>(null);

// Form state
const formUser = reactive({
  // Step 1: Basic Information
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  employeeId: "",
  
  // Step 2: Account Details
  userName: "",
  password: "",
  passwordConfirm: "",
  generatePassword: false,
  
  // Step 3: Professional Information
  jobTitle: "",
  department: "",
  
  // Step 4: Laboratory Access & Permissions
  groupUid: "",
  laboratoryUids: [] as string[],
  activeLaboratoryUid: "",
  
  // Status
  isActive: true,
  isBlocked: false,
  
  // Profile Picture
  profilePicture: "",
  
  // Notification preferences
  sendWelcomeEmail: true,
  includeCredentials: false,
});

// Validation state
const validationErrors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  password: "",
  passwordConfirm: "",
  laboratoryUids: "",
});

// File upload
const profilePictureFile = ref<File | null>(null);
const profilePicturePreview = ref<string>("");

// Password generation
const generateRandomPassword = () => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Computed
const stepTitles = computed(() => [
  "Basic Information",
  "Account Details", 
  "Professional Info",
  "Access & Permissions"
]);

const isStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formUser.firstName.trim() && 
             formUser.lastName.trim() && 
             formUser.email.trim() && 
             isValidEmail(formUser.email);
    case 2:
      return formUser.userName.trim() && 
             (formUser.generatePassword || 
              (formUser.password.trim() && 
               formUser.password === formUser.passwordConfirm &&
               isValidPassword(formUser.password)));
    case 3:
      return true; // Professional info is optional
    case 4:
      return formUser.laboratoryUids.length > 0;
    default:
      return false;
  }
});

const isFormValid = computed(() => {
  return formUser.firstName.trim() &&
         formUser.lastName.trim() &&
         formUser.email.trim() &&
         formUser.userName.trim() &&
         (formUser.generatePassword || 
          (formUser.password.trim() && formUser.password === formUser.passwordConfirm)) &&
         formUser.laboratoryUids.length > 0;
});

const assignedLaboratories = computed(() => {
  return laboratories.value.filter(lab => formUser.laboratoryUids.includes(lab.uid));
});

// Validation methods
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};

const validateCurrentStep = () => {
  // Clear previous errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = "";
  });

  switch (currentStep.value) {
    case 1:
      if (!formUser.firstName.trim()) {
        validationErrors.firstName = "First name is required";
      }
      if (!formUser.lastName.trim()) {
        validationErrors.lastName = "Last name is required";
      }
      if (!formUser.email.trim()) {
        validationErrors.email = "Email is required";
      } else if (!isValidEmail(formUser.email)) {
        validationErrors.email = "Please enter a valid email address";
      }
      break;
      
    case 2:
      if (!formUser.userName.trim()) {
        validationErrors.userName = "Username is required";
      }
      if (!formUser.generatePassword) {
        if (!formUser.password.trim()) {
          validationErrors.password = "Password is required";
        } else if (!isValidPassword(formUser.password)) {
          validationErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and number";
        }
        if (formUser.password !== formUser.passwordConfirm) {
          validationErrors.passwordConfirm = "Passwords do not match";
        }
      }
      break;
      
    case 4:
      if (formUser.laboratoryUids.length === 0) {
        validationErrors.laboratoryUids = "At least one laboratory must be selected";
      }
      break;
  }

  return Object.values(validationErrors).every(error => error === "");
};

// Helper methods
const getLaboratoryName = (labUid: string) => {
  const lab = laboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

const getOrganizationName = (orgUid: string) => {
  const org = organizations.value.find(o => o.uid === orgUid);
  return org?.name || "Unknown Organization";
};

// Generate username from email
const generateUsername = () => {
  if (formUser.email) {
    formUser.userName = formUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  }
};

// Handle profile picture upload
const handleProfilePictureUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toastError("Profile picture must be less than 2MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toastError("Please select a valid image file");
      return;
    }
    
    profilePictureFile.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicturePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Handle laboratory selection changes
const onLaboratorySelectionChange = () => {
  // Reset active laboratory if it's not in selected labs
  if (formUser.activeLaboratoryUid && !formUser.laboratoryUids.includes(formUser.activeLaboratoryUid)) {
    formUser.activeLaboratoryUid = "";
  }
  
  // Auto-select first lab as active if none selected
  if (formUser.laboratoryUids.length === 1 && !formUser.activeLaboratoryUid) {
    formUser.activeLaboratoryUid = formUser.laboratoryUids[0];
  }
};

// Navigation methods
const nextStep = () => {
  if (validateCurrentStep() && currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goToStep = (step: number) => {
  if (step >= 1 && step <= totalSteps) {
    currentStep.value = step;
  }
};

// Form submission
const saveUser = async () => {
  if (!isFormValid.value) {
    toastError("Please fill in all required fields correctly");
    return;
  }

  processing.value = true;
  
  try {
    // Generate password if requested
    let finalPassword = formUser.password;
    if (formUser.generatePassword) {
      finalPassword = generateRandomPassword();
      formUser.includeCredentials = true; // Auto-include credentials in welcome email
    }

    // Step 1: Create the user with enhanced mutation
    const userResult = await withClientMutation<CreateUserMutation, CreateUserMutationVariables>(
      CreateUserEnhancedDocument,
      { 
        payload: {
          firstName: formUser.firstName,
          lastName: formUser.lastName,
          email: formUser.email,
          userName: formUser.userName,
          password: finalPassword,
          passwordc: finalPassword,
          isActive: formUser.isActive,
          isBlocked: formUser.isBlocked,
          groupUid: formUser.groupUid || undefined,
          laboratoryUids: formUser.laboratoryUids,
          activeLaboratoryUid: formUser.activeLaboratoryUid || undefined,
          mobilePhone: formUser.phoneNumber || undefined,
          businessPhone: undefined,
          bio: undefined,
          jobTitle: formUser.jobTitle || undefined,
          department: formUser.department || undefined,
          employeeId: formUser.employeeId || undefined,
          profilePicture: formUser.profilePicture || undefined,
          sendWelcomeEmail: formUser.sendWelcomeEmail,
          includeCredentials: formUser.includeCredentials,
        }
      },
      "createUserEnhanced"
    );

    if (userResult.__typename === "UserType") {
      createdUser.value = userResult as UserType;
      
      toastSuccess("User created successfully!");
      
      // Move to success step
      currentStep.value = totalSteps + 1;
    } else {
      toastError(userResult.error || "Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    toastError("Failed to create user");
  } finally {
    processing.value = false;
  }
};

// Reset form
const resetForm = () => {
  Object.assign(formUser, {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    employeeId: "",
    userName: "",
    password: "",
    passwordConfirm: "",
    generatePassword: false,
    jobTitle: "",
    department: "",
    groupUid: "",
    laboratoryUids: [],
    activeLaboratoryUid: "",
    isActive: true,
    isBlocked: false,
    profilePicture: "",
    sendWelcomeEmail: true,
    includeCredentials: false,
  });
  
  profilePictureFile.value = null;
  profilePicturePreview.value = "";
  currentStep.value = 1;
  
  // Clear validation errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key as keyof typeof validationErrors] = "";
  });
};

// Go back to user listing
const goBack = () => {
  router.push("/admin/users-conf");
};

const createAnotherUser = () => {
  resetForm();
};

// Watch for auto-generated password toggle
watch(() => formUser.generatePassword, (newValue) => {
  if (newValue) {
    formUser.password = "";
    formUser.passwordConfirm = "";
  }
});

// Watch for email changes to auto-generate username
watch(() => formUser.email, () => {
  if (formUser.email && !formUser.userName) {
    generateUsername();
  }
});

// Lifecycle
onMounted(() => {
  // Any initialization logic here
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">Enhanced User Registration</h2>
        <p class="text-sm text-muted-foreground mt-1">Create a new user account with enhanced workflow</p>
      </div>
      <button 
        @click="goBack"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Users
      </button>
    </div>

    <hr class="border-border" />

    <!-- Success Step -->
    <div v-if="currentStep === totalSteps + 1" class="space-y-6">
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-2xl text-green-600"></i>
        </div>
        <h3 class="text-xl font-semibold text-foreground mb-2">User Created Successfully!</h3>
        <p class="text-muted-foreground mb-6">
          {{ createdUser?.firstName }} {{ createdUser?.lastName }} has been registered and assigned to {{ formUser.laboratoryUids.length }} laboratory{{ formUser.laboratoryUids.length !== 1 ? 's' : '' }}.
        </p>
        
        <!-- User Summary -->
        <div class="bg-muted/50 rounded-lg p-4 max-w-md mx-auto mb-6">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-medium">Name:</span>
              <span>{{ createdUser?.firstName }} {{ createdUser?.lastName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Email:</span>
              <span>{{ createdUser?.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Username:</span>
              <span>{{ createdUser?.userName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Laboratories:</span>
              <span>{{ formUser.laboratoryUids.length }}</span>
            </div>
            <div v-if="formUser.sendWelcomeEmail" class="flex justify-between">
              <span class="font-medium">Welcome Email:</span>
              <span class="text-green-600">Sent</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button
            @click="createAnotherUser"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <i class="fas fa-plus mr-2"></i>
            Create Another User
          </button>
          
          <button
            @click="goBack"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View All Users
          </button>
        </div>
      </div>
    </div>

    <!-- Multi-Step Form -->
    <div v-else class="space-y-6">
      <!-- Progress Indicator -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            v-for="step in totalSteps"
            :key="step"
            class="flex items-center"
          >
            <div
              @click="goToStep(step)"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors',
                step === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              ]"
            >
              <i v-if="step < currentStep" class="fas fa-check"></i>
              <span v-else>{{ step }}</span>
            </div>
            <div v-if="step < totalSteps" class="w-12 h-0.5 bg-muted mx-2"></div>
          </div>
        </div>
        <div class="text-sm text-muted-foreground">
          Step {{ currentStep }} of {{ totalSteps }}: {{ stepTitles[currentStep - 1] }}
        </div>
      </div>

      <!-- Step Content -->
      <form @submit.prevent="saveUser" class="space-y-8">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
            
            <!-- Profile Picture Upload -->
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  v-if="profilePicturePreview" 
                  :src="profilePicturePreview" 
                  alt="Profile Preview" 
                  class="w-full h-full object-cover"
                />
                <i v-else class="fas fa-user text-2xl text-muted-foreground"></i>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Profile Picture (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleProfilePictureUpload"
                  class="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p class="text-xs text-muted-foreground">Upload a profile picture (max 2MB)</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  First Name *
                </label>
                <input
                  v-model="formUser.firstName"
                  type="text"
                  required
                  placeholder="Enter first name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': validationErrors.firstName }"
                />
                <p v-if="validationErrors.firstName" class="text-sm text-destructive">
                  {{ validationErrors.firstName }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Last Name *
                </label>
                <input
                  v-model="formUser.lastName"
                  type="text"
                  required
                  placeholder="Enter last name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': validationErrors.lastName }"
                />
                <p v-if="validationErrors.lastName" class="text-sm text-destructive">
                  {{ validationErrors.lastName }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <input
                  v-model="formUser.email"
                  type="email"
                  required
                  placeholder="Enter email address..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': validationErrors.email }"
                />
                <p v-if="validationErrors.email" class="text-sm text-destructive">
                  {{ validationErrors.email }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  v-model="formUser.phoneNumber"
                  type="tel"
                  placeholder="Enter phone number..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Employee ID
                </label>
                <input
                  v-model="formUser.employeeId"
                  type="text"
                  placeholder="Enter employee ID..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Account Details -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-foreground">Account Details</h3>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Username *
                </label>
                <div class="flex space-x-2">
                  <input
                    v-model="formUser.userName"
                    type="text"
                    required
                    placeholder="Enter username..."
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="{ 'border-destructive': validationErrors.userName }"
                  />
                  <button
                    type="button"
                    @click="generateUsername"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                    title="Generate from email"
                  >
                    <i class="fas fa-magic"></i>
                  </button>
                </div>
                <p v-if="validationErrors.userName" class="text-sm text-destructive">
                  {{ validationErrors.userName }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="formUser.generatePassword"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <span class="text-sm font-medium text-foreground">Generate secure password</span>
                </label>
                <p class="text-xs text-muted-foreground">
                  If checked, a secure password will be generated and sent via email
                </p>
              </div>

              <div v-if="!formUser.generatePassword" class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Password *
                </label>
                <input
                  v-model="formUser.password"
                  type="password"
                  required
                  placeholder="Enter password..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': validationErrors.password }"
                />
                <p v-if="validationErrors.password" class="text-sm text-destructive">
                  {{ validationErrors.password }}
                </p>
                <div class="text-xs text-muted-foreground">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </div>
              </div>

              <div v-if="!formUser.generatePassword" class="space-y-2">
                <label class="text-sm font-medium text-foreground">
                  Confirm Password *
                </label>
                <input
                  v-model="formUser.passwordConfirm"
                  type="password"
                  required
                  placeholder="Confirm password..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': validationErrors.passwordConfirm }"
                />
                <p v-if="validationErrors.passwordConfirm" class="text-sm text-destructive">
                  {{ validationErrors.passwordConfirm }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Professional Information -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-foreground">Professional Information</h3>
            <p class="text-sm text-muted-foreground">This information is optional but helps with organization and reporting.</p>
            
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Job Title</label>
                <select
                  v-model="formUser.jobTitle"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select job title...</option>
                  <option v-for="title in jobTitles" :key="title" :value="title">
                    {{ title }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Department</label>
                <select
                  v-model="formUser.department"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select department...</option>
                  <option v-for="dept in departments" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Laboratory Access & Permissions -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-foreground">Laboratory Access & Permissions</h3>
            
            <!-- Default Group -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Default Group</label>
              <select
                v-model="formUser.groupUid"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Default Group (Optional)</option>
                <option v-for="group in groups" :key="group.uid" :value="group.uid">
                  {{ group.name }}
                </option>
              </select>
            </div>

            <!-- Laboratory Multi-Select -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Assigned Laboratories *</label>
              <div class="border border-input rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                <div v-for="lab in laboratories" :key="lab.uid" class="flex items-center space-x-3">
                  <input
                    :id="`lab-${lab.uid}`"
                    v-model="formUser.laboratoryUids"
                    :value="lab.uid"
                    @change="onLaboratorySelectionChange"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <label :for="`lab-${lab.uid}`" class="flex-1 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-sm">{{ lab.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ lab.code }} - {{ getOrganizationName(lab.organizationUid || "") }}</div>
                      </div>
                      <div class="text-xs text-muted-foreground">{{ lab.email }}</div>
                    </div>
                  </label>
                </div>
              </div>
              <p v-if="validationErrors.laboratoryUids" class="text-sm text-destructive">
                {{ validationErrors.laboratoryUids }}
              </p>
            </div>

            <!-- Active Laboratory Selection -->
            <div v-if="formUser.laboratoryUids.length > 0" class="space-y-2">
              <label class="text-sm font-medium text-foreground">Default Active Laboratory</label>
              <select
                v-model="formUser.activeLaboratoryUid"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select default laboratory...</option>
                <option v-for="lab in assignedLaboratories" :key="lab.uid" :value="lab.uid">
                  {{ lab.name }}
                </option>
              </select>
            </div>

            <!-- User Status -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-foreground">User Status</h4>
              
              <div class="flex items-center space-x-6">
                <label class="flex items-center space-x-3">
                  <input
                    v-model="formUser.isActive"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <span class="text-sm font-medium text-foreground">Active User</span>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input
                    v-model="formUser.isBlocked"
                    type="checkbox"
                    class="h-4 w-4 text-destructive focus:ring-ring border-gray-300 rounded"
                  />
                  <span class="text-sm font-medium text-foreground">Blocked</span>
                </label>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="space-y-4">
              <h4 class="text-md font-medium text-foreground">Notification Settings</h4>
              
              <div class="space-y-3">
                <label class="flex items-center space-x-3">
                  <input
                    v-model="formUser.sendWelcomeEmail"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <div>
                    <div class="text-sm font-medium text-foreground">Send Welcome Email</div>
                    <div class="text-xs text-muted-foreground">Send a welcome email to the new user</div>
                  </div>
                </label>
                
                <label v-if="formUser.sendWelcomeEmail" class="flex items-center space-x-3 ml-7">
                  <input
                    v-model="formUser.includeCredentials"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                  />
                  <div>
                    <div class="text-sm font-medium text-foreground">Include Login Credentials</div>
                    <div class="text-xs text-muted-foreground">Include username and password in the welcome email</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6 border-t border-border">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Previous
          </button>
          
          <div v-else></div>

          <div class="flex space-x-4">
            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              :disabled="!isStepValid"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Next
              <i class="fas fa-arrow-right ml-2"></i>
            </button>
            
            <button
              v-if="currentStep === totalSteps"
              type="submit"
              :disabled="!isFormValid || processing"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <span v-if="processing" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              {{ processing ? "Creating User..." : "Create User" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for enhanced form */
.step-indicator {
  transition: all 0.3s ease;
}

.step-indicator.active {
  transform: scale(1.1);
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #3b82f6;
}

.profile-preview {
  transition: all 0.3s ease;
}

.form-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>