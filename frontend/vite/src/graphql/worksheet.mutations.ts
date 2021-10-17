import gql from 'graphql-tag';

export const ADD_WORKSHEET_TEMPLATE= gql`
  mutation AddWorkSheetTemplate($name: String!, $sampleTypeUid: Int!, $description: String, $qcTemplateUid: Int, $reserved: [ReservedInputType!]!, $numberOfSamples: Int!, $worksheetType: String, $instrumentUid: Int, $cols:  Int, $rows:  Int, $analyses: [Int!]!, $rowWise: Boolean){
  createWorksheetTemplate(name: $name, sampleTypeUid: $sampleTypeUid, description: $description, qcTemplateUid: $qcTemplateUid, reserved: $reserved, numberOfSamples: $numberOfSamples, worksheetType: $worksheetType, instrumentUid: $instrumentUid, cols: $cols, rows: $rows, analyses: $analyses, rowWise: $rowWise)
  {
      uid
      name
      reserved
      plate
      numberOfSamples
      rows
      cols
      rowWise
      worksheetType
      instrument {
        uid
        name
      }
      sampleType {
        uid
        name
      }
      description
      qcTemplate {
        uid
        name
        description
        qcLevels {
          uid
          level
        }
      }
      qcLevels {
        uid
        level
      }
      analyses {
        uid
        name
      }
      state
    }
}`;

export const EDIT_WORKSHEET_TEMPLATE= gql`
  mutation EditWorkSheetTemplate($uid:Int!, $name: String!, $sampleTypeUid: Int!, $description: String, $qcTemplateUid: Int, $reserved: [ReservedInputType!]!, $numberOfSamples: Int!, $worksheetType: String, $instrumentUid: Int, $cols:  Int, $rows:  Int, $analyses: [String!]!, $rowWise: Boolean){
  updateWorksheetTemplate(uid: $uid, name: $name, sampleTypeUid: $sampleTypeUid, description: $description, qcTemplateUid: $qcTemplateUid, reserved: $reserved, numberOfSamples: $numberOfSamples, worksheetType: $worksheetType, instrumentUid: $instrumentUid, cols: $cols, rows: $rows, analyses: $analyses, rowWise: $rowWise)
  {
          uid
          name
          reserved
          plate
          numberOfSamples
          rows
          cols
          rowWise
          worksheetType
          instrument {
            uid
            name
          }
          sampleType {
            uid
            name
          }
          description
          qcTemplate {
            uid
            name
            description
            qcLevels {
              uid
              level
            }
          }
          qcLevels {
            uid
            level
          }
          analyses {
            uid
            name
          }
          state
        }
}`;


export const ADD_WORKSHEET = gql`
  mutation AddWorkSheet($analystUid:Int!, $templateUid: Int!, $count: Int){
    createWorksheet(analystUid: $analystUid, templateUid: $templateUid, count:$count)
    {
        uid
        worksheetId
        numberOfSamples
        assignedCount
        analyst {
          uid
          auth{
            uid
            userName
          }
          firstName
          lastName
        }
        instrument {
          uid
          name
        }
        analyses {
          uid
          name
        }
        state
        createdAt
    }
  }`;



export const WORKSHEET_UPDATE = gql`
  mutation UpdateWorkSheet ($worksheetUid:Int!, $analystUid: Int, $action: String, $samples: [Int!]!) {
    updateWorksheet(worksheetUid: $worksheetUid, analystUid: $analystUid, action: $action, samples: $samples )
    {
        uid
        numberOfSamples
        sampleType {
          name
          name
        }
        instrument {
          uid
          name
        }
        template {
          uid
          name
        }
        plate
    }
  }`;


export const EDIT_WORKSHEET_APPLY_TEMPLATE= gql`
  mutation EditWorkSheetApplyTemplate($worksheetUid:Int!, $templateUid: Int!){
    updateWorksheetApplyTemplate(worksheetUid: $worksheetUid, templateUid: $templateUid)
  {
      uid
      numberOfSamples
      sampleType {
        name
        name
      }
      instrument {
        uid
        name
      }
      template {
        uid
        name
      }
      plate
  }
}`;