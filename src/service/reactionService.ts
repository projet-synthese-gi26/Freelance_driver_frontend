import apiClient from "./apiClient";
import publicClient from "./publicClient";
import { Reaction, ReactionPayload, ReactionTargetType } from "@/type/reaction";
import { sessionService } from "./sessionService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reactionService = {
  getReactionsByTarget: async (
    targetId: string,
    targetType: ReactionTargetType
  ): Promise<Reaction[]> => {
    try {
      const response = await publicClient.get(`/api/v1/reactions`, {
        params: { targetId, targetType },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const response = await apiClient.get(`/api/v1/reactions`, {
          params: { targetId, targetType },
        });
        return Array.isArray(response.data) ? response.data : [];
      }
      console.error("❌ [reactionService] Error loading reactions:", error);
      return [];
    }
  },

  getReactionsByUser: async (userId: string): Promise<Reaction[]> => {
    try {
      const response = await publicClient.get(`/api/v1/reactions/user/${userId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      if (error?.response?.status === 401) {
        const response = await apiClient.get(`/api/v1/reactions/user/${userId}`);
        return Array.isArray(response.data) ? response.data : [];
      }
      console.error("❌ [reactionService] Error loading user reactions:", error);
      return [];
    }
  },

  createReaction: async (payload: ReactionPayload): Promise<Reaction> => {
    const token = sessionService.getAuthToken();
    console.warn("🔐 [reactionService] createReaction token present:", Boolean(token));
    const response = await apiClient.post("/api/v1/reactions", payload, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  },

  deleteReaction: async (targetId: string, type: ReactionPayload["type"]): Promise<void> => {
    const token = sessionService.getAuthToken();
    console.warn("🔐 [reactionService] deleteReaction token present:", Boolean(token));
    await apiClient.delete("/api/v1/reactions", {
      params: { targetId, type },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },
};
