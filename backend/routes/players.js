import express from 'express';
const router = express.Router();

/**
 * Player Related API Endpoints
 */
// Pretty sure their's 2000 players so don't load all of them
router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM players
                        LIMIT 200;`;
        const result = await req.pgClient.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching players data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get individual player details and their stats
router.get('/player_profile/:player_id', async (req, res) => {
    try {
        const { player_id } = req.params;
        const query = `
        WITH player_sport_stats AS (
            SELECT 
                ps.stat_id,
                s.sport_id,
                s.sport_name,
                ps.season,
                CASE s.sport_name
                    WHEN 'Basketball' THEN (SELECT row_to_json(bs) FROM basketball_stats bs WHERE bs.stat_id = ps.stat_id)
                    WHEN 'Baseball' THEN (SELECT row_to_json(bs) FROM baseball_stats bs WHERE bs.stat_id = ps.stat_id)
                    WHEN 'Football' THEN (SELECT row_to_json(fs) FROM football_stats fs WHERE fs.stat_id = ps.stat_id)
                    WHEN 'Soccer' THEN (SELECT row_to_json(ss) FROM soccer_stats ss WHERE ss.stat_id = ps.stat_id)
                    WHEN 'Volleyball' THEN (SELECT row_to_json(vs) FROM volleyball_stats vs WHERE vs.stat_id = ps.stat_id)
                    WHEN 'Tennis' THEN (SELECT row_to_json(ts) FROM tennis_stats ts WHERE ts.stat_id = ps.stat_id)
                    WHEN 'Track' THEN (SELECT row_to_json(ts) FROM track_stats ts WHERE ts.stat_id = ps.stat_id)
                    WHEN 'Swimming' THEN (SELECT row_to_json(ss) FROM swimming_stats ss WHERE ss.stat_id = ps.stat_id)
                    WHEN 'Wrestling' THEN (SELECT row_to_json(ws) FROM wrestling_stats ws WHERE ws.stat_id = ps.stat_id)
                    WHEN 'Golf' THEN (SELECT row_to_json(gs) FROM golf_stats gs WHERE gs.stat_id = ps.stat_id)
                    WHEN 'Softball' THEN (SELECT row_to_json(ss) FROM softball_stats ss WHERE ss.stat_id = ps.stat_id)
                    WHEN 'Lacrosse' THEN (SELECT row_to_json(ls) FROM lacrosse_stats ls WHERE ls.stat_id = ps.stat_id)
                    WHEN 'Field Hockey' THEN (SELECT row_to_json(fhs) FROM field_hockey_stats fhs WHERE fhs.stat_id = ps.stat_id)
                    WHEN 'Cross Country' THEN (SELECT row_to_json(ccs) FROM cross_country_stats ccs WHERE ccs.stat_id = ps.stat_id)
                    WHEN 'Hockey' THEN (SELECT row_to_json(hs) FROM hockey_stats hs WHERE hs.stat_id = ps.stat_id)
                    WHEN 'Ultimate Frisbee' THEN (SELECT row_to_json(ufs) FROM ultimate_frisbee_stats ufs WHERE ufs.stat_id = ps.stat_id)
                    WHEN 'Gymnastics' THEN (SELECT row_to_json(gs) FROM gymnastics_stats gs WHERE gs.stat_id = ps.stat_id)
                    WHEN 'Rugby' THEN (SELECT row_to_json(rs) FROM rugby_stats rs WHERE rs.stat_id = ps.stat_id)
                    WHEN 'Water Polo' THEN (SELECT row_to_json(wps) FROM water_polo_stats wps WHERE wps.stat_id = ps.stat_id)
                    WHEN 'Cheerleading' THEN (SELECT row_to_json(cs) FROM cheerleading_stats cs WHERE cs.stat_id = ps.stat_id)
                END as stats
            FROM player_stats ps
            JOIN sports s ON ps.sport_id = s.sport_id
            WHERE ps.player_id = $1
        )
        SELECT 
            p.*,
            json_agg(pss) as stats
        FROM players p
        LEFT JOIN player_sport_stats pss ON p.player_id = $1
        WHERE p.player_id = $1
        GROUP BY p.player_id;`;
        const result = await req.pgClient.query(query, [player_id])

        console.log(result)

        if(result.rows.length === 0){
            res.status(404).json({ error: "Player Not Found"});
        }

        console.log(result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:player_id', async(req, res) => {
    try {
        const { player_id } = req.params;
        const query = `DELETE FROM players WHERE player_id = $1;`;

        await req.pgClient.query(query, [ player_id ]);
        res.status(201).json({ message: 'Player successfully deleted'})
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: error.message });
    }
})

export default router;