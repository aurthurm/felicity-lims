<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useRoute, useRouter } from 'vue-router';
import { UserType, GroupType, LaboratoryType } from '@/types/gql';
import { useUserStore } from '@/stores/user';
import useApiUtil from '@/composables/api_util';
import useNotifyToast from '@/composables/alert_toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

// Mock GraphQL operations - these would need to be generated from the backend schema
interface UserQuery {
    user: UserType;
}

interface UserQueryVariables {
    uid: string;
}

interface UpdateUserMutation {
    updateUser: {
        __typename: 'UserType' | 'OperationError';
        uid?: string;
        firstName?: string;
        error?: string;
    };
}

interface UpdateUserMutationVariables {
    uid: string;
    payload: Partial<UserType>;
}

interface AssignUserToLaboratoriesMutation {
    assignUserToLaboratories: {
        __typename: 'UserType' | 'OperationError';
        uid?: string;
        error?: string;
    };
}

interface AssignUserToLaboratoriesMutationVariables {
    userUid: string;
    laboratoryUids: string[];
    activeLaboratoryUid?: string;
}

interface UserPermissionsQuery {
    userPermissions: {
        uid: string;
        laboratoryUid?: string;
        permissions: string[];
    }[];
}

interface UserPermissionsQueryVariables {
    userUid: string;
}

const GetUserDocument = `
  query GetUser($uid: String!) {
    user(uid: $uid) {
      uid
      firstName
      lastName
      email
      userName
      isActive
      isBlocked
      activeLaboratoryUid
      groups {
        uid
        name
        permissions {
          uid
          action
          target
        }
      }
      laboratories {
        uid
        name
        code
        organizationUid
        email
      }
      createdAt
      updatedAt
    }
  }
`;

const UpdateUserDocument = `
  mutation UpdateUser($uid: String!, $payload: UserInputType!) {
    updateUser(uid: $uid, payload: $payload) {
      ... on UserType {
        uid
        firstName
        lastName
        email
        userName
        isActive
        isBlocked
        activeLaboratoryUid
        updatedAt
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
        laboratories {
          uid
          name
          code
        }
        activeLaboratoryUid
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const GetUserPermissionsDocument = `
  query GetUserPermissions($userUid: String!) {
    userPermissions(userUid: $userUid) {
      uid
      laboratoryUid
      permissions
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Fetch required data
userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups);

// Mock data - in real implementation, these would come from GraphQL queries
const allLaboratories = ref<LaboratoryType[]>([
    {
        uid: 'lab1',
        name: 'Central Laboratory',
        organizationUid: 'org1',
        code: 'CENTRAL',
        email: 'central@lab.com',
    },
    {
        uid: 'lab2',
        name: 'Branch Laboratory',
        organizationUid: 'org1',
        code: 'BRANCH',
        email: 'branch@lab.com',
    },
]);

// State
const user = ref<UserType | null>(null);
const userPermissions = ref<any[]>([]);
const loading = ref(false);
const saving = ref(false);
const isEditing = ref(false);

const userSchema = yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    email: yup.string().trim().email('Enter a valid email').required('Email is required'),
    userName: yup.string().trim().nullable(),
    isActive: yup.boolean().default(true),
    isBlocked: yup.boolean().default(false),
    laboratoryUids: yup.array().of(yup.string()).default([]),
    activeLaboratoryUid: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues, values, setFieldValue } = useForm({
    validationSchema: userSchema,
    initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        isActive: true,
        isBlocked: false,
        laboratoryUids: [] as string[],
        activeLaboratoryUid: '',
    },
});

// Tabs
const activeTab = ref('overview');

// Computed
const userUid = computed(() => route.params.uid as string);

const getUserGroups = (user: UserType) => {
    return user.groups?.map(g => g.name).join(', ') || 'No Groups';
};

const getLaboratoryName = (labUid: string) => {
    const lab = allLaboratories.value.find(l => l.uid === labUid);
    return lab?.name || 'Unknown Laboratory';
};

const getActiveLaboratory = (user: UserType) => {
    if (!user.activeLaboratoryUid) return 'None';
    const lab = user.laboratories?.find(l => l.uid === user.activeLaboratoryUid);
    return lab?.name || 'Unknown';
};

const unassignedLaboratories = computed(() => {
    if (!user.value) return allLaboratories.value;
    const assignedUids = user.value.laboratories?.map(l => l.uid) || [];
    return allLaboratories.value.filter(lab => !assignedUids.includes(lab.uid));
});

// Methods
const fetchUser = async () => {
    if (!userUid.value) return;

    loading.value = true;

    try {
        const result = await withClientQuery<UserQuery, UserQueryVariables>(GetUserDocument, { uid: userUid.value });

        user.value = result.user;

        // Populate edit form
        if (user.value) {
            setValues({
                firstName: user.value.firstName || '',
                lastName: user.value.lastName || '',
                email: user.value.email || '',
                userName: user.value.userName || '',
                isActive: user.value.isActive ?? true,
                isBlocked: user.value.isBlocked ?? false,
                laboratoryUids: user.value.laboratories?.map(lab => lab.uid) || [],
                activeLaboratoryUid: user.value.activeLaboratoryUid || '',
            });
        }

        // Fetch user permissions
        await fetchUserPermissions();
    } catch (error) {
        toastError('Failed to fetch user details');
    } finally {
        loading.value = false;
    }
};

const fetchUserPermissions = async () => {
    if (!userUid.value) return;

    try {
        const result = await withClientQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(GetUserPermissionsDocument, {
            userUid: userUid.value,
        });

        userPermissions.value = result.userPermissions;
    } catch {}
};

const toggleEdit = () => {
    isEditing.value = !isEditing.value;

    if (!isEditing.value && user.value) {
        // Reset form when canceling edit
        resetForm({
            values: {
                firstName: user.value.firstName || '',
                lastName: user.value.lastName || '',
                email: user.value.email || '',
                userName: user.value.userName || '',
                isActive: user.value.isActive ?? true,
                isBlocked: user.value.isBlocked ?? false,
                laboratoryUids: user.value.laboratories?.map(lab => lab.uid) || [],
                activeLaboratoryUid: user.value.activeLaboratoryUid || '',
            },
        });
    }
};

const saveUser = handleSubmit(async values => {
    if (!user.value) return;

    saving.value = true;

    try {
        const result = await withClientMutation<UpdateUserMutation, UpdateUserMutationVariables>(
            UpdateUserDocument,
            {
                uid: user.value.uid,
                payload: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    userName: values.userName ?? undefined,
                    isActive: values.isActive,
                    isBlocked: values.isBlocked,
                },
            },
            'updateUser',
        );

        if (result.__typename === 'UserType') {
            toastSuccess('User updated successfully');
            isEditing.value = false;
            fetchUser(); // Refresh data
        } else {
            toastError(result.error || 'Failed to update user');
        }
    } catch (error) {
        toastError('Failed to update user');
    } finally {
        saving.value = false;
    }
});

const saveLabAssignments = async () => {
    if (!user.value) return;

    saving.value = true;

    try {
        const result = await withClientMutation<AssignUserToLaboratoriesMutation, AssignUserToLaboratoriesMutationVariables>(
            AssignUserToLaboratoriesDocument,
            {
                userUid: user.value.uid,
                laboratoryUids: values.laboratoryUids,
                activeLaboratoryUid: values.activeLaboratoryUid || undefined,
            },
            'assignUserToLaboratories',
        );

        if (result.__typename === 'UserType') {
            toastSuccess('Laboratory assignments updated successfully');
            fetchUser(); // Refresh data
        } else {
            toastError(result.error || 'Failed to update laboratory assignments');
        }
    } catch (error) {
        toastError('Failed to update laboratory assignments');
    } finally {
        saving.value = false;
    }
};

const addLaboratory = (labUid: string) => {
    if (!values.laboratoryUids.includes(labUid)) {
        const next = [...values.laboratoryUids, labUid];
        setFieldValue('laboratoryUids', next);

        if (next.length === 1) {
            setFieldValue('activeLaboratoryUid', labUid);
        }
    }
};

const removeLaboratory = (labUid: string) => {
    const index = values.laboratoryUids.indexOf(labUid);
    if (index > -1) {
        const next = values.laboratoryUids.filter(uid => uid !== labUid);
        setFieldValue('laboratoryUids', next);

        if (values.activeLaboratoryUid === labUid) {
            setFieldValue('activeLaboratoryUid', next[0] || '');
        }
    }
};

const goBack = () => {
    router.push('/admin/users-conf');
};

// Lifecycle
onMounted(() => {
    fetchUser();
});
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <Button variant="outline" size="icon" @click="goBack" type="button">
                    <i class="fas fa-arrow-left"></i>
                </Button>
                <div>
                    <h2 class="text-foreground text-2xl font-semibold">
                        {{ user ? `${user.firstName} ${user.lastName}` : 'User Details' }}
                    </h2>
                    <p class="text-muted-foreground text-sm">View and manage user information and laboratory access</p>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <Button v-if="!isEditing && activeTab === 'overview'" @click="toggleEdit" variant="outline" type="button">
                    <i class="fas fa-edit mr-2"></i>
                    Edit User
                </Button>

                <div v-if="isEditing && activeTab === 'overview'" class="flex items-center space-x-2">
                    <Button @click="toggleEdit" :disabled="saving" variant="outline" type="button"> Cancel </Button>

                    <Button @click="saveUser" :disabled="saving" type="button">
                        <span v-if="saving" class="mr-2">
                            <i class="fas fa-spinner fa-spin"></i>
                        </span>
                        {{ saving ? 'Saving...' : 'Save Changes' }}
                    </Button>
                </div>
            </div>
        </div>

        <hr class="border-border" />

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
                <i class="fas fa-spinner fa-spin mb-4 text-2xl"></i>
                <p class="text-muted-foreground">Loading user details...</p>
            </div>
        </div>

        <!-- User Details -->
        <form v-else-if="user" class="space-y-6">
            <!-- Tabs -->
            <div class="border-border flex space-x-1 border-b">
                <button
                    @click="activeTab = 'overview'"
                    :class="[
                        'rounded-t-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'overview'
                            ? 'bg-background text-foreground border-primary border-b-2'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                >
                    Overview
                </button>
                <button
                    @click="activeTab = 'laboratories'"
                    :class="[
                        'rounded-t-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'laboratories'
                            ? 'bg-background text-foreground border-primary border-b-2'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                >
                    Laboratories
                </button>
                <button
                    @click="activeTab = 'permissions'"
                    :class="[
                        'rounded-t-md px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === 'permissions'
                            ? 'bg-background text-foreground border-primary border-b-2'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                >
                    Permissions
                </button>
            </div>

            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
                <!-- Basic Information -->
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">Basic Information</h3>

                    <div class="grid grid-cols-2 gap-6">
                        <FormField name="firstName" v-slot="{ componentField }">
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl v-if="isEditing">
                                    <Input v-bind="componentField" type="text" required />
                                </FormControl>
                                <FormMessage v-if="isEditing" />
                                <div v-else class="bg-muted/50 rounded-md p-3">
                                    <span class="text-sm">{{ user.firstName || '-' }}</span>
                                </div>
                            </FormItem>
                        </FormField>

                        <FormField name="lastName" v-slot="{ componentField }">
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl v-if="isEditing">
                                    <Input v-bind="componentField" type="text" required />
                                </FormControl>
                                <FormMessage v-if="isEditing" />
                                <div v-else class="bg-muted/50 rounded-md p-3">
                                    <span class="text-sm">{{ user.lastName || '-' }}</span>
                                </div>
                            </FormItem>
                        </FormField>

                        <FormField name="email" v-slot="{ componentField }">
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl v-if="isEditing">
                                    <Input v-bind="componentField" type="email" />
                                </FormControl>
                                <FormMessage v-if="isEditing" />
                                <div v-else class="bg-muted/50 rounded-md p-3">
                                    <span class="text-sm">{{ user.email || '-' }}</span>
                                </div>
                            </FormItem>
                        </FormField>

                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <div class="bg-muted/50 rounded-md p-3">
                                <span class="text-sm">{{ user.userName || '-' }}</span>
                            </div>
                        </FormItem>
                    </div>
                </div>

                <!-- Status -->
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">User Status</h3>

                    <div class="flex items-center space-x-6">
                        <div v-if="isEditing" class="flex items-center space-x-6">
                            <FormField name="isActive" v-slot="{ value, handleChange }">
                                <FormItem class="flex items-center space-x-2">
                                    <FormControl>
                                        <Switch :checked="value" @update:checked="handleChange" />
                                    </FormControl>
                                    <FormLabel>Active User</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <FormField name="isBlocked" v-slot="{ value, handleChange }">
                                <FormItem class="flex items-center space-x-2">
                                    <FormControl>
                                        <Switch :checked="value" @update:checked="handleChange" />
                                    </FormControl>
                                    <FormLabel>Blocked</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </div>

                        <div v-else class="flex items-center space-x-4">
                            <span
                                :class="[
                                    'inline-flex items-center rounded-md px-3 py-1 text-sm font-medium',
                                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                                ]"
                            >
                                {{ user.isActive ? 'Active' : 'Inactive' }}
                            </span>

                            <span
                                v-if="user.isBlocked"
                                class="inline-flex items-center rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800"
                            >
                                Blocked
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Groups and Roles -->
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">Groups and Roles</h3>

                    <div class="space-y-2">
                        <label class="text-foreground text-sm font-medium">Assigned Groups</label>
                        <div class="bg-muted/50 rounded-md p-3">
                            <span class="text-sm">{{ getUserGroups(user) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Metadata -->
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">Metadata</h3>

                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-foreground text-sm font-medium">Created At</label>
                            <div class="bg-muted/50 rounded-md p-3">
                                <span class="text-sm">{{ user.createdAt ? new Date(user.createdAt).toLocaleString() : '-' }}</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-foreground text-sm font-medium">Last Updated</label>
                            <div class="bg-muted/50 rounded-md p-3">
                                <span class="text-sm">{{ user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Laboratories Tab -->
            <div v-if="activeTab === 'laboratories'" class="space-y-6">
                <!-- Current Laboratory Assignments -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-foreground text-lg font-medium">Laboratory Assignments</h3>
                        <Button @click="saveLabAssignments" :disabled="saving" type="button">
                            <span v-if="saving" class="mr-2">
                                <i class="fas fa-spinner fa-spin"></i>
                            </span>
                            {{ saving ? 'Saving...' : 'Save Changes' }}
                        </Button>
                    </div>

                    <!-- Active Laboratory -->
                    <FormField name="activeLaboratoryUid" v-slot="{ componentField }">
                        <FormItem>
                            <FormLabel>Default Active Laboratory</FormLabel>
                            <FormControl>
                                <Select v-bind="componentField">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select default laboratory..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Select default laboratory...</SelectItem>
                                        <SelectItem v-for="labUid in values.laboratoryUids" :key="labUid" :value="labUid">
                                            {{ getLaboratoryName(labUid) }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <!-- Assigned Laboratories -->
                    <div class="space-y-2">
                        <label class="text-foreground text-sm font-medium">Assigned Laboratories</label>
                        <div class="space-y-2">
                            <div
                                v-for="labUid in values.laboratoryUids"
                                :key="labUid"
                                class="border-input flex items-center justify-between rounded-md border p-3"
                            >
                                <div class="flex items-center space-x-3">
                                    <div class="bg-primary h-3 w-3 rounded-full"></div>
                                    <div>
                                        <div class="text-sm font-medium">{{ getLaboratoryName(labUid) }}</div>
                                        <div class="text-muted-foreground text-xs">
                                            {{ labUid === values.activeLaboratoryUid ? 'Active Laboratory' : 'Access Granted' }}
                                        </div>
                                    </div>
                                </div>
                                <Button @click="removeLaboratory(labUid)" variant="ghost" size="icon" type="button" title="Remove Access">
                                    <i class="fas fa-times"></i>
                                </Button>
                            </div>

                            <Empty v-if="values.laboratoryUids.length === 0" class="border-0 bg-transparent p-0">
                                <EmptyContent>
                                    <EmptyMedia variant="icon">
                                        <i class="fas fa-building text-muted-foreground"></i>
                                    </EmptyMedia>
                                    <EmptyHeader>
                                        <EmptyTitle>No laboratories assigned</EmptyTitle>
                                        <EmptyDescription>Assign a laboratory to grant access.</EmptyDescription>
                                    </EmptyHeader>
                                </EmptyContent>
                            </Empty>
                        </div>
                    </div>
                </div>

                <!-- Available Laboratories -->
                <div v-if="unassignedLaboratories.length > 0" class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">Available Laboratories</h3>

                    <div class="space-y-2">
                        <div
                            v-for="lab in unassignedLaboratories"
                            :key="lab.uid"
                            class="border-input flex items-center justify-between rounded-md border p-3"
                        >
                            <div class="flex items-center space-x-3">
                                <div class="bg-muted-foreground h-3 w-3 rounded-full"></div>
                                <div>
                                    <div class="text-sm font-medium">{{ lab.name }}</div>
                                    <div class="text-muted-foreground text-xs">{{ lab.code }} - {{ lab.email }}</div>
                                </div>
                            </div>
                            <Button @click="addLaboratory(lab.uid)" variant="ghost" size="icon" type="button" title="Grant Access">
                                <i class="fas fa-plus"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Permissions Tab -->
            <div v-if="activeTab === 'permissions'" class="space-y-6">
                <div class="space-y-4">
                    <h3 class="text-foreground text-lg font-medium">User Permissions</h3>

                    <div class="space-y-4">
                        <!-- Global Permissions -->
                        <div class="space-y-2">
                            <h4 class="text-foreground font-medium">Global Permissions</h4>
                            <div class="border-input rounded-md border p-4">
                                <div v-if="user.groups && user.groups.length > 0" class="space-y-3">
                                    <div v-for="group in user.groups" :key="group.uid" class="space-y-2">
                                        <div class="text-sm font-medium">{{ group.name }}</div>
                                        <div class="flex flex-wrap gap-2">
                                            <span
                                                v-for="permission in group.permissions"
                                                :key="permission.uid"
                                                class="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                                            >
                                                {{ permission.action }}:{{ permission.target }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Empty v-else class="border-0 bg-transparent p-0">
                                    <EmptyContent>
                                        <EmptyHeader>
                                            <EmptyTitle>No global permissions</EmptyTitle>
                                            <EmptyDescription>Add a group to grant global permissions.</EmptyDescription>
                                        </EmptyHeader>
                                    </EmptyContent>
                                </Empty>
                            </div>
                        </div>

                        <!-- Laboratory-Specific Permissions -->
                        <div class="space-y-2">
                            <h4 class="text-foreground font-medium">Laboratory-Specific Permissions</h4>
                            <div class="border-input rounded-md border p-4">
                                <div v-if="userPermissions.length > 0" class="space-y-3">
                                    <div
                                        v-for="labPerm in userPermissions"
                                        :key="`${labPerm.uid}-${labPerm.laboratoryUid}`"
                                        class="space-y-2"
                                    >
                                        <div class="text-sm font-medium">
                                            {{ labPerm.laboratoryUid ? getLaboratoryName(labPerm.laboratoryUid) : 'Global' }}
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <span
                                                v-for="permission in labPerm.permissions"
                                                :key="permission"
                                                class="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                                            >
                                                {{ permission }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Empty v-else class="border-0 bg-transparent p-0">
                                    <EmptyContent>
                                        <EmptyHeader>
                                            <EmptyTitle>No laboratory-specific permissions</EmptyTitle>
                                            <EmptyDescription>Assign permissions to a laboratory.</EmptyDescription>
                                        </EmptyHeader>
                                    </EmptyContent>
                                </Empty>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <!-- Error State -->
        <Empty v-else class="py-12">
            <EmptyContent>
                <EmptyMedia variant="icon">
                    <i class="fas fa-exclamation-triangle text-destructive"></i>
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>User not found</EmptyTitle>
                    <EmptyDescription>Check the user ID and try again.</EmptyDescription>
                </EmptyHeader>
            </EmptyContent>
        </Empty>
    </div>
</template>
