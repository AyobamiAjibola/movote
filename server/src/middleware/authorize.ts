import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken'

export const authorize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("token");

    if(!token){
        return res.status(403).json({
            errors: [
                {
                    msg:"Invalid Token"
                }
            ]
        })
    }

    try {
        const data = (await JWT.verify(
            token,
            process.env.JWT_SECRET as string
        )) as { user: string, adm: string};
        req.user = data.user;
        req.admin = data.adm;
        next()
    } catch (error: any) {
        return res.status(403).json({
            errors: [
                {
                    msg:"Unauthorized"
                }
            ]
        })
    }
};

export const authorizeandverification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user === req.params.id || req.admin === "admin") {
            next();
          } else {
            res.status(403).json("You are not allowed to do that!");
          }
    })
};

export const authorizeandadmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.admin === "admin") {
            next();
          } else {
            res.status(403).json("You are not allowed to do that!");
          }
    })
};

//MUST BE AUTHORIZE AND MUST BE A USER ADMIN
export const authorizeuser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user && req.admin === "user" || req.admin === "userMul" || req.admin === "userFree") {
            next();
          } else {
            res.status(403).json("You are not allowed to do that!");
          }
    })
};

//MUST BE AUTHORIZE AND MUST BE A USERMUL ADMIN
export const authorizeusermul = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    authorize(req, res, () => {
        if (req.user && req.admin === "userMul") {
            next();
          } else {
            res.status(403).json("You are not allowed to do that!");
          }
    })
};


