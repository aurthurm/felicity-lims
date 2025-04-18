const documentRoutes = [
    {
        path: '',
        name: 'documents-entry',
        component: () => import('@/views/document/DocumentEntry.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
      path: ':documentVersionUid',
      name: 'document-single',
      component: () => import('@/views/document/_id/Document.vue'),
      props: true,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'editor',
          name: 'document-editor',
          component: () => import('@/views/document/_id/DocumentEditor.vue'),
          meta: {
            requiresAuth: true,
          },
        }
      ]
    },
];

export default documentRoutes;
