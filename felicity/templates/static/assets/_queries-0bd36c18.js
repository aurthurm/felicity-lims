import{g as e}from"./index-5d85e9da.js";const a=e`
    query getOrganization {
        organization {
            uid
            name
            tagLine
            email
            emailCc
            mobilePhone
            businessPhone
            address
            banking
            logo
            qualityStatement
            settings {
                uid
                passwordLifetime
                inactivityLogOut
                allowBilling
                allowAutoBilling
                processBilledOnly
                minPaymentStatus
                minPartialPerentage
                currency
                paymentTermsDays
            }
        }
    }
`,i=e`
    query getLaboratory {
        laboratory {
            uid
            name
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
            settings {
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
                processBilledOnly
                minPaymentStatus
                minPartialPerentage
                currency
                paymentTermsDays
            }
        }
    }
`,r=e`
    query getAllLaboratories($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
        laboratoryAll(pageSize: $first, afterCursor: $after, text: $text, sortBy: $sortBy) {
            totalCount
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            items {
                uid
                name
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
                settings {
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
                    processBilledOnly
                    minPaymentStatus
                    minPartialPerentage
                    currency
                    paymentTermsDays
                }
            }
        }
    }
`,o=e`
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
                activeLaboratoryUid
                laboratories
            }
        }
    }
`,s=e`
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
`,n=e`
    query getAuditLogs($targetType: String!, $targetUid: String!) {
        auditLogsFilter(targetType: $targetType, targetUid: $targetUid) {
            uid
            userUid
            targetType
            targetUid
            action
            stateBefore
            stateAfter
            extras
        }
    }
`,l=e`
    query getAllDepartments {
        departmentAll {
            uid
            name
            code
            description
        }
    }
`;export{s as G,o as U,l as a,a as b,r as c,i as d,n as e};
