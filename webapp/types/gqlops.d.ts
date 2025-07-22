export type AuthenticateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type AuthenticateUserMutation = { __typename?: 'Mutation', authenticateUser: { __typename: 'AuthenticatedData', token: string, refresh: string, tokenType: string, user: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null, preference?: { __typename?: 'UserPreferenceType', uid: string, expandedMenu?: boolean | null, theme?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null } | null }, laboratories?: Array<{ __typename?: 'LaboratoryType', uid: string, name: string }> | null, activeLaboratory?: { __typename?: 'LaboratoryType', uid: string, name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type RequestPassResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPassResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename: 'MessagesType', message: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type ValidatePassResetTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type ValidatePassResetTokenMutation = { __typename?: 'Mutation', validatePasswordResetToken: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PasswordResetValidityType', username: string } };

export type PasswordResetMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type PasswordResetMutation = { __typename?: 'Mutation', resetPassword: { __typename: 'MessagesType', message: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type TokenRefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type TokenRefreshMutation = { __typename?: 'Mutation', refresh: { __typename: 'AuthenticatedData', token: string, refresh: string, tokenType: string, user: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null, preference?: { __typename?: 'UserPreferenceType', uid: string, expandedMenu?: boolean | null, theme?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null } | null } } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUserMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  groupUid?: InputMaybe<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordc: Scalars['String']['input'];
}>;


export type AddUserMutation = { __typename?: 'Mutation', createUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type EditUserMutationVariables = Exact<{
  userUid: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  groupUid?: InputMaybe<Scalars['String']['input']>;
  mobilePhone?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isBlocked?: InputMaybe<Scalars['Boolean']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  passwordc?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditUserMutation = { __typename?: 'Mutation', updateUser: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null } };

export type AddGroupMutationVariables = Exact<{
  payload: GroupInputType;
}>;


export type AddGroupMutation = { __typename?: 'Mutation', createGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGroupMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GroupInputType;
}>;


export type EditGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type UpdateGroupsAndPermissionsMutationVariables = Exact<{
  groupUid: Scalars['String']['input'];
  permissionUid: Scalars['String']['input'];
}>;


export type UpdateGroupsAndPermissionsMutation = { __typename?: 'Mutation', updateGroupPermissions: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UpdatedGroupPerms', group: { __typename?: 'GroupType', uid: string, name?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null, active?: boolean | null }> | null }, permission: { __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null } } };

export type AddDepartmentMutationVariables = Exact<{
  payload: DepartmentInputType;
}>;


export type AddDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDepartmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DepartmentInputType;
}>;


export type EditDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'DepartmentType', uid: string, name?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratoryInputType;
}>;


export type EditLaboratoryMutation = { __typename?: 'Mutation', updateLaboratory: { __typename?: 'LaboratoryType', uid: string, name: string, tagLine?: string | null, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, banking?: string | null, logo?: string | null, qualityStatement?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratorySettingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratorySettingInputType;
}>;


export type EditLaboratorySettingMutation = { __typename?: 'Mutation', updateLaboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null, allowBilling?: boolean | null, allowAutoBilling?: boolean | null, currency?: string | null, paymentTermsDays?: number | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetLaboratoryQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratoryQuery = { __typename?: 'Query', laboratory: { __typename?: 'LaboratoryType', uid: string, name: string, tagLine?: string | null, labManagerUid?: string | null, email?: string | null, emailCc?: string | null, mobilePhone?: string | null, businessPhone?: string | null, address?: string | null, banking?: string | null, logo?: string | null, qualityStatement?: string | null } };

export type GetLaboratorySettingQueryVariables = Exact<{
  setupName?: Scalars['String']['input'];
}>;


export type GetLaboratorySettingQuery = { __typename?: 'Query', laboratorySetting: { __typename?: 'LaboratorySettingType', uid: string, laboratoryUid: string, allowSelfVerification?: boolean | null, allowPatientRegistration?: boolean | null, allowSampleRegistration?: boolean | null, allowWorksheetCreation?: boolean | null, defaultRoute?: string | null, passwordLifetime?: number | null, inactivityLogOut?: number | null, defaultTheme?: string | null, autoReceiveSamples?: boolean | null, stickerCopies?: number | null, allowBilling?: boolean | null, allowAutoBilling?: boolean | null, currency?: string | null, paymentTermsDays?: number | null } };

export type UserAllQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UserAllQuery = { __typename?: 'Query', userAll: { __typename?: 'UserCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, isActive: boolean, isSuperuser: boolean, mobilePhone?: string | null, userName: string, isBlocked: boolean, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }> | null }> | null } };

export type GroupsAndPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupsAndPermissionsQuery = { __typename?: 'Query', groupAll: Array<{ __typename?: 'GroupType', uid: string, name?: string | null, keyword?: string | null, pages?: string | null, active?: boolean | null, permissions?: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> | null }>, permissionAll: Array<{ __typename?: 'PermissionType', uid: string, action?: string | null, target?: string | null }> };

export type GetAuditLogsQueryVariables = Exact<{
  targetType: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogsFilter?: Array<{ __typename?: 'AuditLogType', uid: string, userUid?: string | null, targetType?: string | null, targetUid?: string | null, action?: number | null, stateBefore?: never | null, stateAfter?: never | null }> | null };

export type GetAllDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDepartmentsQuery = { __typename?: 'Query', departmentAll: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null, code?: string | null, description?: string | null }> };

export type AddCountryMutationVariables = Exact<{
  payload: CountryInputType;
}>;


export type AddCountryMutation = { __typename?: 'Mutation', createCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCountryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CountryInputType;
}>;


export type EditCountryMutation = { __typename?: 'Mutation', updateCountry: { __typename: 'CountryType', uid: string, name?: string | null, code?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddProvinceMutationVariables = Exact<{
  payload: ProvinceInputType;
}>;


export type AddProvinceMutation = { __typename?: 'Mutation', createProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type EditProvinceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProvinceInputType;
}>;


export type EditProvinceMutation = { __typename?: 'Mutation', updateProvince: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProvinceType', uid: string, name?: string | null, code?: string | null, countryUid?: string | null } };

export type AddDistrictMutationVariables = Exact<{
  payload: DistrictInputType;
}>;


export type AddDistrictMutation = { __typename?: 'Mutation', createDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditDistrictMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DistrictInputType;
}>;


export type EditDistrictMutation = { __typename?: 'Mutation', updateDistrict: { __typename: 'DistrictType', uid: string, name?: string | null, code?: string | null, provinceUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCountriesQuery = { __typename?: 'Query', countryAll: Array<{ __typename?: 'CountryType', uid: string, name?: string | null, code?: string | null }> };

export type GetAllProvincesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProvincesQuery = { __typename?: 'Query', provinceAll: { __typename?: 'ProvinceCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ProvinceType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, countryUid?: string | null }> | null } };

export type FilterProvincesByCountryQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterProvincesByCountryQuery = { __typename?: 'Query', provincesByCountryUid: Array<{ __typename?: 'ProvinceType', name?: string | null, uid: string, code?: string | null, countryUid?: string | null }> };

export type GetAllDistrictsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllDistrictsQuery = { __typename?: 'Query', districtAll: { __typename?: 'DistrictCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'DistrictType', uid: string, name?: string | null, code?: string | null, email?: string | null, emailCc?: string | null, businessPhone?: string | null, mobilePhone?: string | null, provinceUid?: string | null }> | null } };

export type FilterDistrictsByProvinceQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type FilterDistrictsByProvinceQuery = { __typename?: 'Query', districtsByProvinceUid: Array<{ __typename?: 'DistrictType', name?: string | null, uid: string, code?: string | null, provinceUid?: string | null }> };

export type AddCodingStandardMutationVariables = Exact<{
  payload: CodingStandardInputType;
}>;


export type AddCodingStandardMutation = { __typename?: 'Mutation', createCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditCodingStandardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: CodingStandardInputType;
}>;


export type EditCodingStandardMutation = { __typename?: 'Mutation', updateCodingStandard: { __typename: 'CodingStandardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddSampleTypeMutationVariables = Exact<{
  payload: SampleTypeInputType;
}>;


export type AddSampleTypeMutation = { __typename?: 'Mutation', createSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type EditSampleTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeInputType;
}>;


export type EditSampleTypeMutation = { __typename?: 'Mutation', updateSampleType: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean } };

export type AddSampleTypeMappingMutationVariables = Exact<{
  payload: SampleTypeMappingInputType;
}>;


export type AddSampleTypeMappingMutation = { __typename?: 'Mutation', createSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditSampleTypeMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SampleTypeMappingInputType;
}>;


export type EditSampleTypeMappingMutation = { __typename?: 'Mutation', updateSampleTypeMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SampleTypeMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, sampleTypeUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type ReInstateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateSamplesMutation = { __typename?: 'Mutation', reInstateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type CloneSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CloneSamplesMutation = { __typename?: 'Mutation', cloneSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, parentId?: string | null, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> } };

export type CancelSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelSamplesMutation = { __typename?: 'Mutation', cancelSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type ReceiveSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReceiveSamplesMutation = { __typename?: 'Mutation', receiveSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string, status?: string | null }> } };

export type PublishSamplesMutationVariables = Exact<{
  samples: Array<SamplePublishInputType> | SamplePublishInputType;
}>;


export type PublishSamplesMutation = { __typename?: 'Mutation', publishSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', message?: string | null, samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, publishedByUid?: string | null, datePublished?: never | null }> } };

export type PrintSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type PrintSamplesMutation = { __typename?: 'Mutation', printSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type InvalidateSamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type InvalidateSamplesMutation = { __typename?: 'Mutation', invalidateSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type VerifySamplesMutationVariables = Exact<{
  samples: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type VerifySamplesMutation = { __typename?: 'Mutation', verifySamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null }> } };

export type RejectSamplesMutationVariables = Exact<{
  samples: Array<SampleRejectInputType> | SampleRejectInputType;
}>;


export type RejectSamplesMutation = { __typename?: 'Mutation', rejectSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'OperationSuccess' } | { __typename: 'SampleListingType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> } };

export type AddResultOptionMutationVariables = Exact<{
  payload: ResultOptionInputType;
}>;


export type AddResultOptionMutation = { __typename?: 'Mutation', createResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null } };

export type EditResultOptionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ResultOptionInputType;
}>;


export type EditResultOptionMutation = { __typename?: 'Mutation', updateResultOption: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null } };

export type AddAnalysisInterimMutationVariables = Exact<{
  payload: AnalysisInterimInput;
}>;


export type AddAnalysisInterimMutation = { __typename?: 'Mutation', createAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisInterimMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInterimInput;
}>;


export type EditAnalysisInterimMutation = { __typename?: 'Mutation', updateAnalysisInterim: { __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisCorrectionFactorMutationVariables = Exact<{
  payload: AnalysisCorrectionFactorInput;
}>;


export type AddAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', createAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCorrectionFactorMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCorrectionFactorInput;
}>;


export type EditAnalysisCorrectionFactorMutation = { __typename?: 'Mutation', updateAnalysisCorrectionFactor: { __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisUncertaintyMutationVariables = Exact<{
  payload: AnalysisUncertaintyInput;
}>;


export type AddAnalysisUncertaintyMutation = { __typename?: 'Mutation', createAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisUncertaintyMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisUncertaintyInput;
}>;


export type EditAnalysisUncertaintyMutation = { __typename?: 'Mutation', updateAnalysisUncertainty: { __typename?: 'AnalysisUncertaintyType', uid: string, value: number, min: number, max: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisDetectionLimitMutationVariables = Exact<{
  payload: AnalysisDetectionLimitInput;
}>;


export type AddAnalysisDetectionLimitMutation = { __typename?: 'Mutation', createAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisDetectionLimitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisDetectionLimitInput;
}>;


export type EditAnalysisDetectionLimitMutation = { __typename?: 'Mutation', updateAnalysisDetectionLimit: { __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisSpecificationMutationVariables = Exact<{
  payload: AnalysisSpecificationInput;
}>;


export type AddAnalysisSpecificationMutation = { __typename?: 'Mutation', createAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisSpecificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisSpecificationInput;
}>;


export type EditAnalysisSpecificationMutation = { __typename?: 'Mutation', updateAnalysisSpecification: { __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisServiceMutationVariables = Exact<{
  payload: AnalysisInputType;
}>;


export type AddAnalysisServiceMutation = { __typename?: 'Mutation', createAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisServiceMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisInputType;
}>;


export type EditAnalysisServiceMutation = { __typename?: 'Mutation', updateAnalysis: { __typename: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisMappingMutationVariables = Exact<{
  payload: AnalysisMappingInputType;
}>;


export type AddAnalysisMappingMutation = { __typename?: 'Mutation', createAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisMappingInputType;
}>;


export type EditAnalysisMappingMutation = { __typename?: 'Mutation', updateAnalysisMapping: { __typename?: 'AnalysisMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, analysisUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisProfileMutationVariables = Exact<{
  payload: ProfileInputType;
}>;


export type AddAnalysisProfileMutation = { __typename?: 'Mutation', createProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type EditAnalysisProfileMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileInputType;
}>;


export type EditAnalysisProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } };

export type AddProfileMappingMutationVariables = Exact<{
  payload: ProfileMappingInputType;
}>;


export type AddProfileMappingMutation = { __typename?: 'Mutation', createProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type EditProfileMappingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ProfileMappingInputType;
}>;


export type EditProfileMappingMutation = { __typename?: 'Mutation', updateProfileMapping: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ProfileMappingType', uid: string, name?: string | null, description?: string | null, code: string, codingStandardUid: string, profileUid: string, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null } };

export type AddAnalysisTemplateMutationVariables = Exact<{
  payload: AnalysisTemplateInputType;
}>;


export type AddAnalysisTemplateMutation = { __typename?: 'Mutation', createAnalysisTemplate: { __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisTemplateInputType;
}>;


export type EditAnalysisTemplateMutation = { __typename?: 'Mutation', updateAnalysisTemplate: { __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, active?: boolean | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditSampleApplyTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  analysisTemplateUid: Scalars['String']['input'];
}>;


export type EditSampleApplyTemplateMutation = { __typename?: 'Mutation', samplesApplyTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string }> } };

export type SampleManageAnalysisMutationVariables = Exact<{
  sampleUid: Scalars['String']['input'];
  payload: ManageAnalysisInputType;
}>;


export type SampleManageAnalysisMutation = { __typename?: 'Mutation', manageAnalyses: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ResultedSampleListingType', samples: Array<{ __typename?: 'SamplesWithResults', uid: string }> } };

export type AddAnalysisCategoryMutationVariables = Exact<{
  payload: AnalysisCategoryInputType;
}>;


export type AddAnalysisCategoryMutation = { __typename?: 'Mutation', createAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditAnalysisCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AnalysisCategoryInputType;
}>;


export type EditAnalysisCategoryMutation = { __typename?: 'Mutation', updateAnalysisCategory: { __typename?: 'AnalysisCategoryType', uid: string, name: string, active: boolean, description?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddAnalysisRequestMutationVariables = Exact<{
  payload: AnalysisRequestInputType;
}>;


export type AddAnalysisRequestMutation = { __typename?: 'Mutation', createAnalysisRequest: { __typename: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type SubmitAnalysisResultsMutationVariables = Exact<{
  analysisResults: Array<ArResultInputType> | ArResultInputType;
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type SubmitAnalysisResultsMutation = { __typename?: 'Mutation', submitAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOperationType', message?: string | null, isBackground: boolean, results?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, analysisUid?: string | null, laboratoryInstrumentUid?: string | null, methodUid?: string | null, result?: string | null, analystUid?: string | null, submittedByUid?: string | null, dateSubmitted?: never | null }> | null } };

export type CancelAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CancelAnalysisResultsMutation = { __typename?: 'Mutation', cancelAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type ReInstateAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReInstateAnalysisResultsMutation = { __typename?: 'Mutation', reInstateAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null }> } };

export type VerifyAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
  sourceObject: Scalars['String']['input'];
  sourceObjectUid: Scalars['String']['input'];
}>;


export type VerifyAnalysisResultsMutation = { __typename?: 'Mutation', verifyAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultOperationType', message?: string | null, isBackground: boolean, results?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, analysisUid?: string | null, laboratoryInstrumentUid?: string | null, methodUid?: string | null, result?: string | null, analystUid?: string | null, submittedByUid?: string | null, dateSubmitted?: never | null, dateVerified?: never | null, verifiedBy?: Array<{ __typename?: 'UserType', uid: string }> | null }> | null } };

export type RetractAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetractAnalysisResultsMutation = { __typename?: 'Mutation', retractAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type RetestAnalysisResultsMutationVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RetestAnalysisResultsMutation = { __typename?: 'Mutation', retestAnalysisResults: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'ResultListingType', results: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null } | null }> } };

export type AddQcLevelMutationVariables = Exact<{
  level: Scalars['String']['input'];
}>;


export type AddQcLevelMutation = { __typename?: 'Mutation', createQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type EditQcLevelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  level: Scalars['String']['input'];
}>;


export type EditQcLevelMutation = { __typename?: 'Mutation', updateQcLevel: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCLevelType', uid: string, level: string } };

export type AddQcTemplateMutationVariables = Exact<{
  payload: QcTemplateInputType;
}>;


export type AddQcTemplateMutation = { __typename?: 'Mutation', createQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type EditQcTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: QcTemplateInputType;
}>;


export type EditQcTemplateMutation = { __typename?: 'Mutation', updateQcTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> } };

export type AddQcRequestMutationVariables = Exact<{
  samples: Array<QcSetInputType> | QcSetInputType;
}>;


export type AddQcRequestMutation = { __typename?: 'Mutation', createQcSet: { __typename: 'CreateQCSetData', qcSets: Array<{ __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, status: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddRejectionReasonMutationVariables = Exact<{
  reason: Scalars['String']['input'];
}>;


export type AddRejectionReasonMutation = { __typename?: 'Mutation', createRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type EditRejectionReasonMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  reason: Scalars['String']['input'];
}>;


export type EditRejectionReasonMutation = { __typename?: 'Mutation', updateRejectionReason: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'RejectionReasonType', uid: string, reason: string } };

export type GetAllCodingStandardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCodingStandardsQuery = { __typename?: 'Query', codingStandardAll: Array<{ __typename?: 'CodingStandardType', uid: string, name: string, description?: string | null }> };

export type GetAllSampleTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSampleTypesQuery = { __typename?: 'Query', sampleTypeAll: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string, abbr: string, description?: string | null, active: boolean }> };

export type GeSampleTypeMappingsBySampleTypeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GeSampleTypeMappingsBySampleTypeUidQuery = { __typename?: 'Query', sampleTypeMappingsBySampleType: Array<{ __typename?: 'SampleTypeMappingType', uid: string, sampleTypeUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesServicesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllAnalysesServicesQuery = { __typename?: 'Query', analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, description?: string | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, description?: string | null } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetAnalysesServicesByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesServicesByUidQuery = { __typename?: 'Query', analysisByUid: { __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, description?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null } };

export type GetAllAnalysesProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesProfilesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', name: string, keyword?: string | null, active?: boolean | null, sortKey?: number | null }> | null }> };

export type GetAllAnalysesTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesTemplatesQuery = { __typename?: 'Query', analysisTemplateAll: Array<{ __typename?: 'AnalysisTemplateType', uid: string, name: string, description?: string | null, departmentUid?: string | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string }> | null }> };

export type GetAnalysisMappingsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysisMappingsByAnalysisUidQuery = { __typename?: 'Query', analysisMappingsByAnalysis: Array<{ __typename?: 'AnalysisMappingType', uid: string, analysisUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllProfilesAndServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfilesAndServicesQuery = { __typename?: 'Query', profileAll: Array<{ __typename?: 'ProfileType', uid: string, name: string, description?: string | null, keyword?: string | null, active: boolean, departmentUid?: string | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null, sortKey?: number | null, active?: boolean | null }> | null }>, analysisAll: { __typename?: 'AnalysisCursorPage', items?: Array<{ __typename?: 'AnalysisWithProfiles', uid: string, name: string, keyword?: string | null, active?: boolean | null, description?: string | null, sortKey?: number | null, tatLengthMinutes?: number | null, precision?: number | null, requiredVerifications?: number | null, selfVerification?: boolean | null, categoryUid?: string | null, departmentUid?: string | null, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null, specifications?: Array<{ __typename?: 'AnalysisSpecificationType', uid: string, analysisUid: string, unitUid?: string | null, min?: number | null, max?: number | null, minWarn?: number | null, maxWarn?: number | null, minReport?: string | null, maxReport?: string | null, warnValues?: string | null, warnReport?: string | null, gender?: string | null, ageMin?: number | null, ageMax?: number | null, methodUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string, description?: string | null } | null }> | null, uncertainties?: Array<{ __typename?: 'AnalysisUncertaintyType', uid: string, min: number, max: number, value: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, detectionLimits?: Array<{ __typename?: 'AnalysisDetectionLimitType', uid: string, lowerLimit: number, upperLimit: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, correctionFactors?: Array<{ __typename?: 'AnalysisCorrectionFactorType', uid: string, factor: number, analysisUid: string, instrumentUid: string, methodUid: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, keyword?: string | null, description?: string | null }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, category?: { __typename?: 'AnalysisCategoryType', uid: string, name: string } | null, profiles?: Array<{ __typename?: 'ProfileType', uid: string, name: string }> | null }> | null } };

export type GetProfileMappingsByProfileUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetProfileMappingsByProfileUidQuery = { __typename?: 'Query', profileMappingsByProfile: Array<{ __typename?: 'ProfileMappingType', uid: string, profileUid: string, codingStandardUid: string, name?: string | null, code: string, description?: string | null, codingStandard?: { __typename?: 'CodingStandardType', name: string } | null }> };

export type GetAllAnalysesCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnalysesCategoriesQuery = { __typename?: 'Query', analysisCategoryAll: Array<{ __typename?: 'AnalysisCategoryType', uid: string, name: string, description?: string | null, active: boolean, departmentUid?: string | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> };

export type GetAllSamplesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  clientUid: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllSamplesQuery = { __typename?: 'Query', sampleAll: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, createdByUid?: string | null, createdAt?: string | null, dateCollected?: never | null, dateReceived?: never | null, dateSubmitted?: never | null, dateVerified?: never | null, datePublished?: never | null, datePrinted?: never | null, dateStored?: never | null, printed?: boolean | null, dueDate?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }>, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }> | null } };

export type GetSamplesForShipmentAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid?: InputMaybe<Scalars['String']['input']>;
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetSamplesForShipmentAssignQuery = { __typename?: 'Query', samplesForShipmentAssign: { __typename?: 'SampleCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, dateReceived?: never | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, status?: string | null, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null }> | null } };

export type GetAnalysesRequestsByPatientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByPatientUidQuery = { __typename?: 'Query', analysisRequestsByPatientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, requestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> };

export type GetAnalysesRequestsByClientUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesRequestsByClientUidQuery = { __typename?: 'Query', analysisRequestsByClientUid: Array<{ __typename?: 'AnalysisRequestWithSamples', uid: string, clientRequestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> };

export type GetAnalysesResultsBySampleUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsBySampleUidQuery = { __typename?: 'Query', analysisResultBySampleUid: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, dateSubmitted?: never | null, dueDate?: string | null, dateVerified?: never | null, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, worksheetUid?: string | null, worksheetId?: string | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null }, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, sortKey?: number | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string, analysisUid: string, instrumentUid: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, submittedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string } | null, verifiedBy?: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string }> | null }> };

export type GetAnalysesResultsForWsAssignQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  analysisUid: Scalars['String']['input'];
  sampleTypeUid: Scalars['String']['input'];
}>;


export type GetAnalysesResultsForWsAssignQuery = { __typename?: 'Query', analysisResultsForWsAssign: { __typename?: 'AnalysisResultCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'AnalysisResultType', uid: string, assigned: boolean, sampleUid: string, status?: string | null, analysisUid?: string | null, sample: { __typename?: 'SampleType', sampleId: string, priority: number, status?: string | null, dateReceived?: never | null, createdAt?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null }, analysis?: { __typename?: 'AnalysisType', name: string } | null }> | null } };

export type GetAnalysisResultMutationQueryVariables = Exact<{
  resultUid: Scalars['String']['input'];
}>;


export type GetAnalysisResultMutationQuery = { __typename?: 'Query', resultMutationByResultUid?: { __typename?: 'ResultMutationType', uid: string, resultUid: string, before: string, after: string, mutation: string, date?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null, userName: string } | null } | null };

export type GetSampleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSampleByUidQuery = { __typename?: 'Query', sampleByUid: { __typename?: 'SampleType', uid: string, createdByUid?: string | null, createdAt?: string | null, dateReceived?: never | null, receivedByUid?: string | null, dateCollected?: never | null, dateSubmitted?: never | null, submittedByUid?: string | null, dateVerified?: never | null, verifiedByUid?: string | null, datePublished?: never | null, datePrinted?: never | null, printedByUid?: string | null, dateInvalidated?: never | null, invalidatedByUid?: string | null, dateCancelled?: never | null, cancelledByUid?: string | null, dueDate?: string | null, sampleId: string, priority: number, status?: string | null, dateStored?: never | null, storageSlot?: string | null, storageContainerUid?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, client?: { __typename?: 'ClientType', uid: string, name: string } | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, storageContainer?: { __typename?: 'StorageContainerType', uid: string, name: string, storageSection?: { __typename?: 'StorageSectionType', uid: string, name: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, name: string, storeRoom?: { __typename?: 'StoreRoomType', uid: string, name: string } | null } | null } | null } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }>, rejectionReasons?: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> | null } };

export type GetSampleParentIdQueryVariables = Exact<{
  parentId: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSampleParentIdQuery = { __typename?: 'Query', sampleByParentId: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null }> };

export type GetSamplesByStorageContainerUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSamplesByStorageContainerUidQuery = { __typename?: 'Query', samplesByStorageContainerUid: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, storageSlot?: string | null, storageSlotIndex?: number | null, storageContainerUid?: string | null, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string } | null }> };

export type GetAllQcLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcLevelsQuery = { __typename?: 'Query', qcLevelAll: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> };

export type GetAllQcTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllQcTemplatesQuery = { __typename?: 'Query', qcTemplateAll: Array<{ __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }>, departments: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> }> };

export type GetQcSeTsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetQcSeTsQuery = { __typename?: 'Query', qcSetAll: { __typename?: 'QCSetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, items?: Array<{ __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, status: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdByUid?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null, userName: string } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null }> | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> | null }> | null } };

export type GetQcSetByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetQcSetByUidQuery = { __typename?: 'Query', qcSetByUid: { __typename?: 'QCSetWithSamples', uid: string, name: string, note: string, createdAt?: string | null, samples?: Array<{ __typename?: 'SamplesWithResults', uid: string, sampleId: string, status?: string | null, createdAt?: string | null, updatedAt?: string | null, assigned: boolean, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, status?: string | null, sampleUid: string, result?: string | null, analysisUid?: string | null, retest: boolean, reportable: boolean, dateSubmitted?: never | null, dateVerified?: never | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string }> | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, submittedBy?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, verifiedBy?: Array<{ __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null }> | null }> | null }> | null } };

export type GetReferenceRunsQueryVariables = Exact<{
  analyses: Array<Scalars['String']['input']> | Scalars['String']['input'];
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
}>;


export type GetReferenceRunsQuery = { __typename?: 'Query', qcChartData: Array<{ __typename?: 'AnalysisResultType', result?: string | null, dateVerified?: never | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null, sample: { __typename?: 'SampleType', qcLevel?: { __typename?: 'QCLevelType', level: string } | null } }> };

export type ResultOptionsByAnalysisUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ResultOptionsByAnalysisUidQuery = { __typename?: 'Query', resultOptionsByAnalysisUid: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string, analysisUid: string, sampleTypes?: Array<{ __typename?: 'SampleTypeTyp', uid: string, name: string }> | null }> };

export type GetAllRejectionReasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRejectionReasonsQuery = { __typename?: 'Query', rejectionReasonsAll: Array<{ __typename?: 'RejectionReasonType', uid: string, reason: string }> };

export type ImpressSamplesMetaQueryVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressSamplesMetaQuery = { __typename?: 'Query', impressReportsMeta: Array<{ __typename?: 'ReportImpressType', uid: string, state?: string | null, sampleUid?: string | null, jsonContent?: never | null, emailRequired?: boolean | null, emailSent?: boolean | null, smsRequired?: boolean | null, smsSent?: boolean | null, generatedByUid?: string | null, createdAt: never, sample?: { __typename?: 'SampleType', sampleId: string } | null, generatedBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> };

export type ImpressSampleReportsQueryVariables = Exact<{
  sampleIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ImpressSampleReportsQuery = { __typename?: 'Query', impressReportsDownload?: never | null };

export type ImpressSampleReportQueryVariables = Exact<{
  impressUid: Scalars['String']['input'];
}>;


export type ImpressSampleReportQuery = { __typename?: 'Query', impressReportDownload?: never | null };

export type BarcodeSamplesQueryVariables = Exact<{
  sampleUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type BarcodeSamplesQuery = { __typename?: 'Query', barcodeSamples?: Array<never> | null };

export type EditProfilePricingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceInput;
}>;


export type EditProfilePricingMutation = { __typename?: 'Mutation', updateProfilePrice: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProfilePriceType', uid: string, isActive: boolean, amount: number } };

export type EditAnalysisPricingMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceInput;
}>;


export type EditAnalysisPricingMutation = { __typename?: 'Mutation', updateAnalysisPrice: { __typename: 'AnalysisPriceType', uid: string, isActive: boolean, amount: number } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditProfileDiscountMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceDiscountInput;
}>;


export type EditProfileDiscountMutation = { __typename?: 'Mutation', updateProfileDiscount: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ProfileDiscountType', uid: string, profileUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean } };

export type EditAnalysisDiscountMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PriceDiscountInput;
}>;


export type EditAnalysisDiscountMutation = { __typename?: 'Mutation', updateAnalysisDiscount: { __typename: 'AnalysisDiscountType', uid: string, analysisUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddVoucherMutationVariables = Exact<{
  payload: VoucherInput;
}>;


export type AddVoucherMutation = { __typename?: 'Mutation', createVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null } };

export type EditVoucherMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: VoucherInput;
}>;


export type EditVoucherMutation = { __typename?: 'Mutation', updateVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null } };

export type AddVoucherCodeMutationVariables = Exact<{
  payload: VoucherCodeInput;
}>;


export type AddVoucherCodeMutation = { __typename?: 'Mutation', createVoucherCode: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null } };

export type EditVoucherCodeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: VoucherCodeInput;
}>;


export type EditVoucherCodeMutation = { __typename?: 'Mutation', updateVoucherCode: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null } };

export type AddTestBillTransactionMutationVariables = Exact<{
  payload: BillTransactionInput;
}>;


export type AddTestBillTransactionMutation = { __typename?: 'Mutation', createTestBillTransaction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type ConfirmTestBillTransactionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type ConfirmTestBillTransactionMutation = { __typename?: 'Mutation', confirmTestBillTransaction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type ApplyBillVoucherMutationVariables = Exact<{
  payload: ApplyVoucherInput;
}>;


export type ApplyBillVoucherMutation = { __typename?: 'Mutation', applyVoucher: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null } };

export type GetPiceForProfileQueryVariables = Exact<{
  profileUid: Scalars['String']['input'];
}>;


export type GetPiceForProfileQuery = { __typename?: 'Query', priceForProfile?: { __typename?: 'ProfilePriceType', uid: string, profileUid: string, isActive: boolean, amount: number } | null };

export type GetPriceForAnalysisQueryVariables = Exact<{
  analysisUid: Scalars['String']['input'];
}>;


export type GetPriceForAnalysisQuery = { __typename?: 'Query', priceForAnalysis?: { __typename?: 'AnalysisPriceType', uid: string, analysisUid: string, isActive: boolean, amount: number } | null };

export type GetDiscountForProfileQueryVariables = Exact<{
  profileUid: Scalars['String']['input'];
}>;


export type GetDiscountForProfileQuery = { __typename?: 'Query', discountForProfile?: { __typename?: 'ProfileDiscountType', uid: string, profileUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean, voucher?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string } | null } | null };

export type GetDiscountForAnalysisQueryVariables = Exact<{
  analysisUid: Scalars['String']['input'];
}>;


export type GetDiscountForAnalysisQuery = { __typename?: 'Query', discountForAnalysis?: { __typename?: 'AnalysisDiscountType', uid: string, analysisUid: string, name: string, discountType: string, valueType: string, startDate: never, endDate: never, voucherUid?: string | null, valuePercent: number, valueAmount: number, isActive: boolean, voucher?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string } | null } | null };

export type GetAllVouchersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllVouchersQuery = { __typename?: 'Query', voucherAll?: Array<{ __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, codes?: Array<{ __typename?: 'VoucherCodeType', uid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null }> | null };

export type GetVoucherByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetVoucherByUidQuery = { __typename?: 'Query', voucherByUid?: { __typename?: 'VoucherType', uid: string, name: string, usageLimit: number, used: number, startDate: string, endDate: string, oncePerCustomer: boolean, oncePerOrder: boolean, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, codes?: Array<{ __typename?: 'VoucherCodeType', uid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null } | null };

export type GetVoucherCodesQueryVariables = Exact<{
  voucherUid: Scalars['String']['input'];
}>;


export type GetVoucherCodesQuery = { __typename?: 'Query', voucherCodes?: Array<{ __typename?: 'VoucherCodeType', uid: string, voucherUid: string, code: string, usageLimit: number, used: number, isActive: boolean, createdAt: string, createdByUid?: string | null, updatedAt: string, updatedByUid?: string | null }> | null };

export type GetBillsForPatientQueryVariables = Exact<{
  patientUid: Scalars['String']['input'];
}>;


export type GetBillsForPatientQuery = { __typename?: 'Query', billsForPatient?: Array<{ __typename?: 'TestBillType', uid: string, billId: string, patientUid: string, clientUid: string, isActive: boolean, toConfirm: boolean, partial: boolean, totalCharged: number, totalPaid: number, createdAt?: string | null, updatedAt?: string | null, client: { __typename?: 'ClientType', name: string }, orders?: Array<{ __typename?: 'AnalysisRequestType', uid: string, requestId: string, clientRequestId: string }> | null }> | null };

export type GetBillsForClientQueryVariables = Exact<{
  clientUid: Scalars['String']['input'];
}>;


export type GetBillsForClientQuery = { __typename?: 'Query', billsForClient?: Array<{ __typename?: 'TestBillType', uid: string, billId: string, patientUid: string, clientUid: string, isActive: boolean, toConfirm: boolean, partial: boolean, totalCharged: number, totalPaid: number, createdAt?: string | null, updatedAt?: string | null, client: { __typename?: 'ClientType', name: string }, orders?: Array<{ __typename?: 'AnalysisRequestType', uid: string, requestId: string, clientRequestId: string }> | null }> | null };

export type GetBillTransactionsQueryVariables = Exact<{
  billUid: Scalars['String']['input'];
}>;


export type GetBillTransactionsQuery = { __typename?: 'Query', billTransactions?: Array<{ __typename?: 'TestBillTransactionType', uid: string, testBillUid: string, kind: string, amount: number, isSuccess: boolean, actionRequired: boolean, processed: boolean, notes: string, createdAt?: string | null, createdByUid?: string | null }> | null };

export type ImpressBillingReportQueryVariables = Exact<{
  billUid: Scalars['String']['input'];
}>;


export type ImpressBillingReportQuery = { __typename?: 'Query', billInvoiceCreate?: never | null };

export type GetOrdersByBillUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetOrdersByBillUidQuery = { __typename?: 'Query', ordersByBillUid: Array<{ __typename?: 'AnalysisRequestType', uid: string, clientRequestId: string, requestId: string, createdAt?: string | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, gender?: string | null, dateOfBirth?: never | null, age?: number | null, ageDobEstimated: boolean, consentSms: boolean }, samples: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, sortKey?: number | null }> | null, profiles: Array<{ __typename?: 'ProfileType', uid: string, name: string }> }> }> };

export type AddClientMutationVariables = Exact<{
  payload: ClientInputType;
}>;


export type AddClientMutation = { __typename?: 'Mutation', createClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientInputType;
}>;


export type EditClientMutation = { __typename?: 'Mutation', updateClient: { __typename: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddClientContactMutationVariables = Exact<{
  payload: ClientContactInputType;
}>;


export type AddClientContactMutation = { __typename?: 'Mutation', createClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ClientContactInputType;
}>;


export type EditClientContactMutation = { __typename?: 'Mutation', updateClientContact: { __typename: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteClientContactMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteClientContactMutation = { __typename?: 'Mutation', deleteClientContact: { __typename?: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetAllClientsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllClientsQuery = { __typename?: 'Query', clientAll: { __typename?: 'ClientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, contacts?: Array<{ __typename?: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean }> | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> | null } };

export type SearchClientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchClientsQuery = { __typename?: 'Query', clientSearch: Array<{ __typename?: 'ClientType', uid: string, name: string, code: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null }> };

export type GetClientContactsByClientUidQueryVariables = Exact<{
  clientUid: Scalars['String']['input'];
}>;


export type GetClientContactsByClientUidQuery = { __typename?: 'Query', clientContactByClientUid: Array<{ __typename?: 'ClientContactType', uid: string, firstName?: string | null, lastName?: string | null, email?: string | null, mobilePhone?: string | null, consentSms: boolean }> };

export type GetClientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetClientByUidQuery = { __typename?: 'Query', clientByUid: { __typename?: 'ClientType', uid: string, name: string, code: string, districtUid?: string | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, provinceUid?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, countryUid?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } };

export type GetSampleGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleGroupByStatusQuery = { __typename?: 'Query', countSampleGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetExtrasGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExtrasGroupByStatusQuery = { __typename?: 'Query', countExtrasGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAnalysisGroupByStatusQuery = { __typename?: 'Query', countAnalyteGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetWorksheetGroupByStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorksheetGroupByStatusQuery = { __typename?: 'Query', countWorksheetGroupByStatus: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type GetAnalysisGroupByInstrumentQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisGroupByInstrumentQuery = { __typename?: 'Query', countAnalyteGroupByInstrument: { __typename?: 'GroupedCounts', data: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> } };

export type SampleProcessPeformanceQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleProcessPeformanceQuery = { __typename?: 'Query', sampleProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, counts?: { __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null } | null }> } };

export type GetAnalysisProcessPeformanceQueryVariables = Exact<{
  process: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type GetAnalysisProcessPeformanceQuery = { __typename?: 'Query', analysisProcessPerformance: { __typename: 'ProcessStatistics', data: Array<{ __typename?: 'ProcessData', process: string, groups?: Array<{ __typename?: 'ProcessCounts', totalSamples?: number | null, totalLate?: number | null, totalNotLate?: number | null, processAverage?: number | null, avgExtraDays?: number | null, service?: string | null }> | null }> } };

export type SampleGroupByActionQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;


export type SampleGroupByActionQuery = { __typename?: 'Query', countSampleGroupByAction: { __typename: 'GroupedData', data: Array<{ __typename: 'GroupData', group: string, counts?: Array<{ __typename: 'GroupCount', group: string, count?: number | null }> | null }> } };

export type GetSampleLaggardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSampleLaggardsQuery = { __typename?: 'Query', sampleLaggards: { __typename: 'LaggardStatistics', data: Array<{ __typename: 'LaggardData', category: string, counts?: { __typename: 'LaggardCounts', totalIncomplete?: number | null, totalDelayed?: number | null, totalNotDelayed?: number | null, lessThanTen?: number | null, tenToTwenty?: number | null, twentyToThirty?: number | null, graterThanThirty?: number | null } | null }> } };

export type AddDocumentFolderMutationVariables = Exact<{
  payload: DocumentFolderInputType;
}>;


export type AddDocumentFolderMutation = { __typename?: 'Mutation', createDocumentFolder: { __typename?: 'DocumentFolderType', uid: string, name: string, parentUid?: string | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type AddDocumentMutationVariables = Exact<{
  payload: DocumentInputType;
}>;


export type AddDocumentMutation = { __typename?: 'Mutation', createDocument: { __typename?: 'DocumentType', uid: string, name: string, documentId: string, folderUid?: string | null, createdAt?: string | null, updatedAt?: string | null, latestVersion?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, thumbnail?: string | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type EditDocumentVersionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: DocumentVersionUpdateInputType;
}>;


export type EditDocumentVersionMutation = { __typename?: 'Mutation', updateDocumentVersion: { __typename?: 'DocumentVersionType', uid: string, thumbnail?: string | null } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type GetDocumentFolderAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDocumentFolderAllQuery = { __typename?: 'Query', documentFolderAll: { __typename?: 'DocumentFolderCursorPage', items?: Array<{ __typename?: 'DocumentFolderType', uid: string, name: string, parentUid?: string | null }> | null } };

export type GetDocumentAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  folderUid?: InputMaybe<Scalars['String']['input']>;
  categoryUid?: InputMaybe<Scalars['String']['input']>;
  tagUid?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  authorUid?: InputMaybe<Scalars['String']['input']>;
  readerUid?: InputMaybe<Scalars['String']['input']>;
  departmentUid?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetDocumentAllQuery = { __typename?: 'Query', documentAll: { __typename?: 'DocumentCursorPage', items?: Array<{ __typename?: 'DocumentType', uid: string, name: string, documentId: string, folderUid?: string | null, createdAt?: string | null, updatedAt?: string | null, latestVersion?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, thumbnail?: string | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetDocumentVersionByBidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetDocumentVersionByBidQuery = { __typename?: 'Query', documentVersionByUid?: { __typename?: 'DocumentVersionType', uid: string, content: string, editor: string, versionNumber: string, changeSummary?: string | null, thumbnail?: string | null, createdAt?: string | null, document?: { __typename?: 'DocumentType', uid: string, name: string, documentId: string, createdAt?: string | null, updatedAt?: string | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | null, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null } | null };

export type AddGrindErrandMutationVariables = Exact<{
  payload: GrindCreateErrandInput;
}>;


export type AddGrindErrandMutation = { __typename?: 'Mutation', createGrindErrand: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, posterUid?: string | null, createdByUid?: string | null, createdAt?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindErrandMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateErrandInput;
}>;


export type EditGrindErrandMutation = { __typename?: 'Mutation', updateGrindErrand: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string }>, label?: { __typename?: 'GrindLabelType', uid: string } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindErrandDiscussionMutationVariables = Exact<{
  payload: GrindCreateErrandDiscussionInput;
}>;


export type AddGrindErrandDiscussionMutation = { __typename?: 'Mutation', createGrindErrandDiscussion: { __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindErrandDiscussionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateErrandDiscussionInput;
}>;


export type EditGrindErrandDiscussionMutation = { __typename?: 'Mutation', updateGrindErrandDiscussion: { __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindMilestoneMutationVariables = Exact<{
  payload: GrindCreateMilestoneInput;
}>;


export type AddGrindMilestoneMutation = { __typename?: 'Mutation', createGrindMilestone: { __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindMilestoneMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateMilestoneInput;
}>;


export type EditGrindMilestoneMutation = { __typename?: 'Mutation', updateGrindMilestone: { __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteMilestoneMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteMilestoneMutation = { __typename?: 'Mutation', deleteGrindMilestone: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError' } };

export type AddGrindSchemeMutationVariables = Exact<{
  payload: GrindCreateSchemeInput;
}>;


export type AddGrindSchemeMutation = { __typename?: 'Mutation', createGrindScheme: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindSchemeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateSchemeInput;
}>;


export type EditGrindSchemeMutation = { __typename?: 'Mutation', updateGrindScheme: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindBoardMutationVariables = Exact<{
  payload: GrindCreateBoardInput;
}>;


export type AddGrindBoardMutation = { __typename?: 'Mutation', createGrindBoard: { __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null, createdAt?: string | null, scheme?: { __typename?: 'GrindSchemeType', uid: string, title: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditGrindBoardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: GrindUpdateBoardInput;
}>;


export type EditGrindBoardMutation = { __typename?: 'Mutation', updateGrindBoard: { __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindPosterMutationVariables = Exact<{
  payload: GrindCreatePosterInput;
}>;


export type AddGrindPosterMutation = { __typename?: 'Mutation', createGrindPoster: { __typename?: 'GrindPosterType', uid: string, title?: string | null, errands: Array<{ __typename?: 'GrindErrandType', uid: string }> } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindLabelMutationVariables = Exact<{
  payload: GrindCreateLabelInput;
}>;


export type AddGrindLabelMutation = { __typename?: 'Mutation', createGrindLabel: { __typename?: 'GrindLabelType', uid: string, title: string, category?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindStampMutationVariables = Exact<{
  payload: GrindCreateStampInput;
}>;


export type AddGrindStampMutation = { __typename?: 'Mutation', createGrindStamp: { __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddGrindMediaMutationVariables = Exact<{
  payload: GrindCreateMediaInput;
}>;


export type AddGrindMediaMutation = { __typename?: 'Mutation', createGrindMedia: { __typename?: 'GrindMediaType', uid: string, target?: string | null, targetUid?: string | null, filename?: string | null, originalName?: string | null, path?: string | null, size?: string | null, mimetype?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteGrindMediaMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteGrindMediaMutation = { __typename?: 'Mutation', deleteGrindMedia: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError' } };

export type GetGrindErrandsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindErrandsQuery = { __typename?: 'Query', grindErrandAll: { __typename?: 'GrindErrandCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, milestonesAt: number, createdAt?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string, title?: string | null } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, label?: { __typename?: 'GrindLabelType', uid: string, title: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }> }> | null } };

export type GetGrindErrandQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetGrindErrandQuery = { __typename?: 'Query', grindErrandByUid?: { __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, category?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, posterUid?: string | null, milestonesAt: number, labelUid?: string | null, createdAt?: string | null, poster?: { __typename?: 'GrindPosterType', uid: string, title?: string | null } | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, label?: { __typename?: 'GrindLabelType', uid: string, title: string } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, reporter?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | null };

export type GetGrindErrandDiscussionsQueryVariables = Exact<{
  errandUid: Scalars['String']['input'];
}>;


export type GetGrindErrandDiscussionsQuery = { __typename?: 'Query', grindErrandDiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, subdiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindErrandDiscussionsByParentQueryVariables = Exact<{
  parentUid: Scalars['String']['input'];
}>;


export type GetGrindErrandDiscussionsByParentQuery = { __typename?: 'Query', grindErrandDiscussionsByParent: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null, canEdit: boolean, createdAt?: string | null, createdByUid?: string | null, subdiscussions: Array<{ __typename?: 'GrindErrandDiscussionType', uid: string, comment: string, errandUid?: string | null, parentUid?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindOccurrenciesByTargetQueryVariables = Exact<{
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetGrindOccurrenciesByTargetQuery = { __typename?: 'Query', grindOccurrencesByTarget: Array<{ __typename?: 'GrindOccurrenceType', uid: string, description?: string | null, target?: string | null, targetUid?: string | null, createdAt?: string | null, actor?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindMilestonesByErrandQueryVariables = Exact<{
  errandUid: Scalars['String']['input'];
}>;


export type GetGrindMilestonesByErrandQuery = { __typename?: 'Query', grindMilestonesByErrand: Array<{ __typename?: 'GrindMilestoneType', uid: string, title?: string | null, description?: string | null, createdAt?: string | null, complete?: boolean | null, errand?: { __typename?: 'GrindErrandType', uid: string } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindMediaQueryVariables = Exact<{
  target: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetGrindMediaQuery = { __typename?: 'Query', grindMediaByTarget: Array<{ __typename?: 'GrindMediaType', uid: string, target?: string | null, targetUid?: string | null, destination?: string | null, encoding?: string | null, filename?: string | null, mimetype?: string | null, originalName?: string | null, path?: string | null, size?: string | null, createdAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> };

export type GetGrindSchemeAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindSchemeAllQuery = { __typename?: 'Query', grindSchemeAll: { __typename?: 'GrindSchemeCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetGrindSchemeQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetGrindSchemeQuery = { __typename?: 'Query', grindSchemeByUid?: { __typename?: 'GrindSchemeType', uid: string, title: string, description?: string | null, startDate?: string | null, endDate?: string | null, createdAt?: string | null, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }>, boards: Array<{ __typename?: 'GrindBoardType', uid: string, title: string, description?: string | null }>, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } | null };

export type GetGrindPostersByBoardQueryVariables = Exact<{
  boardUid: Scalars['String']['input'];
}>;


export type GetGrindPostersByBoardQuery = { __typename?: 'Query', grindPostersByBoard: Array<{ __typename?: 'GrindPosterType', uid: string, title?: string | null, boardUid?: string | null, errands: Array<{ __typename?: 'GrindErrandType', uid: string, title?: string | null, description?: string | null, priority?: string | null, startDate?: string | null, endDate?: string | null, progress?: number | null, posterUid?: string | null, milestonesAt: number, labelUid?: string | null, stamps: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null }>, assignee?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }> }> }> };

export type GetGrindStampAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindStampAllQuery = { __typename?: 'Query', grindStampAll: { __typename?: 'GrindStampCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null }> | null } };

export type GetGrindStampByCategoryQueryVariables = Exact<{
  category: StampCategory;
}>;


export type GetGrindStampByCategoryQuery = { __typename?: 'Query', grindStampByCategory: Array<{ __typename?: 'GrindStampType', uid: string, title?: string | null, category?: string | null }> };

export type GetGrindLabelAllQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetGrindLabelAllQuery = { __typename?: 'Query', grindLabelAll: { __typename?: 'GrindLabelCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'GrindLabelType', uid: string, title: string, category?: string | null }> | null } };

export type DownloadGrindMediaFileUrlQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DownloadGrindMediaFileUrlQuery = { __typename?: 'Query', downloadGrindMediaFileUrl: { __typename?: 'FileUrlResponseType', uid: string, mimetype: string, filename: string, downloadUrl: string } };

export type DownloadGrindMediaFileQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DownloadGrindMediaFileQuery = { __typename?: 'Query', downloadGrindMediaFile: { __typename?: 'FileResponseType', uid: string, filename: string, mimetype: string, content: string, size: number } };

export type AddSupplierMutationVariables = Exact<{
  payload: SupplierInputType;
}>;


export type AddSupplierMutation = { __typename?: 'Mutation', createSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type EditSupplierMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SupplierInputType;
}>;


export type EditSupplierMutation = { __typename?: 'Mutation', updateSupplier: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null } };

export type AddManufacturerMutationVariables = Exact<{
  payload: ManufacturerInputType;
}>;


export type AddManufacturerMutation = { __typename?: 'Mutation', createManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditManufacturerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ManufacturerInputType;
}>;


export type EditManufacturerMutation = { __typename?: 'Mutation', updateManufacturer: { __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentTypeMutationVariables = Exact<{
  payload: InstrumentTypeInputType;
}>;


export type AddInstrumentTypeMutation = { __typename?: 'Mutation', createInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentTypeInputType;
}>;


export type EditInstrumentTypeMutation = { __typename?: 'Mutation', updateInstrumentType: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddInstrumentMutationVariables = Exact<{
  payload: InstrumentInputType;
}>;


export type AddInstrumentMutation = { __typename?: 'Mutation', createInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditInstrumentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: InstrumentInputType;
}>;


export type EditInstrumentMutation = { __typename?: 'Mutation', updateInstrument: { __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddLaboratoryInstrumentMutationVariables = Exact<{
  payload: LaboratoryInstrumentInputType;
}>;


export type AddLaboratoryInstrumentMutation = { __typename?: 'Mutation', createLaboratoryInstrument: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditLaboratoryInstrumentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: LaboratoryInstrumentInputType;
}>;


export type EditLaboratoryInstrumentMutation = { __typename?: 'Mutation', updateLaboratoryInstrument: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddMethodMutationVariables = Exact<{
  payload: MethodInputType;
}>;


export type AddMethodMutation = { __typename?: 'Mutation', createMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditMethodMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: MethodInputType;
}>;


export type EditMethodMutation = { __typename?: 'Mutation', updateMethod: { __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddUnitMutationVariables = Exact<{
  payload: UnitInputType;
}>;


export type AddUnitMutation = { __typename?: 'Mutation', createUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, description?: string | null } };

export type EditUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: UnitInputType;
}>;


export type EditUnitMutation = { __typename?: 'Mutation', updateUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'UnitType', uid: string, name: string, description?: string | null } };

export type GetAllSuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSuppliersQuery = { __typename?: 'Query', supplierAll: Array<{ __typename?: 'SupplierType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllManufacturersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllManufacturersQuery = { __typename?: 'Query', manufacturerAll: Array<{ __typename?: 'ManufacturerType', uid: string, name?: string | null, description?: string | null }> };

export type GetAllInstrumentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentTypesQuery = { __typename?: 'Query', instrumentTypeAll: { __typename?: 'InstrumentTypeCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentTypeType', uid: string, name?: string | null, description?: string | null }> | null } };

export type GetAllInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllInstrumentsQuery = { __typename?: 'Query', instrumentAll: { __typename?: 'InstrumentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, supplierUid?: string | null, manufacturerUid?: string | null, instrumentTypeUid?: string | null, supplier?: { __typename?: 'SupplierType', uid: string, name?: string | null } | null, manufacturer?: { __typename?: 'ManufacturerType', uid: string, name?: string | null } | null, instrumentType?: { __typename?: 'InstrumentTypeType', uid: string, name?: string | null } | null }> | null } };

export type GetAllLaboratoryInstrumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLaboratoryInstrumentsQuery = { __typename?: 'Query', laboratoryInstrumentAll: { __typename?: 'LaboratoryInstrumentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null, instrumentUid?: string | null, dateCommissioned?: never | null, dateDecommissioned?: never | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllMethodsQuery = { __typename?: 'Query', methodAll: { __typename?: 'MethodCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null, description?: string | null, keyword?: string | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, description?: string | null }> | null }> | null } };

export type GetAllUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUnitsQuery = { __typename?: 'Query', unitAll: Array<{ __typename?: 'UnitType', uid: string, name: string }> };

export type AddHazardMutationVariables = Exact<{
  payload: HazardInputType;
}>;


export type AddHazardMutation = { __typename?: 'Mutation', createHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditHazardMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: HazardInputType;
}>;


export type EditHazardMutation = { __typename?: 'Mutation', updateHazard: { __typename: 'HazardType', uid: string, name: string, description?: string | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddStockCategoryMutationVariables = Exact<{
  payload: StockCategoryInputType;
}>;


export type AddStockCategoryMutation = { __typename?: 'Mutation', createStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type EditStockCategoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockCategoryInputType;
}>;


export type EditStockCategoryMutation = { __typename?: 'Mutation', updateStockCategory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockCategoryType', uid: string, name: string, description?: string | null } };

export type AddStockUnitMutationVariables = Exact<{
  payload: StockUnitInputType;
}>;


export type AddStockUnitMutation = { __typename?: 'Mutation', createStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type EditStockUnitMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockUnitInputType;
}>;


export type EditStockUnitMutation = { __typename?: 'Mutation', updateStockUnit: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockUnitType', uid: string, name: string } };

export type ReceiveStockProductMutationVariables = Exact<{
  payload: StockReceiptInputType;
}>;


export type ReceiveStockProductMutation = { __typename?: 'Mutation', createStockReceipt: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, quantity: number, stockItem?: { __typename?: 'StockItemType', name: string, description?: string | null, category?: { __typename?: 'StockCategoryType', name: string } | null, hazard?: { __typename?: 'HazardType', name: string } | null } | null } };

export type AddStockItemMutationVariables = Exact<{
  payload: StockItemInputType;
}>;


export type AddStockItemMutation = { __typename?: 'Mutation', createStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null } };

export type EditStockItemMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockItemInputType;
}>;


export type EditStockItemMutation = { __typename?: 'Mutation', updateStockItem: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemType', uid: string, name: string, description?: string | null } };

export type AddStockItemVariantMutationVariables = Exact<{
  stockItemUid: Scalars['String']['input'];
  payload: StockItemVariantInputType;
}>;


export type AddStockItemVariantMutation = { __typename?: 'Mutation', createStockItemVariant: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null, createdAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type EditStockItemVariantMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockItemVariantInputType;
}>;


export type EditStockItemVariantMutation = { __typename?: 'Mutation', updateStockItemVariant: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null, createdAt?: string | null, updatedAt?: string | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null } };

export type AddStockAdjustmentMutationVariables = Exact<{
  payload: StockAdjustmentInputType;
}>;


export type AddStockAdjustmentMutation = { __typename?: 'Mutation', createStockAdjustment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: string | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: string | null, createdByUid?: string | null } };

export type AddStockOrderMutationVariables = Exact<{
  payload: StockOrderInputType;
}>;


export type AddStockOrderMutation = { __typename?: 'Mutation', createStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type EditStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderInputType;
}>;


export type EditStockOrderMutation = { __typename?: 'Mutation', updateStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, productUid?: string | null, orderUid?: string | null, quantity?: number | null }> } | { __typename?: 'StockOrderType' } };

export type SubmitStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type SubmitStockOrderMutation = { __typename?: 'Mutation', submitStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null } };

export type ApproveStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StockOrderApprovalInputType;
}>;


export type ApproveStockOrderMutation = { __typename?: 'Mutation', approveStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename?: 'StockOrderLineType' } | { __typename: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null } };

export type IssueStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: Array<StockOrderProductLineInputType> | StockOrderProductLineInputType;
}>;


export type IssueStockOrderMutation = { __typename?: 'Mutation', issueStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType', stockOrder: { __typename?: 'StockOrderType', uid: string, orderByUid?: string | null, departmentUid?: string | null, status?: string | null, orderNumber?: string | null, remarks?: string | null }, orderProducts: Array<{ __typename?: 'StockOrderProductType', uid: string, orderUid?: string | null, quantity?: number | null, product?: { __typename?: 'StockItemVariantType', uid: string, quantity: number } | null }> } | { __typename?: 'StockOrderType' } };

export type DeleteStockOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteStockOrderMutation = { __typename?: 'Mutation', deleteStockOrder: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StockOrderLineType' } | { __typename?: 'StockOrderType' } };

export type GetAllHazardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllHazardsQuery = { __typename?: 'Query', hazardAll: Array<{ __typename?: 'HazardType', uid: string, name: string, description?: string | null }> };

export type GetAllStockCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockCategoriesQuery = { __typename?: 'Query', stockCategoryAll: Array<{ __typename?: 'StockCategoryType', uid: string, name: string, description?: string | null }> };

export type GetAllStockUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStockUnitsQuery = { __typename?: 'Query', stockUnitAll: Array<{ __typename?: 'StockUnitType', uid: string, name: string }> };

export type GetAllStockItemsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockItemsQuery = { __typename?: 'Query', stockItemAll: { __typename?: 'StockItemCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockItemType', uid: string, name: string, description?: string | null, categoryUid?: string | null, hazardUid?: string | null, category?: { __typename?: 'StockCategoryType', uid: string, name: string } | null, hazard?: { __typename?: 'HazardType', uid: string, name: string } | null }> | null } };

export type GetAllStockItemVariantsQueryVariables = Exact<{
  stockItemUid: Scalars['String']['input'];
}>;


export type GetAllStockItemVariantsQuery = { __typename?: 'Query', stockItemVariants: Array<{ __typename?: 'StockItemVariantType', uid: string, name: string, description?: string | null, stockItemUid?: string | null, minimumLevel?: number | null, maximumLevel?: number | null }> };

export type GetAllStockProductsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockProductsQuery = { __typename?: 'Query', stockProductAll: { __typename?: 'StockItemVariantCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockItemVariantType', uid: string, name: string, description?: string | null, quantity: number, createdAt?: string | null, updatedAt?: string | null, stockItem?: { __typename?: 'StockItemType', name: string, description?: string | null, category?: { __typename?: 'StockCategoryType', name: string } | null, hazard?: { __typename?: 'HazardType', name: string } | null } | null, createdBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, updatedBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetAllStockLotsQueryVariables = Exact<{
  productUid: Scalars['String']['input'];
}>;


export type GetAllStockLotsQuery = { __typename?: 'Query', stockLots: Array<{ __typename?: 'StockLotType', uid: string, lotNumber: string, quantity: number, expiryDate: never }> };

export type GetAllStockOrdersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllStockOrdersQuery = { __typename?: 'Query', stockOrderAll: { __typename?: 'StockOrderCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockOrderType', uid: string, status?: string | null, orderNumber?: string | null, orderBy?: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null } | null, department?: { __typename?: 'DepartmentType', uid: string, name?: string | null } | null }> | null } };

export type GetAllStockOrderProductsQueryVariables = Exact<{
  stockOrderUid: Scalars['String']['input'];
}>;


export type GetAllStockOrderProductsQuery = { __typename?: 'Query', stockOrderProductAll: Array<{ __typename?: 'StockOrderProductType', uid: string, quantity?: number | null, product?: { __typename?: 'StockItemVariantType', uid: string, name: string, quantity: number } | null, stockLot?: { __typename?: 'StockLotType', uid: string, lotNumber: string, quantity: number } | null }> };

export type GetAllStockAdjustmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  productUid?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllStockAdjustmentsQuery = { __typename?: 'Query', stockAdjustmentAll: { __typename?: 'StockAdjustmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'StockAdjustmentType', uid: string, productUid?: string | null, adjustmentType?: string | null, adjust?: number | null, adjustmentDate?: string | null, remarks?: string | null, adjustmentByUid?: string | null, createdAt?: string | null, createdByUid?: string | null, updatedAt?: string | null, updatedByUid?: string | null, product?: { __typename?: 'StockItemVariantType', name: string } | null, adjustmentBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type AddAbxGuidelineMutationVariables = Exact<{
  payload: AbxGuidelineInputType;
}>;


export type AddAbxGuidelineMutation = { __typename?: 'Mutation', createAbxGuideline: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxGuidelineMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxGuidelineInputType;
}>;


export type EditAbxGuidelineMutation = { __typename?: 'Mutation', updateAbxGuideline: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxAntibioticMutationVariables = Exact<{
  payload: AbxAntibioticInputType;
}>;


export type AddAbxAntibioticMutation = { __typename?: 'Mutation', createAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type EditAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxAntibioticInputType;
}>;


export type EditAbxAntibioticMutation = { __typename?: 'Mutation', updateAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type UseAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type UseAbxAntibioticMutation = { __typename?: 'Mutation', useAbxAntibiotic: { __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null, human?: boolean | null, veterinary?: boolean | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', name: string }> | null } | { __typename?: 'OperationError' } };

export type DiscardAbxAntibioticMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DiscardAbxAntibioticMutation = { __typename?: 'Mutation', discardAbxAntibiotic: { __typename?: 'DeletedItem', uid: string } };

export type AddAbxAstPanelMutationVariables = Exact<{
  payload: AbxAstPanelInputType;
}>;


export type AddAbxAstPanelMutation = { __typename?: 'Mutation', createAbxAstPanel: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type EditAbxAstPanelMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxAstPanelInputType;
}>;


export type EditAbxAstPanelMutation = { __typename?: 'Mutation', updateAbxAstPanel: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null } | { __typename?: 'OperationError' } };

export type AddAbxTestMethodMutationVariables = Exact<{
  payload: AbxTestMethodInputType;
}>;


export type AddAbxTestMethodMutation = { __typename?: 'Mutation', createAbxTestMethod: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxTestMethodMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxTestMethodInputType;
}>;


export type EditAbxTestMethodMutation = { __typename?: 'Mutation', updateAbxTestMethod: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxBreakpointTypeMutationVariables = Exact<{
  payload: AbxBreakpointTypeInputType;
}>;


export type AddAbxBreakpointTypeMutation = { __typename?: 'Mutation', createAbxBreakpointType: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxBreakpointTypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxBreakpointTypeInputType;
}>;


export type EditAbxBreakpointTypeMutation = { __typename?: 'Mutation', updateAbxBreakpointType: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxHostMutationVariables = Exact<{
  payload: AbxHostInputType;
}>;


export type AddAbxHostMutation = { __typename?: 'Mutation', createAbxHost: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxHostMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxHostInputType;
}>;


export type EditAbxHostMutation = { __typename?: 'Mutation', updateAbxHost: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxSiteOfInfectionMutationVariables = Exact<{
  payload: AbxSiteOfInfectionInputType;
}>;


export type AddAbxSiteOfInfectionMutation = { __typename?: 'Mutation', createAbxSiteOfInfection: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxSiteOfInfectionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxSiteOfInfectionInputType;
}>;


export type EditAbxSiteOfInfectionMutation = { __typename?: 'Mutation', updateAbxSiteOfInfection: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxBreakpointMutationVariables = Exact<{
  payload: AbxBreakpointInputType;
}>;


export type AddAbxBreakpointMutation = { __typename?: 'Mutation', createAbxBreakpoint: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxBreakpointMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxBreakpointInputType;
}>;


export type EditAbxBreakpointMutation = { __typename?: 'Mutation', updateAbxBreakpoint: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxMediumMutationVariables = Exact<{
  payload: AbxMediumInputType;
}>;


export type AddAbxMediumMutation = { __typename?: 'Mutation', createAbxMedium: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxMediumMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxMediumInputType;
}>;


export type EditAbxMediumMutation = { __typename?: 'Mutation', updateAbxMedium: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxQcRangeMutationVariables = Exact<{
  payload: AbxQcRangeInputType;
}>;


export type AddAbxQcRangeMutation = { __typename?: 'Mutation', createAbxQcRange: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxQcRangeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxQcRangeInputType;
}>;


export type EditAbxQcRangeMutation = { __typename?: 'Mutation', updateAbxQcRange: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxKingdomMutationVariables = Exact<{
  payload: AbxKingdomInputType;
}>;


export type AddAbxKingdomMutation = { __typename?: 'Mutation', createAbxKingdom: { __typename?: 'AbxKingdomType', uid: string, name: string } | { __typename?: 'OperationError' } };

export type EditAbxKingdomMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxKingdomInputType;
}>;


export type EditAbxKingdomMutation = { __typename?: 'Mutation', updateAbxKingdom: { __typename?: 'AbxKingdomType', uid: string, name: string } | { __typename?: 'OperationError' } };

export type AddAbxPhylumMutationVariables = Exact<{
  payload: AbxPhylumInputType;
}>;


export type AddAbxPhylumMutation = { __typename?: 'Mutation', createAbxPhylum: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxPhylumMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxPhylumInputType;
}>;


export type EditAbxPhylumMutation = { __typename?: 'Mutation', updateAbxPhylum: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxClassMutationVariables = Exact<{
  payload: AbxClassInputType;
}>;


export type AddAbxClassMutation = { __typename?: 'Mutation', createAbxClass: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxClassMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxClassInputType;
}>;


export type EditAbxClassMutation = { __typename?: 'Mutation', updateAbxClass: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrderMutationVariables = Exact<{
  payload: AbxOrderInputType;
}>;


export type AddAbxOrderMutation = { __typename?: 'Mutation', createAbxOrder: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxOrderMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrderInputType;
}>;


export type EditAbxOrderMutation = { __typename?: 'Mutation', updateAbxOrder: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxFamilyMutationVariables = Exact<{
  payload: AbxFamilyInputType;
}>;


export type AddAbxFamilyMutation = { __typename?: 'Mutation', createAbxFamily: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxFamilyMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxFamilyInputType;
}>;


export type EditAbxFamilyMutation = { __typename?: 'Mutation', updateAbxFamily: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxGenusMutationVariables = Exact<{
  payload: AbxGenusInputType;
}>;


export type AddAbxGenusMutation = { __typename?: 'Mutation', createAbxGenus: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxGenusMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxGenusInputType;
}>;


export type EditAbxGenusMutation = { __typename?: 'Mutation', updateAbxGenus: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismMutationVariables = Exact<{
  payload: AbxOrganismInputType;
}>;


export type AddAbxOrganismMutation = { __typename?: 'Mutation', createAbxOrganism: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxOrganismMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrganismInputType;
}>;


export type EditAbxOrganismMutation = { __typename?: 'Mutation', updateAbxOrganism: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismSerotypeMutationVariables = Exact<{
  payload: AbxOrganismSerotypeInputType;
}>;


export type AddAbxOrganismSerotypeMutation = { __typename?: 'Mutation', createAbxOrganismSerotype: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxOrganismSerotypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxOrganismSerotypeInputType;
}>;


export type EditAbxOrganismSerotypeMutation = { __typename?: 'Mutation', updateAbxOrganismSerotype: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxExpResPhenotypeMutationVariables = Exact<{
  payload: AbxExpResPhenotypeInputType;
}>;


export type AddAbxExpResPhenotypeMutation = { __typename?: 'Mutation', createAbxExpResPhenotype: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | { __typename?: 'OperationError' } };

export type EditAbxExpResPhenotypeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxExpResPhenotypeInputType;
}>;


export type EditAbxExpResPhenotypeMutation = { __typename?: 'Mutation', updateAbxExpResPhenotype: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | { __typename?: 'OperationError' } };

export type AddAbxExpertInterpretationRuleMutationVariables = Exact<{
  payload: AbxExpertInterpretationRuleInputType;
}>;


export type AddAbxExpertInterpretationRuleMutation = { __typename?: 'Mutation', createAbxExpertInterpretationRule: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type EditAbxExpertInterpretationRuleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: AbxExpertInterpretationRuleInputType;
}>;


export type EditAbxExpertInterpretationRuleMutation = { __typename?: 'Mutation', updateAbxExpertInterpretationRule: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | { __typename?: 'OperationError' } };

export type AddAbxOrganismResultMutationVariables = Exact<{
  analysisResultUid: Scalars['String']['input'];
}>;


export type AddAbxOrganismResultMutation = { __typename?: 'Mutation', createAbxOrganismResult: { __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null } };

export type SaveAbxOrganismResultMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  organismUid: Scalars['String']['input'];
}>;


export type SaveAbxOrganismResultMutation = { __typename?: 'Mutation', saveAbxOrganismResult: { __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null } };

export type DeleteAbxOrganismResultMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteAbxOrganismResultMutation = { __typename?: 'Mutation', removeAbxOrganismResult: { __typename?: 'DeletedItem', uid: string } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type ApplyAbxAstPanelMutationVariables = Exact<{
  payload: AbxApplyAstPanelInput;
}>;


export type ApplyAbxAstPanelMutation = { __typename?: 'Mutation', applyAbxAstPanel: { __typename?: 'AbxASTResultsType', astResults: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, reportable: boolean } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type UpdateAbxAstResultsMutationVariables = Exact<{
  payload: AbxAstResultsUpdateInput;
}>;


export type UpdateAbxAstResultsMutation = { __typename?: 'Mutation', updateAbxAstResults: { __typename?: 'AbxASTResultsType', astResults: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, reportable: boolean } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> } | { __typename?: 'OperationError', error: string, suggestion?: string | null } };

export type GetAbxGuidelinesAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGuidelinesAllQuery = { __typename?: 'Query', abxGuidelinesAll?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null }> | null };

export type GetAbxGuidelineByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxGuidelineByUidQuery = { __typename?: 'Query', abxGuidelineByUid?: { __typename?: 'AbxGuidelineType', uid: string, name: string, code?: string | null, description?: string | null } | null };

export type GetAbxAntibioticAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxAntibioticAllQuery = { __typename?: 'Query', abxAntibioticAll: { __typename?: 'AbxAntibioticCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxAntibioticByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxAntibioticByUidQuery = { __typename?: 'Query', abxAntibioticByUid?: { __typename?: 'AbxAntibioticType', uid: string, name: string, whonetAbxCode?: string | null, whoCode?: string | null, dinCode?: string | null, jacCode?: string | null, eucastCode?: string | null, userCode?: string | null, abxNumber?: string | null, potency?: string | null, atcCode?: string | null, class_?: string | null, subclass?: string | null, profClass?: string | null, ciaCategory?: string | null, clsiOrder?: string | null, eucastOrder?: string | null, human?: boolean | null, veterinary?: boolean | null, animalGp?: string | null, loinccomp?: string | null, loincgen?: string | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, loincslow?: string | null, loincafb?: string | null, loincsbt?: string | null, loincmlc?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', uid: string, name: string }> | null } | null };

export type GetAbxLaboratoryAntibioticsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxLaboratoryAntibioticsQuery = { __typename?: 'Query', abxLaboratoryAntibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null, human?: boolean | null, veterinary?: boolean | null, loincdisk?: string | null, loincmic?: string | null, loincetest?: string | null, guidelines?: Array<{ __typename?: 'AbxGuidelineType', name: string }> | null }> | null };

export type GetAbxKingdomAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxKingdomAllQuery = { __typename?: 'Query', abxKingdomAll?: Array<{ __typename?: 'AbxKingdomType', uid: string, name: string }> | null };

export type GetAbxKingdomByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxKingdomByUidQuery = { __typename?: 'Query', abxKingdomByUid?: { __typename?: 'AbxKingdomType', uid: string, name: string } | null };

export type GetAbxPhylumAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxPhylumAllQuery = { __typename?: 'Query', abxPhylumAll?: Array<{ __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null }> | null };

export type GetAbxPhylumByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxPhylumByUidQuery = { __typename?: 'Query', abxPhylumByUid?: { __typename?: 'AbxPhylumType', uid: string, name: string, kingdomUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null } | null };

export type GetAbxClassAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxClassAllQuery = { __typename?: 'Query', abxClassAll?: Array<{ __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null }> | null };

export type GetAbxClassByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxClassByUidQuery = { __typename?: 'Query', abxClassByUid?: { __typename?: 'AbxClassType', uid: string, name: string, phylumUid?: string | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null } | null };

export type GetAbxOrderAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxOrderAllQuery = { __typename?: 'Query', abxOrderAll?: Array<{ __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null, class_?: { __typename?: 'AbxClassType', name: string } | null }> | null };

export type GetAbxOrderByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrderByUidQuery = { __typename?: 'Query', abxOrderByUid?: { __typename?: 'AbxOrderType', uid: string, name: string, classUid?: string | null, class_?: { __typename?: 'AbxClassType', name: string } | null } | null };

export type GetAbxFamilyAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxFamilyAllQuery = { __typename?: 'Query', abxFamilyAll?: Array<{ __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null, order?: { __typename?: 'AbxOrderType', name: string } | null }> | null };

export type GetAbxFamilyByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxFamilyByUidQuery = { __typename?: 'Query', abxFamilyByUid?: { __typename?: 'AbxFamilyType', uid: string, name: string, orderUid?: string | null, order?: { __typename?: 'AbxOrderType', name: string } | null } | null };

export type GetAbxGenusAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGenusAllQuery = { __typename?: 'Query', abxGenusAll?: Array<{ __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null, family?: { __typename?: 'AbxFamilyType', name: string } | null }> | null };

export type GetAbxGenusByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxGenusByUidQuery = { __typename?: 'Query', abxGenusByUid?: { __typename?: 'AbxGenusType', uid: string, name: string, familyUid?: string | null, family?: { __typename?: 'AbxFamilyType', name: string } | null } | null };

export type GetAbxOrganismAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxOrganismAllQuery = { __typename?: 'Query', abxOrganismAll: { __typename?: 'AbxOrganismCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxOrganismByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrganismByUidQuery = { __typename?: 'Query', abxOrganismByUid?: { __typename?: 'AbxOrganismType', uid: string, name: string, whonetOrgCode?: string | null, replacedBy?: string | null, taxonomicStatus?: string | null, common?: string | null, organismType?: string | null, anaerobe?: boolean | null, morphology?: string | null, subkingdomCode?: string | null, familyCode?: string | null, genusGroup?: string | null, genusCode?: string | null, speciesGroup?: string | null, serovarGroup?: string | null, msfGrpClin?: string | null, sctCode?: string | null, sctText?: string | null, gbifTaxonId?: string | null, gbifDatasetId?: string | null, gbifTaxonomicStatus?: string | null, kingdomUid?: string | null, phylumUid?: string | null, classUid?: string | null, orderUid?: string | null, familyUid?: string | null, genusUid?: string | null, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, kingdom?: { __typename?: 'AbxKingdomType', name: string } | null, phylum?: { __typename?: 'AbxPhylumType', name: string } | null, class_?: { __typename?: 'AbxClassType', name: string } | null, order?: { __typename?: 'AbxOrderType', name: string } | null, family?: { __typename?: 'AbxFamilyType', name: string } | null, genus?: { __typename?: 'AbxGenusType', name: string } | null } | null };

export type GetAbxOrganismSerotypeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxOrganismSerotypeAllQuery = { __typename?: 'Query', abxOrganismSerotypeAll: { __typename?: 'AbxOrganismSerotypeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxOrganismSerotypeByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxOrganismSerotypeByUidQuery = { __typename?: 'Query', abxOrganismSerotypeByUid?: { __typename?: 'AbxOrganismSerotypeType', uid: string, organismUid: string, serotype: string, serogroup?: string | null, subspecies?: string | null, oAntigens?: string | null, hPhase1?: string | null, hPhase2?: string | null, x997Check?: string | null, fate?: string | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', name: string } | null } | null };

export type GetAbxTestMethodAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxTestMethodAllQuery = { __typename?: 'Query', abxTestMethodAll?: Array<{ __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxTestMethodByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxTestMethodByUidQuery = { __typename?: 'Query', abxTestMethodByUid?: { __typename?: 'AbxTestMethodType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxBreakpointTypeAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxBreakpointTypeAllQuery = { __typename?: 'Query', abxBreakpointTypeAll?: Array<{ __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxBreakpointTypeByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxBreakpointTypeByUidQuery = { __typename?: 'Query', abxBreakpointTypeByUid?: { __typename?: 'AbxBreakpointTypeTyp', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxHostAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxHostAllQuery = { __typename?: 'Query', abxHostAll?: Array<{ __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxHostUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxHostUidQuery = { __typename?: 'Query', abxHostByUid?: { __typename?: 'AbxHostType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxSiteOfInfectionAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxSiteOfInfectionAllQuery = { __typename?: 'Query', abxSiteOfInfectionAll?: Array<{ __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxSiteOfInfectionUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxSiteOfInfectionUidQuery = { __typename?: 'Query', abxSiteOfInfectionByUid?: { __typename?: 'AbxSiteOfInfectionType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxGuidelineYearAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxGuidelineYearAllQuery = { __typename?: 'Query', abxGuidelineYearAll?: Array<{ __typename?: 'AbxGuidelineYearType', uid: string, guidelineUid: string, year: number, code: string, guideline?: { __typename?: 'AbxGuidelineType', uid: string, name: string } | null }> | null };

export type GetAbxBreakpointAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxBreakpointAllQuery = { __typename?: 'Query', abxBreakpointAll: { __typename?: 'AbxBreakpointTypCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxBreakpointUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxBreakpointUidQuery = { __typename?: 'Query', abxBreakpointByUid?: { __typename?: 'AbxBreakpointTyp', uid: string, guidelineYearUid: string, testMethodUid: string, potency?: string | null, organismCode: string, organismCodeType: string, breakpointTypeUid: string, hostUid?: string | null, siteOfInfectionUid?: string | null, referenceTable?: string | null, referenceSequence?: string | null, whonetAbxCode?: string | null, comments?: string | null, r?: string | null, i?: string | null, sdd?: string | null, s?: string | null, ecvEcoff?: string | null, ecvEcoffTentative?: string | null, createdAt?: string | null, createdByUid?: string | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, testMethod?: { __typename?: 'AbxTestMethodType', name: string } | null, breakpointType?: { __typename?: 'AbxBreakpointTypeTyp', name: string } | null, host?: { __typename?: 'AbxHostType', name: string } | null, siteOfInfection?: { __typename?: 'AbxSiteOfInfectionType', name: string } | null } | null };

export type GetAbxExpResPhenotypeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxExpResPhenotypeAllQuery = { __typename?: 'Query', abxExpectedResistancePhenotypeAll: { __typename?: 'AbxExpResPhenotypeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxExpResPhenotypeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxExpResPhenotypeUidQuery = { __typename?: 'Query', abxExpectedResistancePhenotypeByUid?: { __typename?: 'AbxExpResPhenotypeType', uid: string, guidelineUid: string, referenceTable?: string | null, organismCode: string, organismCodeType: string, exceptionOrganismCode: string, exceptionOrganismCodeType: string, abxCode: string, abxCodeType: string, antibioticExceptions: string, comments?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null } | null };

export type GetAbxExpertInterpretationRuleAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxExpertInterpretationRuleAllQuery = { __typename?: 'Query', abxExpertInterpretationRuleAll: { __typename?: 'AbxExpertInterpretationRuleCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxExpertInterpretationRuleUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxExpertInterpretationRuleUidQuery = { __typename?: 'Query', abxExpertInterpretationRuleByUid?: { __typename?: 'AbxExpertInterpretationRuleType', uid: string, ruleCode: string, description?: string | null, organismCode: string, organismCodeType: string, ruleCriteria: string, affectedAntibiotics: string, antibioticExceptions: string, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxMediumAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxMediumAllQuery = { __typename?: 'Query', abxMediumAll?: Array<{ __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null }> | null };

export type GetAbxMediumUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxMediumUidQuery = { __typename?: 'Query', abxMediumByUid?: { __typename?: 'AbxMediumType', uid: string, name: string, description?: string | null, createdAt?: string | null, createdByUid?: string | null } | null };

export type GetAbxQcRangeAllQueryVariables = Exact<{
  text: Scalars['String']['input'];
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  afterCursor?: InputMaybe<Scalars['String']['input']>;
  beforeCursor?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAbxQcRangeAllQuery = { __typename?: 'Query', abxQcRangeAll: { __typename?: 'AbxQCRangeCursorPage', totalCount: number, items?: Array<{ __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type GetAbxQcRangeUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxQcRangeUidQuery = { __typename?: 'Query', abxQcRangeByUid?: { __typename?: 'AbxQCRangeType', uid: string, guidelineUid: string, year: number, strain: string, referenceTable: string, whonetOrgCode: string, antibiotic: string, abxTest: string, whonetAbxCode: string, method: string, mediumUid?: string | null, minimum?: string | null, maximum?: string | null, createdAt?: string | null, createdByUid?: string | null, guideline?: { __typename?: 'AbxGuidelineType', name: string } | null, medium?: { __typename?: 'AbxMediumType', name: string } | null } | null };

export type GetAbxAstPanelFilterQueryVariables = Exact<{
  organismUid: Scalars['String']['input'];
  text?: Scalars['String']['input'];
}>;


export type GetAbxAstPanelFilterQuery = { __typename?: 'Query', abxAstPanelFilter?: Array<{ __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string }> | null }> | null };

export type GetAbxAstPanelAllQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAbxAstPanelAllQuery = { __typename?: 'Query', abxAstPanelAll?: Array<{ __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null }> | null }> | null };

export type GetAbxAstPanelUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetAbxAstPanelUidQuery = { __typename?: 'Query', abxAstPanelByUid?: { __typename?: 'AbxASTPanelType', uid: string, name: string, description?: string | null, active: boolean, createdAt?: string | null, createdByUid?: string | null, organisms?: Array<{ __typename?: 'AbxOrganismType', uid: string, name: string }> | null, antibiotics?: Array<{ __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null }> | null } | null };

export type GetAbxAstResultAllQueryVariables = Exact<{
  sampleUid: Scalars['String']['input'];
}>;


export type GetAbxAstResultAllQuery = { __typename?: 'Query', abxAstResultAll?: Array<{ __typename?: 'AbxASTResultType', uid: string, organismResultUid: string, analysisResultUid: string, antibioticUid: string, guidelineYearUid?: string | null, breakpointUid?: string | null, astMethodUid?: string | null, astValue?: string | null, createdAt?: string | null, createdByUid?: string | null, analysisResult?: { __typename?: 'AnalysisResultType', result?: string | null, reportable: boolean, status?: string | null } | null, antibiotic?: { __typename?: 'AbxAntibioticType', uid: string, name: string, potency?: string | null } | null, guidelineYear?: { __typename?: 'AbxGuidelineYearType', uid: string, code: string } | null, astMethod?: { __typename?: 'AbxTestMethodType', uid: string, name: string } | null }> | null };

export type GetAbxOrganismResultAllQueryVariables = Exact<{
  analysisResultUid: Scalars['String']['input'];
}>;


export type GetAbxOrganismResultAllQuery = { __typename?: 'Query', abxOrganismResultAll?: Array<{ __typename?: 'AbxOrganismResultType', uid: string, analysisResultUid: string, organismUid?: string | null, isolateNumber?: number | null, createdAt?: string | null, createdByUid?: string | null, organism?: { __typename?: 'AbxOrganismType', uid: string, name: string } | null }> | null };

export type AddNoticeMutationVariables = Exact<{
  payload: NoticeInputType;
}>;


export type AddNoticeMutation = { __typename?: 'Mutation', createNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: NoticeInputType;
}>;


export type EditNoticeMutation = { __typename?: 'Mutation', updateNotice: { __typename: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type DeleteNoticeMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteNoticeMutation = { __typename?: 'Mutation', deleteNotice: { __typename: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetNoticesByCreatorUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetNoticesByCreatorUidQuery = { __typename?: 'Query', noticesByCreator?: Array<{ __typename?: 'NoticeType', uid: string, title: string, body: string, expiry: string, createdByUid?: string | null, departments?: Array<{ __typename?: 'DepartmentType', uid: string, name?: string | null }> | null, groups?: Array<{ __typename?: 'GroupType', uid: string, name?: string | null }> | null }> | null };

export type AddIdentificationMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type AddIdentificationMutation = { __typename?: 'Mutation', createIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type EditIdentificationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type EditIdentificationMutation = { __typename?: 'Mutation', updateIdentification: { __typename: 'IdentificationType', uid: string, name: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type AddPatientMutationVariables = Exact<{
  payload: PatientInputType;
}>;


export type AddPatientMutation = { __typename?: 'Mutation', createPatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type EditPatientMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: PatientInputType;
}>;


export type EditPatientMutation = { __typename?: 'Mutation', updatePatient: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } };

export type GetAllPatientsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllPatientsQuery = { __typename?: 'Query', patientAll: { __typename?: 'PatientCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, clientUid: string, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', uid: string, name?: string | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> | null } };

export type SearchPatientsQueryVariables = Exact<{
  queryString: Scalars['String']['input'];
}>;


export type SearchPatientsQuery = { __typename?: 'Query', patientSearch: Array<{ __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null }> };

export type GetPatientByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetPatientByUidQuery = { __typename?: 'Query', patientByUid?: { __typename?: 'PatientType', uid: string, clientPatientId: string, patientId: string, firstName?: string | null, middleName?: string | null, lastName?: string | null, age?: number | null, gender?: string | null, dateOfBirth?: never | null, ageDobEstimated: boolean, phoneHome?: string | null, phoneMobile?: string | null, consentSms: boolean, countryUid?: string | null, provinceUid?: string | null, districtUid?: string | null, client?: { __typename?: 'ClientType', uid: string, name: string, district?: { __typename?: 'DistrictType', name?: string | null, province?: { __typename?: 'ProvinceType', name?: string | null } | null } | null } | null, identifications?: Array<{ __typename?: 'PatientIdentificationType', uid: string, value: string, identificationUid: string, identification?: { __typename?: 'IdentificationType', uid: string, name: string } | null }> | null, country?: { __typename?: 'CountryType', uid: string, name?: string | null } | null, province?: { __typename?: 'ProvinceType', uid: string, name?: string | null } | null, district?: { __typename?: 'DistrictType', uid: string, name?: string | null } | null } | null };

export type IdentificationTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type IdentificationTypesQuery = { __typename?: 'Query', identificationAll: Array<{ __typename?: 'IdentificationType', uid: string, name: string }> };

export type AddReflexRuleMutationVariables = Exact<{
  payload: ReflexRuleInput;
}>;


export type AddReflexRuleMutation = { __typename?: 'Mutation', createReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type EditReflexRuleMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexRuleInput;
}>;


export type EditReflexRuleMutation = { __typename?: 'Mutation', updateReflexRule: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexRuleType', uid: string, name: string, description: string, createdByUid?: string | null, createdAt?: string | null } };

export type AddReflexActionMutationVariables = Exact<{
  payload: ReflexActionInput;
}>;


export type AddReflexActionMutation = { __typename?: 'Mutation', createReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type EditReflexActionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexActionInput;
}>;


export type EditReflexActionMutation = { __typename?: 'Mutation', updateReflexAction: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexActionType', uid: string, description: string, level: number, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string }> | null, reflexRule?: { __typename?: 'ReflexRuleType', uid: string, name: string } | null } };

export type AddReflexBrainMutationVariables = Exact<{
  payload: ReflexBrainInput;
}>;


export type AddReflexBrainMutation = { __typename?: 'Mutation', createReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> } };

export type EditReflexBrainMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReflexBrainInput;
}>;


export type EditReflexBrainMutation = { __typename?: 'Mutation', updateReflexBrain: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> } };

export type DeleteReflexBrainMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteReflexBrainMutation = { __typename?: 'Mutation', deleteReflexBrain: { __typename: 'DeletedItem', uid: string } };

export type GetAllReflexRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReflexRulesQuery = { __typename?: 'Query', reflexRuleAll: { __typename?: 'ReflexRuleCursorPage', totalCount: number, items?: Array<{ __typename?: 'ReflexRuleType', uid: string, name: string, description: string, createdBy?: { __typename?: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } };

export type GetReflexRuleByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetReflexRuleByUidQuery = { __typename?: 'Query', reflexRuleByUid?: { __typename?: 'ReflexRuleType', uid: string, name: string, description: string, reflexActions?: Array<{ __typename: 'ReflexActionType', uid: string, level: number, description: string, analyses?: Array<{ __typename: 'AnalysisType', uid: string, name: string }> | null, brains?: Array<{ __typename: 'ReflexBrainType', uid: string, description: string, conditions: Array<{ __typename?: 'ReflexBrainConditionType', description?: string | null, priority: number, criteria?: Array<{ __typename: 'ReflexBrainConditionCriteriaType', analysisUid: string, operator: string, value: string, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }>, actions: Array<{ __typename: 'ReflexBrainActionType', addNew?: Array<{ __typename: 'ReflexBrainAdditionType', analysisUid: string, count: number, analysis?: { __typename: 'AnalysisType', uid: string, name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null, finalise?: Array<{ __typename: 'ReflexBrainFinalType', analysisUid: string, value: string, analysis?: { __typename: 'AnalysisType', name: string, resultOptions?: Array<{ __typename: 'ResultOptionType', optionKey: number, value: string }> | null } | null }> | null }> }> | null, createdBy?: { __typename: 'UserType', firstName?: string | null, lastName?: string | null } | null }> | null } | null };

export type AddReferralLaboratoryMutationVariables = Exact<{
  payload: ReferralLaboratoryInputType;
}>;


export type AddReferralLaboratoryMutation = { __typename?: 'Mutation', createReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type EditReferralLaboratoryMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ReferralLaboratoryInputType;
}>;


export type EditReferralLaboratoryMutation = { __typename?: 'Mutation', updateReferralLaboratory: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null } };

export type AddShipmentMutationVariables = Exact<{
  payload: ShipmentInputType;
}>;


export type AddShipmentMutation = { __typename?: 'Mutation', createShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentListingType', shipments?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, laboratoryUid?: string | null, createdAt?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type UpdateShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentUpdateInputType;
}>;


export type UpdateShipmentMutation = { __typename?: 'Mutation', updateShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null } };

export type ShipmentManageSamplesMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: ShipmentManageSamplesInput;
}>;


export type ShipmentManageSamplesMutation = { __typename?: 'Mutation', shipmentManageSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null } | null, samples?: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null }> | null } };

export type ActionShipmentMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  action: Scalars['String']['input'];
}>;


export type ActionShipmentMutation = { __typename?: 'Mutation', actionShipment: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'ShipmentType', uid: string, state?: string | null } };

export type GetAllReferralLaboratoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReferralLaboratoriesQuery = { __typename?: 'Query', referralLaboratoryAll: Array<{ __typename?: 'ReferralLaboratoryType', uid: string, name?: string | null, code?: string | null, url?: string | null, password?: string | null, username?: string | null, isReferral?: boolean | null, isReference?: boolean | null }> };

export type GetAllShipmentsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  incoming: Scalars['Boolean']['input'];
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllShipmentsQuery = { __typename?: 'Query', shipmentAll: { __typename?: 'ShipmentCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, incoming: boolean, state?: string | null, laboratoryUid?: string | null, courier?: string | null, createdAt?: string | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null } | null }> | null } };

export type GetShipmentByUidQueryVariables = Exact<{
  shipmentUid: Scalars['String']['input'];
}>;


export type GetShipmentByUidQuery = { __typename?: 'Query', shipmentByUid: { __typename?: 'ShipmentType', uid: string, shipmentId?: string | null, assignedCount?: number | null, state?: string | null, incoming: boolean, comment?: string | null, createdAt?: string | null, courier?: string | null, jsonContent?: never | null, laboratory?: { __typename?: 'ReferralLaboratoryType', name?: string | null, url?: string | null, username?: string | null, password?: string | null } | null, shippedSamples?: Array<{ __typename?: 'ShippedSampleType', resultNotified?: boolean | null, extSampleId?: string | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', clientRequestId: string, patient: { __typename?: 'PatientType', uid: string } } | null, analyses?: Array<{ __typename?: 'AnalysisType', uid: string, name: string, keyword?: string | null }> | null } }> | null } };

export type ManifestReportQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type ManifestReportQuery = { __typename?: 'Query', manifestReportDownload?: never | null };

export type AddSmsTemplateMutationVariables = Exact<{
  payload: SmsTemplateInputType;
}>;


export type AddSmsTemplateMutation = { __typename?: 'Mutation', createSmsTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SmsTemplateType', uid: string, name?: string | null, description?: string | null, specificationTrigger?: SmsTrigger | null, audience?: SmsAudience | null, template?: string | null, createdAt?: string | null, updatedAt?: string | null, isActive: boolean } };

export type EditSmsTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: SmsTemplateInputType;
}>;


export type EditSmsTemplateMutation = { __typename?: 'Mutation', updateSmsTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'SmsTemplateType', uid: string, name?: string | null, description?: string | null, specificationTrigger?: SmsTrigger | null, audience?: SmsAudience | null, template?: string | null, createdAt?: string | null, updatedAt?: string | null, isActive: boolean } };

export type DeleteSmsTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type DeleteSmsTemplateMutation = { __typename?: 'Mutation', deleteSmsTemplate: { __typename: 'DeletedItem', uid: string } | { __typename: 'OperationError', error: string, suggestion?: string | null } };

export type GetSmsTemplatesByTargetQueryVariables = Exact<{
  targetType: Scalars['String']['input'];
  targetUid: Scalars['String']['input'];
}>;


export type GetSmsTemplatesByTargetQuery = { __typename?: 'Query', smsTemplatesByTarget: Array<{ __typename?: 'SmsTemplateType', uid: string, name?: string | null, description?: string | null, specificationTrigger?: SmsTrigger | null, audience?: SmsAudience | null, template?: string | null, createdAt?: string | null, updatedAt?: string | null, isActive: boolean }> };

export type AddStoreRoomMutationVariables = Exact<{
  payload: StoreRoomInputType;
}>;


export type AddStoreRoomMutation = { __typename?: 'Mutation', createStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type EditStoreRoomMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StoreRoomInputType;
}>;


export type EditStoreRoomMutation = { __typename?: 'Mutation', updateStoreRoom: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoreRoomType', uid: string, name: string, description?: string | null } };

export type AddStorageLocationMutationVariables = Exact<{
  payload: StorageLocationInputType;
}>;


export type AddStorageLocationMutation = { __typename?: 'Mutation', createStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type EditStorageLocationMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageLocationInputType;
}>;


export type EditStorageLocationMutation = { __typename?: 'Mutation', updateStorageLocation: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } };

export type AddStorageSectionMutationVariables = Exact<{
  payload: StorageSectionInputType;
}>;


export type AddStorageSectionMutation = { __typename?: 'Mutation', createStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type EditStorageSectionMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageSectionInputType;
}>;


export type EditStorageSectionMutation = { __typename?: 'Mutation', updateStorageSection: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } };

export type AddStorageContainerMutationVariables = Exact<{
  payload: StorageContainerInputType;
}>;


export type AddStorageContainerMutation = { __typename?: 'Mutation', createStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type EditStorageContainerMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: StorageContainerInputType;
}>;


export type EditStorageContainerMutation = { __typename?: 'Mutation', updateStorageContainer: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storageSection?: { __typename?: 'StorageSectionType', uid: string, storageLocationUid: string, storageLocation?: { __typename?: 'StorageLocationType', uid: string, storeRoomUid: string } | null } | null } };

export type StoreSamplesMutationVariables = Exact<{
  payload: Array<StoreSamplesInputType> | StoreSamplesInputType;
}>;


export type StoreSamplesMutation = { __typename?: 'Mutation', storeSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, sampleId: string, priority: number, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type RecoverSamplesMutationVariables = Exact<{
  sampleUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RecoverSamplesMutation = { __typename?: 'Mutation', recoverSamples: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'StoredSamplesType', samples: Array<{ __typename?: 'SampleType', uid: string, status?: string | null, storageSlot?: string | null, storageContainerUid?: string | null }> } };

export type GetAllStoreRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStoreRoomsQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null }> };

export type GetStoreRoomByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStoreRoomByUidQuery = { __typename?: 'Query', storeRoomByUid?: { __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null } | null };

export type GetAllStorageLocationsQueryVariables = Exact<{
  storeRoomUid: Scalars['String']['input'];
}>;


export type GetAllStorageLocationsQuery = { __typename?: 'Query', storageLocations: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string }> };

export type GetStorageLocationByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageLocationByUidQuery = { __typename?: 'Query', storageLocationByUid?: { __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, storeRoomUid: string } | null };

export type GetAllStorageSectionsQueryVariables = Exact<{
  storageLocationUid: Scalars['String']['input'];
}>;


export type GetAllStorageSectionsQuery = { __typename?: 'Query', storageSections: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string }> };

export type GetStorageSectionByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetStorageSectionByUidQuery = { __typename?: 'Query', storageSectionByUid?: { __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, storageLocationUid: string } | null };

export type GetAllStorageContainersQueryVariables = Exact<{
  storageSectionUid: Scalars['String']['input'];
}>;


export type GetAllStorageContainersQuery = { __typename?: 'Query', storageContainers: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null }> };

export type GetSrorageContainerByUidQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetSrorageContainerByUidQuery = { __typename?: 'Query', storageContainerByUid?: { __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, storageSectionUid: string, grid?: boolean | null, rowWise?: boolean | null, cols?: number | null, rows?: number | null, slots?: number | null, storedCount?: number | null } | null };

export type GetStoreRoomsTreeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStoreRoomsTreeQuery = { __typename?: 'Query', storeRoomAll: Array<{ __typename?: 'StoreRoomType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageLocationType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageSectionType', uid: string, name: string, description?: string | null, tag: string, children?: Array<{ __typename?: 'StorageContainerType', uid: string, name: string, description?: string | null, tag: string }> | null }> | null }> | null }> };

export type GetSystemActivitySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetSystemActivitySubscription = { __typename?: 'Subscription', latestActivity: { __typename?: 'ActivityStreamType', uid: string, actorUid?: string | null, actionObjectUid?: string | null, actionObjectType?: NotificationObjectType | null, targetUid?: string | null, verb?: string | null, actor: { __typename?: 'UserType', uid: string, firstName?: string | null, lastName?: string | null }, actionObject: { __typename: 'AnalysisResultType', uid: string, sampleUid: string, result?: string | null, status?: string | null } | { __typename: 'ReportMetaType', uid: string, status?: string | null, location?: string | null } | { __typename: 'SampleType', uid: string, sampleId: string, status?: string | null, analysisRequest?: { __typename?: 'AnalysisRequestType', patientUid: string } | null } | { __typename: 'UnknownObjectType' } | { __typename: 'WorkSheetType', uid: string, worksheetId: string, state?: string | null } } };

export type AddWorkSheetTemplateMutationVariables = Exact<{
  payload: WorksheetTemplateInputType;
}>;


export type AddWorkSheetTemplateMutation = { __typename?: 'Mutation', createWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type EditWorkSheetTemplateMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  payload: WorksheetTemplateInputType;
}>;


export type EditWorkSheetTemplateMutation = { __typename?: 'Mutation', updateWorksheetTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, qcTemplate?: { __typename?: 'QCTemplateType', uid: string, name: string, description?: string | null, qcLevels: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> } | null, qcLevels?: Array<{ __typename?: 'QCLevelType', uid: string, level: string }> | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null } };

export type AddWorkSheetMutationVariables = Exact<{
  analystUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddWorkSheetMutation = { __typename?: 'Mutation', createWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorksheetListingType', worksheets?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, instrumentUid?: string | null, analysisUid?: string | null, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type UpdateWorkSheetMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  analystUid?: InputMaybe<Scalars['String']['input']>;
  instrumentUid?: InputMaybe<Scalars['String']['input']>;
  methodUid?: InputMaybe<Scalars['String']['input']>;
  action?: InputMaybe<Scalars['String']['input']>;
  samples?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateWorkSheetMutation = { __typename?: 'Mutation', updateWorksheet: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type EditWorkSheetApplyTemplateMutationVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
  templateUid: Scalars['String']['input'];
}>;


export type EditWorkSheetApplyTemplateMutation = { __typename?: 'Mutation', updateWorksheetApplyTemplate: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type ManualyAssignWorsheetMutationVariables = Exact<{
  uid: Scalars['String']['input'];
  qcTemplateUid?: InputMaybe<Scalars['String']['input']>;
  analysesUids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ManualyAssignWorsheetMutation = { __typename?: 'Mutation', updateWorksheetManualAssign: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorkSheetType', uid: string, numberOfSamples?: number | null, sampleTypeUid?: string | null, instrumentUid?: string | null, templateUid?: string | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null } };

export type ActionAssignWorsheetMutationVariables = Exact<{
  uids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  action: Scalars['String']['input'];
}>;


export type ActionAssignWorsheetMutation = { __typename?: 'Mutation', actionWorksheets: { __typename: 'OperationError', error: string, suggestion?: string | null } | { __typename: 'WorksheetListingType', worksheets?: Array<{ __typename?: 'WorkSheetType', uid: string, state?: string | null }> | null } };

export type GetAllWorksheetTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllWorksheetTemplatesQuery = { __typename?: 'Query', worksheetTemplateAll: Array<{ __typename?: 'WorkSheetTemplateType', uid: string, name: string, reserved?: never | null, numberOfSamples?: number | null, rows?: number | null, cols?: number | null, rowWise: boolean, worksheetType: string, instrumentUid?: string | null, sampleTypeUid?: string | null, description?: string | null, analysisUid?: string | null, state?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> };

export type GetAllWorksheetsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  text: Scalars['String']['input'];
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetAllWorksheetsQuery = { __typename?: 'Query', worksheetAll: { __typename?: 'WorkSheetCursorPage', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, items?: Array<{ __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null }> | null } };

export type GetWorkSheetByUidQueryVariables = Exact<{
  worksheetUid: Scalars['String']['input'];
}>;


export type GetWorkSheetByUidQuery = { __typename?: 'Query', worksheetByUid: { __typename?: 'WorkSheetType', uid: string, worksheetId: string, numberOfSamples?: number | null, assignedCount: number, reserved?: never | null, state?: string | null, createdAt?: string | null, analyst?: { __typename?: 'UserType', uid: string, userName: string, firstName?: string | null, lastName?: string | null } | null, sampleType?: { __typename?: 'SampleTypeTyp', name: string } | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null, template?: { __typename?: 'WorkSheetTemplateType', uid: string, name: string } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string } | null, analysisResults?: Array<{ __typename?: 'AnalysisResultType', uid: string, result?: string | null, status?: string | null, worksheetPosition?: number | null, retest: boolean, reportable: boolean, method?: { __typename?: 'MethodType', uid: string, name?: string | null } | null, laboratoryInstrument?: { __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, instrument?: { __typename?: 'InstrumentType', uid: string, name?: string | null } | null } | null, analysis?: { __typename?: 'AnalysisType', uid: string, name: string, unitUid?: string | null, unit?: { __typename?: 'UnitType', uid: string, name: string } | null, resultOptions?: Array<{ __typename?: 'ResultOptionType', uid: string, optionKey: number, value: string }> | null, interims?: Array<{ __typename?: 'AnalysisInterimType', uid: string, key: number, value: string }> | null, instruments?: Array<{ __typename?: 'InstrumentType', uid: string, name?: string | null, laboratoryInstruments?: Array<{ __typename?: 'LaboratoryInstrumentType', uid: string, labName?: string | null, serialNumber?: string | null }> | null }> | null, methods?: Array<{ __typename?: 'MethodType', uid: string, name?: string | null }> | null } | null, sample: { __typename?: 'SampleType', uid: string, sampleId: string, priority: number, analysisRequest?: { __typename?: 'AnalysisRequestType', uid: string, client?: { __typename?: 'ClientType', uid: string, name: string } | null, patient: { __typename?: 'PatientType', uid: string, firstName?: string | null, lastName?: string | null, clientPatientId: string, patientId: string } } | null, qcLevel?: { __typename?: 'QCLevelType', uid: string, level: string } | null } }> | null } };
