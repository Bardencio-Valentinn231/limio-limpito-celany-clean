/* Almacenamiento común entre la tienda y el gestor. */
(function (global) {
  'use strict';
  var STORAGE_KEY = 'cleanyCleanOrders';
  var config = global.CLEANY_ORDERS_CONFIG || {};
  var client = null;

  function isCloudConfigured() {
    var url = String(config.supabaseUrl || '').trim();
    var key = String(config.supabaseAnonKey || '').trim();
    return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url) &&
      key.length > 20 && !/YOUR_|PEGAR_|REEMPLAZAR/i.test(key);
  }

  function getClient() {
    if (!isCloudConfigured()) return null;
    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      throw new Error('No se pudo cargar el cliente de Supabase. Revisá la conexión a internet.');
    }
    if (!client) {
      client = global.supabase.createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim(), {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
    }
    return client;
  }

  function readLocalOrders() {
    try {
      var saved = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.error('No se pudieron leer pedidos locales:', error);
      return [];
    }
  }

  function writeLocalOrders(orders) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }

  function updateLocalSyncStatus(orderId, synced, message) {
    try {
      var orders = readLocalOrders();
      var index = orders.findIndex(function (order) { return order.id === orderId; });
      if (index >= 0) {
        orders[index].cloudSynced = Boolean(synced);
        if (message) orders[index].cloudSyncError = String(message).slice(0, 240);
        else delete orders[index].cloudSyncError;
        writeLocalOrders(orders);
      }
    } catch (error) {
      console.error('No se pudo actualizar el estado de sincronización:', error);
    }
  }

  function toCloudRow(order) {
    return {
      id: String(order.id),
      created_at: order.createdAt || new Date().toISOString(),
      customer: order.customer || {},
      forma_pago: order.formaPago || 'No especificado',
      items: Array.isArray(order.items) ? order.items : [],
      subtotal: Number(order.subtotal) || 0,
      total: Number(order.total) || 0,
      currency: order.currency || 'ARS',
      status: order.status || 'Recibido'
    };
  }

  function fromCloudRow(row) {
    return {
      id: row.id, createdAt: row.created_at, customer: row.customer || {},
      formaPago: row.forma_pago || 'No especificado',
      items: Array.isArray(row.items) ? row.items : [],
      subtotal: Number(row.subtotal) || 0, total: Number(row.total) || 0,
      currency: row.currency || 'ARS', status: row.status || 'Recibido',
      cloudSynced: true
    };
  }

  async function syncOrder(order) {
    if (!isCloudConfigured()) return { configured: false, synced: false };
    try {
      var result = await getClient().from('orders').insert(toCloudRow(order));
      if (result.error && result.error.code !== '23505') {
        updateLocalSyncStatus(order.id, false, result.error.message);
        return { configured: true, synced: false, error: result.error };
      }
      updateLocalSyncStatus(order.id, true);
      return { configured: true, synced: true };
    } catch (error) {
      updateLocalSyncStatus(order.id, false, error.message);
      return { configured: true, synced: false, error: error };
    }
  }

  async function syncPendingOrders() {
    if (!isCloudConfigured()) return { attempted: 0, synced: 0 };
    var pending = readLocalOrders().filter(function (order) { return !order.cloudSynced; });
    var synced = 0;
    for (var i = 0; i < pending.length; i += 1) {
      var result = await syncOrder(pending[i]);
      if (result.synced) synced += 1;
    }
    return { attempted: pending.length, synced: synced };
  }

  async function signInAdmin(email, password) {
    var sb = getClient();
    if (!sb) throw new Error('La conexión central todavía no está configurada.');
    var result = await sb.auth.signInWithPassword({ email: String(email || '').trim(), password: password });
    if (result.error) throw result.error;
    var user = result.data.user;
    if (!user || !user.app_metadata || user.app_metadata.role !== 'admin') {
      await sb.auth.signOut();
      throw new Error('El usuario inició sesión, pero no tiene el rol de administrador en Supabase.');
    }
    return user;
  }

  async function signOutAdmin() {
    if (!isCloudConfigured()) return;
    var sb = getClient();
    if (sb) await sb.auth.signOut();
  }

  async function getAdminOrders() {
    var localOrders = readLocalOrders();
    if (!isCloudConfigured()) return localOrders;
    var sb = getClient();
    var sessionResult = await sb.auth.getSession();
    var user = sessionResult.data && sessionResult.data.session && sessionResult.data.session.user;
    if (!user || !user.app_metadata || user.app_metadata.role !== 'admin') {
      throw new Error('La sesión de administrador no está activa. Volvé a ingresar.');
    }
    var result = await sb.from('orders').select('*').order('created_at', { ascending: false }).limit(1000);
    if (result.error) throw result.error;
    var cloudOrders = (result.data || []).map(fromCloudRow);
    var seen = new Set(cloudOrders.map(function (order) { return order.id; }));
    var combined = cloudOrders.concat(localOrders.filter(function (order) { return !seen.has(order.id); }));
    combined.sort(function (a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    return combined;
  }

  global.CleanyOrders = {
    storageKey: STORAGE_KEY,
    isCloudConfigured: isCloudConfigured,
    readLocalOrders: readLocalOrders,
    syncOrder: syncOrder,
    syncPendingOrders: syncPendingOrders,
    signInAdmin: signInAdmin,
    signOutAdmin: signOutAdmin,
    getAdminOrders: getAdminOrders
  };
})(window);
