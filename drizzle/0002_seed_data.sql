-- Seed account categories
INSERT INTO "account_categories" ("code", "name", "type") VALUES
('1', 'Aset Lancar', 'asset'),
('2', 'Aset Tetap', 'asset'),
('3', 'Kewajiban Lancar', 'liability'),
('4', 'Kewajiban Jangka Panjang', 'liability'),
('5', 'Ekuitas', 'equity'),
('6', 'Pendapatan', 'revenue'),
('7', 'Harga Pokok Penjualan', 'expense'),
('8', 'Beban Operasional', 'expense')
ON CONFLICT DO NOTHING;

-- Seed accounts
INSERT INTO "accounts" ("code", "name", "category_id", "normal_balance", "description") VALUES
('1101', 'Kas', 1, 'debit', 'Kas tersedia'),
('1102', 'Bank', 1, 'debit', 'Kas di bank'),
('1103', 'Piutang Usaha', 1, 'debit', 'Piutang dari pelanggan'),
('1104', 'Persediaan Bahan Baku', 1, 'debit', 'Persediaan bahan baku'),
('1105', 'Persediaan Barang Dalam Proses', 1, 'debit', 'Persediaan barang dalam proses produksi'),
('1106', 'Persediaan Barang Jadi', 1, 'debit', 'Persediaan barang jadi siap dijual'),
('2101', 'Tanah', 2, 'debit', 'Tanah perusahaan'),
('2102', 'Bangunan', 2, 'debit', 'Bangunan perusahaan'),
('2103', 'Mesin dan Peralatan', 2, 'debit', 'Mesin dan peralatan produksi'),
('2104', 'Akumulasi Penyusutan Bangunan', 2, 'credit', 'Akumulasi penyusutan bangunan'),
('2105', 'Akumulasi Penyusutan Mesin dan Peralatan', 2, 'credit', 'Akumulasi penyusutan mesin dan peralatan'),
('3101', 'Utang Usaha', 3, 'credit', 'Utang kepada supplier'),
('3102', 'Utang Gaji', 3, 'credit', 'Utang gaji karyawan'),
('3103', 'Utang Pajak', 3, 'credit', 'Utang pajak perusahaan'),
('4101', 'Utang Bank Jangka Panjang', 4, 'credit', 'Utang bank jangka panjang'),
('5101', 'Modal Disetor', 5, 'credit', 'Modal yang disetor oleh pemilik'),
('5102', 'Laba Ditahan', 5, 'credit', 'Laba ditahan perusahaan'),
('6101', 'Pendapatan Penjualan', 6, 'credit', 'Pendapatan dari penjualan produk'),
('7101', 'Biaya Bahan Baku', 7, 'debit', 'Biaya bahan baku yang digunakan'),
('7102', 'Biaya Tenaga Kerja Langsung', 7, 'debit', 'Biaya tenaga kerja langsung produksi'),
('7103', 'Biaya Overhead Pabrik', 7, 'debit', 'Biaya overhead pabrik'),
('8101', 'Beban Gaji Administrasi', 8, 'debit', 'Beban gaji staff administrasi'),
('8102', 'Beban Pemasaran', 8, 'debit', 'Beban pemasaran dan iklan'),
('8103', 'Beban Utilitas', 8, 'debit', 'Beban listrik, air, dan telepon'),
('8104', 'Beban Penyusutan', 8, 'debit', 'Beban penyusutan aset tetap')
ON CONFLICT DO NOTHING;

-- Seed transaction types
INSERT INTO "transaction_types" ("code", "name", "description") VALUES
('PO', 'Pembelian Bahan Baku', 'Transaksi pembelian bahan baku'),
('PP', 'Produksi', 'Transaksi produksi barang'),
('SJ', 'Penjualan', 'Transaksi penjualan produk'),
('PR', 'Pembayaran', 'Transaksi pembayaran'),
('RC', 'Penerimaan', 'Transaksi penerimaan pembayaran'),
('EX', 'Pengeluaran', 'Transaksi pengeluaran operasional')
ON CONFLICT DO NOTHING;

-- Seed inventory categories
INSERT INTO "inventory_categories" ("code", "name", "type") VALUES
('RM', 'Bahan Baku', 'raw_material'),
('WP', 'Barang Dalam Proses', 'work_in_process'),
('FG', 'Barang Jadi', 'finished_goods')
ON CONFLICT DO NOTHING;

-- Seed asset categories
INSERT INTO "asset_categories" ("code", "name", "depreciation_method", "depreciation_rate") VALUES
('BLD', 'Bangunan', 'straight_line', 5.00),
('MCH', 'Mesin Produksi', 'straight_line', 10.00),
('VHC', 'Kendaraan', 'straight_line', 20.00),
('OFF', 'Peralatan Kantor', 'straight_line', 25.00)
ON CONFLICT DO NOTHING;