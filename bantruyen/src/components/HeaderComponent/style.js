import { Row } from "antd";
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: #093155;
    align-items: center;
    gap: 16px;
    flext-wrap: nowrap;
    width: 1270px;
    padding: 10px 0;
`
export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
`
export const WrapperHeaderAccount = styled.div`
    display: flex,
    align-items: center;
    color: #fff;
    padding-left:50px;
    font-size: 13px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover{
        background: red;
        color: #fff;
    }
`
