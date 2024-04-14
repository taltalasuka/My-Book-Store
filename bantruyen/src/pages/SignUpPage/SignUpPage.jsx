import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from "../../components/assets/images/logo-login.png"
import { Image } from 'antd'
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
import {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as message from '../../components/Message'


const SignUpPage = () => {
  const navigate = useNavigate()
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')

  const handleOnchangeEmail =(value) => {
    setEmail(value)
  }
  const handleOnchangePassword  =(value) => {
    setPassword(value)
  }
  
  const handleOnchangeConfirmPassword  =(value) => {
    setconfirmPassword(value)
  }

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  )
//GHINHO: DATA
  const {data, isSuccess, isError} = mutation

useEffect(() => {
  if(isSuccess) {
    message.success()
    handleNavigateSignIn()
  }else if (isError){
    message.error()
  }
}, [isSuccess, isError])

  const handleSignUp = () => {
    mutation.mutate({email, password, confirmPassword})
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0, 0.53)', height: '100vh'}}>

      <div style = {{width: '1000px', height: '700px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex'}}>
        <WrapperContainerLeft>
              <h1>Xin chào</h1>
              <p>Đăng nhập và tạo tài khoản</p>
              <InputForm style ={{marginBottom: '10px'}} placeholder = "abc@gmail.com" value={email} onChange = {handleOnchangeEmail}/>
              <div style={{position: 'relative'}}>
                <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{
                  zIndex: 30,
                  position: 'absolute',
                  top: '17px',
                  right: '8px'
                }}
                >{
                  isShowPassword? (
                    <EyeFilled/>
                  ) : (
                    <EyeInvisibleFilled/>   
                  )
                }
                </span>
                <InputForm placeholder = "Mật khẩu" type={isShowPassword ? "text" : "password"} value={password} onChange = {handleOnchangePassword}/>

              </div>
              <div style={{position: 'relative', marginTop: '10px'}}>
                <span
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                style={{
                  zIndex: 30,
                  position: 'absolute',
                  top: '17px',
                  right: '8px'
                }}
                >{
                  isShowConfirmPassword? (
                    <EyeFilled/>
                  ) : (
                    <EyeInvisibleFilled/>
                  )
                }
                </span>
                <InputForm placeholder = "Xác nhận mật khẩu" type={isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange = {handleOnchangeConfirmPassword}/>

              </div>
              {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: '15px'}}>{data?.message}</span>}
              <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40} 
              styleButton={{
                    background: 'rgb(255,57,69)',
                    height: '48px',
                    width: '100%',
                    margin: '26px 0 30px'
              }} 
                        textButton = {'Đăng ký'}
                        styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700px'}}
                    ></ButtonComponent>
                    <span><WrapperTextLight onClick={handleNavigateSignIn} style= {{cursor: 'pointer'}}>Trở lại đăng nhập</WrapperTextLight></span>
           </WrapperContainerLeft>
           <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="logo" height="300px" width="500px" />
          <h1 style={{textAlign: 'center'}}>Chào mừng bạn đến với trang đăng nhập của truyentranh24</h1>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage