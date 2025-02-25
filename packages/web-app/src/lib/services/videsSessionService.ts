import { pb } from '$lib/pocketbase';
import type { VideoSession } from '$lib/types';

/**
 * Helper function to filter allowed fields
 */
const filteredObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
    let newObj: { [key: string]: any } = {};
    Object.keys(obj).forEach((key: string) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};

/**
 * Create a new Video Session
 */
export async function createVideoSession(data: Partial<VideoSession>): Promise<VideoSession> {
    try {
        const newSession = await pb.collection('VideoSessions').create(data);
        return newSession as unknown as VideoSession;
    } catch (error) {
        console.error('Failed to create video session:', error);
        throw new Error('Unable to create video session. Please try again.');
    }
}

/**
 * Get a single Video Session by ID
 */
export async function getVideoSession(sessionId: string): Promise<VideoSession> {
    try {
        const session = await pb.collection('VideoSessions').getOne(sessionId);
        return session as unknown as VideoSession;
    } catch (error) {
        console.error('Failed to fetch video session:', error);
        throw new Error('Unable to fetch video session. Please try again.');
    }
}

/**
 * Get all Video Sessions (optional filtering)
 */
export async function getAllVideoSessions(filter?: string): Promise<VideoSession[]> {
    try {
        const sessions = await pb.collection('VideoSessions').getFullList({
            filter: filter || '',
            sort: '-created',
        });

        return sessions as unknown as VideoSession[];
    } catch (error) {
        console.error('Failed to fetch video sessions:', error);
        throw new Error('Unable to fetch video sessions. Please try again.');
    }
}

/**
 * Update a Video Session
 */
export async function updateVideoSession(sessionId: string, updatedData: Partial<VideoSession>): Promise<VideoSession> {
    try {
        // Ensure only valid fields are updated
        const filteredData = filteredObj(
            updatedData,
            "session_start", "session_end", "appointment_id", "session_url"
        );

        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for update");
        }

        const updatedSession = await pb.collection('VideoSessions').update(sessionId, filteredData);
        return updatedSession as unknown as VideoSession;
    } catch (error) {
        console.error('Failed to update video session:', error);
        throw new Error('Unable to update video session. Please try again.');
    }
}

/**
 * Soft delete a Video Session (marks as deleted)
 */
export async function softDeleteVideoSession(sessionId: string): Promise<void> {
    try {
        await pb.collection('VideoSessions').update(sessionId, { deleted: true });
    } catch (error) {
        console.error('Failed to soft delete video session:', error);
        throw new Error('Unable to delete video session. Please try again.');
    }
}

/**
 * Restore a soft-deleted Video Session
 */
export async function restoreVideoSession(sessionId: string): Promise<void> {
    try {
        await pb.collection('VideoSessions').update(sessionId, { deleted: false });
    } catch (error) {
        console.error('Failed to restore video session:', error);
        throw new Error('Unable to restore video session. Please try again.');
    }
}

/**
 * Permanently delete a Video Session
 */
export async function deleteVideoSession(sessionId: string): Promise<void> {
    try {
        await pb.collection('VideoSessions').delete(sessionId);
    } catch (error) {
        console.error('Failed to permanently delete video session:', error);
        throw new Error('Unable to delete video session permanently. Please try again.');
    }
}
