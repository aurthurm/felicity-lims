<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, LaboratoryType, GroupType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Onboarding workflow GraphQL operations
interface CreateOnboardingWorkflowMutation {
  createOnboardingWorkflow: {
    __typename: "OnboardingWorkflowType" | "OperationError";
    uid?: string;
    status?: string;
    error?: string;
  };
}

interface UpdateOnboardingStepMutation {
  updateOnboardingStep: {
    __typename: "OnboardingStepType" | "OperationError";
    uid?: string;
    status?: string;
    error?: string;
  };
}

interface SendOnboardingInvitationMutation {
  sendOnboardingInvitation: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface OnboardingWorkflowsQuery {
  onboardingWorkflows: {
    items: OnboardingWorkflowType[];
    totalCount: number;
  };
}

interface OnboardingWorkflowType {
  uid: string;
  user: UserType;
  laboratory: LaboratoryType;
  status: "pending" | "in_progress" | "completed" | "rejected";
  steps: OnboardingStepType[];
  assignedTo: UserType;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingStepType {
  uid: string;
  name: string;
  description: string;
  status: "pending" | "completed" | "skipped";
  assignedTo?: UserType;
  completedAt?: string;
  notes?: string;
}

const CreateOnboardingWorkflowDocument = `
  mutation CreateOnboardingWorkflow($payload: OnboardingWorkflowInputType!) {
    createOnboardingWorkflow(payload: $payload) {
      ... on OnboardingWorkflowType {
        uid
        status
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const UpdateOnboardingStepDocument = `
  mutation UpdateOnboardingStep($stepUid: String!, $status: String!, $notes: String) {
    updateOnboardingStep(stepUid: $stepUid, status: $status, notes: $notes) {
      ... on OnboardingStepType {
        uid
        status
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const SendOnboardingInvitationDocument = `
  mutation SendOnboardingInvitation($workflowUid: String!, $emailTemplate: String) {
    sendOnboardingInvitation(workflowUid: $workflowUid, emailTemplate: $emailTemplate) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const OnboardingWorkflowsDocument = `
  query OnboardingWorkflows($laboratoryUid: String, $status: String) {
    onboardingWorkflows(laboratoryUid: $laboratoryUid, status: $status) {
      items {
        uid
        user {
          uid
          firstName
          lastName
          email
          userName
        }
        laboratory {
          uid
          name
          code
        }
        status
        steps {
          uid
          name
          description
          status
          assignedTo {
            uid
            firstName
            lastName
          }
          completedAt
          notes
        }
        assignedTo {
          uid
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();

// Fetch required data
userStore.fetchUsers({});
const allUsers = computed(() => userStore.getUsers);

// Mock data
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
]);

// Predefined onboarding steps template
const defaultOnboardingSteps = [
  {
    name: "Account Setup",
    description: "Create user account and basic profile information",
    required: true,
  },
  {
    name: "Laboratory Assignment",
    description: "Assign user to appropriate laboratories and set permissions",
    required: true,
  },
  {
    name: "Role Assignment",
    description: "Assign appropriate roles and groups to the user",
    required: true,
  },
  {
    name: "Security Training",
    description: "Complete mandatory security and safety training",
    required: true,
  },
  {
    name: "System Training",
    description: "Complete LIMS system training and orientation",
    required: true,
  },
  {
    name: "Department Orientation",
    description: "Meet with department head and team members",
    required: false,
  },
  {
    name: "Equipment Access",
    description: "Grant access to laboratory equipment and systems",
    required: false,
  },
  {
    name: "Final Review",
    description: "Final review and approval for full system access",
    required: true,
  },
];

// State
const selectedLaboratory = ref("");
const statusFilter = ref("");
const onboardingWorkflows = ref<OnboardingWorkflowType[]>([]);
const loading = ref(false);
const saving = ref(false);

// Modal states
const showCreateWorkflowModal = ref(false);
const showStepDetailsModal = ref(false);
const currentStep = ref<OnboardingStepType | null>(null);
const currentWorkflow = ref<OnboardingWorkflowType | null>(null);

// Create workflow form
const createWorkflowForm = reactive({
  userEmail: "",
  userName: "",
  firstName: "",
  lastName: "",
  laboratoryUid: "",
  assignedToUid: "",
  selectedSteps: [] as string[],
  customSteps: [] as { name: string; description: string }[],
  sendInvitation: true,
});

// Step details form
const stepDetailsForm = reactive({
  status: "",
  notes: "",
});

// Computed
const filteredWorkflows = computed(() => {
  let filtered = [...onboardingWorkflows.value];
  
  if (selectedLaboratory.value) {
    filtered = filtered.filter(w => w.laboratory.uid === selectedLaboratory.value);
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(w => w.status === statusFilter.value);
  }
  
  return filtered;
});

const workflowStats = computed(() => {
  const total = filteredWorkflows.value.length;
  const pending = filteredWorkflows.value.filter(w => w.status === "pending").length;
  const inProgress = filteredWorkflows.value.filter(w => w.status === "in_progress").length;
  const completed = filteredWorkflows.value.filter(w => w.status === "completed").length;
  const rejected = filteredWorkflows.value.filter(w => w.status === "rejected").length;
  
  return { total, pending, inProgress, completed, rejected };
});

// Methods
const loadOnboardingWorkflows = async () => {
  loading.value = true;
  
  try {
    const result = await withClientQuery<OnboardingWorkflowsQuery, any>(
      OnboardingWorkflowsDocument,
      {
        laboratoryUid: selectedLaboratory.value || undefined,
        status: statusFilter.value || undefined,
      }
    );

    onboardingWorkflows.value = result.onboardingWorkflows.items;
  } catch (error) {
    console.error("Error loading onboarding workflows:", error);
    toastError("Failed to load onboarding workflows");
  } finally {
    loading.value = false;
  }
};

// Create workflow methods
const openCreateWorkflowModal = () => {
  Object.assign(createWorkflowForm, {
    userEmail: "",
    userName: "",
    firstName: "",
    lastName: "",
    laboratoryUid: "",
    assignedToUid: "",
    selectedSteps: defaultOnboardingSteps.filter(s => s.required).map(s => s.name),
    customSteps: [],
    sendInvitation: true,
  });
  showCreateWorkflowModal.value = true;
};

const closeCreateWorkflowModal = () => {
  showCreateWorkflowModal.value = false;
};

const addCustomStep = () => {
  createWorkflowForm.customSteps.push({ name: "", description: "" });
};

const removeCustomStep = (index: number) => {
  createWorkflowForm.customSteps.splice(index, 1);
};

const createOnboardingWorkflow = async () => {
  if (!createWorkflowForm.userEmail || !createWorkflowForm.laboratoryUid) {
    toastError("Please fill in all required fields");
    return;
  }

  saving.value = true;
  
  try {
    const allSteps = [
      ...defaultOnboardingSteps.filter(s => createWorkflowForm.selectedSteps.includes(s.name)),
      ...createWorkflowForm.customSteps.filter(s => s.name.trim()),
    ];

    const result = await withClientMutation<CreateOnboardingWorkflowMutation, any>(
      CreateOnboardingWorkflowDocument,
      {
        payload: {
          userEmail: createWorkflowForm.userEmail,
          userName: createWorkflowForm.userName,
          firstName: createWorkflowForm.firstName,
          lastName: createWorkflowForm.lastName,
          laboratoryUid: createWorkflowForm.laboratoryUid,
          assignedToUid: createWorkflowForm.assignedToUid,
          steps: allSteps,
          sendInvitation: createWorkflowForm.sendInvitation,
        }
      },
      "createOnboardingWorkflow"
    );

    if (result.__typename === "OnboardingWorkflowType") {
      toastSuccess("Onboarding workflow created successfully");
      closeCreateWorkflowModal();
      loadOnboardingWorkflows();
    } else {
      toastError(result.error || "Failed to create onboarding workflow");
    }
  } catch (error) {
    console.error("Error creating onboarding workflow:", error);
    toastError("Failed to create onboarding workflow");
  } finally {
    saving.value = false;
  }
};

// Step management methods
const openStepDetailsModal = (step: OnboardingStepType, workflow: OnboardingWorkflowType) => {
  currentStep.value = step;
  currentWorkflow.value = workflow;
  stepDetailsForm.status = step.status;
  stepDetailsForm.notes = step.notes || "";
  showStepDetailsModal.value = true;
};

const closeStepDetailsModal = () => {
  currentStep.value = null;
  currentWorkflow.value = null;
  showStepDetailsModal.value = false;
};

const updateOnboardingStep = async () => {
  if (!currentStep.value) return;

  saving.value = true;
  
  try {
    const result = await withClientMutation<UpdateOnboardingStepMutation, any>(
      UpdateOnboardingStepDocument,
      {
        stepUid: currentStep.value.uid,
        status: stepDetailsForm.status,
        notes: stepDetailsForm.notes,
      },
      "updateOnboardingStep"
    );

    if (result.__typename === "OnboardingStepType") {
      toastSuccess("Step updated successfully");
      closeStepDetailsModal();
      loadOnboardingWorkflows();
    } else {
      toastError(result.error || "Failed to update step");
    }
  } catch (error) {
    console.error("Error updating step:", error);
    toastError("Failed to update step");
  } finally {
    saving.value = false;
  }
};

// Utility methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "in_progress": return "bg-blue-100 text-blue-800";
    case "completed": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "skipped": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStepProgress = (workflow: OnboardingWorkflowType) => {
  const completed = workflow.steps.filter(s => s.status === "completed").length;
  const total = workflow.steps.length;
  return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
};

const getUserName = (user: UserType) => {
  return `${user.firstName} ${user.lastName}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const goBack = () => {
  router.push("/admin/users-conf");
};

// Lifecycle
onMounted(() => {
  loadOnboardingWorkflows();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="goBack"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 class="text-2xl font-semibold text-foreground">User Onboarding Workflow</h2>
          <p class="text-sm text-muted-foreground">Manage new user onboarding processes and track progress</p>
        </div>
      </div>
      
      <button 
        @click="openCreateWorkflowModal"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <i class="fas fa-plus mr-2"></i>
        Start Onboarding
      </button>
    </div>

    <!-- Filters and Stats -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-64">
          <select
            v-model="selectedLaboratory"
            @change="loadOnboardingWorkflows"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Laboratories</option>
            <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>
        
        <div class="w-48">
          <select
            v-model="statusFilter"
            @change="loadOnboardingWorkflows"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <button
          @click="loadOnboardingWorkflows"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Total</h3>
          <i class="fas fa-clipboard-list text-muted-foreground"></i>
        </div>
        <div class="text-2xl font-bold">{{ workflowStats.total }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Pending</h3>
          <i class="fas fa-clock text-yellow-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ workflowStats.pending }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">In Progress</h3>
          <i class="fas fa-spinner text-blue-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ workflowStats.inProgress }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Completed</h3>
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ workflowStats.completed }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Rejected</h3>
          <i class="fas fa-times-circle text-red-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ workflowStats.rejected }}</div>
      </div>
    </div>

    <!-- Workflows List -->
    <div class="space-y-4">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
          <p class="text-muted-foreground">Loading onboarding workflows...</p>
        </div>
      </div>
      
      <div v-else-if="filteredWorkflows.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <i class="fas fa-clipboard-list text-4xl mb-4 text-muted-foreground"></i>
          <p class="text-muted-foreground">No onboarding workflows found</p>
        </div>
      </div>
      
      <div v-else v-for="workflow in filteredWorkflows" :key="workflow.uid" class="bg-card rounded-lg border p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-lg font-medium text-foreground">
                {{ getUserName(workflow.user) }}
              </h3>
              <span :class="[
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                getStatusColor(workflow.status)
              ]">
                {{ workflow.status.replace('_', ' ').toUpperCase() }}
              </span>
            </div>
            
            <div class="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{{ workflow.user.email }}</span>
              <span>•</span>
              <span>{{ workflow.laboratory.name }}</span>
              <span>•</span>
              <span>Created {{ formatDate(workflow.createdAt) }}</span>
              <span v-if="workflow.assignedTo">•</span>
              <span v-if="workflow.assignedTo">Assigned to {{ getUserName(workflow.assignedTo) }}</span>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-sm font-medium mb-1">
              {{ getStepProgress(workflow).completed }} / {{ getStepProgress(workflow).total }} steps
            </div>
            <div class="w-32 bg-muted rounded-full h-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300" 
                :style="{ width: `${getStepProgress(workflow).percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Steps Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div 
            v-for="step in workflow.steps" 
            :key="step.uid"
            @click="openStepDetailsModal(step, workflow)"
            class="p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-sm">{{ step.name }}</h4>
              <span :class="[
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                getStatusColor(step.status)
              ]">
                {{ step.status }}
              </span>
            </div>
            
            <p class="text-xs text-muted-foreground mb-2">{{ step.description }}</p>
            
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span v-if="step.assignedTo">{{ getUserName(step.assignedTo) }}</span>
              <span v-if="step.completedAt">{{ formatDate(step.completedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Workflow Modal -->
  <div v-if="showCreateWorkflowModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg max-h-[90vh] overflow-y-auto">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Create Onboarding Workflow</h3>
        <p class="text-sm text-muted-foreground">Set up a new user onboarding process</p>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- User Information -->
        <div class="space-y-4">
          <h4 class="font-medium">User Information</h4>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Email Address *</label>
              <input
                v-model="createWorkflowForm.userEmail"
                type="email"
                required
                placeholder="Enter user's email..."
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Username</label>
              <input
                v-model="createWorkflowForm.userName"
                type="text"
                placeholder="Enter username..."
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">First Name</label>
                <input
                  v-model="createWorkflowForm.firstName"
                  type="text"
                  placeholder="First name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Last Name</label>
                <input
                  v-model="createWorkflowForm.lastName"
                  type="text"
                  placeholder="Last name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Laboratory *</label>
              <select
                v-model="createWorkflowForm.laboratoryUid"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select laboratory...</option>
                <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
                  {{ lab.name }} ({{ lab.code }})
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Assign To</label>
              <select
                v-model="createWorkflowForm.assignedToUid"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select responsible person...</option>
                <option v-for="user in allUsers" :key="user.uid" :value="user.uid">
                  {{ getUserName(user) }}
                </option>
              </select>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="createWorkflowForm.sendInvitation"
                type="checkbox"
                id="send-invitation"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label for="send-invitation" class="text-sm font-medium text-foreground">
                Send onboarding invitation email
              </label>
            </div>
          </div>
        </div>

        <!-- Onboarding Steps -->
        <div class="space-y-4">
          <h4 class="font-medium">Onboarding Steps</h4>
          
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="step in defaultOnboardingSteps" :key="step.name" class="flex items-start space-x-3">
              <input
                :id="`step-${step.name}`"
                v-model="createWorkflowForm.selectedSteps"
                :value="step.name"
                type="checkbox"
                :disabled="step.required"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded mt-1"
              />
              <label :for="`step-${step.name}`" class="flex-1 cursor-pointer">
                <div class="font-medium text-sm">
                  {{ step.name }}
                  <span v-if="step.required" class="text-red-500">*</span>
                </div>
                <div class="text-xs text-muted-foreground">{{ step.description }}</div>
              </label>
            </div>
          </div>

          <!-- Custom Steps -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h5 class="font-medium text-sm">Custom Steps</h5>
              <button
                @click="addCustomStep"
                type="button"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
              >
                <i class="fas fa-plus mr-1"></i>
                Add Step
              </button>
            </div>

            <div v-for="(step, index) in createWorkflowForm.customSteps" :key="index" class="flex items-center space-x-2">
              <input
                v-model="step.name"
                type="text"
                placeholder="Step name..."
                class="flex h-8 w-32 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                v-model="step.description"
                type="text"
                placeholder="Description..."
                class="flex h-8 flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                @click="removeCustomStep(index)"
                type="button"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeCreateWorkflowModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="createOnboardingWorkflow"
          :disabled="!createWorkflowForm.userEmail || !createWorkflowForm.laboratoryUid || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Creating..." : "Create Workflow" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Step Details Modal -->
  <div v-if="showStepDetailsModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">{{ currentStep?.name }}</h3>
        <p class="text-sm text-muted-foreground">{{ currentStep?.description }}</p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Status</label>
          <select
            v-model="stepDetailsForm.status"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Notes</label>
          <textarea
            v-model="stepDetailsForm.notes"
            rows="3"
            placeholder="Add notes about this step..."
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <div v-if="currentStep?.assignedTo" class="p-3 bg-muted/50 rounded-md">
          <div class="text-sm">
            <div class="font-medium">Assigned to: {{ getUserName(currentStep.assignedTo) }}</div>
            <div v-if="currentStep.completedAt" class="text-muted-foreground mt-1">
              Completed: {{ formatDate(currentStep.completedAt) }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeStepDetailsModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="updateOnboardingStep"
          :disabled="saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Updating..." : "Update Step" }}
        </button>
      </div>
    </div>
  </div>
</template>