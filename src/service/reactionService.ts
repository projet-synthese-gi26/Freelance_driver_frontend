import apiClient from "./apiClient";
import axios from "axios";
import { Reaction, ReactionPayload, ReactionTargetType } from "@/type/reaction";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reactionService = {
  getReactionsByTarget: async (
    targetId: string,
    targetType: ReactionTargetType
  ): Promise<Reaction[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/reactions`, {
        params: { targetId, targetType },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("❌ [reactionService] Error loading reactions:", error);
      return [];
    }
  },

  getReactionsByUser: async (userId: string): Promise<Reaction[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/reactions/user/${userId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("❌ [reactionService] Error loading user reactions:", error);
      return [];
    }
  },

  createReaction: async (payload: ReactionPayload): Promise<Reaction> => {
    const response = await apiClient.post("/api/v1/reactions", payload);
    return response.data;
  },

  deleteReaction: async (targetId: string, type: ReactionPayload["type"]): Promise<void> => {
    await apiClient.delete("/api/v1/reactions", {
      params: { targetId, type },
    });
  },
};
