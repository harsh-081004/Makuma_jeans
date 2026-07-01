import { sign, verify } from 'hono/jwt';
const secret = 'qg/MAKUMA+7stEcgRl1BbMiNusggl+0w8owLZC8/QF6oVXcL9bmuEsFCge/44dMRle7HUs7QCl4DsYnFBK5g==';
async function test() {
  const token = await sign({ id: '123' }, secret);
  console.log('Signed token:', token);
  try {
    const decoded = await verify(token, secret);
    console.log('Decoded:', decoded);
  } catch (err) {
    console.error('Verify error:', err);
  }
}
test();
