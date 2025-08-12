// Outings Service for Lifestyles/Listings Management
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase.js';
import { authService } from './auth.js';

export class OutingsService {
  // Create new outing
  static async createOuting(outingData) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      const outing = {
        ...outingData,
        created_by: currentWalletId,
        created_at: serverTimestamp(),
        claimed: false,
        claimed_by_creator: null,
        status: 'active'
      };

      const outingRef = await addDoc(collection(db, 'Outings'), outing);
      return outingRef.id;
    } catch (error) {
      console.error('Error creating outing:', error);
      throw error;
    }
  }

  // Get all active outings
  static async getActiveOutings(location = null, limit_count = 50) {
    try {
      let outingsQuery = query(
        collection(db, 'Outings'),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc'),
        limit(limit_count)
      );

      if (location) {
        outingsQuery = query(
          collection(db, 'Outings'),
          where('status', '==', 'active'),
          where('location', '==', location),
          orderBy('created_at', 'desc'),
          limit(limit_count)
        );
      }

      const outingDocs = await getDocs(outingsQuery);
      return outingDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting active outings:', error);
      throw error;
    }
  }

  // Claim outing by creator
  static async claimOuting(outingId) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      // Check if user is creator level
      if (!authService.isCreator() && !authService.isAdmin()) {
        throw new Error('Only creators can claim outings');
      }

      const outingRef = doc(db, 'Outings', outingId);
      const outingDoc = await getDoc(outingRef);

      if (!outingDoc.exists()) {
        throw new Error('Outing not found');
      }

      const outingData = outingDoc.data();
      if (outingData.claimed) {
        throw new Error('Outing already claimed');
      }

      await updateDoc(outingRef, {
        claimed: true,
        claimed_by_creator: currentWalletId,
        claimed_at: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error claiming outing:', error);
      throw error;
    }
  }

  // Get outings by location
  static async getOutingsByLocation(location) {
    try {
      const outingsQuery = query(
        collection(db, 'Outings'),
        where('location', '==', location),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      );

      const outingDocs = await getDocs(outingsQuery);
      return outingDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting outings by location:', error);
      throw error;
    }
  }

  // Get claimed outings by creator
  static async getClaimedOutings(creatorWalletId) {
    try {
      const outingsQuery = query(
        collection(db, 'Outings'),
        where('claimed_by_creator', '==', creatorWalletId),
        orderBy('claimed_at', 'desc')
      );

      const outingDocs = await getDocs(outingsQuery);
      return outingDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting claimed outings:', error);
      throw error;
    }
  }

  // Update outing status
  static async updateOutingStatus(outingId, status) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      const outingRef = doc(db, 'Outings', outingId);
      const outingDoc = await getDoc(outingRef);

      if (!outingDoc.exists()) {
        throw new Error('Outing not found');
      }

      const outingData = outingDoc.data();
      
      // Check if user can update this outing
      if (outingData.created_by !== currentWalletId && 
          outingData.claimed_by_creator !== currentWalletId && 
          !authService.isAdmin()) {
        throw new Error('Not authorized to update this outing');
      }

      await updateDoc(outingRef, {
        status: status,
        updated_at: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating outing status:', error);
      throw error;
    }
  }

  // Add media to outing
  static async addMediaToOuting(outingId, mediaUrl, mediaType) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      const outingRef = doc(db, 'Outings', outingId);
      const outingDoc = await getDoc(outingRef);

      if (!outingDoc.exists()) {
        throw new Error('Outing not found');
      }

      const outingData = outingDoc.data();
      const currentMedia = outingData.media_assets || [];
      
      const newMedia = {
        url: mediaUrl,
        type: mediaType,
        uploaded_by: currentWalletId,
        uploaded_at: serverTimestamp()
      };

      await updateDoc(outingRef, {
        media_assets: [...currentMedia, newMedia]
      });

      return true;
    } catch (error) {
      console.error('Error adding media to outing:', error);
      throw error;
    }
  }

  // Get popular locations
  static async getPopularLocations(limit_count = 10) {
    try {
      const outingsQuery = query(
        collection(db, 'Outings'),
        where('status', '==', 'active')
      );

      const outingDocs = await getDocs(outingsQuery);
      const locationCounts = {};

      outingDocs.docs.forEach(doc => {
        const location = doc.data().location;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });

      return Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit_count)
        .map(([location, count]) => ({ location, count }));
    } catch (error) {
      console.error('Error getting popular locations:', error);
      throw error;
    }
  }

  // Search outings
  static async searchOutings(searchTerm, location = null) {
    try {
      let outingsQuery = query(
        collection(db, 'Outings'),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      );

      const outingDocs = await getDocs(outingsQuery);
      let results = outingDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by search term (client-side for now)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(outing => 
          outing.title?.toLowerCase().includes(term) ||
          outing.description?.toLowerCase().includes(term) ||
          outing.location?.toLowerCase().includes(term)
        );
      }

      // Filter by location
      if (location) {
        results = results.filter(outing => 
          outing.location?.toLowerCase() === location.toLowerCase()
        );
      }

      return results;
    } catch (error) {
      console.error('Error searching outings:', error);
      throw error;
    }
  }
}

export default OutingsService;