import { gql } from "@apollo/client";

export const GET_DOCUMENT = gql`
  query GetDocument($documentId: UUID!) {
    documentGet(documentId: $documentId) {
      id
      title
      coverPhotoId
      coverPhotoUrl
      updatedAt
      deletedAt
      spaceId
      iconType
      iconValue
      documentType
      parentId
      assignment {
        id
        maxNumberOfAttempt
        preDescription
        testDuration
        bandScoreId
        gradeMethod
        forceAutoSubmit
        gradeByRubricId
      }
      submission {
        id
        documentId
        startAt
        submitAt
        feedbackAt
        feedback
        finalGrade
        user {
          id
          name
          avatar {
            publicUrl
          }
          randomColor
        }
        assignment {
          id
          documentId
        }
      }
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages($documentId: UUID!) {
    documentGet(documentId: $documentId) {
      id
      pages {
        id
        documentId
        index
        title
        layout
      }
    }
  }
`;

export const GET_DOCUMENT_PAGE_CONTENT = gql`
  query GetDocumentPageContents($documentId: UUID!) {
    documentGet(documentId: $documentId) {
      id
      pages {
        id
        pageContents {
          id
          pageId
          index
          body
          updatedAt
          createdAt
        }
      }
    }
  }
`;
