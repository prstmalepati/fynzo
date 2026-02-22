// =============================================================
// hooks/useAdmin.ts — Admin role check via Firestore whitelist
// =============================================================
// Firestore doc: system/admin_whitelist
// Structure: { uids: ["uid1", "uid2"], emails: ["admin@myfynzo.com"] }
// Only whitelisted users see the Admin tab.

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    try {
      const snap = await getDoc(doc(db, 'system', 'admin_whitelist'));
      if (snap.exists()) {
        const data = snap.data();
        const uids: string[] = data.uids || [];
        const emails: string[] = data.emails || [];
        setIsAdmin(
          uids.includes(user!.uid) || 
          emails.includes(user!.email || '')
        );
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      // If permission denied, user is not admin
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  return { isAdmin, adminLoading };
}
