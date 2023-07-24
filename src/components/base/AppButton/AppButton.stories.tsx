import React, { useEffect ,useContext } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TestLayout from '../../../stories/TestLayout'
import AppButton, { BTN_SIZE, BTN_KIND, AppButtonProps } from './AppButton'

const Wrapper = function(props: AppButtonProps) {
    return <TestLayout
        views={[{
            path:'*',
            element: <AppButton {...props} >Button</AppButton>
        }]}
    ></TestLayout>
}


export default {
    title: 'Component/Base',
    component: AppButton,
} as ComponentMeta<typeof AppButton>;


const Template: ComponentStory<typeof AppButton> = (args) => <Wrapper {...args} />;

export const Button = Template.bind({})

