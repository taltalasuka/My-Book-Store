import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  access_token: "",
  id: "",
  isAdmin: false,
  city: "",
  id: "",
  phone:""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name ='', email = '', access_token='', isAdmin, city= '', _id = '', phone='' } = action.payload;
      console.log("action", action);
      state.name = name || email;
      state.email = email;
      state.access_token = access_token;
      state.id = _id;
      state.isAdmin = isAdmin;
      state.city = city;
      state.phone = phone;

      
    },
    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.id = '';
      state.access_token = "";
      state.isAdmin = false;
      state.city = '';
      state.phone = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
