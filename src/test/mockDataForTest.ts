import { Group, Profile, Badge, Badgelet, ProfileSimple, Invite, Presend } from '../service/solas'

export const groups: Group[] = [
    {
        id: 567,
        group_owner_id: 1,
        image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/5ypp629n_4fCVC1OIJ',
        is_group: true,
        status: 'active',
        token_id: 'asdasdasdasdasdasda123123asdasd',
        twitter: null,
        twitter_proof_url:null,
        username: 'testgroup1',
        domain: 'testgroup1.sociallayer.im',
        nickname: 'testgroup1',
    }, {
        id: 568,
        group_owner_id: 1,
        image_url: null,
        is_group: true,
        status: 'active',
        token_id: 'asdasdasdasdasdasda123123asdasd22',
        twitter: null,
        twitter_proof_url:null,
        username: 'testgroup2',
        domain: 'testgroup2.sociallayer.im',
        nickname: 'testgroup2',
    }, {
        id: 569,
        group_owner_id: 1,
        image_url: null,
        is_group: true,
        status: 'freezed',
        token_id: 'asdasdasdasdasdasda123123asdasd33',
        twitter: null,
        twitter_proof_url:null,
        username: 'testgroup3',
        domain: 'testgroup3.sociallayer.im',
        nickname: 'testgroup3',
    }
]

export const profiles: Profile[] = [
    {
        address: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c',
        domain: 'zfd.sociallayer.im',
        group_owner_id: null,
        id: 1,
        image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/xydvdzqa_qBn0RxwN2',
        twitter: 'twitter',
        email: null,
        username: 'zfd',
        followers: 2,
        following: 6,
        is_group: null,
        badge_count: 12,
        status: 'active',
        ens: 'zfd.eth',
        github: 'zfd',
        discord: 'zfd',
        nostr: 'zfd',
        website: 'zfd',
        about: 'zfd',
        nickname: 'zfd',
        telegram: 'zfd',
        lens: 'zfd',
        location: 'zfd',

    },
    {
        address: '0x7682Ba569E3823Ca1B7317017F5769F8Aa8842D4',
        domain: 'jiang.sociallayer.im',
        group_owner_id: null,
        id: 46,
        image_url: null,
        twitter: 'jiangplus',
        email: null,
        username: 'jiang',
        followers: 5,
        following: 11,
        is_group: null,
        badge_count: 12,
        status: 'active',
        ens: 'zfd.eth',
        github: 'zfd',
        discord: 'zfd',
        nostr: 'zfd',
        website: 'zfd',
        about: 'zfd',
        nickname: 'zfd',
        telegram: 'zfd',
        lens: 'zfd',
        location: 'zfd',
    },
    {
        address: 'null',
        domain: '475469442.sociallayer.im',
        group_owner_id: null,
        id: 46,
        image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/0jjlqw8s_VpFMGtEQH',
        twitter: '475469442',
        email: '475469442@qq.com',
        username: 'jiang',
        followers: 0,
        following: 0,
        is_group: null,
        badge_count: 12,
        status: 'active',
        ens: 'zfd.eth',
        github: 'zfd',
        discord: 'zfd',
        nostr: 'zfd',
        website: 'zfd',
        about: 'zfd',
        nickname: 'zfd',
        telegram: 'zfd',
        lens: 'zfd',
        location: 'zfd',
    }
]

export const badges: Badge[] = [
    {
        id: 711,
        domain: 'solar.zfd.sociallayer.im',
        created_at: '2023-04-11T09:12:13.107Z',
        name: 'solar',
        title: 'solar',
        token_id: '0x14dc83c6fb4a6103a238f3000cc22ce414801179e9b54d90dc50a45c869aafe2',
        image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/r5piktty_SR2idIzw9',
        sender: profiles[0],
        group: null,
        content: '',
        counter: 5,
        badge_type: 'badge'
    },
    {
        id: 1,
        domain: 'tessss.zfd.sociallayer.im',
        created_at: '2023-04-11T09:12:13.107Z',
        name: 'solar',
        title: 'solar',
        token_id: '0xbab7c1e6b833a45910e1c1ab371ca8097d2cd42d7d246a69d5f490664024866a',
        image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/r5piktty_SR2idIzw9',
        sender: profiles[0],
        group: null,
        content: 'ttttasd',
        counter: 10,
        badge_type: 'badge'
    }
]

export const badgelets: Badgelet[] = [
    {
        id: 1140,
        badge_id: 719,
        content: 'zfd test issue',
        domain: 'zfdtestissue.testgroup4.sociallayer.im#1',
        hide: false,
        top: false,
        owner: {
            id: 1,
            address: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c',
            domain: 'zfd.sociallayer.im',
            email: null,
            image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/xydvdzqa_qBn0RxwN2',
        },
        receiver: {
            id: 1,
            address: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c',
            domain: 'zfd.sociallayer.im',
            email: null,
            image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/xydvdzqa_qBn0RxwN2',
        },
        sender: {
            id: 1,
            address: '0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c',
            domain: 'zfd.sociallayer.im',
            email: null,
            image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/xydvdzqa_qBn0RxwN2',
        },
        status: 'accepted',
        token_id: '0x627d67bbc6fae2fa589a41febb664d1df0b4b5ec51ad007fb4591f2b09c917a2',
        badge: {
            id: 719,
            domain: 'zfdtestissue.testgroup4.sociallayer.im',
            created_at: '2023-04-11T09:12:13.107Z',
            name: 'zfd test issue',
            title: 'zfd test issue',
            token_id: '0xabaab2fea3a70e84945448a841731e33c553c26bc4f3b0adad397d90e622e87a',
            image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/5ypp629n_4fCVC1OIJ',
            sender: profiles[0],
            group: {
                domain: 'testgroup4.sociallayer.im',
                username: 'testgroup4',
                id: 764,
                image_url: 'https://ik.imagekit.io/soladata/tr:n-ik_ml_thumbnail/xewls18v_qXrB2mr8q'
            } as any,
            content: 'zfd test issue',
            counter: 2,
            badge_type: 'badge'
        },
        chain_data: null,
        group: null,
        created_at: '2023-04-14T10:20:01.997Z',
        last_consumed_at: '2023-04-14T10:20:01.997Z',
    }
]

export const invites: Invite[] = [
    {
        id: 59,
        message: 'Invite you to become a member of finalgroup',
        receiver_id: 1,
        sender_id: 1,
        status: 'accepted',
        expires_at: '2023-04-10T12:29:15.782Z',
        group_id: 670,
        created_at: '2023-04-10T07:23:39.196Z'
    }
]

export const presends: Presend[] = [
    {
        id: 403,
        message: '',
        sender_id: 1,
        group: null,
        code: "4776253",
        badge: badges[0],
        counter: 1,
        badge_id: badges[0].id,
        expires_at: '2023-04-11T12:34:22.978Z',
        created_at: '2023-05-11T12:34:22.977Z'
    }
]
