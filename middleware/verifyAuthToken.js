import jwt from 'jsonwebtoken';


export const verifyAuthToken = async (req, res, next) => {
    try {

        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        if (!token) {

            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            throw new Error();
        }
        req.user = decoded;
        console.log(req.user);
        console.log(decoded)
        next();


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error verifying token" });
    }
}