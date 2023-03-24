import bcrypt from 'bcrypt';
import { db } from '../lib/db';
import { artistsData } from './songsData';

const run = async () => {
  await Promise.all(
    artistsData.map(async (artist) => {
      return db.artist.upsert({
        where: {
          name: artist.name,
        },
        update: {},
        create: {
          name: artist.name,
          songs: {
            create: artist.songs.map((song) => ({
              name: song.name,
              duration: song.duration,
              url: song.url,
            })),
          },
        },
      });
    })
  );

  const salt = bcrypt.genSaltSync(10);
  const user = await db.user.upsert({
    where: {
      email: 'user@test.com',
    },
    update: {},
    create: {
      email: 'user@test.com',
      password: bcrypt.hashSync('123456', salt),
      firstName: 'Kamil',
      lastName: 'W.',
    },
  });

  const songs = await db.song.findMany({});

  await Promise.all(
    new Array(10).fill(1).map(async (_, i) => {
      return db.playlist.create({
        data: {
          name: `Playlists ${i + 1}`,
          user: {
            connect: {
              id: user.id,
            },
          },
          songs: {
            connect: songs.map((song) => ({
              id: song.id,
            })),
          },
        },
      });
    })
  );
};

run()
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    await db.$disconnect();
    process.exit(1);
  })
  .finally(async () => db.$disconnect());
