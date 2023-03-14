const users = require("../models/userSchema");
const moment = require("moment");


// register user
exports.userpost = async (req, res) => {
    // console.log(req.body);

    const { fname, lname, email, mobile, category, location, choice } = req.body;
    if (!fname || !lname || !email || !mobile || !category || !location || !choice) {
        res.status(401).json("All Inputs are required")
    }
    try {
        const preuser = await users.findOne({ email: email });

        if (preuser) {
            res.status(401).json("This user already exist in our Database")

        }
        else {

            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const userData = new users({
                fname, lname, email, mobile, category, location, choice, datecreated
            });
            await userData.save();
            res.status(200).json(userData);
        }
    }
    catch (error) {
        res.status(401).json(error);
        console.log("catch block error");

    }
}

// userget
exports.userget = async (req, res) => {

    const search = req.query.search || ""
    const category = req.query.category || ""
    // console.log(req.query)

    const query = {
        fname: { $regex: search, $options: "i" }
    }

    if (category !== "All") {
        query.category = category
    }

    try {

        const usersdata = await users.find(query);
        res.status(200).json(usersdata)
    }
    catch (error) {
        res.status(401).json(error)
    }
}

// single user get
exports.singleuserget = async (req, res) => {
    const { id } = req.params;

    try {
        const userdata = await users.findOne({ _id: id });
        res.status(200).json(userdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

// user edit
exports.useredit = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, mobile, category, location, choice } = req.body;

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateuser = await users.findByIdAndUpdate({ _id: id }, {
            fname, lname, email, mobile, category, location, choice, dateUpdated
        },
            {
                new: true
            });

        await updateuser.save();
        res.status(200).json(updateuser);
    }
    catch (error) {
        res.status(401).json(error)
    }
}

// delete user
exports.userdelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletuser = await users.findByIdAndDelete({ _id: id });
        res.status(200).json(deletuser);
    } catch (error) {
        res.status(401).json(error)
    }
}

//userchoice 
exports.userchoice = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const userchoiceupdate = await users.findByIdAndUpdate({ _id: id }, { choice: data }, { new: true });
        res.status(200).json(userchoiceupdate)
    } catch (error) {
        res.status(401).json(error)
    }
}