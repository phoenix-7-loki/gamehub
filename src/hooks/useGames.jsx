import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGames, getGameById, createGame, updateGame, deleteGame } from '../api';
import { useCartStore } from '../store/useCartStore';

export const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: getGames,
  });
};

export const useGame = (id) => {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => getGameById(id),
    enabled: !!id,
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGame,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game', data.id] });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
};