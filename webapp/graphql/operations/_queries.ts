import gql from 'graphql-tag';

export const GET_LABORATORY = gql`
    query getLaboratory($setupName: String! = "felicity") {
        laboratory(setupName: $setupName) {
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
    }
`;

export const GET_LABORATORY_SETTING = gql`
    query getLaboratorySetting($setupName: String! = "felicity") {
        laboratorySetting(setupName: $setupName) {
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
    }
`;

export const GET_ALL_USERS = gql`
    query userAll($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
        userAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                firstName
                lastName
                email
                isActive
                isSuperuser
                mobilePhone
                userName
                isBlocked
                groups {
                    uid
                    name
                    keyword
                    pages
                    permissions {
                        uid
                        action
                        target
                    }
                }
            }
        }
    }
`;

export const GET_GROUPS_AND_PERMISSIONS = gql`
    query groupsAndPermissions {
        groupAll {
            uid
            name
            keyword
            pages
            active
            permissions {
                uid
                action
                target
            }
        }

        permissionAll {
            uid
            action
            target
        }
    }
`;

export const GET_AUDIT_LOG_FOR_TARGET = gql`
    query getAuditLogs($targetType: String!, $targetUid: String!) {
        auditLogsFilter(targetType: $targetType, targetUid: $targetUid) {
            uid
            userUid
            targetType
            targetUid
            action
            stateBefore
            stateAfter
        }
    }
`;

export const GET_DEPARTMENTS = gql`
    query getAllDepartments {
        departmentAll {
            uid
            name
            code
            description
        }
    }
`;
