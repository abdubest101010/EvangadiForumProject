import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../axios/AxiosBase";

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL, // Dynamically set from axiosBase
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const questionAPI = createApi({
  reducerPath: "question",
  baseQuery,
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: () => `/questions/alltitles`,
    }),
    getSingleQuestion: builder.query({
      query: (questionId) => `/questions/withoutAnswers/${questionId}`,
    }),
    getAnswersByQuestionId: builder.query({
      query: (questionId) => `/answers/byQuestionId/${questionId}`,
    }),
    postAnswer: builder.mutation({
      query: ({ user_id, question_id, answer }) => ({
        url: `/answers/addAnswer`,
        method: "POST",
        body: { user_id, question_id, answer },
      }),
    }),
    postQuestion: builder.mutation({
      query: ({ email, title, description }) => ({
        url: `/questions/add`,
        method: "POST",
        body: { title, description, email },
      }),
    }),
    deleteQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/questions/delete`,
        method: "DELETE",
        body: { question_id: questionId },
      }),
    }),
    deleteAnswer: builder.mutation({
      query: (answerId) => ({
        url: `/answers/delete`,
        method: "DELETE",
        body: { answer_id: answerId },
      }),
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetSingleQuestionQuery,
  useGetAnswersByQuestionIdQuery,
  usePostAnswerMutation,
  usePostQuestionMutation,
  useDeleteQuestionMutation,
  useDeleteAnswerMutation,
} = questionAPI;
