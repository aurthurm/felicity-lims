import gql from 'graphql-tag';

// hazards
export const ADD_HAZARD= gql`
  mutation AddHazard ($payload: HazardInputType!) {
    createHazard(payload: $payload){
      ... on HazardType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_HAZARD= gql`
  mutation EditHazard ($uid: FelicityID!, $payload: HazardInputType!) {
    updateHazard(uid: $uid, payload: $payload){
      ... on HazardType {
        __typename
        uid
        name
        description

      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// categories
export const ADD_STOCK_CATEGORY= gql`
  mutation AddStockCategory ($payload: StockCategoryInputType!) {
    createStockCategory(payload: $payload){
      ... on StockCategoryType {
        __typename
        uid
        name
        description
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const EDIT_STOCK_CATEGORY= gql`
  mutation EditStockCategory ($uid: FelicityID!, $payload: StockCategoryInputType!) {
    updateStockCategory(uid: $uid, payload: $payload){
      ... on StockCategoryType {
        __typename
        uid
        name
        description

      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// packages
export const ADD_STOCK_PACKAGING = gql`
  mutation AddStockPackaging($payload: StockPackagingInputType!) {
    createStockPackaging(payload: $payload) {
      ... on StockPackagingType {
        __typename
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

export const EDIT_STOCK_PACKAGING = gql`
  mutation editStockPackaging($uid: FelicityID!, $payload: StockPackagingInputType!){
    updateStockPackaging(uid: $uid, payload: $payload){
      ... on StockPackagingType {
        __typename
        uid
        name
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }`;

// units
export const ADD_STOCK_UNIT = gql`
  mutation AddStockUnit($payload: StockUnitInputType!) {
    createStockUnit(payload: $payload) {
      ... on StockUnitType {
        __typename
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

export const EDIT_STOCK_UNIT = gql`
  mutation editStockUnit($uid: FelicityID!, $payload: StockUnitInputType!){
    updateStockUnit(uid: $uid, payload: $payload){
      ... on StockUnitType {
        __typename
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

// products
export const ADD_STOCK_PRODUCT = gql`
  mutation AddStockProduct($payload: StockProductInputType!) {
    createStockProduct(payload: $payload) {
      ... on StockProductType {
        __typename
        uid
        name
        department{
          uid
          name
        }
        supplier{
          uid
          name
        }
        category{
          uid
          name
        }
        hazard{
          uid
          name
        }
        storeRoom{
          uid
          name
        }
        lotNumber
        batch
        size
        unit{
          uid
          name
        }
        packaging{
          uid
          name
        }
        price
        quantityReceived
        remaining
        dateReceived
        expiryDate
        receivedBy{
          uid
          firstName
          lastName
        }
        createdAt
        createdBy{
          uid
          firstName
          lastName
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

export const EDIT_STOCK_PRODUCT = gql`
  mutation editStockProduct($uid: FelicityID!, $payload: StockProductInputType!){
    updateStockProduct(uid: $uid, payload: $payload){
      ... on StockProductType {
        __typename
        uid
        name
        department{
          uid
          name
        }
        supplier{
          uid
          name
        }
        category{
          uid
          name
        }
        hazard{
          uid
          name
        }
        storeRoom{
          uid
          name
        }
        lot_number
        batch
        size
        unit{
          uid
          name
        }
        packaging{
          uid
          name
        }
        price
        quantityReceived
        remaining
        dateReceived
        expiryDate
        receivedBy{
          uid
          firstName
          lastName
        }
        createdAt
        createdBy{
          uid
          firstName
          lastName
        }
        updatedAt
        updatedBy{
          uid
          firstName
          lastName
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

// items
export const ADD_STOCK_ITEM = gql`
  mutation AddStockItem($payload: StockItemInputType!) {
    createStockItem(payload: $payload) {
      ... on StockItemType {
        __typename
        uid
        name
        description
        departmentUid
        department {
          uid
          name
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

export const EDIT_STOCK_ITEM = gql`
  mutation editStockItem($uid: FelicityID!, $payload: StockItemInputType!){
    updateStockItem(uid: $uid, payload: $payload){
      ... on StockItemType {
        __typename
        uid
        name
        description
        departmentUid
        department {
          uid
          name
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

// transactions
export const ADD_STOCK_TRANSACTION = gql`
  mutation AddStockTransaction($payload: StockTransactionInputType!) {
    createStockTransaction(payload: $payload) {
      ... on StockTransactionType {
        __typename
        uid
        productUid
        issued
        departmentUid
        date_issued
        transactionByUid
        createdAt
        createdByUid
        updatedAt
        updatedByUid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// adjustments
export const ADD_STOCK_ADJUSTMENT = gql`
  mutation AddStockAjustment($payload: StockAjustmentInputType!) {
    createStockAjustment(payload: $payload) {
      ... on StockAjustmentType {
        __typename
        uid
        productUid
        adjustmentType
        adjust
        adjustmentDate
        remarks
        adjustment_by_uid
        createdAt
        createdByUid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


// stock orders
export const ADD_STOCK_ORDER = gql`
  mutation AddStockOrder($payload: StockOrderInputType!) {
    createStockOrder(payload: $payload) {
      ... on StockOrderLineType {
        __typename
        stockOrder {
            uid
            orderByUid
            departmentUid
            status
            orderNumber
            remarks
        }
        orderProducts {
            uid
            productUid
            orderUid
            price
            quantity
            remarks
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

export const EDIT_STOCK_ORDER = gql`
  mutation EditStockOrder($uid: FelicityID!, $payload: [StockOrderProductLineInputType!]!) {
    updateStockOrder(uid:$uid, payload: $payload) {
      ... on StockOrderLineType {
        __typename
        stockOrder {
            uid
            orderByUid
            departmentUid
            status
            orderNumber
            remarks
        }
        orderProducts {
            uid
            productUid
            orderUid
            price
            quantity
            remarks
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

export const APPROVE_STOCK_ORDER = gql`
  mutation ApproveStockOrder($uid: FelicityID!, $payload: StockOrderApprovalInputType!) {
    approveStockOrder(uid:$uid, payload: $payload) {
      ... on StockOrderType {
        __typename
        uid
        orderByUid
        departmentUid
        status
        orderNumber
        remarks
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const ISSUE_STOCK_ORDER = gql`
  mutation IssueStockOrder($uid: FelicityID!, $payload: [StockOrderProductLineInputType!]!) {
    issueStockOrder(uid:$uid, payload: $payload) {
        ... on StockOrderLineType {
        __typename
        stockOrder {
            uid
            orderByUid
            departmentUid
            status
            orderNumber
            remarks
        }
        orderProducts {
            uid
            productUid
            orderUid
            price
            quantity
            remarks
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

export const DELETE_STOCK_ORDER = gql`
  mutation DeleteStockOrder($uid: FelicityID!) {
    deleteStockOrder(uid:$uid) {
        ... on StockOrderLineType {
        __typename
        uid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;