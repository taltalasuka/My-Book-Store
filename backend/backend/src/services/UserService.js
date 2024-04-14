const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "Email đã tồn tại",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      console.log("hash", hash);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({ email: email });

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "User không tồn tại",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Mật khẩu hoặc tài khoản không đúng",
        });
      } else {
        const access_token = await genneralAccessToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });
        const refresh_token = await genneralRefreshToken({
          id: checkUser.id,
          isAdmin: checkUser.isAdmin,
        });
        resolve({
          status: "OK",
          message: "Thành công",
          access_token,
          refresh_token,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser == null) {
        resolve({
          status: "OK",
          message: "User khong ton tai",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "thanh cong",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser == null) {
        resolve({
          status: "ERR",
          message: "Nguoi dung khong ton tai",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Xoa thanh cong",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({_id: ids});
      resolve({
        status: "OK",
        message: "Xoa thanh cong",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "thanh cong",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user == null) {
        resolve({
          status: "ERR",
          message: "Nguoi dung khong ton tai",
        });
      }
      resolve({
        status: "OK",
        message: "Thanh cong",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser
};
