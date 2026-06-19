/**
 * Seller Verification Status Utilities
 * Checks if a seller is approved in the platform verification process
 */

import type { User } from '../types';

/**
 * Check if a seller is platform-approved (verified seller)
 * A seller is considered verified if their latest verification application status is APPROVED
 * 
 * @param user - The seller/user to check
 * @returns true if seller is platform-approved, false otherwise
 */
export function isSellerVerified(user: User | undefined | null): boolean {
  if (!user) return false;

  // Check if they have a verification application with APPROVED status
  // The backend returns verificationApplications as an array with the latest first
  const latestVerification = user.verificationApplications?.[0];
  if (latestVerification?.status === 'APPROVED') {
    return true;
  }

  // Also check the verification field as a fallback (though it should use the array above)
  const verification = user.verification;
  if (verification?.status === 'APPROVED' || verification?.approved === true) {
    return true;
  }

  return false;
}

/**
 * Get seller verification status label
 * @param user - The seller/user to check
 * @returns Status string: 'APPROVED', 'PENDING', 'REJECTED', or 'NONE'
 */
export function getSellerVerificationStatus(user: User | undefined | null): 'APPROVED' | 'PENDING' | 'REJECTED' | 'NONE' {
  if (!user) return 'NONE';

  const latestVerification = user.verificationApplications?.[0];
  
  if (latestVerification?.status === 'APPROVED') {
    return 'APPROVED';
  }
  
  if (latestVerification?.status === 'SUBMITTED' || latestVerification?.status === 'IN_REVIEW') {
    return 'PENDING';
  }
  
  if (latestVerification?.status === 'REJECTED') {
    return 'REJECTED';
  }

  return 'NONE';
}
