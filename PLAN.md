# Multi-Laboratory User Management Implementation Plan

## Overview

Implementation plan for enabling users to belong to multiple laboratories with laboratory context switching capabilities in Felicity LIMS.

## Current State Analysis

### Existing Infrastructure ✅
- `laboratory_user` many-to-many table already exists (migration: 322d323a4bfe)
- `User.active_laboratory_uid` field already exists (migration: cf889b8db893)
- Multi-tenant architecture with laboratory-level data isolation
- Tenant context management system in place
- Admin interface structure already established

### Requirements
- Users can be assigned to multiple laboratories
- Laboratory registration through webapp admin
- Enhanced user registration with lab assignments
- Laboratory context switching for active users
- Backend GraphQL endpoints for lab management

---

## Phase 1: Backend GraphQL Enhancements

### 1.1 Laboratory Management Endpoints

**File: `felicity/api/gql/setup/mutations.py`**
```python
@strawberry.mutation
async def create_laboratory(
    self, 
    info: Info,
    laboratory: schemas.LaboratoryCreate
) -> LaboratoryResponse:
    """Create new laboratory with organization assignment"""
    # Validate user permissions (org admin or super admin)
    # Create laboratory with auto-generated UID
    # Set default laboratory settings
    # Return created laboratory

@strawberry.mutation  
async def update_laboratory(
    self, 
    info: Info,
    uid: str, 
    laboratory: schemas.LaboratoryUpdate
) -> LaboratoryResponse:
    """Update existing laboratory details"""
    # Validate user has admin access to laboratory
    # Update laboratory information
    # Handle manager changes
    # Return updated laboratory

@strawberry.mutation
async def delete_laboratory(
    self, 
    info: Info,
    uid: str
) -> MessageResponse:
    """Soft delete laboratory (mark as inactive)"""
    # Validate no active samples/data
    # Reassign users to other laboratories
    # Mark as inactive instead of hard delete
```

**File: `felicity/api/gql/setup/query.py`**
```python
@strawberry.field
async def laboratories_all(
    self, 
    info: Info
) -> List[LaboratoryType]:
    """Get all laboratories visible to current user"""
    # Super admin: all laboratories
    # Org admin: organization laboratories
    # Regular user: assigned laboratories

@strawberry.field
async def laboratory_by_uid(
    self, 
    info: Info,
    uid: str
) -> Optional[LaboratoryType]:
    """Get specific laboratory by UID"""
    # Validate user access to laboratory
    # Return laboratory with related data
```

### 1.2 User-Laboratory Association Endpoints

**File: `felicity/api/gql/user/mutations.py`**
```python
@strawberry.mutation
async def assign_user_to_laboratories(
    self,
    info: Info,
    user_uid: str, 
    laboratory_uids: List[str]
) -> UserResponse:
    """Assign user to multiple laboratories"""
    # Validate current user has admin rights
    # Validate target laboratories exist and accessible
    # Clear existing assignments if specified
    # Create new laboratory_user records
    # Set active_laboratory_uid if not set
    # Return updated user with laboratories

@strawberry.mutation
async def remove_user_from_laboratory(
    self,
    info: Info,
    user_uid: str, 
    laboratory_uid: str
) -> MessageResponse:
    """Remove user from specific laboratory"""
    # Validate admin permissions
    # Remove laboratory_user record
    # Update active_laboratory_uid if removing active lab
    # Handle group memberships in removed lab

@strawberry.mutation
async def switch_active_laboratory(
    self,
    info: Info,
    laboratory_uid: str
) -> AuthenticatedData:
    """Switch current user's active laboratory context"""
    user = await auth_from_info(info)
    
    # Verify user has access to laboratory
    user_labs = await UserService.get_user_laboratories(user.uid)
    if laboratory_uid not in [lab.uid for lab in user_labs]:
        return OperationError(error="Access denied to laboratory")
    
    # Update active laboratory
    updated_user = await UserService.update(
        user.uid, 
        {"active_laboratory_uid": laboratory_uid}
    )
    
    # Update JWT token with new context
    laboratory = await LaboratoryService.get(uid=laboratory_uid)
    new_token = create_access_token(
        data={
            "user_uid": user.uid,
            "laboratory_uid": laboratory_uid,
            "organization_uid": laboratory.organization_uid
        }
    )
    
    return AuthenticatedData(
        user=updated_user, 
        token=new_token,
        refresh=create_refresh_token(user.uid)
    )
```

### 1.3 Enhanced User Queries

**File: `felicity/api/gql/user/query.py`**
```python
@strawberry.field
async def user_laboratories(
    self, 
    info: Info,
    user_uid: str
) -> List[LaboratoryType]:
    """Get all laboratories assigned to specific user"""
    # Validate user access (self or admin)
    # Return user's assigned laboratories

@strawberry.field
async def laboratory_users(
    self, 
    info: Info,
    laboratory_uid: str
) -> List[UserType]:
    """Get all users assigned to specific laboratory"""
    # Validate user has admin access to laboratory
    # Return users with laboratory access
```

---

## Phase 2: Frontend Admin Interface

### 2.1 Laboratory Registration Admin

**File: `webapp/views/admin/laboratory/LaboratoryRegistration.vue`**
```vue
<template>
  <div class="laboratory-registration">
    <PageHeading title="Laboratory Registration" />
    
    <form @submit.prevent="submitLaboratory">
      <!-- Basic Information -->
      <div class="grid grid-cols-2 gap-4">
        <FelInput
          v-model="form.name"
          label="Laboratory Name"
          required
        />
        <FelInput
          v-model="form.code"
          label="Laboratory Code"
        />
      </div>
      
      <!-- Organization Assignment -->
      <FelSelect
        v-model="form.organization_uid"
        :options="organizations"
        label="Organization"
        required
      />
      
      <!-- Manager Assignment -->
      <FelSelect
        v-model="form.lab_manager_uid"
        :options="availableUsers"
        label="Laboratory Manager"
        searchable
      />
      
      <!-- Contact Details -->
      <div class="grid grid-cols-2 gap-4">
        <FelInput
          v-model="form.email"
          type="email"
          label="Email"
        />
        <FelInput
          v-model="form.mobile_phone"
          label="Mobile Phone"
        />
      </div>
      
      <!-- Location -->
      <div class="grid grid-cols-3 gap-4">
        <FelSelect
          v-model="form.country_uid"
          :options="countries"
          label="Country"
          @change="loadProvinces"
        />
        <FelSelect
          v-model="form.province_uid"
          :options="provinces"
          label="Province/State"
          @change="loadDistricts"
        />
        <FelSelect
          v-model="form.district_uid"
          :options="districts"
          label="District/City"
        />
      </div>
      
      <FelTextarea
        v-model="form.address"
        label="Physical Address"
        rows="3"
      />
      
      <!-- Laboratory Settings -->
      <div class="settings-section">
        <h3>Default Settings</h3>
        <div class="grid grid-cols-2 gap-4">
          <FelSwitch
            v-model="settings.allow_self_verification"
            label="Allow Self Verification"
          />
          <FelSwitch
            v-model="settings.allow_patient_registration"
            label="Allow Patient Registration"
          />
          <FelSwitch
            v-model="settings.allow_sample_registration"
            label="Allow Sample Registration"
          />
          <FelSwitch
            v-model="settings.allow_worksheet_creation"
            label="Allow Worksheet Creation"
          />
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button type="button" @click="cancel" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn-primary">
          Create Laboratory
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createLaboratory } from '@/graphql/operations/admin.mutations'

const router = useRouter()

const form = reactive({
  name: '',
  code: '',
  organization_uid: '',
  lab_manager_uid: '',
  email: '',
  mobile_phone: '',
  country_uid: '',
  province_uid: '',
  district_uid: '',
  address: ''
})

const settings = reactive({
  allow_self_verification: false,
  allow_patient_registration: true,
  allow_sample_registration: true,
  allow_worksheet_creation: true
})

const submitLaboratory = async () => {
  try {
    const result = await createLaboratory({
      laboratory: form,
      settings: settings
    })
    
    if (result.data?.createLaboratory.__typename === 'LaboratoryType') {
      // Success - redirect to laboratory list
      router.push('/admin/laboratory')
    } else {
      // Handle error
      console.error('Failed to create laboratory')
    }
  } catch (error) {
    console.error('Error creating laboratory:', error)
  }
}
</script>
```

### 2.2 Enhanced User Administration

**File: `webapp/views/admin/users/UsersAdmin.vue`**
```vue
<!-- Add to existing user form -->
<div class="laboratory-assignment mt-6">
  <h3 class="text-lg font-medium mb-4">Laboratory Access</h3>
  
  <!-- Multi-select for laboratory assignment -->
  <FelMultiSelect
    v-model="form.laboratory_uids"
    :options="availableLaboratories"
    label="Assigned Laboratories"
    multiple
    searchable
    placeholder="Select laboratories..."
  >
    <template #option="{ option }">
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
        <div>
          <div class="font-medium">{{ option.name }}</div>
          <div class="text-sm text-gray-500">{{ option.organization?.name }}</div>
        </div>
      </div>
    </template>
  </FelMultiSelect>
  
  <!-- Active laboratory selection -->
  <FelSelect
    v-model="form.active_laboratory_uid"
    :options="assignedLaboratories"
    label="Default Active Laboratory"
    placeholder="Select default laboratory..."
    :disabled="!form.laboratory_uids?.length"
  />
  
  <!-- Laboratory roles per lab -->
  <div v-if="form.laboratory_uids?.length" class="mt-4">
    <h4 class="font-medium mb-2">Laboratory Roles</h4>
    <div v-for="labUid in form.laboratory_uids" :key="labUid" class="mb-3">
      <div class="flex items-center justify-between p-3 border rounded">
        <span class="font-medium">
          {{ getLaboratoryName(labUid) }}
        </span>
        <FelSelect
          v-model="laboratoryRoles[labUid]"
          :options="availableRoles"
          placeholder="Select role..."
          class="w-48"
        />
      </div>
    </div>
  </div>
</div>
```

### 2.3 Laboratory Users Management

**File: `webapp/views/admin/laboratory/LaboratoryUsers.vue`**
```vue
<template>
  <div class="laboratory-users">
    <PageHeading title="Laboratory Users Management" />
    
    <!-- Laboratory Selector -->
    <div class="mb-6">
      <FelSelect
        v-model="selectedLaboratory"
        :options="userLaboratories"
        label="Select Laboratory"
        @change="loadLaboratoryUsers"
      />
    </div>
    
    <div v-if="selectedLaboratory" class="space-y-6">
      <!-- Add Users Section -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Add Users to Laboratory</h3>
        <div class="flex space-x-4">
          <FelMultiSelect
            v-model="selectedUsers"
            :options="availableUsers"
            placeholder="Search and select users..."
            multiple
            searchable
            class="flex-1"
          />
          <button 
            @click="addUsersToLab"
            :disabled="!selectedUsers.length"
            class="btn-primary"
          >
            Add Users
          </button>
        </div>
      </div>
      
      <!-- Current Users List -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h3 class="text-lg font-medium">Current Laboratory Users</h3>
        </div>
        
        <FelDataTable
          :data="laboratoryUsers"
          :columns="userColumns"
          searchable
          @action="handleUserAction"
        >
          <template #active_laboratory="{ row }">
            <span
              :class="row.active_laboratory_uid === selectedLaboratory ? 'text-green-600 font-medium' : 'text-gray-500'"
            >
              {{ row.active_laboratory_uid === selectedLaboratory ? 'Active' : 'Inactive' }}
            </span>
          </template>
          
          <template #actions="{ row }">
            <div class="flex space-x-2">
              <button
                v-if="row.active_laboratory_uid !== selectedLaboratory"
                @click="setActiveLabForUser(row.uid)"
                class="text-blue-600 hover:text-blue-800"
              >
                Set Active
              </button>
              <button
                @click="removeUserFromLab(row.uid)"
                class="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </template>
        </FelDataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  assignUserToLaboratories,
  removeUserFromLaboratory 
} from '@/graphql/operations/admin.mutations'

const selectedLaboratory = ref('')
const selectedUsers = ref([])
const laboratoryUsers = ref([])

const userColumns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'active_laboratory', label: 'Status', slot: 'active_laboratory' },
  { key: 'actions', label: 'Actions', slot: 'actions' }
]

const addUsersToLab = async () => {
  // Implementation for bulk user assignment
}

const removeUserFromLab = async (userUid: string) => {
  // Implementation for removing user from lab
}
</script>
```

---

## Phase 3: User Registration Form Enhancement

### 3.1 Registration Form Updates

**File: `webapp/components/person/UserRegistrationForm.vue`**
```vue
<template>
  <form @submit.prevent="submitUser" class="space-y-6">
    <!-- Existing user fields (name, email, etc.) -->
    <div class="grid grid-cols-2 gap-4">
      <FelInput
        v-model="form.firstName"
        label="First Name"
        required
      />
      <FelInput
        v-model="form.lastName"
        label="Last Name"
        required
      />
    </div>
    
    <FelInput
      v-model="form.email"
      type="email"
      label="Email Address"
      required
    />
    
    <FelInput
      v-model="form.userName"
      label="Username"
      required
    />
    
    <!-- Laboratory Assignment Section -->
    <div class="laboratory-assignment border-t pt-6">
      <h3 class="text-lg font-medium mb-4">Laboratory Access</h3>
      
      <FelMultiSelect
        v-model="form.laboratory_uids"
        :options="availableLaboratories"
        label="Assigned Laboratories"
        multiple
        searchable
        required
        placeholder="Select laboratories this user can access..."
      >
        <template #option="{ option }">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
            <div>
              <div class="font-medium">{{ option.name }}</div>
              <div class="text-sm text-gray-500">
                {{ option.organization?.name }}
              </div>
            </div>
          </div>
        </template>
      </FelMultiSelect>
      
      <FelSelect
        v-model="form.active_laboratory_uid"
        :options="assignedLaboratories"
        label="Default Active Laboratory"
        placeholder="Select default laboratory..."
        :disabled="!form.laboratory_uids?.length"
        required
      />
      
      <div class="text-sm text-gray-600 mt-2">
        The user will start with the selected default laboratory active.
        They can switch between assigned laboratories after login.
      </div>
    </div>
    
    <!-- Role Assignment per Laboratory -->
    <div v-if="form.laboratory_uids?.length" class="roles-assignment">
      <h4 class="font-medium mb-3">Role Assignment</h4>
      <div class="space-y-3">
        <div 
          v-for="labUid in form.laboratory_uids" 
          :key="labUid"
          class="flex items-center justify-between p-3 border rounded-md"
        >
          <div class="flex-1">
            <div class="font-medium">
              {{ getLaboratoryName(labUid) }}
            </div>
            <div class="text-sm text-gray-500">
              {{ getLaboratoryOrganization(labUid) }}
            </div>
          </div>
          <FelSelect
            v-model="laboratoryRoles[labUid]"
            :options="availableRoles"
            placeholder="Select role..."
            class="w-48"
            required
          />
        </div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-4">
      <button type="button" @click="cancel" class="btn-secondary">
        Cancel
      </button>
      <button 
        type="submit" 
        :disabled="!isFormValid"
        class="btn-primary"
      >
        Create User
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { createUserWithLaboratories } from '@/graphql/operations/admin.mutations'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  laboratory_uids: [],
  active_laboratory_uid: ''
})

const laboratoryRoles = reactive({})

const assignedLaboratories = computed(() => {
  return availableLaboratories.value.filter(lab => 
    form.laboratory_uids.includes(lab.uid)
  )
})

const submitUser = async () => {
  try {
    const result = await createUserWithLaboratories({
      user: form,
      laboratory_uids: form.laboratory_uids,
      laboratory_roles: laboratoryRoles
    })
    
    if (result.data?.createUserWithLaboratories.__typename === 'UserType') {
      // Success handling
      emit('user-created', result.data.createUserWithLaboratories)
    }
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

// Auto-set active laboratory when only one is selected
watch(() => form.laboratory_uids, (newLabs) => {
  if (newLabs.length === 1 && !form.active_laboratory_uid) {
    form.active_laboratory_uid = newLabs[0]
  } else if (!newLabs.includes(form.active_laboratory_uid)) {
    form.active_laboratory_uid = ''
  }
})
</script>
```

### 3.2 Registration Mutation Enhancement

**File: `webapp/graphql/operations/admin.mutations.graphql`**
```graphql
mutation CreateUserWithLaboratories(
  $user: UserCreate!, 
  $laboratory_uids: [String!]!,
  $laboratory_roles: [UserLaboratoryRoleInput!]
) {
  createUserWithLaboratories(
    user: $user, 
    laboratory_uids: $laboratory_uids,
    laboratory_roles: $laboratory_roles
  ) {
    ... on UserType {
      uid
      firstName
      lastName
      email
      userName
      laboratories {
        uid
        name
        organization {
          name
        }
      }
      activeLaboratory {
        uid
        name
        organization {
          name
        }
      }
    }
    ... on OperationError {
      error
      suggestion
    }
  }
}

mutation AssignUserToLaboratories(
  $user_uid: String!,
  $laboratory_uids: [String!]!
) {
  assignUserToLaboratories(
    user_uid: $user_uid,
    laboratory_uids: $laboratory_uids
  ) {
    ... on UserType {
      uid
      laboratories {
        uid
        name
      }
      activeLaboratory {
        uid
        name
      }
    }
  }
}

mutation SwitchActiveLaboratory($laboratory_uid: String!) {
  switchActiveLaboratory(laboratory_uid: $laboratory_uid) {
    ... on AuthenticatedData {
      user {
        uid
        firstName
        lastName
        activeLaboratory {
          uid
          name
          organization {
            name
          }
        }
      }
      token
      refresh
    }
  }
}
```

---

## Phase 4: Laboratory Context Switching

### 4.1 Frontend Context Switcher Component

**File: `webapp/components/nav/LaboratorySwitcher.vue`**
```vue
<template>
  <div class="laboratory-switcher relative">
    <div class="flex items-center space-x-2">
      <!-- Current Laboratory Display -->
      <div class="current-lab-info">
        <div class="text-sm font-medium text-gray-900">
          {{ authStore.activeLaboratory?.name || 'No Lab Selected' }}
        </div>
        <div class="text-xs text-gray-500">
          {{ authStore.activeLaboratory?.organization?.name }}
        </div>
      </div>
      
      <!-- Switch Button -->
      <button
        @click="showSwitcher = !showSwitcher"
        class="p-2 rounded-md hover:bg-gray-100 transition-colors"
        :disabled="userLaboratories.length <= 1"
      >
        <ChevronDownIcon class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Laboratory Switcher Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showSwitcher && userLaboratories.length > 1"
        class="absolute top-full left-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border"
      >
        <div class="p-3 border-b">
          <h3 class="text-sm font-medium text-gray-900">Switch Laboratory</h3>
          <p class="text-xs text-gray-500">Select which laboratory to work in</p>
        </div>
        
        <div class="max-h-64 overflow-y-auto">
          <div
            v-for="lab in userLaboratories"
            :key="lab.uid"
            @click="switchToLaboratory(lab.uid)"
            class="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 border-l-4 border-blue-500': lab.uid === authStore.activeLaboratory?.uid }"
          >
            <div class="flex-1">
              <div class="flex items-center">
                <div
                  class="w-3 h-3 rounded-full mr-3"
                  :class="lab.uid === authStore.activeLaboratory?.uid ? 'bg-green-500' : 'bg-gray-300'"
                ></div>
                <div>
                  <div class="font-medium text-gray-900">{{ lab.name }}</div>
                  <div class="text-sm text-gray-500">{{ lab.organization?.name }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="lab.uid === authStore.activeLaboratory?.uid" class="text-green-600">
              <CheckIcon class="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div class="p-3 border-t bg-gray-50">
          <div class="text-xs text-gray-500">
            Current context determines which data you can access
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Loading Overlay -->
    <div
      v-if="switching"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-md"
    >
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { switchActiveLaboratory } from '@/graphql/operations/admin.mutations'
import { useNotification } from '@/composables/notification'

const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const showSwitcher = ref(false)
const switching = ref(false)

const userLaboratories = computed(() => {
  return authStore.user?.laboratories || []
})

const switchToLaboratory = async (laboratoryUid: string) => {
  if (laboratoryUid === authStore.activeLaboratory?.uid || switching.value) {
    return
  }
  
  switching.value = true
  showSwitcher.value = false
  
  try {
    const result = await switchActiveLaboratory({
      laboratory_uid: laboratoryUid
    })
    
    if (result.data?.switchActiveLaboratory.__typename === 'AuthenticatedData') {
      const { user, token } = result.data.switchActiveLaboratory
      
      // Update auth store
      await authStore.updateAuthToken(token)
      authStore.setUser(user)
      
      // Show success notification
      showSuccess(`Switched to ${user.activeLaboratory?.name}`)
      
      // Refresh current page data to reflect new context
      window.location.reload()
    } else {
      showError('Failed to switch laboratory context')
    }
  } catch (error) {
    console.error('Error switching laboratory:', error)
    showError('Error switching laboratory')
  } finally {
    switching.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (!event.target?.closest('.laboratory-switcher')) {
    showSwitcher.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
```

### 4.2 Navigation Integration

**File: `webapp/components/nav/NavigationMain.vue`**
```vue
<!-- Add to header section -->
<div class="flex items-center justify-between">
  <div class="flex items-center space-x-4">
    <!-- Existing logo and navigation -->
  </div>
  
  <div class="flex items-center space-x-6">
    <!-- Laboratory Switcher -->
    <LaboratorySwitcher v-if="authStore.isAuthenticated" />
    
    <!-- User Menu -->
    <UserDropdown />
  </div>
</div>
```

---

## Phase 5: Enhanced Backend Services

### 5.1 User Service Extensions

**File: `felicity/apps/user/services.py`**
```python
class UserService(BaseService):
    
    async def assign_to_laboratories(
        self, 
        user_uid: str, 
        laboratory_uids: List[str],
        replace_existing: bool = False
    ) -> User:
        """Assign user to multiple laboratories"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        # Validate laboratories exist and are accessible
        labs = await LaboratoryService.get_by_uids(laboratory_uids)
        if len(labs) != len(laboratory_uids):
            raise ValueError("One or more laboratories not found")
        
        async with self.transaction() as session:
            if replace_existing:
                # Remove existing assignments
                await self.repository.table_delete(
                    table=laboratory_user,
                    session=session,
                    user_uid=user_uid
                )
            
            # Create new assignments
            assignments = [
                {"user_uid": user_uid, "laboratory_uid": lab_uid}
                for lab_uid in laboratory_uids
            ]
            
            await self.repository.table_insert(
                table=laboratory_user,
                mappings=assignments,
                session=session
            )
            
            # Set active laboratory if not set
            if not user.active_laboratory_uid and laboratory_uids:
                await self.update(
                    user_uid, 
                    {"active_laboratory_uid": laboratory_uids[0]},
                    session=session
                )
        
        return await self.get(uid=user_uid, related=["laboratories", "active_laboratory"])
    
    async def get_user_laboratories(self, user_uid: str) -> List[Laboratory]:
        """Get all laboratories assigned to user"""
        labs = await self.repository.table_query(
            table=laboratory_user,
            user_uid=user_uid
        )
        lab_uids = [lab.laboratory_uid for lab in labs]
        return await LaboratoryService.get_by_uids(lab_uids)
    
    async def remove_from_laboratory(self, user_uid: str, laboratory_uid: str) -> None:
        """Remove user from specific laboratory"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User {user_uid} not found")
        
        async with self.transaction() as session:
            # Remove assignment
            await self.repository.table_delete(
                table=laboratory_user,
                session=session,
                user_uid=user_uid,
                laboratory_uid=laboratory_uid
            )
            
            # Update active laboratory if removing active one
            if user.active_laboratory_uid == laboratory_uid:
                remaining_labs = await self.get_user_laboratories(user_uid)
                new_active = remaining_labs[0].uid if remaining_labs else None
                await self.update(
                    user_uid,
                    {"active_laboratory_uid": new_active},
                    session=session
                )
    
    async def switch_active_laboratory(
        self, 
        user_uid: str, 
        laboratory_uid: str
    ) -> User:
        """Switch user's active laboratory with validation"""
        # Validate user has access to laboratory
        user_labs = await self.get_user_laboratories(user_uid)
        lab_uids = [lab.uid for lab in user_labs]
        
        if laboratory_uid not in lab_uids:
            raise ValueError("User does not have access to laboratory")
        
        return await self.update(
            user_uid,
            {"active_laboratory_uid": laboratory_uid},
            related=["active_laboratory", "laboratories"]
        )
    
    async def create_with_laboratories(
        self,
        user_data: dict,
        laboratory_uids: List[str],
        laboratory_roles: dict = None
    ) -> User:
        """Create user and assign to laboratories in single transaction"""
        async with self.transaction() as session:
            # Set active laboratory
            if laboratory_uids and not user_data.get("active_laboratory_uid"):
                user_data["active_laboratory_uid"] = laboratory_uids[0]
            
            # Create user
            user = await self.create(user_data, session=session, commit=False)
            
            # Assign to laboratories
            if laboratory_uids:
                assignments = [
                    {"user_uid": user.uid, "laboratory_uid": lab_uid}
                    for lab_uid in laboratory_uids
                ]
                
                await self.repository.table_insert(
                    table=laboratory_user,
                    mappings=assignments,
                    session=session,
                    commit=False
                )
            
            # Handle laboratory roles if provided
            if laboratory_roles:
                # Implementation for role assignment per laboratory
                pass
            
            await session.commit()
        
        return await self.get(uid=user.uid, related=["laboratories", "active_laboratory"])
```

### 5.2 Laboratory Service Extensions

**File: `felicity/apps/setup/services.py`**
```python
class LaboratoryService(BaseService):
    
    async def get_laboratory_users(self, laboratory_uid: str) -> List[User]:
        """Get all users assigned to laboratory"""
        assignments = await self.repository.table_query(
            table=laboratory_user,
            laboratory_uid=laboratory_uid
        )
        user_uids = [assignment.user_uid for assignment in assignments]
        return await UserService.get_by_uids(user_uids)
    
    async def add_users_to_laboratory(
        self, 
        laboratory_uid: str, 
        user_uids: List[str]
    ) -> None:
        """Bulk add users to laboratory"""
        # Validate laboratory exists
        lab = await self.get(uid=laboratory_uid)
        if not lab:
            raise ValueError(f"Laboratory {laboratory_uid} not found")
        
        # Validate users exist
        users = await UserService.get_by_uids(user_uids)
        if len(users) != len(user_uids):
            raise ValueError("One or more users not found")
        
        # Create assignments
        assignments = [
            {"user_uid": user_uid, "laboratory_uid": laboratory_uid}
            for user_uid in user_uids
        ]
        
        await self.repository.table_insert(
            table=laboratory_user,
            mappings=assignments
        )
    
    async def remove_user_from_laboratory(
        self, 
        laboratory_uid: str, 
        user_uid: str
    ) -> None:
        """Remove specific user from laboratory"""
        await self.repository.table_delete(
            table=laboratory_user,
            laboratory_uid=laboratory_uid,
            user_uid=user_uid
        )
    
    async def create_with_settings(
        self,
        laboratory_data: dict,
        settings_data: dict = None
    ) -> Laboratory:
        """Create laboratory with default settings"""
        async with self.transaction() as session:
            # Create laboratory
            laboratory = await self.create(
                laboratory_data, 
                session=session, 
                commit=False
            )
            
            # Create default settings
            if settings_data:
                settings_data["laboratory_uid"] = laboratory.uid
                await LaboratorySettingService.create(
                    settings_data,
                    session=session,
                    commit=False
                )
            
            await session.commit()
        
        return await self.get(uid=laboratory.uid, related=["settings"])
```

---

## Phase 6: Frontend State Management

### 6.1 Auth Store Enhancement

**File: `webapp/stores/auth.ts`**
```typescript
import { defineStore } from 'pinia'
import { Laboratory, User } from '@/graphql/graphql'

interface AuthState {
  user: User | null
  token: string | null
  refresh: string | null
  userLaboratories: Laboratory[]
  activeLaboratory: Laboratory | null
  isAuthenticated: boolean
  forgotPassword: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refresh: null,
    userLaboratories: [],
    activeLaboratory: null,
    isAuthenticated: false,
    forgotPassword: false
  }),

  getters: {
    currentUser: (state) => state.user,
    currentLaboratory: (state) => state.activeLaboratory,
    hasMultipleLabs: (state) => state.userLaboratories.length > 1,
    canSwitchLabs: (state) => state.userLaboratories.length > 1
  },

  actions: {
    async switchLaboratory(laboratoryUid: string) {
      try {
        const result = await switchActiveLaboratory({ laboratory_uid: laboratoryUid })
        
        if (result.data?.switchActiveLaboratory.__typename === 'AuthenticatedData') {
          const { user, token, refresh } = result.data.switchActiveLaboratory
          
          // Update auth data
          this.updateAuthToken(token, refresh)
          this.setUser(user)
          this.activeLaboratory = user.activeLaboratory
          
          return true
        }
        return false
      } catch (error) {
        console.error('Error switching laboratory:', error)
        return false
      }
    },

    async refreshUserLaboratories() {
      if (!this.user) return
      
      try {
        const laboratories = await getUserLaboratories({ user_uid: this.user.uid })
        this.userLaboratories = laboratories
      } catch (error) {
        console.error('Error refreshing user laboratories:', error)
      }
    },

    setUser(user: User) {
      this.user = user
      this.userLaboratories = user.laboratories || []
      this.activeLaboratory = user.activeLaboratory || null
      this.isAuthenticated = true
    },

    updateAuthToken(token: string, refresh?: string) {
      this.token = token
      if (refresh) {
        this.refresh = refresh
      }
      
      // Store in localStorage
      localStorage.setItem('auth_token', token)
      if (refresh) {
        localStorage.setItem('refresh_token', refresh)
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refresh = null
      this.userLaboratories = []
      this.activeLaboratory = null
      this.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    },

    reset() {
      this.forgotPassword = false
    },

    setForgotPassword(value: boolean) {
      this.forgotPassword = value
    }
  }
})
```

### 6.2 Laboratory Store

**File: `webapp/stores/laboratory.ts`**
```typescript
import { defineStore } from 'pinia'
import { Laboratory, User } from '@/graphql/graphql'

interface LaboratoryState {
  laboratories: Laboratory[]
  currentLaboratory: Laboratory | null
  laboratoryUsers: Record<string, User[]>
  loading: boolean
}

export const useLaboratoryStore = defineStore('laboratory', {
  state: (): LaboratoryState => ({
    laboratories: [],
    currentLaboratory: null,
    laboratoryUsers: {},
    loading: false
  }),

  getters: {
    getLaboratoryById: (state) => (id: string) => {
      return state.laboratories.find(lab => lab.uid === id)
    },
    
    getLaboratoryUsers: (state) => (laboratoryUid: string) => {
      return state.laboratoryUsers[laboratoryUid] || []
    }
  },

  actions: {
    async fetchLaboratories() {
      this.loading = true
      try {
        const result = await getAllLaboratories()
        this.laboratories = result.data?.laboratoriesAll || []
      } catch (error) {
        console.error('Error fetching laboratories:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLaboratoryUsers(laboratoryUid: string) {
      try {
        const result = await getLaboratoryUsers({ laboratory_uid: laboratoryUid })
        this.laboratoryUsers[laboratoryUid] = result.data?.laboratoryUsers || []
      } catch (error) {
        console.error('Error fetching laboratory users:', error)
      }
    },

    async createLaboratory(laboratoryData: any) {
      try {
        const result = await createLaboratory({ laboratory: laboratoryData })
        
        if (result.data?.createLaboratory.__typename === 'LaboratoryType') {
          const newLab = result.data.createLaboratory
          this.laboratories.push(newLab)
          return newLab
        }
        
        throw new Error('Failed to create laboratory')
      } catch (error) {
        console.error('Error creating laboratory:', error)
        throw error
      }
    },

    async assignUsersToLaboratory(laboratoryUid: string, userUids: string[]) {
      try {
        await assignUserToLaboratories({
          user_uid: userUids[0], // This would need to be modified for bulk assignment
          laboratory_uids: [laboratoryUid]
        })
        
        // Refresh laboratory users
        await this.fetchLaboratoryUsers(laboratoryUid)
      } catch (error) {
        console.error('Error assigning users to laboratory:', error)
        throw error
      }
    }
  }
})
```

---

## Implementation Priority Order

### Phase 1: Core Backend (Week 1-2) 🔥 HIGH PRIORITY
1. **Laboratory Management GraphQL endpoints**
   - Create/Update/Delete laboratory mutations
   - Laboratory queries with proper access control
   
2. **User-Laboratory Association endpoints**
   - Assign/remove users to/from laboratories
   - Switch active laboratory mutation with JWT refresh

3. **Enhanced User Service methods**
   - Multi-laboratory assignment logic
   - Active laboratory switching with validation

### Phase 2: Frontend Context Switching (Week 2-3) 🔥 HIGH PRIORITY
1. **Laboratory Switcher Component**
   - Dropdown with user's assigned laboratories
   - Active laboratory indication
   - Smooth switching with loading states

2. **Auth Store Enhancement**
   - Multi-laboratory state management
   - Context switching methods
   - Token refresh handling

3. **Navigation Integration**
   - Header laboratory display
   - Context indicator

### Phase 3: Admin Interfaces (Week 3-4) 🟡 MEDIUM PRIORITY
1. **Laboratory Registration Admin**
   - Complete laboratory creation form
   - Organization assignment
   - Default settings configuration

2. **Enhanced User Administration**
   - Laboratory assignment in user forms
   - Multi-select laboratory picker
   - Laboratory-specific role assignment

3. **Laboratory Users Management**
   - Per-laboratory user listing
   - Bulk user assignment/removal
   - Role management per laboratory

### Phase 4: Registration Enhancement (Week 4-5) 🟡 MEDIUM PRIORITY
1. **User Registration Form Updates**
   - Laboratory assignment during registration
   - Default active laboratory selection
   - Role assignment per laboratory

2. **Registration Workflow Enhancement**
   - Validation for laboratory access
   - Default role assignment
   - Welcome email with laboratory info

### Phase 5: Advanced Features (Week 5-6) 🟢 LOW PRIORITY
1. **Bulk Operations**
   - Bulk user-laboratory assignments
   - Bulk role updates
   - Import/export functionality

2. **Enhanced Security & Validation**
   - Laboratory access audit logging
   - Advanced permission validation
   - Context switching rate limiting

3. **Performance Optimizations**
   - Laboratory data caching
   - Optimized queries for large datasets
   - Background sync for laboratory assignments

---

## Database Migration Requirements

### Optional Enhancements
```sql
-- Add timestamps and audit fields to laboratory_user table
ALTER TABLE laboratory_user ADD COLUMN assigned_at TIMESTAMP DEFAULT NOW();
ALTER TABLE laboratory_user ADD COLUMN assigned_by_uid VARCHAR REFERENCES user(uid);
ALTER TABLE laboratory_user ADD COLUMN role_in_laboratory VARCHAR DEFAULT 'user';

-- Add index for performance
CREATE INDEX idx_laboratory_user_lab_uid ON laboratory_user(laboratory_uid);
CREATE INDEX idx_laboratory_user_user_uid ON laboratory_user(user_uid);
```

### Validation Rules
1. User must have at least one laboratory assignment
2. Active laboratory must be in user's assigned laboratories
3. Cannot remove user from their active laboratory without reassigning
4. Laboratory must have at least one admin user
5. Super admin can access all laboratories regardless of assignments

---

## Testing Strategy

### Backend Tests
1. **Unit Tests**
   - User-laboratory assignment logic
   - Active laboratory switching validation
   - Laboratory creation with settings

2. **Integration Tests**
   - GraphQL mutation workflows
   - Multi-laboratory context switching
   - Permission validation across laboratories

### Frontend Tests
1. **Component Tests**
   - Laboratory switcher functionality
   - Registration form validation
   - Admin interface interactions

2. **E2E Tests**
   - Complete user registration with lab assignment
   - Laboratory context switching workflow
   - Admin laboratory management

---

## Security Considerations

### Access Control
- Users can only see/access their assigned laboratories
- Laboratory admins can manage users within their laboratory
- Organization admins can manage all laboratories in their organization
- Super admins have global access

### Context Validation
- JWT tokens include laboratory context
- Backend validates laboratory access on every request
- Context switching requires re-authentication
- Audit logging for all laboratory assignments and switches

### Data Isolation
- All lab-scoped data filtered by current laboratory context
- No cross-laboratory data leakage
- Proper tenant isolation maintained

This comprehensive plan provides a structured approach to implementing multi-laboratory user management while maintaining the existing security and architectural patterns of the Felicity LIMS system.