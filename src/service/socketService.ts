// src/service/socketService.ts

import { io, Socket } from 'socket.io-client';

// ADAPTATION WEB : On utilise NEXT_PUBLIC_ au lieu de EXPO_PUBLIC_
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';
const ENABLE_SOCKET_IO = String(process.env.NEXT_PUBLIC_ENABLE_SOCKET_IO || '').toLowerCase() === 'true';

class SocketService {
  private socket: Socket | null;

  constructor() {
    this.socket = null;

    if (!ENABLE_SOCKET_IO) {
      console.log('🔌 [Web] Socket.IO désactivé (NEXT_PUBLIC_ENABLE_SOCKET_IO!=true)');
      return;
    }

    console.log(`🔌 [Web] Initialisation Socket.io vers ${SOCKET_URL}`);

    // On se connecte au serveur backend
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'], // Force l'utilisation des WebSockets pour la stabilité
      reconnectionAttempts: 5,     // Tentatives de reconnexion auto
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  // Écouteurs de base pour le débogage
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ [Web] Connecté au serveur Socket.IO');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`🔌 [Web] Déconnecté du serveur Socket.IO: ${reason}`);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ [Web] Erreur de connexion Socket.IO:', error.message);
    });
  }

  // --- Méthodes pour s'abonner aux événements (avec fonction de désabonnement) ---

  onNewAnnouncement(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('new_announcement', callback);
    return () => socket.off('new_announcement', callback);
  }

  onUpdateAnnouncement(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('updated_announcement', callback);
    return () => socket.off('updated_announcement', callback);
  }

  onDeleteAnnouncement(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('deleted_announcement', callback);
    return () => socket.off('deleted_announcement', callback);
  }

  // Idem pour les plannings
  onNewPlanning(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('new_planning', callback);
    return () => socket.off('new_planning', callback);
  }

  onUpdatePlanning(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('updated_planning', callback);
    return () => socket.off('updated_planning', callback);
  }

  onDeletePlanning(callback: (data: any) => void) {
    if (!this.socket) return () => {};
    const socket = this.socket;
    socket.on('deleted_planning', callback);
    return () => socket.off('deleted_planning', callback);
  }

  // --- Méthodes pour émettre des événements ---

  emitNewAnnouncement(data: any) {
    if (!this.socket) return;
    this.socket.emit('new_announcement', data);
  }

  emitUpdateAnnouncement(data: any) {
    if (!this.socket) return;
    this.socket.emit('updated_announcement', data);
  }

  emitDeleteAnnouncement(id: string) {
    if (!this.socket) return;
    this.socket.emit('deleted_announcement', { id });
  }

  emitNewPlanning(data: any) {
    if (!this.socket) return;
    this.socket.emit('new_planning', data);
  }

  emitUpdatePlanning(data: any) {
    if (!this.socket) return;
    this.socket.emit('updated_planning', data);
  }

  emitDeletePlanning(id: string) {
    if (!this.socket) return;
    this.socket.emit('deleted_planning', { id });
  }

  // --- Gestion générique des listeners ---
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

// On exporte une instance unique (singleton) du service
export const socketService = new SocketService();