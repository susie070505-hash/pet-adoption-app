import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../supabase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [adoptionApplications, setAdoptionApplications] = useState([]);

  useEffect(() => {
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
      fetchProfile();
      fetchAdoptionApplications();
    } else {
      setFavorites([]);
      setChats([]);
      setProfile(null);
      setAdoptionApplications([]);
    }
  }, [user]);

  const fetchPets = async () => {
    const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false });
    if (!error && data) setPets(data);
  };

  const fetchFavorites = async () => {
    const { data, error } = await supabase.from('favorites').select('pet_id').eq('user_id', user.id);
    if (!error && data) setFavorites(data.map(fav => fav.pet_id));
  };

  const markAsAdopted = async (petId) => {
    const { error } = await supabase.from('pets').update({ status: 'adopted' }).eq('id', petId);
    if (!error) {
      setPets(prev => prev.map(p => p.id === petId ? { ...p, status: 'adopted' } : p));
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        if (newMessage.sender_id !== user.id) {
          // Simple foreground notification
          // Alert.alert('新消息', newMessage.text); // Too intrusive? Maybe just update state.
        }
        setChats(prev => prev.map(chat => 
          chat.id === newMessage.chat_id 
            ? { ...chat, messages: [...(chat.messages || []), { ...newMessage, is_from_user: newMessage.sender_id === user.id }] }
            : chat
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (!error && data) setProfile(data);
    else if (error) {
      console.log('fetchProfile error:', error);
      if (error.code === 'PGRST116') {
        const { data: newProfile } = await supabase.from('profiles').insert({ id: user.id, nickname: '新用户', city: '上海' }).select().single();
        if (newProfile) setProfile(newProfile);
      }
    }
  };

  const fetchAdoptionApplications = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*, pets(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setAdoptionApplications(data);
  };

  const fetchChats = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chats')
      .select(`*, messages (*)`)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (!error && data) {
      setChats(data.map(chat => ({
        ...chat,
        messages: (chat.messages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      })));
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })
      .select().single();
    if (!error && data) setProfile(data);
    if (error) throw error;
  };

  const toggleFavorite = async (petId) => {
    if (!user) return;
    const isFav = favorites.includes(petId);
    setFavorites(prev => isFav ? prev.filter(id => id !== petId) : [...prev, petId]);
    if (isFav) {
      await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: petId });
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, pet_id: petId });
    }
  };

  const isFavorite = (petId) => favorites.includes(petId);

  const addMessageToChat = async (chatId, messageText) => {
    if (!user) return;
    const newMessage = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      sender_id: user.id,
      text: messageText,
      created_at: new Date().toISOString(),
      is_from_user: true
    };
    
    // Optimistic update
    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, last_message: messageText, messages: [...(chat.messages || []), newMessage], updated_at: new Date().toISOString() }
        : chat
    ));

    const { error } = await supabase.from('messages').insert({ 
      chat_id: chatId, 
      sender_id: user.id, 
      text: messageText, 
      is_from_user: true 
    });
    
    if (!error) {
      await supabase.from('chats').update({ 
        last_message: messageText, 
        updated_at: new Date().toISOString() 
      }).eq('id', chatId);
    }
  };

  const submitAdoption = async (petId, formData) => {
    if (!user) throw new Error('NOT_LOGGED_IN');
    const { data, error } = await supabase.from('adoption_applications').insert({
      user_id: user.id,
      pet_id: petId,
      applicant_name: formData.name,
      contact: formData.contact,
      experience: formData.experience,
      note: formData.note,
      id_card_front: formData.idCardFront || null,
      id_card_back: formData.idCardBack || null,
      status: 'pending',
    }).select().single();
    if (error) throw error;
    // refresh applications list
    setAdoptionApplications(prev => [data, ...prev]);
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    pets, favorites, isFavorite, toggleFavorite,
    chats, addMessageToChat, markAsAdopted,
    user, profile, updateProfile, signOut,
    adoptionApplications, fetchAdoptionApplications,
    submitAdoption,
  }), [pets, favorites, chats, user, profile, adoptionApplications, markAsAdopted]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
