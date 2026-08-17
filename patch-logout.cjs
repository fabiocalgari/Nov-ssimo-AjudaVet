const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetLogout = `app.post('/api/auth/logout', async (req, res) => {
  if (req.session.userId) {
    await db.update(users).set({ currentSessionId: null }).where(eq(users.id, req.session.userId));
  }
  req.session.destroy(() => {
    res.json({ message: 'Logout success' });
  });
});`;

const replacementLogout = `app.post('/api/auth/logout', requireAuth, async (req, res) => {
  await db.update(users).set({ currentSessionId: null }).where(eq(users.id, req.user.id));
  if (req.session) {
    req.session.destroy(() => {
      res.json({ message: 'Logout success' });
    });
  } else {
    res.json({ message: 'Logout success' });
  }
});`;

code = code.replace(targetLogout, replacementLogout);
fs.writeFileSync('server.ts', code);
