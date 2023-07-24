import React, { useEffect ,useContext } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LangContext, { LangType } from './LangContext'
import TestLayout from '../../../stories/TestLayout'

interface TestProps {
    lang: LangType
}

function ShowText (props: TestProps) {
    const { lang, switchLang, langType } = useContext(LangContext)

    useEffect(()=> {
        switchLang(props.lang)
    }, [props.lang])

    return  <>
        <div>lang type: <b>{ langType }</b></div>
        <div>text text: <b>{ lang['Landing_Des_1']}</b></div>
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
    title: 'Provider/LangProvider',
    component: TestUserProvider,
} as ComponentMeta<typeof TestUserProvider>;

const Template: ComponentStory<typeof TestUserProvider> = (args) => <TestUserProvider {...args} />;

export const EN = Template.bind({});
EN.args = {
    lang: LangType.en
};

export const CN = Template.bind({});
CN.args = {
    lang: LangType.cn
};
