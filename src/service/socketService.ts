// src/service/socketService.ts

import { io, Socket } from 'socket.io-client';

// ADAPTATION WEB : On utilise NEXT_PUBLIC_ au lieu de EXPO_PUBLIC_
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

class SocketService {
  private socket: Socket;

  constructor() {
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
    this.socket.on('new_announcement', callback);
    return () => this.socket.off('new_announcement', callback);
  }

  onUpdateAnnouncement(callback: (data: any) => void) {
    this.socket.on('updated_announcement', callback);
    return () => this.socket.off('updated_announcement', callback);
  }

  onDeleteAnnouncement(callback: (data: any) => void) {
    this.socket.on('deleted_announcement', callback);
    return () => this.socket.off('deleted_announcement', callback);
  }

  // Idem pour les plannings
  onNewPlanning(callback: (data: any) => void) {
    this.socket.on('new_planning', callback);
    return () => this.socket.off('new_planning', callback);
  }

  onUpdatePlanning(callback: (data: any) => void) {
    this.socket.on('updated_planning', callback);
    return () => this.socket.off('updated_planning', callback);
  }

  onDeletePlanning(callback: (data: any) => void) {
    this.socket.on('deleted_planning', callback);
    return () => this.socket.off('deleted_planning', callback);
  }

  // --- Méthodes pour émettre des événements ---

  emitNewAnnouncement(data: any) {
    this.socket.emit('new_announcement', data);
  }

  emitUpdateAnnouncement(data: any) {
    this.socket.emit('updated_announcement', data);
  }

  emitDeleteAnnouncement(id: string) {
    this.socket.emit('deleted_announcement', { id });
  }

  emitNewPlanning(data: any) {
    this.socket.emit('new_planning', data);
  }

  emitUpdatePlanning(data: any) {
    this.socket.emit('updated_planning', data);
  }

  emitDeletePlanning(id: string) {
    this.socket.emit('deleted_planning', { id });
  }

  // --- Gestion générique des listeners ---
  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }
}

// On exporte une instance unique (singleton) du service
export const socketService = new SocketService();