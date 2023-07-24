import { render, screen, userEvent } from '../../../test/test-utils'
import AddressList from './AddressList'
import { groups, profiles } from '../../../test/mockDataForTest'

describe('Input', async () => {
    it('正常渲染', () => {
        render(<AddressList data={groups} />)
        expect(screen.getByText('testgroup1')).toBeInTheDocument()
    })

    it('通过传入选中值，值对应的列表项显示“选中”标记', () => {
        render(<AddressList data={groups} selected={['testgroup1.sociallayer.im']} />)
        expect(screen.getByTestId('AddressList').querySelector('.list-item')).toContainHTML('<i class="icon icon-selected" title="selected"></i>')
    })

    it('通过列表项，回调函数输出选中值', () => {
        let select: string | null = null
        const handleSelect = (domain: string) => {
            select = domain
        }
        render(<AddressList data={groups} onClick={ handleSelect }/>)

        userEvent.click(screen.getByTestId('AddressList').querySelector('.list-item')!)

        expect(select).toEqual('testgroup1.sociallayer.im')
    })
})
