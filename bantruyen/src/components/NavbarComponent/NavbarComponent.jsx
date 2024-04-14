import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Col, Rate, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
const NavbarComponent = () => {
    const onChange = () => { }
    const navigate = useNavigate()
    const renderContent = (type, options) => {
        switch(type) {
            case 'text':
                return options.map((option) => {
                        return(
                         <WrapperTextValue>{option}</WrapperTextValue>
                        )
                })
            case 'checkbox':
                return(
                
                <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                    {options.map((option) => {
                        return(
                            <Checkbox value={option.value}>{option.label}</Checkbox>
                        )

                    })}
                    
                    <Checkbox value="B">B</Checkbox>
                </Checkbox.Group>
                
                )
                case 'star':
                    return options.map((option) => {
                            return(          
                                <div style={{display: 'flex', gap: '4px'}}>
                                <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
                                <span>{`Từ ${option} sao`}</span>
                                </div>
                                )
                            })
                case 'price':
                    return options.map((option) => {
                            return(          
                                <WrapperTextPrice>
                                    {option}
                                </WrapperTextPrice>
                                )
                            })                     
            default:
                return{}
        }
    }
    return(
    <div>
        <WrapperLabelText>
            Các chuyên mục 
        </WrapperLabelText>
        <WrapperContent>
        <h3 onClick={() => navigate('/product/Truyen%20Trinh%20Tham')}>Truyện trinh thám</h3>
        <h3 onClick={() => navigate('/product/Truyen%20Tinh%20Cam')}>Truyện tình cảm</h3>
        <h3 onClick={() => navigate('/product/Truyen%20Cuoi')}>Truyện Cười</h3>



        </WrapperContent>
    </div>
    )
}
export default NavbarComponent