import express, { Request, Response } from 'express';
import { authorizeandadmin, authorize } from '../middleware/authorize';
import bcrypt from 'bcryptjs';
import User from '../model/User';
import { upload } from '../middleware/multer';
import { updateMulterValidation } from '../middleware/updateMulterValidation';
import Contestant from '../model/Contestant';
import ContestantMul from '../model/ContestantMul';

const router = express.Router();

//GET ALL THE USERS
router.get("/users", authorizeandadmin, async (req: Request, res: Response) => {

    try {
      const { q } = req.query;
      const keys = ["contestName", "company", "isAdmin"];
      const search = (data: any) => {
        return data.filter((item: any) =>
            keys.some((key) => item[key].toLowerCase().includes(q))
        );
      };
      const user = await User
          .find({email: {$ne: "admin@gmail.com"}})
          .populate("")
          .sort({ createdAt: -1 })

      res.json(q ? search(user) : user)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  //COUNTS THE NUMBER OF USERS userMul
  router.get("/cat_user", authorizeandadmin, async (req: Request, res: Response) => {

      try {
        const user = await User.count({isAdmin: "userMul"})

        res.json(user)
      } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    });

  //COUNTS THE NUMBER OF USERS Single user
  router.get("/single_user", authorizeandadmin, async (req: Request, res: Response) => {

      try {
        const user = await User.count({isAdmin: "user"})

        res.json(user)
      } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    });

  //COUNT ALL THE USERS APART FROM
  router.get("/total", authorizeandadmin, async (req: Request, res: Response) => {

    try {
      const user = await User.count({isAdmin: {$ne: "admin"}})

      res.json(user)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

//GET THE CUR USER
router.get("/user", authorize, async (req: Request, res: Response) => {

    try {
      const user = await User.findOne({_id: req.user})

      res.status(200).json(user)
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

//GET USER BY ID. ONLY BY ADMIN
router.get("/users/:id", authorizeandadmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)

    res.status(200).json(user)
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//DELETE USER ONLY BY ADMIN
router.delete("/users/:id", authorizeandadmin, async (req: Request, res: Response) => {
  try {
      await User.findByIdAndDelete(req.params.id);
      await Contestant.deleteMany({userId: req.params.id});
      await ContestantMul.deleteMany({userId: req.params.id});

      return res.status(200).json({ message: 'User deleted successfully.' });

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//UPDATE USER (users can edit their profile)
router.put("/users", authorize, upload.single('image'), async (req, res) => {

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

    try {
      const {email, password, isAdmin, company, contestName, description} = req.body;
      const image = req.file && req.file.path;

      const fetch = await User.findById(req.user)
      const user = await User.findOne({email});
      if(user && user.email !== fetch.email){
          return res.json({
              errors: [
                  {
                    msg: "Email has already been taken"
                  }
              ]
          })
      }
      const updatedUser = await User.findByIdAndUpdate(
        {_id: req.user},
        {
          $set: { email, password, isAdmin, company, contestName, image, description },
        },
        { new: true }
      );
      if(updatedUser){
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

//UPDATE USER IMAGE
router.put(
    "/users/image",
    authorize,
    upload.single('image'),
    updateMulterValidation,
  async (req, res) => {

    try {
      const image = req.file && req.file.path;

      const updatedUser = await User.findByIdAndUpdate(
        {_id: req.user},
        {
          $set: { image },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }

});

//GET USER MY STAT
router.get("/stats", authorizeandadmin, async (req: Request, res: Response) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          // year: {$year: "$createdAt"}
        },
      },
      {
        $group: {
          _id: "$month",
          // year: "$year",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//GET ALL THE USERS EXCEPT ADMIN USERS
router.get("/contest_list", async (req: Request, res: Response) => {

  try {
    const { q } = req.query;
    const keys = ["contestName"];
    const search = (data: any) => {
    return data.filter((item: any) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
    );
    };
    const user = await User
        .find({}, {password: 0, email: 0, isAdmin: 0, })
        .find({isAdmin: {$ne: "admin"}})
        .populate("")
        .sort({ createdAt: -1 })

    res.json(q ? search(user) : user.slice(0, 6))
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//GET THE CURRENT CONTEST BY PARAMS WITHOUT AUTHORIZATION
router.get("/current/contest/:id", async (req, res) => {
  try {
      const data = await User.findOne({contestName: req.params.id})
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json(error);
  }
})

export default router;