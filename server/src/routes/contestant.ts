import express, { Request, Response } from 'express';
import Contestant from '../model/Contestant';
import { authorizeandadmin, authorizeuser, authorizeusermul } from '../middleware/authorize';
import ContestantMul from '../model/ContestantMul';
import { upload } from '../middleware/multer';
import { validateMulter } from '../middleware/multerValidation';
import { updateMulterValidation } from '../middleware/updateMulterValidation';
import { body, validationResult } from "express-validator";
import User from '../model/User';
import { ObjectId } from 'mongodb';

const router = express.Router();

//CONTESTANTS
//CREATE CONTESTANT
router.post(
    '/con',
    authorizeuser,
    upload.single('image'),
    body("email").isEmail().withMessage("The email is invalid"),
    validateMulter,
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

    const {fname, lname, username, email} = req.body;
    const image = req.file ? req.file.path : ''
    const userId = req.user;

    const contestant = await Contestant.findOne({username});
    if(contestant){
        return res.json({
            errors:[
                {
                    msg: "Username has already been taken"
                }
            ],
            data: null,
        })
    }
    const newContestant = await Contestant.create({
      fname,
      lname,
      email,
      username,
      image,
      userId
    });

    res.status(200).json(newContestant)

  } catch (error) {
    console.error(error)
  }
})

//GET CONTESTANTS BY user ID (all user types)
router.get("/con/:id", async (req: Request, res: Response) => {
  try {
    const fetch = await User.findOne({contestName: req.params.id})

    if(fetch.isAdmin === 'user' || fetch.isAdmin === 'userFree'){
        const { q } = req.query;
        const keys = ["username"];
        const search = (data: any) => {
            return data.filter((item: any) =>
            keys.some((key) => item[key].toLowerCase().includes(q))
            );
        };

        const contestant = await Contestant.find({userId: fetch._id}).populate("")
        if(contestant.length === 0){
            return res.json({
                errors:[
                    {
                        msg: "There are no contestants"
                    }
                ],
                data: null,
            })
        }

        res.json(q ? search(contestant) : contestant)
    } else if (fetch.isAdmin === 'userMul'){
        const contestant = await ContestantMul.find({userId: fetch._id}).populate("")
        if(contestant.length === 0){
            return res.json({
                errors:[
                    {
                        msg: "There are no contestants"
                    }
                ],
                data: null,
            })
        }
        res.status(200).json(contestant)
    }
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//GET CONTESTANTS VOTES BY THE ID IN THE TOKEN (all user type) BARCHART
router.get("/contestant/votes", authorizeuser, async (req: Request, res: Response) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree') {
            const contestant = await Contestant.find({userId: req.user}, {vote: 1, username: 1})
            res.status(200).json(contestant)
        } else if (req.admin === 'userMul'){
            const contestant = await ContestantMul.find({userId: req.user}, {vote: 1, username: 1})
            res.status(200).json(contestant)
        }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });


//GET ALL CONTESTANTS ACROSS ALL CONTESTS
router.get("/con", authorizeandadmin, async (req: Request, res: Response) => {
    try {
      const contestant = await Contestant.find()

      res.status(200).json(contestant)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

//GET ALL CONTESTANTS OF A CONTEST USING THE TOKEN (all user types)
router.get("/contest/contestants", authorizeuser, async (req: Request, res: Response) => {
    try {
      if(req.admin === 'user' || req.admin === 'userFree') {
        const { q } = req.query;
        const keys = ["username", "fname", "lname"];
        const search = (data: any) => {
        return data.filter((item: any) =>
            keys.some((key) => item[key].toLowerCase().includes(q))
        );
        };
        const contestant = await Contestant
            .find({userId: req.user})
            .populate("")
            .sort({ createdAt: 1 })

      res.json(q ? search(contestant) : contestant)
      } else if (req.admin === 'userMul'){
        const { q } = req.query;
        const keys = ["username", "fname", "lname", "category"];
        const search = (data: any) => {
        return data.filter((item: any) =>
            keys.some((key) => item[key].toLowerCase().includes(q))
        );
        };
        const contestant = await ContestantMul
            .find({userId: req.user})
            .populate("")
            .sort({ createdAt: 1 })

      res.json(q ? search(contestant) : contestant)
      }
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

//EDIT CONTESTANTS
router.put("/con/:id", authorizeuser, upload.single('image'), async (req, res) => {
    try {
        const { fname, lname, username, email } = req.body;
        const image = req.file && req.file.path;

        const fetch = await Contestant.findById(req.params.id)
        const updateContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
        if(updateContestant !== req.user) {
            return res.json({
                errors: [
                    {
                        msg: "This contestant is not registered under this user"
                    }
                ]
            })
        }
        const contestant = await Contestant.findOne({username});
        if(contestant && contestant.username !== fetch.username){
            return res.json({
                errors: [
                    {
                        msg: "Username has already been taken"
                    }
                ]
            })
        }
        const result = await Contestant.updateOne(
            {_id: req.params.id},
            {$set: { fname, lname, username, email, image }},
            { new: true })
        if(result){
            return res.json({
                errors: null,
                data: [
                    {
                        msg: "Success"
                    }
                ]
            })
        }

    } catch (err) {
      res.status(500).json(err);
    }
  });

//UPDATE CONTESTANT IMAGE (all user types)
router.put(
    "/con/image/:id",
    authorizeuser,
    upload.single('image'),
    updateMulterValidation,
    async (req, res) => {

    try {
        const image = req.file ? req.file.path : ''
        if(req.admin === 'user' || req.admin === 'userFree'){
            const fetch = await Contestant.findById(req.params.id)
            const updateContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
            if(updateContestant === req.user) {
                await Contestant.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { image },
                    },
                        { new: true })
            } else {
                return res.json("This contestant is not registered under this user")
            }
        } else if (req.admin === 'userMul'){
            const fetch = await ContestantMul.findById(req.params.id)
            const updateContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
            if(updateContestant === req.user) {
                await ContestantMul.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { image },
                    },
                        { new: true })
            } else {
                return res.json("This contestant is not registered under this user")
            }
        }

        res.status(200).json("Image was successfully updated");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//GET THE CURRENT CONTESTANT BY PARAMS (all user types)
router.get("/curr_contestant/:id", authorizeuser, async (req, res) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree'){
            const data = await Contestant.findOne({_id: req.params.id})
            res.status(200).json(data);
        } else if (req.admin === 'userMul'){
            const data = await ContestantMul.findOne({_id: req.params.id})
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// GET CONTESTANT DETAIL
router.get("/contestant/details/:id", async (req, res) => {
    try {
        const data = await Contestant.findOne({username: req.params.id})
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

// CHECK CONTEST TYPE
router.get("/nonsense/:id", async (req, res) => {
    try {
        const data = await Contestant.findOne({username: req.params.id})
        const user = await User.findOne({_id: data.userId})

        res.status(200).json(user.isAdmin);
    } catch (error) {
        res.status(500).json(error);
    }
})

//ACTIVATE / DEACTIVATE STATUS (both users)
router.put("/status_activate/:id", authorizeuser, async (req, res) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree'){
        const status = await Contestant.findById(req.params.id)
        const activateVote = JSON.stringify(status.userId).replaceAll('"', '')
        if(activateVote === req.user) {
            if(status.status === 'pending'){
                await Contestant.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { status: "active" },
                    },
                        { new: true })
            } else if(status.status === 'active') {
                await Contestant.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { status: "pending" },
                    },
                        { new: true })
            }
        }
    } else if (req.admin === 'userMul'){
        const status = await ContestantMul.findById(req.params.id)
        const activateVote = JSON.stringify(status.userId).replaceAll('"', '')
        if(activateVote === req.user) {
            if(status.status === 'pending'){
                await ContestantMul.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { status: "active" },
                    },
                        { new: true })
            } else if(status.status === 'active') {
                await ContestantMul.updateOne(
                    {_id: req.params.id},
                    {
                        $set: { status: "pending" },
                    },
                        { new: true })
            }
        }
    }
        res.status(200).json("Success");
    } catch (error) {
        res.status(500).json(error);
    }
})

//ACTIVATE MULTIPLE USERS (both users)
router.put("/change_status_active", authorizeuser, async(req, res) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree'){
            await Contestant.updateMany({userId: req.user}, {$set: {status: 'active'}})
        } else if (req.admin === 'userMul'){
            await ContestantMul.updateMany({userId: req.user}, {$set: {status: 'active'}})
        }
        res.status(200).json("activate success")
    } catch (error) {
        res.status(500).json(error);
    }
})

//DEACTIVATE MULTIPLE USERS (both users)
router.put("/change_status_deactive", authorizeuser, async(req, res) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree'){
            await Contestant.updateMany({userId: req.user}, {$set: {status: 'pending'}})
        } else if (req.admin === 'userMul'){
            await ContestantMul.updateMany({userId: req.user}, {$set: {status: 'pending'}})
        }
        res.status(200).json("deactivate success")
    } catch (error) {
        res.status(500).json(error);
    }
})

// DELETE CONTESTANT (both users)
router.delete("/con/:id", authorizeuser, async (req, res) => {

    try {
        if(req.admin === 'user' || req.admin === 'userFree') {
            const fetch = await Contestant.findById(req.params.id)
            const deleteContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
            if(deleteContestant === req.user) {
                await Contestant.deleteOne( {_id: req.params.id} )
            } else {
                return res.json("This contestant is not registered under this user")
            }
        } else if (req.admin === 'userMul') {
            const fetch = await ContestantMul.findById(req.params.id)
            const deleteContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
            if(deleteContestant === req.user) {
                await ContestantMul.deleteOne( {_id: req.params.id} )
            } else {
                return res.json("This contestant is not registered under this user")
            }
        }
        res.status(200).json("Successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  });

// VOTE CONTESTANT
router.put("/vote/:id", async (req, res) => {
    try {
        const fetch = await Contestant.findOne({username: req.params.id});
        const curVote = fetch.vote;
        const {vote} = req.body;
        const updVote = vote + curVote;
        if(fetch.status === 'active') {
            await Contestant.updateOne(
                {username: req.params.id},
                {
                    $set: {vote: updVote},
                },
                    { new: true })
        } else {
            return res.json("This contestant is not active")
        }

        res.status(200).json("Thank you for voting");
    } catch (err) {
      res.status(500).json(err);
    }

});

//GET ALL THE VOTES FROM CONTESTANTS
router.get("/vote/sum", authorizeandadmin, async (req, res) => {
    try {

        const sum = await Contestant.aggregate([ { $group: { _id : null, sum : { $sum: "$vote" } }}])

        res.status(200).json(sum[0].sum);
    } catch (err) {
      res.status(500).json(err);
    }

});

//GET ALL THE VOTES FROM A PARTICULAR CONTEST (both users)
router.get("/contest/vote", authorizeuser, async (req, res) => {
    try {
        if(req.admin === 'user' || req.admin === 'userFree') {
            const sum = await Contestant.aggregate([
                {$match: {userId: new ObjectId(req.user)}},
                {$group: {_id: null, sum: { $sum: "$vote"}}}
            ])
            res.status(200).json(sum[0].sum);
        } else if(req.admin === 'userMul'){
            const sum = await ContestantMul.aggregate([
                {$match: {userId: new ObjectId(req.user)}},
                {$group: {_id: null, sum: { $sum: "$vote"}}}
            ])
            res.status(200).json(sum[0].sum);
        }
    } catch (err) {
      res.status(500).json(err);
    }

});

//MULTIPLE CONTESTANTS
// CREATE MUL CONTESTANT
router.post(
    '/conmul',
    authorizeusermul,
    upload.single('image'),
    body("email").isEmail().withMessage("The email is invalid"),
    validateMulter, async (req: Request, res: Response) => {
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

    const {fname, lname, username, category, email } = req.body;
    const image = req.file ? req.file.path : ''
    const userId = req.user;

    const contestant = await ContestantMul.findOne({username});
    if(contestant){
        return res.json({
            errors:[
                {
                    msg: "Username already taken"
                }
            ],
            data: null,
        })
    }
    const newContestant = await ContestantMul.create({
        fname,
        lname,
        username,
        category,
        email,
        image,
        userId
    });

    res.status(200).json(newContestant)

    } catch (error) {
    console.log(error)
    }
})

//GET MUL CONTESTANT BASED ON ID AND CATEGORY
router.get("/conmul/:id", async (req: Request, res: Response) => {

try {

    const { q } = req.query;

    const keys = ["category"];

    const search = (data: any) => {
    return data.filter((item: any) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
    );
    };
    const contestant = await ContestantMul
        .find({userId: req.params.id})
        .populate("")
        .sort({ username: 1 })

    // res.json(contestant)
    res.json(search(contestant))
    } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
    }
});

//GET MUL CONTESTANTS BY user ID
router.get("/conmul/all/:id", async (req: Request, res: Response) => {
    try {
      const contestant = await ContestantMul.find({userId: req.params.id}).populate("")

      res.status(200).json(contestant)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

//GET ALL MUL CONTESTANTS
router.get("/conmul", authorizeandadmin, async (req: Request, res: Response) => {
    try {
      const contestant = await ContestantMul.find()

      res.status(200).json(contestant)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

//EDIT MUL CONTESTANTS
router.put("/con/mul/:id", authorizeuser,  upload.single('image'), async (req, res) => {

    try {
        const { fname, lname, username, email, category } = req.body;
        const image = req.file && req.file.path;

        const fetch = await ContestantMul.findById(req.params.id)
        const updateContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
        if(updateContestant !== req.user) {
            return res.json({
                errors: [
                    {
                        msg: "This contestant is not registered under this user"
                    }
                ]
            })
        }
        const contestant = await ContestantMul.findOne({username});
        if(contestant && contestant.username !== fetch.username){
            return res.json({
                errors: [
                    {
                        msg: "Username has already been taken"
                    }
                ]
            })
        }
        const result = await ContestantMul.updateOne(
            {_id: req.params.id},
            {$set: { fname, lname, username, email, category, image }},
            { new: true })
        if(result){
            return res.json({
                errors: null,
                data: [
                    {
                        msg: "Success"
                    }
                ]
            })
        }
        // res.status(200).json("Successfully updated");
    } catch (err) {
      res.status(500).json(err);
    }
});

//UPDATE MUL CONTESTANTS IMAGES
router.put("/con/mul/image/:id", authorizeusermul, async (req, res) => {

    try {
        const image = req.file ? req.file.path : ''
        const fetch = await ContestantMul.findById(req.params.id)
        const updateContestant = JSON.stringify(fetch.userId).replaceAll('"', '')
        if(updateContestant === req.user) {
            await ContestantMul.updateOne(
                {_id: req.params.id},
                {
                    $set: {image},
                },
                    { new: true })
        } else {
            return res.json("This contestant is not registered under this user")
        }

        res.status(200).json("Successfully updated the image");
    } catch (err) {
      res.status(500).json(err);
    }
});

//VOTE MUL CONTESTANT
router.put("/votemul/:id", async (req, res) => {
    try {
        const fetch = await ContestantMul.findById(req.params.id);
        const curVote = fetch.vote;
        const {vote} = req.body;
        const updVote = vote + curVote;

            await ContestantMul.updateOne(
                {_id: req.params.id},
                {
                    $set: {vote: updVote},
                },
                    { new: true })

        res.status(200).json("Thank you for voting");
    } catch (err) {
      res.status(500).json(err);
    }

});

//GET ALL THE VOTES FROM mul CONTESTANTS
router.get("/votemul/sum", authorizeandadmin, async (req, res) => {
    try {

        const sum = await ContestantMul.aggregate([ { $group: { _id : null, sum : { $sum: "$vote" } }}])

        res.status(200).json(sum[0].sum);
    } catch (err) {
      res.status(500).json(err);
    }

});

//GET ALL THE VOTES FROM A PARTICULAR CONTEST
router.get("/contest/category/vote", authorizeusermul, async (req, res) => {
    try {

        const sum = await ContestantMul.aggregate([
            {$match: {userId: new ObjectId(req.user)}},
            {$group: {_id: null, sum: { $sum: "$vote"}}}
        ])
        res.status(200).json(sum[0].sum);
    } catch (err) {
      res.status(500).json(err);
    }

});

export default router;