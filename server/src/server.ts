import { app } from "./app";
import { conn } from "./shared/infra/database/conn";

const start = async() => {
  try{
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log("🚀 Server running on http://localhost:3333");
  } catch(err){
    app.log.error(err);
    process.exit(1);
  }
}

const signals = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
  process.on(signal, async () => {
    await app.close();
    await conn.destroy();
    process.exit(0);
  });
}

start();