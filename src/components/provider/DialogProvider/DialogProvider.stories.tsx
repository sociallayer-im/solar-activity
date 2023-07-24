import React, { useEffect ,useContext } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TestLayout from '../../../stories/TestLayout'
import DialogsContext from './DialogsContext'

interface ShowDialogProps {
    showDialog: boolean
}

function TestDialogProvider (props: ShowDialogProps) {
    return (
        <TestLayout views={[{
            path: '*',
            element: <ShowDialog {...props} />
        }]} />
    )
}

function ShowDialog( props: ShowDialogProps) {
    const { openDialog, clean } = useContext(DialogsContext)
    const content = <div style={{background: '#fff', height: '100%'}}>here is a dialog</div>

    const open = () => {
        openDialog({
            content: () => content,
            size: [300, 300]
        })
    }

    useEffect(() => {
        if (props.showDialog) {
            open()
        } else {
            clean()
        }
    }, [props.showDialog])



    return  <div onClick={() => { open() }}> click here to open a dialog</div>
}

export default {
    title: 'Provider/DialogProvider',
    component: TestDialogProvider,
} as ComponentMeta<typeof TestDialogProvider>;

const Template: ComponentStory<typeof TestDialogProvider> = (args) => <TestDialogProvider {...args} />;

export const Show = Template.bind({});

Show.args = {
    showDialog: true
}

export const Close = Template.bind({});

Close.args = {
    showDialog: false
}

