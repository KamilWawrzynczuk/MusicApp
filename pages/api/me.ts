import { validateRoute } from "../../lib/auth";
import { db } from "../../lib/db";

export default validateRoute(async (req, res, user)=>{
    const playlistsCount = await db.playlist.count({
        where: {
            userId: user.id
        }
    });

    res.json({...user, playlistsCount });
})