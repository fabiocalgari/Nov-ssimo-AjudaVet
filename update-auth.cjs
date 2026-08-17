const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetAuth = `const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId || !req.session.sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await db.select().from(users).where(eq(users.id, req.session.userId)).limit(1);
    if (!user.length || user[0].currentSessionId !== req.session.sessionId) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Sessão inválida ou expirada. Este usuário pode estar conectado em outro dispositivo.' });
    }
    if (user[0].status !== 'ATIVO' && user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Conta inativa' });
    }
    req.user = user[0];
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};`;

const replacementAuth = `const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let sessionId = req.session?.sessionId;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    sessionId = authHeader.substring(7);
  }
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await db.select().from(users).where(eq(users.currentSessionId, sessionId)).limit(1);
    if (!user.length) {
      if (req.session) req.session.destroy(() => {});
      return res.status(401).json({ error: 'Sessão inválida ou expirada. Este usuário pode estar conectado em outro dispositivo.' });
    }
    if (user[0].status !== 'ATIVO' && user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Conta inativa' });
    }
    req.user = user[0];
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};`;

code = code.replace(targetAuth, replacementAuth);
fs.writeFileSync('server.ts', code);
