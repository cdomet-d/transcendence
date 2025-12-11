import { createVisualFeedback, redirectOnError } from "../error";

const ERROR_HANDLERS: Record<string, { message: string; action: 'feedback' | 'redirect' }> = {
    'not enough players': {
        message: 'You do not have enough players in your lobby to start playing!',
        action: 'feedback'
    },
    'lobby not found': {
        message: 'Your lobby is malfunctioning! Please create a new one!',
        action: 'feedback'
    },
    'lobby does not exist': {
        message: 'The lobby you are trying to join does not exist anymore!',
        action: 'redirect'
    },
    'not invited': {
        message: 'You were not invited to this lobby!',
        action: 'feedback'
    },
    'user not in lobby': {
        message: 'You are not in a lobby. Please create or join one first!',
        action: 'feedback'
    },
    
    'not lobby host': {
        message: 'Only the lobby host can perform this action!',
        action: 'feedback'
    },
    'Unauthorized': {
        message: 'Unauthorized action detected. Please log in again.',
        action: 'redirect'
    },
    'user mismatch': {
        message: 'Unauthorized action detected. Please log in again.',
        action: 'redirect'
    },
    
    'cannot invite yourself': {
        message: 'You cannot invite yourself to the lobby!',
        action: 'feedback'
    },
    'invalid invitee': {
        message: 'Invalid user selected. Please try again!',
        action: 'feedback'
    },
    'host data corrupted': {
        message: 'Lobby data corrupted. Please create a new lobby!',
        action: 'redirect'
    },
    'invalid lobby': {
        message: 'Invalid lobby detected. Please refresh and try again!',
        action: 'feedback'
    },
    
    'Invalid message format': {
        message: 'Connection error. Please refresh the page.',
        action: 'feedback'
    }
};

export function handleError(error: string): void {
    const handler = ERROR_HANDLERS[error];
    
    if (handler) {
        if (handler.action === 'redirect') {
            redirectOnError('/home', handler.message);
        } else {
            createVisualFeedback(handler.message, 'error');
        }
    } else {
        console.error('Unhandled error from server:', error);
        createVisualFeedback('An unexpected error occurred. Please try again.', 'error');
    }
}