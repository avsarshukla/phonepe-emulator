const TTL_MS = 5 * 60 * 1000;

export function addTransaction(txn) {
  const payload = { ...txn, expiry: Date.now() + TTL_MS };
  const list = getAllTransactions();
  list.unshift(payload);
  sessionStorage.setItem('all_txns', JSON.stringify(list));
  sessionStorage.setItem('active_txn', JSON.stringify(payload));
}

export function getAllTransactions() {
  const raw = sessionStorage.getItem('all_txns');
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    const now = Date.now();
    const valid = list.filter((t) => now <= t.expiry);
    sessionStorage.setItem('all_txns', JSON.stringify(valid));
    return valid;
  } catch {
    return [];
  }
}

export function getTransaction() {
  const raw = sessionStorage.getItem('active_txn');
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (Date.now() > data.expiry) {
      sessionStorage.removeItem('active_txn');
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
