import supabase from '../services/supabase.mjs';

export async function TokenMiddleware(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({error: 'No token provided'});

    const {data: {user}, error} = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({error: "Unauthorized"});

    req.user = user;
    next();
}