-- ══════════════════════════════════════════════════════════
--  Kavas B2B Platform — Notifications Table (Final Schema)
--  Adds `role` column to distinguish buyer / vendor / admin
--  notifications in the same table.
-- ══════════════════════════════════════════════════════════

-- 1. Create the notifications table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL,
  title       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'buyer'
                CHECK (role IN ('buyer', 'vendor', 'admin')),
  is_read     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- 2. If the table already existed without the role column, add it:
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'buyer'
    CHECK (role IN ('buyer', 'vendor', 'admin'));

-- 3. Foreign key constraint → public.users(id) ON DELETE CASCADE
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 4. Indexes — matching your Neon setup + new role index
CREATE INDEX IF NOT EXISTS idx_notifications_user
  ON public.notifications USING BTREE (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_read
  ON public.notifications USING BTREE (is_read);

-- New: filter by role efficiently
CREATE INDEX IF NOT EXISTS idx_notifications_role
  ON public.notifications USING BTREE (role);

-- Compound index: most common query pattern (user + role + unread)
CREATE INDEX IF NOT EXISTS idx_notifications_user_role_read
  ON public.notifications (user_id, role, is_read);

-- ══════════════════════════════════════════════════════════
--  Notification types per role
-- ══════════════════════════════════════════════════════════
--
--  role = 'buyer'
--    type IN ('Orders', 'Payments', 'Shipping', 'Messages', 'Offers', 'System')
--
--  role = 'vendor'
--    type IN ('New Order', 'Payment Received', 'RFQ Request',
--             'Buyer Review', 'Inventory Alert', 'System')
--
--  role = 'admin'
--    type IN ('New User', 'Vendor Approval', 'Order Issue',
--             'Payment', 'Compliance', 'System')

-- ══════════════════════════════════════════════════════════
--  Optional seed data (replace UUIDs with real ones)
-- ══════════════════════════════════════════════════════════
/*

-- BUYER seed
INSERT INTO public.notifications (user_id, role, type, title, message) VALUES
  ('<buyer-uuid>', 'buyer', 'Orders',   'Order #KAVAS-7821 confirmed',        'Your bulk order of 500 units has been confirmed.'),
  ('<buyer-uuid>', 'buyer', 'Shipping', 'Shipment out for delivery',           'Order #KAVAS-7819 is out for delivery today.'),
  ('<buyer-uuid>', 'buyer', 'Payments', 'Payment successful — ₹2,45,000',     'Payment for Invoice #INV-20240517 received.'),
  ('<buyer-uuid>', 'buyer', 'Messages', 'New message from Rajesh Metals Ltd.', 'Rajesh Metals replied to your RFQ with a 5% discount.'),
  ('<buyer-uuid>', 'buyer', 'Offers',   'Flash sale: 30% off textiles',        'Limited-time offer on premium cotton and linen fabrics.'),
  ('<buyer-uuid>', 'buyer', 'System',   'Account verified',                    'Your business account is verified. B2B pricing unlocked.');

-- VENDOR seed
INSERT INTO public.notifications (user_id, role, type, title, message) VALUES
  ('<vendor-uuid>', 'vendor', 'New Order',        'New order received — #KAVAS-7821',   'Priya Enterprises ordered 500 units worth ₹2,45,000.'),
  ('<vendor-uuid>', 'vendor', 'RFQ Request',      'New RFQ from Sharma Traders',         'Sharma Traders submitted an RFQ for 2000 Steel Bolts.'),
  ('<vendor-uuid>', 'vendor', 'Payment Received', 'Payment received — ₹1,80,000',        'Credited to your payout account for Order #KAVAS-7815.'),
  ('<vendor-uuid>', 'vendor', 'Buyer Review',     'New 5★ review from Arjun Industries', 'Excellent quality, timely delivery. Highly recommended!'),
  ('<vendor-uuid>', 'vendor', 'Inventory Alert',  'Low stock — Industrial Steel Pipes',  'Only 45 units remaining (SKU: ISP-1020).'),
  ('<vendor-uuid>', 'vendor', 'System',           'Store profile approved',               'Your store is now visible to all buyers on Kavas.');

-- ADMIN seed
INSERT INTO public.notifications (user_id, role, type, title, message) VALUES
  ('<admin-uuid>', 'admin', 'New User',        'New buyer — Priya Enterprises',           'Priya Enterprises registered. Business verification pending.'),
  ('<admin-uuid>', 'admin', 'Vendor Approval', 'Vendor approval — Rajesh Metals Ltd.',    'Documents submitted. GST and trade license uploaded.'),
  ('<admin-uuid>', 'admin', 'Order Issue',     'Dispute raised — Order #KAVAS-7790',      'Sharma Traders raised a dispute. Wrong product delivered.'),
  ('<admin-uuid>', 'admin', 'Payment',         'Payout processed — ₹3,40,000',            'Monthly payout for 12 vendors. TXN-20240717-001.'),
  ('<admin-uuid>', 'admin', 'Compliance',      'GST flag — Arjun Industries',             'No GST returns filed for 2 quarters. Review required.'),
  ('<admin-uuid>', 'admin', 'System',          'Platform health check — All OK',          'All microservices operational. API uptime: 99.98%.');

*/
