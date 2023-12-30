import gql from 'graphql-tag';

export const AUTHENTICATE_USER = gql`
    mutation AuthenticateUser($username: String!, $password: String!) {
        authenticateUser(password: $password, username: $username) {
            ... on AuthenticatedData {
                __typename
                token
                refresh
                tokenType
                user {
                    uid
                    firstName
                    lastName
                    groups {
                        permissions {
                            uid
                            action
                            target
                        }
                        uid
                        name
                        keyword
                        pages
                    }
                    preferenceUid
                    preference {
                        expandedMenu
                        theme
                        departments {
                            uid
                            name
                        }
                    }
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const REQUEST_PASSWORD_RESET = gql`
    mutation RequestPassReset($email: String!) {
        requestPasswordReset(email: $email) {
            ... on MessagesType {
            __typename
            message
            }
            ... on OperationError {
            __typename
            error
            suggestion
            }
        }
    }
`

export const VALIDATE_PASSWORD_RESET_TOKEN = gql`
    mutation ValidatePassResetToken($token: String!) {
        validatePasswordResetToken(token: $token) {
            ... on PasswordResetValidityType {
            __typename
            authUid
            username
            }
            ... on OperationError {
            __typename
            error
            suggestion
            }
        }
    }

`

export const RESET_PASSWORD = gql`
    mutation PasswordReset($username: String!, $authUid: String!, $password: String!, $passwordc: String!) {
        resetPassword(username:$username, authUid: $authUid, password: $password, passwordc:$passwordc) {
            ... on MessagesType {
            __typename
            message
            }
            ... on OperationError {
            __typename
            error
            suggestion
            }
        }
    }
`


export const REFRESH_TOKEN = gql`
    mutation TokenRefresh($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            ... on AuthenticatedData {
                __typename
                token
                refresh
                tokenType
                user {
                    uid
                    firstName
                    lastName
                    groups {
                        permissions {
                            uid
                            action
                            target
                        }
                        uid
                        name
                        keyword
                        pages
                    }
                    preferenceUid
                    preference {
                        expandedMenu
                        theme
                        departments {
                            uid
                            name
                        }
                    }
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($firstName: String!, $lastName: String!, $email: String!, $groupUid: String) {
        createUser(firstName: $firstName, lastName: $lastName, email: $email, groupUid: $groupUid) {
            ... on UserType {
                uid
                firstName
                lastName
                email
                isActive
                isSuperuser
                mobilePhone
                auth {
                    uid
                    userName
                    isBlocked
                    userType
                }
                groups {
                    permissions {
                        uid
                        action
                        target
                    }
                    uid
                    name
                    keyword
                    pages
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_USER = gql`
    mutation editUser(
        $userUid: String!
        $firstName: String!
        $lastName: String
        $email: String
        $groupUid: String
        $mobilePhone: String
        $isActive: Boolean
    ) {
        updateUser(
            userUid: $userUid
            firstName: $firstName
            lastName: $lastName
            email: $email
            groupUid: $groupUid
            mobilePhone: $mobilePhone
            isActive: $isActive
        ) {
            ... on UserType {
                uid
                firstName
                lastName
                email
                isActive
                isSuperuser
                mobilePhone
                auth {
                    uid
                    userName
                    isBlocked
                    userType
                }
                groups {
                    permissions {
                        uid
                        action
                        target
                    }
                    uid
                    name
                    keyword
                    pages
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const ADD_USER_AUTH = gql`
    mutation addUserAuth($userUid: String!, $userName: String!, $password: String!, $passwordc: String!) {
        createUserAuth(userUid: $userUid, userName: $userName, password: $password, passwordc: $passwordc) {
            ... on UserType {
                uid
                firstName
                lastName
                email
                isActive
                isSuperuser
                mobilePhone
                auth {
                    uid
                    userName
                    isBlocked
                    userType
                }
                groups {
                    permissions {
                        uid
                        action
                        target
                    }
                    uid
                    name
                    keyword
                    pages
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const EDIT_USER_AUTH = gql`
    mutation editUserAuth($userUid: String!, $userName: String!, $password: String!, $passwordc: String!) {
        updateUserAuth(userUid: $userUid, userName: $userName, password: $password, passwordc: $passwordc) {
            ... on UserType {
                uid
                firstName
                lastName
                email
                isActive
                isSuperuser
                mobilePhone
                auth {
                    uid
                    userName
                    isBlocked
                    userType
                }
                groups {
                    permissions {
                        uid
                        action
                        target
                    }
                    uid
                    name
                    keyword
                    pages
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const ADD_GROUP = gql`
    mutation addGroup($payload: GroupInputType!) {
        createGroup(payload: $payload) {
            ... on GroupType {
                __typename
                uid
                name
                pages
                permissions {
                    uid
                    action
                    target
                    active
                }
                active
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const UPDATE_GROUP = gql`
    mutation editGroup($uid: String!, $payload: GroupInputType!) {
        updateGroup(uid: $uid, payload: $payload) {
            ... on GroupType {
                __typename
                uid
                name
                pages
                permissions {
                    uid
                    action
                    target
                    active
                }
                active
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const UPDATE_GROUP_PERMS = gql`
    mutation updateGroupsAndPermissions($groupUid: String!, $permissionUid: String!) {
        updateGroupPermissions(groupUid: $groupUid, permissionUid: $permissionUid) {
            ... on UpdatedGroupPerms {
                group {
                    uid
                    name
                    pages
                    permissions {
                        uid
                        action
                        target
                        active
                    }
                    active
                }
                permission {
                    uid
                    action
                    target
                }
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const ADD_DEPARTMENT = gql`
    mutation addDepartment($payload: DepartmentInputType!) {
        createDepartment(payload: $payload) {
            ... on DepartmentType {
                uid
                name
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const UPDATE_DEPARTMENT = gql`
    mutation editDepartment($uid: String!, $payload: DepartmentInputType!) {
        updateDepartment(uid: $uid, payload: $payload) {
            ... on DepartmentType {
                uid
                name
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const UPDATE_LABORATOTY = gql`
    mutation editLaboratory($uid: String!, $payload: LaboratoryInputType!) {
        updateLaboratory(uid: $uid, payload: $payload) {
            ... on LaboratoryType {
                uid
                setupName
                labName
                tagLine
                labManagerUid
                email
                emailCc
                mobilePhone
                businessPhone
                address
                banking
                logo
                qualityStatement
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;

export const UPDATE_LABORATOTY_SETTING = gql`
    mutation editLaboratorySetting($uid: String!, $payload: LaboratorySettingInputType!) {
        updateLaboratorySetting(uid: $uid, payload: $payload) {
            ... on LaboratorySettingType {
                uid
                laboratoryUid
                allowSelfVerification
                allowPatientRegistration
                allowSampleRegistration
                allowWorksheetCreation
                defaultRoute
                passwordLifetime
                inactivityLogOut
                defaultTheme
                autoReceiveSamples
                stickerCopies
                allowBilling
                allowAutoBilling
                currency
                paymentTermsDays
            }
            ... on OperationError {
                __typename
                error
                suggestion
            }
        }
    }
`;
