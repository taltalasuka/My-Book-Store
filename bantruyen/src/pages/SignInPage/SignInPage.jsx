import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { Image, Input } from 'antd';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import imageLogo from '../../components/assets/images/logo-login.png';
import { useMutation } from '@tanstack/react-query';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/userMutationHook';
import jwt_decode from "jwt-decode"
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice';


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
//GHINHO: DATA
  const {data, isSuccess} = mutation

useEffect(() => {
  console.log('location', location)
  if(isSuccess){
    if(location?.state){
      navigate(location?.state)
    }else{
      navigate('/')
    }
    localStorage.setItem('access_token', JSON.stringify(data?.access_token))
    if(data?.access_token){
      const decoded = jwt_decode(data?.access_token)
      console.log('decoded', decoded)
      if(decoded?.id){
        handleGetDetailsUser(decoded?.id, data?.access_token)
      }
      // localStorage.setItem('user_id', decoded?.user_id)
      // localStorage.setItem('user_name', decoded?.user_name)
    }
  }
}, [isSuccess])

const handleGetDetailsUser = async(id, token) => {
  const res = await UserService.getDetailsUser(id, token)
  dispatch(updateUser({...res?.data, access_token: token}))
}
  console.log('mutation', mutation)

  const handleNavigateSignUp = () => {
    navigate('/sign-up');
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0, 0.53)', height: '100vh' }}>
      <div style={{ width: '1000px', height: '700px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 30,
                position: 'absolute',
                top: '17px',
                right: '8px',
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm placeholder="Mật khẩu" type={isShowPassword ? 'text' : 'password'} value={password} onChange={handleOnchangePassword} />
          </div>
          {data?.status === 'ERR' && <span style={{color: 'red'}}>{data?.message}</span>}
          <ButtonComponent
            disabled={!email.length || !password.length}
            onClick={handleSignIn}
            size={40}
            styleButton={{
              background: 'rgb(255,57,69)',
              height: '48px',
              width: '100%',
              margin: '26px 0 30px',
            }}
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700px' }}
          ></ButtonComponent>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <span>
            <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight>
          </span>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="logo" height="300px" width="500px" />
          <h1 style={{textAlign: 'center'}}>Chào mừng bạn đến với trang đăng nhập của truyentranh24</h1>
        </WrapperContainerRight>
      </div>

    </div>
  );
};

export default SignInPage;
