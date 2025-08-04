// Lifestyles/Listings API Integration
import { OutingsService } from '../core/outingsService.js';
import { authService } from '../core/auth.js';

class LifestylesAPI {
  constructor() {
    this.currentLocation = 'NYC'; // Default location
  }

  // Get all active listings/outings
  async getListings(location = null, limit = 50) {
    try {
      return await OutingsService.getActiveOutings(location || this.currentLocation, limit);
    } catch (error) {
      console.error('Error getting listings:', error);
      throw error;
    }
  }

  // Create new listing/outing
  async createListing(listingData) {
    try {
      if (!authService.currentUser) {
        throw new Error('User must be authenticated to create listings');
      }

      const outing = {
        title: listingData.title,
        description: listingData.description,
        location: listingData.location || this.currentLocation,
        scheduled_at: listingData.scheduledDate ? new Date(listingData.scheduledDate) : null,
        prize_type: listingData.prizeType || 'experience',
        media_assets: [],
        category: listingData.category || 'general'
      };

      return await OutingsService.createOuting(outing);
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  // Claim listing (for creators)
  async claimListing(listingId) {
    try {
      if (!authService.isCreator() && !authService.isAdmin()) {
        throw new Error('Only creators can claim listings');
      }

      return await OutingsService.claimOuting(listingId);
    } catch (error) {
      console.error('Error claiming listing:', error);
      throw error;
    }
  }

  // Get listings by category
  async getListingsByCategory(category, location = null) {
    try {
      const allListings = await this.getListings(location);
      return allListings.filter(listing => listing.category === category);
    } catch (error) {
      console.error('Error getting listings by category:', error);
      throw error;
    }
  }

  // Search listings
  async searchListings(searchTerm, location = null) {
    try {
      return await OutingsService.searchOutings(searchTerm, location);
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  }

  // Get popular locations
  async getPopularLocations() {
    try {
      return await OutingsService.getPopularLocations();
    } catch (error) {
      console.error('Error getting popular locations:', error);
      throw error;
    }
  }

  // Get user's claimed listings
  async getMyClaimedListings() {
    try {
      const walletId = authService.getWalletId();
      if (!walletId) throw new Error('No authenticated user');

      return await OutingsService.getClaimedOutings(walletId);
    } catch (error) {
      console.error('Error getting claimed listings:', error);
      throw error;
    }
  }

  // Update listing status
  async updateListingStatus(listingId, status) {
    try {
      return await OutingsService.updateOutingStatus(listingId, status);
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw error;
    }
  }

  // Add media to listing
  async addMediaToListing(listingId, mediaUrl, mediaType) {
    try {
      return await OutingsService.addMediaToOuting(listingId, mediaUrl, mediaType);
    } catch (error) {
      console.error('Error adding media to listing:', error);
      throw error;
    }
  }

  // Set current location
  setLocation(location) {
    this.currentLocation = location;
  }

  // Get current location
  getCurrentLocation() {
    return this.currentLocation;
  }

  // Get listing categories
  getCategories() {
    return [
      { id: 'dining', name: 'Dining & Food', icon: '🍽️' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
      { id: 'nightlife', name: 'Nightlife', icon: '🌙' },
      { id: 'culture', name: 'Arts & Culture', icon: '🎨' },
      { id: 'outdoor', name: 'Outdoor Activities', icon: '🌳' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️' },
      { id: 'wellness', name: 'Health & Wellness', icon: '🧘' },
      { id: 'social', name: 'Social Events', icon: '👥' },
      { id: 'adventure', name: 'Adventure', icon: '⚡' },
      { id: 'general', name: 'General', icon: '📍' }
    ];
  }

  // Get prize types
  getPrizeTypes() {
    return [
      { id: 'ticket', name: 'Event Ticket', icon: '🎫' },
      { id: 'voucher', name: 'Voucher/Discount', icon: '💰' },
      { id: 'experience', name: 'Experience', icon: '✨' },
      { id: 'merchandise', name: 'Merchandise', icon: '🎁' },
      { id: 'tokens', name: 'KTG Tokens', icon: '🪙' },
      { id: 'diamonds', name: 'Diamonds', icon: '💎' }
    ];
  }

  // Format listing for display
  formatListing(listing) {
    return {
      ...listing,
      formattedDate: listing.scheduled_at ? 
        new Date(listing.scheduled_at.seconds * 1000).toLocaleDateString() : 
        'Flexible',
      categoryInfo: this.getCategories().find(cat => cat.id === listing.category),
      prizeInfo: this.getPrizeTypes().find(prize => prize.id === listing.prize_type),
      isClaimable: !listing.claimed && (authService.isCreator() || authService.isAdmin()),
      canEdit: listing.created_by === authService.getWalletId() || 
               listing.claimed_by_creator === authService.getWalletId() ||
               authService.isAdmin()
    };
  }
}

// Create singleton instance
export const lifestylesAPI = new LifestylesAPI();

// Export for use in Lifestyles components
export default lifestylesAPI;