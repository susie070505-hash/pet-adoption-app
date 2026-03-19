import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase'; // adjusting path assuming AppContext is in context/

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 检查当前登录用户
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    fetchPets();
    if (user) {
      fetchFavorites();
      fetchChats();
    } else {
      setFavorites([]);
      setChats([]);
    }
  }, [user]);

  const fetchPets = async () => {
    const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPets(data);
    } else {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchFavorites = async () => {
    const { data, error } = await supabase.from('favorites').select('pet_id').eq('user_id', user.id);
    if (!error && data) {
      setFavorites(data.map(fav => fav.pet_id));
    }
  };

  const fetchChats = async () => {
    // 假设联表查询获取 messages
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        messages (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Supabase 联表返回后，messages 可能是乱序的，可以再排序一下
      const formattedChats = data.map(chat => ({
        ...chat,
        messages: chat.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      }));
      setChats(formattedChats);
    }
  };

  const toggleFavorite = async (petId) => {
    if (!user) return;
    const isFav = favorites.includes(petId);
    
    // Optimistic UI update
    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== petId) : [...prev, petId]
    );

    if (isFav) {
      await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: petId });
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, pet_id: petId });
    }
  };

  const isFavorite = (petId) => favorites.includes(petId);

  const addMessageToChat = async (chatId, messageText) => {
    if (!user) return;
    
    // Optimistic UI update
    const newMessage = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      sender_id: user.id,
      text: messageText,
      created_at: new Date().toISOString(),
      is_from_user: true
    };
    
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              last_message: messageText,
              messages: [...(chat.messages || []), newMessage]
            }
          : chat
      )
    );

    await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: user.id,
      text: messageText,
      is_from_user: true
    });
    
    await supabase.from('chats').update({ last_message: messageText }).eq('id', chatId);
  };

  const value = useMemo(
    () => ({
      pets,
      favorites,
      isFavorite,
      toggleFavorite,
      chats,
      addMessageToChat,
      user
    }),
    [pets, favorites, chats, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
