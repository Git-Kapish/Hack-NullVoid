import { request } from './client';

export const knowledgeApi = {
  /**
   * Ask a question against official enterprise policy documents.
   * @param {Object} payload - { question: string, region?: string, category?: string, membershipTier?: string }
   */
  askQuestion: async (payload) => {
    return request('/knowledge/ask', {
      method: 'POST',
      body: payload,
    });
  },

  /**
   * List document versions with metadata and chunk counts (Admin)
   */
  listDocuments: async (page = 0, size = 50) => {
    return request(`/admin/knowledge/documents?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'X-Mock-User-Role': 'ADMIN',
        'X-Mock-User-Id': 'admin_1',
      },
    });
  },

  /**
   * Get document metadata and all chunk contents (Admin)
   */
  getDocumentDetail: async (docId) => {
    return request(`/admin/knowledge/documents/${docId}`, {
      method: 'GET',
      headers: {
        'X-Mock-User-Role': 'ADMIN',
        'X-Mock-User-Id': 'admin_1',
      },
    });
  },

  /**
   * Upload an approved knowledge document (Admin)
   * @param {FormData} formData
   */
  uploadDocument: async (formData) => {
    return request('/admin/knowledge/documents', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Mock-User-Role': 'ADMIN',
        'X-Mock-User-Id': 'admin_1',
      },
    });
  },

  /**
   * Bulk seed knowledge documents from dataset (Admin)
   */
  seedCorpus: async () => {
    return request('/admin/knowledge/seed', {
      method: 'POST',
      headers: {
        'X-Mock-User-Role': 'ADMIN',
        'X-Mock-User-Id': 'admin_1',
      },
    });
  },
};
