const UserModel = require("../models/UserModel");
const bcrypt =require('bcrypt'); 

//GET USER INFO 
const getUserController=async(_req,_res) =>{
    try {
//find USER 
const user= await UserModel.findById ({_id:_req.body.id},)
//validation
if (!user) {
    return _res.status(404).send ({
        success:false,
        message:'User Not Found'
    })
}
//hide password
user.password= undefined
//response
_res.status(200).send({
    success:true,
    message:' USER GET SUCCESSFULLY ',
    user
})
    }catch(error){
    console.log(error)
    _res.status(500).send({
     success:false,
     message:'ERROR IN GET USER API',
     error
    })
}

}; 
//UPDATE USER 
const updateUserController=async(_req,_res)=>{
    try{

   //find user
       const user = await UserModel.findById({_id:_req.body.id})
         //validation
         if(!user){
            return  _res.status(404).send({
                success:false,
                message:'USER NOT FOUND '
            })
         }
    //UPDATE USER 
    const{userName,adresse ,phone,}=_req.body
    if(userName) user.userName=userName
     if (adresse) user.adresse=adresse
     if (phone) user.phone=phone 
     //save user
     await user.save()
     logUserActivity(user._id, 'Profile updated', `Updated profile details: userName=${userName}, adresse=${adresse}, phone=${phone}`);
     _res.status(200).send({
        success:true,
        message:'User Updated Successfully',
     })

    
    }catch (error){
        _res.status(500).send({
            success:false,
            message:'ERROR IN UPDATE USER API',
            error
        })
    }
};
//UPDATE PASSWORD
const updatePasswordController=async(_req,_res)=>{
//find a user
    try{
  const user= await UserModel.findById({_id:_req.body.id})

//validation 
if(!user){
    return  _res.status(404).send({
            succes:false,
            message: 'USER NOT FOUND' ,
    })
} 
//get DATA  
const {oldPassword,newPassword}=_req.body
if (!oldPassword|| !newPassword){
    return  _res.status(500).send({
        success:false,
        message: 'PLEASE PROVID OLD OR NEW PASSWORD'
    })

}
const isMatch = await bcrypt.compare(oldPassword, user.password);

if (!isMatch){
    return _res.status(500).send({
        success:false,
        message:"INVALID OLD PASSWORD",

    });

}
//hashing password
var salt = bcrypt.genSaltSync(10); 
    const hashedPassword = await bcrypt.hash(newPassword,salt) 
    user.password=hashedPassword
    await user.save(); 
    _res.status(200).send({
        success:true,
        message:"PASSWORD UPDATED !",
    }); 
}catch(error){
        console.log(error)
        _res.status(500).send({
        success:false,
        message:'ERROR IN PASSWORD  UPDATE API ',
        error 
    })
    }
};

//RESET PASSWORD 
const resetPasswordController=async(_req,_res)=>{
    try{
  const {email,newPassword,answer}=_req.body
if (!email || !newPassword || !answer) {
    return _res.status(500).send({
     success:false,
     message:'Please Provide all FIELDS'
})}
const user = await UserModel.findOne({email,answer})
    if (!user){
        return _res.status(500).send({
            success:false,
            message:'USER NOT FOUND or invalid answer'
        })
    }
    var salt = bcrypt.genSaltSync(10); 
    const hashedPassword = await bcrypt.hash(newPassword,salt)
user.password=hashedPassword 
await user.save()
_res.status(200).send({
    success:true,
    message:'PASSWORD RESET SUCCESSFULLY'

})
}catch(error){
        console.log(error)
        _res.status(500).send({
            success:false,
            message:'ERROR IN PASSWORD RESET API', 
            error
        })
    }
  
};
//delete PROFILE ACCOUNT
const deleteProfileController=async(_req,_res)=>{
    try{
await UserModel.findByIdAndDelete(_req.params.id)
 return _res.status(200).send({
    success:true,
    message:"YOUR ACCOUNT HAS BEEN DELETED ",
 });
    }catch(error){
        console.log(error)
        _res.status(500).send({
            success:false,
            message:"ERROR IN PASSWORD RESET API",
            error

        }
        )
        


    }
};


const updateEmailController = async (_req, _res) => {
    try {
        // Find user by ID
        const user = await UserModel.findById({ _id: _req.body.id });

        // Validate user existence
        if (!user) {
            return _res.status(404).send({
                success: false,
                message: 'USER NOT FOUND',
            });
        }

        const { newEmail } = _req.body;
        if (!newEmail) {
            return _res.status(400).send({
                success: false,
                message: 'Please provide a new email address',
            });
        }

        // Check if the email is already taken by another user
        const emailExists = await UserModel.findOne({ email: newEmail });
        if (emailExists) {
            return _res.status(400).send({
                success: false,
                message: 'Email address is already in use',
            });
        }

        user.email = newEmail;

        await user.save();
        _res.status(200).send({
            success: true,
            message: 'Email updated successfully',
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: 'ERROR IN UPDATE EMAIL API',
            error,
        });
    }
};


// DEACTIVATE USER ACCOUNT
const deactivateUserController = async (_req, _res) => {
    try {
        // Find the user by ID
        const user = await UserModel.findById({ _id: _req.body.id });

        if (!user) {
            return _res.status(404).send({
                success: false,
                message: 'USER NOT FOUND',
            });
        }
        user.status = 'deactivated';

        
        await user.save();

        _res.status(200).send({
            success: true,
            message: 'User account deactivated successfully',
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: 'ERROR IN DEACTIVATE USER API',
            error,
        });
    }
};

// ACTIVATE USER ACCOUNT
const activateUserController = async (_req, _res) => {
    try {
        // Find the user by ID
        const user = await UserModel.findById({ _id: _req.body.id });

        if (!user) {
            return _res.status(404).send({
                success: false,
                message: 'USER NOT FOUND',
            });
        }
        if (user.status === 'active') {
            return _res.status(400).send({
                success: false,
                message: 'User account is already active',
            });
        }

        // Activate the user by changing the status field to "active"
        user.status = 'active';

        await user.save();

        _res.status(200).send({
            success: true,
            message: 'User account activated successfully',
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: 'ERROR IN ACTIVATE USER API',
            error,
        });
    }
};
// GET ALL USERS
const getAllUsersController = async (_req, _res) => {
    try {
        //  from the database
        const users = await UserModel.find();

        //  no users
        if (!users || users.length === 0) {
            return _res.status(404).send({
                success: false,
                message: 'No users found',
            });
        }

        //  list of users 
        _res.status(200).send({
            success: true,
            message: 'Users retrieved successfully',
            users,
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: 'ERROR IN GETTING ALL USERS API',
            error,
        });
    }
};

// CHANGE USER ROLE
const changeUserRoleController = async (_req, _res) => {
    try {
        const user = await UserModel.findById({ _id: _req.body.id });

        if (!user) {
            return _res.status(404).send({
                success: false,
                message: 'USER NOT FOUND',
            });
        }

        const { newRole } = _req.body;
        if (!newRole || (newRole !== 'admin' && newRole !== 'client')) {
            return _res.status(400).send({
                success: false,
                message: 'Invalid role provided. Allowed values are "admin" or "user".',
            });
        }

        user.role = newRole;

        await user.save();

        _res.status(200).send({
            success: true,
            message: `User role updated to ${newRole} successfully`,
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: 'ERROR IN CHANGE USER ROLE API',
            error,
        });
    }
};

// RESET PASSWORD WITH OLD PASSWORD
const resetPasswordWithOldPasswordController = async (_req, _res) => {
    try {
        const { userId, oldPassword, newPassword } = _req.body;

        // Check for required fields
        if (!userId || !oldPassword || !newPassword) {
            return _res.status(400).send({
                success: false,
                message: "User ID, old password, and new password are required",
            });
        }

        //  user by ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return _res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        //  old password is true
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return _res.status(401).send({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // new  diff old 
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            return _res.status(400).send({
                success: false,
                message: "New password cannot be the same as the old password",
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in mongo
        user.password = hashedPassword;
        await user.save();

        _res.status(200).send({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: "Error resetting password",
            error,
        });
    }
};




module.exports={getUserController,
    updateUserController,
    updatePasswordController,
   resetPasswordController ,
deleteProfileController ,updateEmailController,deactivateUserController,activateUserController, 
getAllUsersController,changeUserRoleController,resetPasswordWithOldPasswordController,}; 