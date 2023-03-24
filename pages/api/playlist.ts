import { db } from '../../lib/db';
import { validateRoute } from '../../lib/auth';

export default validateRoute(async (req, res, user) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: 'asc',
    },
  });

  

  return res.json(playlists);
});
