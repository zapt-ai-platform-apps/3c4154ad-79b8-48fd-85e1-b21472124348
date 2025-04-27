import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { accounts, accountCategories } from '../drizzle/schema.js';
import { authenticateUser, handleApiError } from './_apiUtils.js';
import { eq } from 'drizzle-orm';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`API request to ${req.url} with method ${req.method}`);
  
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    
    // Initialize database connection
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    if (req.method === 'GET') {
      console.log('Fetching accounts');
      
      // Join accounts with their categories
      const result = await db
        .select({
          id: accounts.id,
          code: accounts.code,
          name: accounts.name,
          description: accounts.description,
          isActive: accounts.isActive,
          normalBalance: accounts.normalBalance,
          categoryId: accounts.categoryId,
          categoryName: accountCategories.name,
          categoryType: accountCategories.type
        })
        .from(accounts)
        .leftJoin(accountCategories, eq(accounts.categoryId, accountCategories.id));
      
      console.log(`Fetched ${result.length} accounts`);
      return res.status(200).json(result);
    }
    
    if (req.method === 'POST') {
      const accountData = req.body;
      console.log('Creating new account:', accountData);
      
      // Validate required fields
      if (!accountData.code || !accountData.name || !accountData.categoryId || !accountData.normalBalance) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const result = await db.insert(accounts).values({
        code: accountData.code,
        name: accountData.name,
        categoryId: accountData.categoryId,
        description: accountData.description || null,
        normalBalance: accountData.normalBalance,
        isActive: accountData.isActive !== undefined ? accountData.isActive : true
      }).returning();
      
      console.log('Account created:', result[0]);
      return res.status(201).json(result[0]);
    }
    
    if (req.method === 'PUT') {
      const { id, ...accountData } = req.body;
      console.log(`Updating account with ID ${id}:`, accountData);
      
      if (!id) {
        return res.status(400).json({ error: 'Missing account ID' });
      }
      
      const result = await db.update(accounts)
        .set({
          code: accountData.code,
          name: accountData.name,
          categoryId: accountData.categoryId,
          description: accountData.description,
          normalBalance: accountData.normalBalance,
          isActive: accountData.isActive,
          updatedAt: new Date()
        })
        .where(eq(accounts.id, id))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      console.log('Account updated:', result[0]);
      return res.status(200).json(result[0]);
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      console.log(`Deleting account with ID ${id}`);
      
      if (!id) {
        return res.status(400).json({ error: 'Missing account ID' });
      }
      
      const result = await db.delete(accounts)
        .where(eq(accounts.id, parseInt(id)))
        .returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      console.log('Account deleted:', result[0]);
      return res.status(200).json({ message: 'Account deleted successfully' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return handleApiError(error, res, 'Failed to process accounts request');
  }
}