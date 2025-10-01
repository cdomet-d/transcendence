//interface UserProfile {
//    avatar: string;
//    biography: string;
//    joinedOn: string;
//    profileColor: string;
//    rank: string;
//    status: boolean;
//    username: string;
//}
//
//// Fetches the full user profile card from the users service
//export async function getUserProfile(userId: number): Promise<UserProfile | null> {
//    try {
//        // NOTE: This assumes you have an endpoint like this on your users service
//        const response = await fetch(`http://users:2626/internal/users/profile/${userId}`);
//        
//        if (response.status === 404) return null;
//        if (!response.ok) throw new Error(`Users service returned status: ${response.status}`);
//
//        return await response.json() as UserProfile;
//    } catch (error) {
//        console.error(`Error fetching profile for user ID ${userId}:`, error);
//        throw error;
//    }
//}