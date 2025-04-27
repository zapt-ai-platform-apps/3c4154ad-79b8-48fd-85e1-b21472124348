-- Create account categories table
CREATE TABLE IF NOT EXISTS "account_categories" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS "accounts" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category_id" INTEGER NOT NULL,
  "description" TEXT,
  "is_active" BOOLEAN DEFAULT TRUE,
  "normal_balance" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create transaction types table
CREATE TABLE IF NOT EXISTS "transaction_types" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS "transactions" (
  "id" SERIAL PRIMARY KEY,
  "transaction_date" DATE NOT NULL,
  "reference_no" TEXT NOT NULL,
  "description" TEXT,
  "type_id" INTEGER NOT NULL,
  "amount" DECIMAL(19,4) NOT NULL,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create journal entries table
CREATE TABLE IF NOT EXISTS "journal_entries" (
  "id" SERIAL PRIMARY KEY,
  "journal_date" DATE NOT NULL,
  "reference_no" TEXT NOT NULL,
  "description" TEXT,
  "journal_type" TEXT NOT NULL,
  "transaction_id" INTEGER,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create journal items table
CREATE TABLE IF NOT EXISTS "journal_items" (
  "id" SERIAL PRIMARY KEY,
  "journal_id" INTEGER NOT NULL,
  "account_id" INTEGER NOT NULL,
  "description" TEXT,
  "debit" DECIMAL(19,4) DEFAULT '0',
  "credit" DECIMAL(19,4) DEFAULT '0',
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create general ledger table
CREATE TABLE IF NOT EXISTS "general_ledger" (
  "id" SERIAL PRIMARY KEY,
  "account_id" INTEGER NOT NULL,
  "journal_item_id" INTEGER NOT NULL,
  "posting_date" DATE NOT NULL,
  "debit" DECIMAL(19,4) DEFAULT '0',
  "credit" DECIMAL(19,4) DEFAULT '0',
  "balance" DECIMAL(19,4) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create fiscal years table
CREATE TABLE IF NOT EXISTS "fiscal_years" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "is_closed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create inventory categories table
CREATE TABLE IF NOT EXISTS "inventory_categories" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create inventory items table
CREATE TABLE IF NOT EXISTS "inventory_items" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category_id" INTEGER NOT NULL,
  "unit" TEXT NOT NULL,
  "unit_cost" DECIMAL(19,4) NOT NULL,
  "valuation_method" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS "inventory_transactions" (
  "id" SERIAL PRIMARY KEY,
  "item_id" INTEGER NOT NULL,
  "transaction_date" DATE NOT NULL,
  "transaction_type" TEXT NOT NULL,
  "quantity" DECIMAL(19,4) NOT NULL,
  "unit_cost" DECIMAL(19,4) NOT NULL,
  "total_cost" DECIMAL(19,4) NOT NULL,
  "reference_no" TEXT,
  "journal_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create asset categories table
CREATE TABLE IF NOT EXISTS "asset_categories" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "depreciation_method" TEXT NOT NULL,
  "depreciation_rate" DECIMAL(5,2) NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create fixed assets table
CREATE TABLE IF NOT EXISTS "fixed_assets" (
  "id" SERIAL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category_id" INTEGER NOT NULL,
  "acquisition_date" DATE NOT NULL,
  "acquisition_cost" DECIMAL(19,4) NOT NULL,
  "salvage_value" DECIMAL(19,4) DEFAULT '0',
  "useful_life" INTEGER NOT NULL,
  "current_value" DECIMAL(19,4) NOT NULL,
  "accumulated_depreciation" DECIMAL(19,4) DEFAULT '0',
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create depreciation table
CREATE TABLE IF NOT EXISTS "depreciation" (
  "id" SERIAL PRIMARY KEY,
  "asset_id" INTEGER NOT NULL,
  "depreciation_date" DATE NOT NULL,
  "amount" DECIMAL(19,4) NOT NULL,
  "accumulated_depreciation" DECIMAL(19,4) NOT NULL,
  "remaining_value" DECIMAL(19,4) NOT NULL,
  "journal_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create financial statements table
CREATE TABLE IF NOT EXISTS "financial_statements" (
  "id" SERIAL PRIMARY KEY,
  "fiscal_year_id" INTEGER NOT NULL,
  "statement_type" TEXT NOT NULL,
  "statement_date" DATE NOT NULL,
  "data" TEXT NOT NULL,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);