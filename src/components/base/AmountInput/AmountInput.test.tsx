import { render, screen, userEvent } from '../../../test/test-utils'
import AmountInput from './AmountInput'

describe('AmountInput', async () => {

    it('正常渲染', () => {
        let amount: number | null | string = null
        const handleChange = (value: number | string) => {
            amount = value
        }
        render(<AmountInput value={10} onChange={ handleChange } />)
        expect(screen.getByTestId('AmountInput')).toBeInTheDocument()
        expect(screen.getByTestId('AmountInput').querySelector('input')!.value).toEqual('10')
    })

    it('点击预设数量按钮,回调函数传出预设值', async () => {
        let amount: number | null | string = null
        const handleChange = (value: number | string) => {
            amount = value
        }

        const screen = await render(<AmountInput value={10} onChange={ handleChange } />)
        userEvent.click(screen.getByText('50'))
        screen.rerender(<AmountInput value={amount!} onChange={ handleChange } />)
        expect(screen.getByTestId('AmountInput').querySelector('input')!.value).toEqual('50')
    })

    it('手动输入数量,回调函数传出输入值', async () => {
        let amount: number | null | string = null
        const handleChange = (value: number | string) => {
            amount = value
        }

        const screen = await render(<AmountInput value={10} onChange={ handleChange } />)
        userEvent.type(screen.getByTestId('AmountInput').querySelector('input')!, '100')
        expect(amount).toEqual(100)
    })

    it('只能输入数字', async () => {
        let amount: number | null | string = null
        const handleChange = (value: number | string) => {
            amount = value
        }

        const screen = await render(<AmountInput value={10} onChange={ handleChange } />)
        userEvent.type(screen.getByTestId('AmountInput').querySelector('input')!, '只能输入数字')
        expect(amount).toBeNull()
    })
})
