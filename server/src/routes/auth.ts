import express, { Request, Response } from 'express';
import { body, validationResult } from "express-validator";
import User from '../model/User';
import bcrypt from 'bcryptjs';
import { jwtGenerator } from '../utils/jwtGenerator';
import { authorize, authorizeandadmin } from '../middleware/authorize';
import { upload } from '../middleware/multer';
import { validateMulter } from '../middleware/multerValidation';

const router = express.Router();

router.post(
    '/register',
    authorizeandadmin,
    upload.single('image'),
    validateMulter,
    body("email").isEmail().withMessage("The email is invalid"),
    body("password").isLength({ min: 8 }).withMessage("The password is invalid"),
    async (req: Request, res: Response) => {

    try {
        const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        const errors = validationErrors.array().map((error) => {
            return {
                msg: error.msg,
            };
        });

        return res.json({ errors, data: null });
    }

    const {email, password, isAdmin, company, contestName, description} = req.body;
    const image = req.file ? req.file.path : ''

    const user = await User.findOne({email});
    if(user){
        return res.json({
            errors:[
                {
                    msg: "Email already in use"
                }
            ],
            data: null,
        })
    }
    const contest = await User.findOne({contestName});
    if(contest){
        return res.json({
            errors:[
                {
                    msg: "Contest already in use"
                }
            ],
            data: null,
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        isAdmin,
        company,
        contestName,
        image,
        description
    });

    const token = jwtGenerator(newUser._id, newUser.isAdmin);
    res.json({
        error: [],
        data: {
            token
        }
    });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

router.post("/login", async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body

        const user = await User.findOne({email});
        if(!user) {
            return res.json({
                errors: [
                    {
                        msg: "Invalid Credential email"
                    }
                ],
                data: null
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({
                errors: [
                    {
                        msg: "Invalid Credential password"
                    }
                ],
                data: null
            })
        }

        const token = jwtGenerator(user._id, user.isAdmin);
        res.json({
            errors: [],
            data: {
                token,
                user: {
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(500).send("Server error");
    }
})

router.get('/verify', authorize, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user, isAdmin: req.admin });
        // res.json(true)
        return res.json({
            errors: [],
            data: {
                user: {
                    id: user._id,
                    isAdmin: user.isAdmin
                }
            }
        })
    } catch (error: any) {
        console.error(error.message)
    }
})

export default router;