import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Custom authentication route
server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = router.db; // Get the database
  
  const user = db.get('userData').find({ username: username }).value();
  
  if (user && password === 'demo123') { // Simple demo password
    const userData = { ...user };
    delete userData.passwordHash; // Don't send password hash
    
    // Update last login
    db.get('userData').find({ username: username }).assign({ 
      loginStatus: true, 
      lastLogin: new Date().toISOString() 
    }).write();
    
    res.json({
      success: true,
      user: userData,
      token: `demo_token_${user.id}_${Date.now()}`
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Custom wallet balance route
server.get('/api/wallet/balance', (req, res) => {
  const username = req.query.username || 'user_123'; // Default for demo
  const db = router.db;
  
  const wallet = db.get('wallet').find({ username: username }).value();
  const user = db.get('userData').find({ username: username }).value();
  
  if (wallet && user) {
    res.json({
      balance: wallet.balance,
      credits: user.credits,
      totalEarned: wallet.totalEarned,
      totalSpent: wallet.totalSpent,
      pendingCredits: wallet.pendingCredits
    });
  } else {
    res.json({ balance: 750, credits: 750 }); // Default demo values
  }
});

// Custom unlock key route
server.post('/api/unlock/:keyId', (req, res) => {
  const keyId = req.params.keyId;
  const db = router.db;
  
  const key = db.get('createdKeys').find({ id: parseInt(keyId) }).value();
  
  if (key && key.available > 0) {
    // Simulate random key from available pool
    const keyVariations = [
      `${key.keyValue}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      `${key.keyValue.replace('ABCD', Math.random().toString(36).substring(2, 6).toUpperCase())}`,
      key.keyValue
    ];
    
    const randomKey = keyVariations[Math.floor(Math.random() * keyVariations.length)];
    
    // Update availability
    db.get('createdKeys').find({ id: parseInt(keyId) }).assign({
      available: key.available - 1,
      sold: key.sold + 1
    }).write();
    
    // Create unlock record
    const unlockRecord = {
      id: db.get('unlocks').size().value() + 1,
      transactionId: Math.floor(Math.random() * 10000),
      username: 'user_123', // Demo user
      email: 'john.buyer@example.com',
      date: Date.now(),
      time: new Date().toLocaleTimeString(),
      credits: 750,
      keyId: key.keyId,
      keyTitle: key.keyTitle,
      keyValue: randomKey,
      sellerUsername: key.username,
      sellerEmail: key.email,
      price: key.price,
      status: 'Completed'
    };
    
    db.get('unlocks').push(unlockRecord).write();
    
    res.json({
      success: true,
      key: randomKey,
      transactionId: unlockRecord.transactionId
    });
  } else {
    res.status(404).json({ success: false, message: 'Key not available or not found' });
  }
});

// Custom route for seller listings
server.get('/api/seller/listings/:id', (req, res) => {
  const id = req.params.id;
  const db = router.db;
  
  const key = db.get('createdKeys').find({ id: parseInt(id) }).value();
  
  if (key) {
    res.json(key);
  } else {
    res.status(404).json({ error: 'Listing not found' });
  }
});

// Custom route for all listings
server.get('/api/listings', (req, res) => {
  const db = router.db;
  const listings = db.get('createdKeys').filter({ isActive: true }).value();
  res.json(listings);
});

// Custom route for user notifications
server.get('/api/notifications/:username', (req, res) => {
  const username = req.params.username;
  const db = router.db;
  
  const notifications = db.get('notifications').filter({ username: username }).value();
  res.json(notifications);
});

// Custom route for purchase/upload
server.post('/api/host/upload', (req, res) => {
  const { title, price_credits } = req.body;
  const db = router.db;
  
  // Simulate file processing
  setTimeout(() => {
    const newKey = {
      id: db.get('createdKeys').size().value() + 1,
      keyId: `key_${Date.now()}`,
      username: 'seller_123',
      email: 'jane.seller@example.com',
      keyTitle: title || 'New Key Listing',
      keyValue: `DEMO-KEY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      description: `Generated key listing: ${title}`,
      price: parseInt(price_credits) || 100,
      quantity: Math.floor(Math.random() * 50) + 10,
      sold: 0,
      available: Math.floor(Math.random() * 50) + 10,
      creationDate: Date.now(),
      expirationDate: null,
      isActive: true,
      isReported: false,
      reportCount: 0,
      encryptionKey: `enc_key_${Date.now()}`,
      tags: ['demo', 'uploaded']
    };
    
    db.get('createdKeys').push(newKey).write();
    
    res.json({
      success: true,
      uploadId: newKey.keyId,
      message: 'Keys uploaded successfully'
    });
  }, 1000);
});

// Use default router for all other routes
server.use('/api', router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on port ${PORT}`);
  console.log(`📊 Database: db.json`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /api/userData`);
  console.log(`   - GET /api/createdKeys`);
  console.log(`   - GET /api/unlocks`);
  console.log(`   - GET /api/notifications`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET /api/wallet/balance`);
  console.log(`   - POST /api/unlock/:keyId`);
  console.log(`   - GET /api/listings`);
  console.log(`   - POST /api/host/upload`);
});