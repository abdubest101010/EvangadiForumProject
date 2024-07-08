import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:52896/api',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const questionAPI = createApi({
  reducerPath: 'question',
  baseQuery,
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: () => `/questions/alltitles`,
    }),
    getSingleQuestion: builder.query({
      query: (questionId) => `/questions/${questionId}`,
    }),
    postAnswer: builder.mutation({
      query: ({ questionId, answer }) => ({
        url: `/answers/addAnswer`,
        method: 'POST',
        body: { answer, question_id: questionId },
      }),
    }),
    postQuestion: builder.mutation({
      query: ({ email, title, description }) => ({
        url: `/questions/add`,
        method: 'POST',
        body: { title, description, email },
      }),
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  usePostAnswerMutation,
  usePostQuestionMutation,
} = questionAPI;
