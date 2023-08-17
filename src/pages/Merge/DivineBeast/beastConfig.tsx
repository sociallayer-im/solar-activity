import Beast01 from "./svg/Beast01";
import Beast02 from "./svg/Beast02";

export interface BeastInfo {
    id: number
    complete: string
    category: string
    description: string
    post: any,
    cost: Array<number>  // 合成消耗 [<poap数量>， <host数量>]
    items: Array<BeastItemInfo>
}

export interface BeastItemInfo {
    name: string
    icon: string,
    position: number,
    cost?: Array<number> // 合成消耗 [<poap数量>， <host数量>]
}

function useBeastConfig() {
    const list: BeastInfo[] = [
        {
            id: 1,
            category: '基础大狫',
            complete: 'Web3 大狫',
            description: '体大如斗，秉节持重',
            post: Beast01,
            cost: [3, 1],
            items: [
                {
                    name: '帽子1',
                    icon: '/images/merge/items/beast_1_item_1.svg',
                    position: 1,
                    cost: [1, 0],
                },
                {
                    name: '帽子2',
                    icon: '/images/merge/items/beast_1_item_5.svg',
                    position: 1,
                    cost: [1, 0],
                },
                {
                    name: '眼镜',
                    icon: '/images/merge/items/beast_1_item_2.svg',
                    position: 2,
                    cost: [1, 0],
                },
                {
                    name: '项链',
                    icon: '/images/merge/items/beast_1_item_3.svg',
                    position: 3,
                    cost: [1, 0],
                },
                {
                    name: '鞋子1',
                    icon: '/images/merge/items/beast_1_item_4.svg',
                    position: 4,
                    cost: [1, 0],
                },
                {
                    name: '鞋子2',
                    icon: '/images/merge/items/beast_1_item_6.svg',
                    position: 4,
                    cost: [1, 0],
                },
                {
                    name: '鱼竿',
                    icon: '/images/merge/items/beast_1_item_7.svg',
                    position: 5,
                    cost: [1, 0],
                }
            ]
        },
        {
            id: 2,
            complete: 'Web3 小狫',
            category: '基础小狫',
            description: '沉厚寡言，游于山林',
            post: Beast02,
            cost: [3, 1],
            items: [
                {
                    name: '帽子',
                    icon: '/images/merge/items/beast_2_item_1.svg',
                    position: 1,
                },
                {
                    name: '口罩',
                    icon: '/images/merge/items/beast_2_item_2.svg',
                    position: 2,
                },
                {
                    name: '鞋子',
                    icon: '/images/merge/items/beast_2_item_3.svg',
                    position: 3,
                }
            ]
        }
    ]


    return {beastInfo: list}
}

export default useBeastConfig
