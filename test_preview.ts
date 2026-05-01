import { GET } from './app/api/preview/route';

async function test() {
  const req = new Request('http://localhost/api/preview?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  console.time('api preview');
  const res = await GET(req);
  console.timeEnd('api preview');
  console.log(await res.json());
}
test();
