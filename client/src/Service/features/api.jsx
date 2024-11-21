import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBase from "../../axios/AxiosBase";


const axiosBaseQuery = 
  ({ baseUrl } = {}) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosBase.request({
        url: baseUrl ? `${baseUrl}${url}` : url,
        method,
        data,
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Create API with the custom baseQuery
export const questionAPI = createApi({
  reducerPath: "question",
  baseQuery: axiosBaseQuery({ baseUrl: "/api" }), // Adjust baseUrl if needed
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: () => ({
        url: "/questions/alltitles",
        method: "GET",
      }),
    }),
    getSingleQuestion: builder.query({
      query: (questionId) => ({
        url: `/questions/withoutAnswers/${questionId}`,
        method: "GET",
      }),
    }),
    getAnswersByQuestionId: builder.query({
      query: (questionId) => ({
        url: `/answers/byQuestionId/${questionId}`,
        method: "GET",
      }),
    }),
    postAnswer: builder.mutation({
      query: ({ user_id, question_id, answer }) => ({
        url: "/answers/addAnswer",
        method: "POST",
        data: { user_id, question_id, answer },
      }),
    }),
    postQuestion: builder.mutation({
      query: ({ email, title, description }) => ({
        url: "/questions/add",
        method: "POST",
        data: { title, description, email },
      }),
    }),
    deleteQuestion: builder.mutation({
      query: (questionId) => ({
        url: "/questions/delete",
        method: "DELETE",
        data: { question_id: questionId },
      }),
    }),
    deleteAnswer: builder.mutation({
      query: (answerId) => ({
        url: "/answers/delete",
        method: "DELETE",
        data: { answer_id: answerId },
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
