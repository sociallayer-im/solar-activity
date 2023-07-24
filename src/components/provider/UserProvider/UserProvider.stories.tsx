import React, { useEffect ,useContext } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react';
import UserContext from './UserContext'
import TestLayout from '../../../stories/TestLayout'

interface TestProps {
    isLogin: boolean
}

function ShowText (props: TestProps) {
    const { user, setUser, logOut } = useContext(UserContext)

    useEffect(()=> {
        if(props.isLogin) {
            setUser({
                domain: 'zfd.sociallayer.im',
                userName: 'zfd',
                wallet: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c',
                email: null,
                avatar: null,
                authToken: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c'
            })
        } else {
            logOut()
        }
    }, [props.isLogin])

    return  <>
        <div>username: <b>{user.userName}</b></div>
        <div>domain: <b>{user.domain}</b></div>
        <div>wallet: <b>{user.wallet}</b></div>
        <div>auth token: <b>{user.authToken}</b></div>
    </>
}

function TestUserProvider (props: TestProps) {
    return (
        <TestLayout views={[{
            path: '*',
            element: <ShowText {...props}></ShowText>
        }]} />
    )
}


export default {
    title: 'Provider/UserProvider',
    component: TestUserProvider,
} as ComponentMeta<typeof TestUserProvider>;

const Template: ComponentStory<typeof TestUserProvider> = (args) => <TestUserProvider {...args} />;

export const Login = Template.bind({});
Login.args = {
    isLogin: true
};
export const SignOut = Template.bind({});
SignOut.args = {
    isLogin: false
};
