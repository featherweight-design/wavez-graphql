import { createLocalServer } from 'server';

const PORT = process.env.PORT || 4000;
const server = createLocalServer();

void server.listen(PORT, () =>
  console.log(`🚀  Server running on http://localhost:${PORT}/graphql`)
);
