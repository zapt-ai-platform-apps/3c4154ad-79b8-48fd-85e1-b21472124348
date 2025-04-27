import { db } from '@/indexedDb';
import * as Sentry from '@sentry/browser';

export const accountsService = {
  /**
   * Get all accounts with their categories
   * @returns {Promise<Array>} - List of accounts with category information
   */
  async getAllAccounts() {
    try {
      const accounts = await db.getAll(db.STORES.ACCOUNTS);
      const categories = await db.getAll(db.STORES.ACCOUNT_CATEGORIES);
      
      // Join accounts with their categories
      return accounts.map(account => {
        const category = categories.find(cat => cat.id === account.categoryId);
        return {
          ...account,
          categoryName: category?.name || 'Unknown',
          categoryType: category?.type || 'Unknown'
        };
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Get account by ID
   * @param {number} id - Account ID
   * @returns {Promise<Object>} - Account with category information
   */
  async getAccountById(id) {
    try {
      const account = await db.get(db.STORES.ACCOUNTS, id);
      if (!account) return null;
      
      const category = await db.get(db.STORES.ACCOUNT_CATEGORIES, account.categoryId);
      
      return {
        ...account,
        categoryName: category?.name || 'Unknown',
        categoryType: category?.type || 'Unknown'
      };
    } catch (error) {
      console.error(`Error fetching account with ID ${id}:`, error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Create a new account
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} - Created account
   */
  async createAccount(accountData) {
    try {
      const timestamp = new Date();
      const newAccount = {
        ...accountData,
        isActive: accountData.isActive !== undefined ? accountData.isActive : true,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const accountId = await db.add(db.STORES.ACCOUNTS, newAccount);
      return { ...newAccount, id: accountId };
    } catch (error) {
      console.error('Error creating account:', error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Update an existing account
   * @param {number} id - Account ID
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} - Updated account
   */
  async updateAccount(id, accountData) {
    try {
      const account = await db.get(db.STORES.ACCOUNTS, id);
      if (!account) {
        throw new Error('Account not found');
      }
      
      const updatedAccount = {
        ...account,
        ...accountData,
        updatedAt: new Date()
      };
      
      await db.update(db.STORES.ACCOUNTS, updatedAccount);
      return updatedAccount;
    } catch (error) {
      console.error(`Error updating account with ID ${id}:`, error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Delete an account
   * @param {number} id - Account ID
   * @returns {Promise<boolean>} - True if deleted successfully
   */
  async deleteAccount(id) {
    try {
      await db.delete(db.STORES.ACCOUNTS, id);
      return true;
    } catch (error) {
      console.error(`Error deleting account with ID ${id}:`, error);
      Sentry.captureException(error);
      throw error;
    }
  },
  
  /**
   * Get all account categories
   * @returns {Promise<Array>} - List of account categories
   */
  async getAllAccountCategories() {
    try {
      return await db.getAll(db.STORES.ACCOUNT_CATEGORIES);
    } catch (error) {
      console.error('Error fetching account categories:', error);
      Sentry.captureException(error);
      throw error;
    }
  }
};