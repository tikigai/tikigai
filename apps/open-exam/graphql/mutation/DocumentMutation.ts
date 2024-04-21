import { gql } from "@apollo/client";


export const DOCUMENT_UPDATE_PUBLIC = gql`
  mutation DocumentUpdatePublic($documentId: UUID!, $isPublic: Boolean!) {
    documentUpdatePublic(documentId: $documentId, isPublic: $isPublic)
  }
`;

export const SOFT_DELETE_DOCUMENTS = gql`
  mutation SoftDeleteDocuments($documentIds: [UUID!]!, $spaceId: Int!) {
    spaceSoftDeleteMultiple(spaceId: $spaceId, documentIds: $documentIds)
  }
`;

export const ADD_DOCUMENT_STANDALONE = gql`
  mutation AddDocumentStandalone($data: NewDocument!, $spaceId: Int, $isAssignment: Boolean!) {
    documentCreate(data: $data, spaceId: $spaceId, isAssignment: $isAssignment) {
      id
    }
  }
`;

export const UPDATE_DOCUMENT_POSITIONS = gql`
  mutation UpdateDocumentPositions($items: [UpdatePositionData!]!) {
    documentUpdatePositions(items: $items)
  }
`;


// NOTE: using this to update PageBLock title.
export const DOCUMENT_ADD_PAGE_BLOCK = gql`
  mutation DocumentAddPageBlock($data: PageBlockInput!) {
    documentAddPageBlock(data: $data) {
      id
      documentId
      title
    }
  }
`;

export const DOCUMENT_ADD_PAGE_BLOCK_DOCUMENT = gql`
  mutation DocumentAddPageBlockDocument($data: PageBlockDocumentInput!) {
    documentAddPageBlockDocument(data: $data) {
      pageBlockId
      documentId
      index
      createdAt
      document {
        id
        body
      }
    }
  }
`;

export const DOCUMENT_CLONE_PAGE_BLOCK = gql`
  mutation documentClonePageBlock(
    $fromId: UUID!
    $toId: UUID!
    $toDocumentId: UUID!
  ) {
    documentClonePageBlock(
      fromId: $fromId
      toId: $toId
      toDocumentId: $toDocumentId
    ) {
      id
      documentId
      title
      nestedDocuments {
        pageBlockId
        documentId
        index
        createdAt
        document {
          id
          body
        }
      }
    }
  }
`;

export const RESTORE_DOCUMENT = gql`
  mutation RestoreDocument($documentId: UUID!) {
    documentRestore(documentId: $documentId)
  }
`;

export const DELETE_DOCUMENT_PERMANENT = gql`
  mutation DeleteDocumentPermanent($documentId: UUID!) {
    documentDelete(documentId: $documentId)
  }
`;
