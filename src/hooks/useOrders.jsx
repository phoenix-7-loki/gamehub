import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../api';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';

export const useOrders = () => {
  const { userEmail } = useUserStore();
  return useQuery({
    queryKey: ['orders', userEmail],
    queryFn: getOrders,
    enabled: !!userEmail,
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { userEmail } = useUserStore();
  const { items, getTotal, clearCart } = useCartStore();
  
  return useMutation({
    mutationFn: async () => {
      const orderData = {
        reference: `CMD-${Date.now()}`,
        date: new Date().toISOString(),
        userId: userEmail,
        items: items.map(item => ({
          gameId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotal(),
        status: 'draft',
      };
      const order = await createOrder(orderData);
      clearCart();
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
};