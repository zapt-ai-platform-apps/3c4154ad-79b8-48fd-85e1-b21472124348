import { pgTable, serial, text, uuid, timestamp, integer, decimal, date, boolean } from 'drizzle-orm/pg-core';

// Accounts Chart
export const accountCategories = pgTable('account_categories', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // asset, liability, equity, revenue, expense
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  categoryId: integer('category_id').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  normalBalance: text('normal_balance').notNull(), // debit or credit
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Transactions and Journals
export const transactionTypes = pgTable('transaction_types', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  transactionDate: date('transaction_date').notNull(),
  referenceNo: text('reference_no').notNull(),
  description: text('description'),
  typeId: integer('type_id').notNull(),
  amount: decimal('amount', { precision: 19, scale: 4 }).notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  journalDate: date('journal_date').notNull(),
  referenceNo: text('reference_no').notNull(),
  description: text('description'),
  journalType: text('journal_type').notNull(), // general, adjustment, closing, reversing
  transactionId: integer('transaction_id'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const journalItems = pgTable('journal_items', {
  id: serial('id').primaryKey(),
  journalId: integer('journal_id').notNull(),
  accountId: integer('account_id').notNull(),
  description: text('description'),
  debit: decimal('debit', { precision: 19, scale: 4 }).default('0'),
  credit: decimal('credit', { precision: 19, scale: 4 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Ledgers
export const generalLedger = pgTable('general_ledger', {
  id: serial('id').primaryKey(),
  accountId: integer('account_id').notNull(),
  journalItemId: integer('journal_item_id').notNull(),
  postingDate: date('posting_date').notNull(),
  debit: decimal('debit', { precision: 19, scale: 4 }).default('0'),
  credit: decimal('credit', { precision: 19, scale: 4 }).default('0'),
  balance: decimal('balance', { precision: 19, scale: 4 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Fiscal Periods
export const fiscalYears = pgTable('fiscal_years', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isClosed: boolean('is_closed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Inventory
export const inventoryCategories = pgTable('inventory_categories', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // raw_material, work_in_process, finished_goods
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('category_id').notNull(),
  unit: text('unit').notNull(),
  unitCost: decimal('unit_cost', { precision: 19, scale: 4 }).notNull(),
  valuationMethod: text('valuation_method').notNull(), // fifo, lifo, average
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const inventoryTransactions = pgTable('inventory_transactions', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id').notNull(),
  transactionDate: date('transaction_date').notNull(),
  transactionType: text('transaction_type').notNull(), // purchase, production, consumption, sale
  quantity: decimal('quantity', { precision: 19, scale: 4 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 19, scale: 4 }).notNull(),
  totalCost: decimal('total_cost', { precision: 19, scale: 4 }).notNull(),
  referenceNo: text('reference_no'),
  journalId: integer('journal_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Fixed Assets
export const assetCategories = pgTable('asset_categories', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  depreciationMethod: text('depreciation_method').notNull(), // straight_line, reducing_balance
  depreciationRate: decimal('depreciation_rate', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const fixedAssets = pgTable('fixed_assets', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('category_id').notNull(),
  acquisitionDate: date('acquisition_date').notNull(),
  acquisitionCost: decimal('acquisition_cost', { precision: 19, scale: 4 }).notNull(),
  salvageValue: decimal('salvage_value', { precision: 19, scale: 4 }).default('0'),
  usefulLife: integer('useful_life').notNull(), // in months
  currentValue: decimal('current_value', { precision: 19, scale: 4 }).notNull(),
  accumulatedDepreciation: decimal('accumulated_depreciation', { precision: 19, scale: 4 }).default('0'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const depreciation = pgTable('depreciation', {
  id: serial('id').primaryKey(),
  assetId: integer('asset_id').notNull(),
  depreciationDate: date('depreciation_date').notNull(),
  amount: decimal('amount', { precision: 19, scale: 4 }).notNull(),
  accumulatedDepreciation: decimal('accumulated_depreciation', { precision: 19, scale: 4 }).notNull(),
  remainingValue: decimal('remaining_value', { precision: 19, scale: 4 }).notNull(),
  journalId: integer('journal_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Financial Statements
export const financialStatements = pgTable('financial_statements', {
  id: serial('id').primaryKey(),
  fiscalYearId: integer('fiscal_year_id').notNull(),
  statementType: text('statement_type').notNull(), // income_statement, balance_sheet, cash_flow, equity_change
  statementDate: date('statement_date').notNull(),
  data: text('data').notNull(), // JSON stringified data
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});