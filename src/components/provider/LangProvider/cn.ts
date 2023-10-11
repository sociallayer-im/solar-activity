import { LangConfig } from './en'

function slotLang(str: string) {
  return function (slots: any[]): string {
    let res = str
    slots.forEach(slot => {
      res = res.replace(/\{(\w+)\}/i, slot)
    })
    return res
  }
}

const langCN: LangConfig = {
  Nav_Wallet_Connect: '登录',
  Nav_Wallet_Disconnect: '登出',
  Nav_Badge_Page: '徽章',
  Nav_Event_Page: '活动',

  Wallet_Title_MetaMask: 'Meta Mask',
  Wallet_Intro_MetaMask: '连接你的 MetaMask 钱包',

  Wallet_Title_WalletConnect: 'WalletConnect',
  Wallet_Intro_WalletConnect: '连接你的 WalletConnect 钱包',

  UserAction_MyProfile: '查看主页',
  UserAction_Disconnect: '登出',

  Regist_Step_One_Title: '设置一个用户名',
  Regist_Step_One_Des: '请输入英文或中文字符',
  Regist_Step_One_Placeholder: '输入你的用户名',

  Regist_Step_Two_Address_Title: '绑定钱包',
  Regist_Step_Two_Address_Des: '请输入你的钱包地址以绑定账号',
  Regist_Step_Two_Address_Placeholder: '你的钱包地址',

  Regist_Step_Two_Email_Title: '绑定邮箱',
  Regist_Step_Two_Email_Des: '请输入你的邮箱以绑定账号',
  Regist_Step_Two_Email_Placeholder: '你的邮箱',

  Regist_Step_Next: '下一步',

  Regist_Title: '设定一个独一无二的 Social layer 域名身份吧！',
  Domain_Rule: '只能包含字母数字连字符，并且连字符不能在开头和结尾，不能有空格，6个字符以上。',
  Regist_Input_Placeholder: '你的域名',
  Regist_Input_Validate: slotLang('不能超过 {n} 个字符'),
  Regist_Input_Validate_2: slotLang('不能少于 {n} 个字符'),
  Regist_Input_Validate_3: '域名包含非法字符',
  Regist_Input_Validate_4: slotLang('域名包含非法字符: {n}'),
  Regist_Input_Empty: '此项不能为空',
  Regist_Input_Error_Start: '不能以"-"开始',
  Regist_Input_Error_End: '不能以"-"结尾',
  Regist_Confirm: '确定',
  Regist_Dialog_Title: '你将以这个域名创建用户：',
  Regist_Dialog_ModifyIt: '修改一下',
  Regist_Dialog_Create: '使用',
  Regist_InUse: '该域名已被使用',

  Profile_User_NotExist: '该用户不存在',
  Profile_User_MindBadge: '颁发徽章',
  Profile_User_IssueBadge: '发送徽章給 ',
  Profile_User_Qrcode_download: '保存到相册',
  Profile_Tab_Received: '徽章',
  Profile_Tab_Point: '点数',
  Profile_Tab_NFTPASS: 'NFT Pass',
  Profile_Tab_Basic: '基础徽章',
  Profile_Tab_Minted: '已创建',
  Profile_Tab_Groups: '群组',
  Profile_Tab_Presend: '发送中',
  Profile_Show_Wallet: '你的钱包地址',
  Profile_Show_Email: '你的邮箱',
  Profile_Show_Close: '关闭',
  Profile_Show_Copy: '复制',

  Avatar_Upload_Button: '更改头像',

  BadgeDialog_Btn_Login: '登录以接收',
  BadgeDialog_Btn_Reject: '拒绝',
  BadgeDialog_Btn_Accept: '接收',
  BadgeDialog_Btn_Face2face: '二维码',
  BadgeDialog_Btn_share: '发送',
  BadgeDialog_Btn_Issue: '再次颁发',
  BadgeDialog_Btn_None_Left: '领取完毕',

  BadgeDialog_Label_Creator: '颁发者',
  BadgeDialog_Label_Token: 'Token 域名',
  BadgeDialog_Label_Issuees: '接收者',
  BadgeDialog_Label_action_hide: '设为隐藏',
  BadgeDialog_Label_action_public: '设为公开',
  BadgeDialog_Label_action_top: '设为置顶',
  BadgeDialog_Label_action_untop: '取消置顶',
  BadgeDialog_Label_hide_tip: '仅本人可见',
  BadgeDialog_Label_Creat_Time: '创建时间',
  BadgeDialog_Label_Private: '徽章类型',
  BadgeDialog_Label_Private_text: '私密',
  BadgeDialog_Label_gift_text: '礼物卡',

  BadgeletDialog_title: '徽章详情',
  BadgeletDialog_presend_title: '发送中详情',
  BadgeletDialog_invite_title: '邀请详情',
  BadgeletDialog_gift_title: '礼物卡详情',
  BadgeletDialog_Reason: '颁发理由',

  MintBadge_Title: '创建徽章',
  MintBadge_Upload: '徽章图片',
  MintBadge_UploadTip: slotLang('支持JPG, PNG, GIF， 大小不超过 {size}'),
  MintBadge_Name_Label: '徽章名称',
  MintBadge_Name_Placeholder: '徽章名称',
  MintBadge_Domain_Label: '徽章域名',
  MintBadge_Domain_Placeholder: '徽章域名',
  MintBadge_Submit: '发送给朋友',
  MintBadge_Next: '下一步',
  MintBadge_Submit_To: slotLang('发送给 {1}'),
  MintBadge_Submiting: '创建中',
  MintBadge_Domain_Rule: '这个域名是徽章的唯一标识符。<br />只能包含字母数字连字符，并且连字符不能在开头和结尾，不能有空格，4个字符以上。',

  MintFinish_Title: '颁发完成！',
  MintFinish_Button_Later: '暂不颁发',
  MintFinish_Button_Issue: '直接颁发',

  IssueBadge_Title: '颁发徽章',
  IssueBadge_Domain: '徽章域名',
  IssueBadge_Reason: '颁发原因 (选填)',
  IssueBadge_Create_time: '创建于',
  IssueBadge_ReasonPlaceholder: '颁发徽章的原因',
  IssueBadge_Issuees: '接收者',
  IssueBadge_Support: '支持： <br />1.钱包地址; <br/>2. \'.dot/.eth\'结尾的域名; <br /> 3.Social Layer 的用户名和用户域名',
  IssueBadge_IssueesPlaceholder: '请输入对方钱包地址、域名、用户名',
  IssueBadge_GoToIssue: '直接颁发',
  IssueBadge_Issuesing: '颁发中',
  IssueBadge_Mint: '发送',
  IssueBadge_Mint_later: '稍后发送',
  IssueBadge_Sendwithlink: '链接发送',
  IssueBadge_By_QRcode: '二维码发送',
  IssueBadge_Sendwithdomain: '选择名字',
  IssueBadge_linkbtn: '链接',
  IssueBadge_Eventbtn: '事件',
  IssueBadge_Address_List_Title: '选择接收者',
  IssueBadge_Input_Error: '无效的域名，地址或者用户名',
  IssueBadge_Input_Des: '输入域名/钱包/电子邮件地址，颁发人可以接收徽章。',

  IssueFinish_Title: '分享',
  IssueFinish_Share_By_Qrcode: '通过二维码分享',
  IssueFinish_Share_By_Link: '通过链接分享',
  IssueFinish_CopyLink: '复制链接',
  IssueFinish_Screenshot: '通过屏幕截图分享',
  IssueFinish_Screenshot_Or: '或者',
  IssueFinish_share: '#1 给你颁发了一枚 NFT 徽章：#2，快去领取吧！\n 推荐使用MetaMask或者imToken的浏览器打开。\n #3',
  IssueFinish_Share_Card_text_1: '给你一个特别徽章',
  IssueFinish_Share_Card_text_2: 'Mint by @Social Layer',

  Search_Cancel: '取消',
  Search_Label_Domain: slotLang('Domain for "{keyword}":'),
  Search_Label_Badge: slotLang('Badges for "{keyword}":'),

  Home_SubTitle: 'The social honor of your life your life',
  Home_Content: 'Each POAP is a gift from an issuer to collectors, in celebration of a special shared memory.<br>By minting these memories to the blockchain, collectors build a rich tapestry of tokenized experiences which unlock a world of possibilities.',
  Home_SearchPlaceholder: 'Search for Wallet/Domain',
  Home_ButtonLabel: 'Explore my collection',
  Home_ButtonTip: 'Connect Wallet',

  Copied: '已复制',

  Landing_Title: '欢迎来到<span>Social Layer 🎉</span>',
  Landing_Sub_Tittle_1: 'Social Layer 是什么？',
  Landing_Sub_Tittle_2: '你可以做什么？',
  Landing_Sub_Tittle_3: '如何颁发徽章？',
  Landing_Des_1: '一个任何人可以给任何人发徽章的dApp，基于主观的、不可量化的价值，构建一个人的数字身份。徽章发放不受第三方的审核和批准，多元价值社区中会自然涌现出最具价值的徽章。',
  Landing_Des_2: '通过颁发徽章，表达对他人的感受，发现更多与你志趣相投的人。',
  Landing_Des_3: '点击“马上体验”，创建自己的链上身份，进入profile页即可颁发徽章。作为首批用户，Social Layer将为你支付铸造徽章所产生的gas费。',
  Landing_Des_4: '更多信息请进入：',
  Landing_White_Paper: 'Social Layer 白皮书',
  Landing_Button: '马上体验',
  Landing_Badge_Receive: '登录并领取',

  WhatsApp_Share: slotLang('{domain} 给你颁发了一枚 NFT 徽章：{badge}. 快去领取吧！{url}'),

  Login_Title: '使用邮箱登录',
  Login_alert: '徽章的接收/颁发不会被铸造',
  Login_solar: '使用 Social Layer 登录',
  Login_continue: '下一步',
  Login_Placeholder: '您的邮箱',
  Login_option: '其他方式',
  Login_input_Code_title: '邮箱验证码',
  Login_input_Code_des: slotLang('输入你的邮箱 {email} 接收到的验证码完成登录操作'),

  Page_Back: '返回',
  Page_Back_Done: '完成',

  Picture_Recommend_Title: '示例',
  Picture_Recommend_Create_By_Canva: '通过 Canva 创建',
  Picture_Recommend_Download_A_Template: '下载示例',

  Quantity_input_label: '数量',
  Quantity_Unlimited: '无限制',

  Presend_step: '输入徽章数量，徽章将作为链接发送。',

  presend_share_link: '#1 给你发送了NFT徽章：#2。 赶紧去获取吧！\n #3 \n 推荐使用MetaMask或者imToken的浏览器打开。',

  Activity_Calendar: '活动日程表',
  Activity_Page_type: '活动',
  Activity_State_Registered: '已报名',
  Activity_Online_Event: '线上活动',
  Activity_Max_Participations: '最多 #1 人',
  Activity_State_Created: '我发起的',
  Activity_login_title: '没有已参加的活动',
  Activity_login_des: '通过登录参加活动',
  Activity_login_btn: '登录 / 注册',
  Activity_search_placeholder: '搜索活动…',
  Activity_no_activity: '当前没有活动～',
  Activity_latest: '最新活动',
  Activity_Popular: '最受欢迎',
  Activity_Past: '已结束',
  Activity_Commended: '推荐',
  Activity_Coming: '即将开始',
  Activity_Greeting_Morning: '早上好',
  Activity_Greeting_Afternoon: '下午好',
  Activity_Greeting_Evening: '晚上好',
  Activity_My_Register: '我的报名',
  Activity_My_Event: '我的',
  Activity_All_Activity: '全部活动',
  Activity_Btn_Create: '发布活动',
  Activity_Btn_Modify: '修改活动',
  Activity_Create_title: '发布活动',
  Activity_Create_Btn: '发布活动',
  Activity_Setting_title: '修改活动',
  Activity_Create_Done: '完成',
  Activity_Create_Success: '创建成功 🎉',
  Activity_Create_Success_Scan_tips: '扫描二维码 <br> 参加活动',
  Activity_Create_Success_Scan_tips_2: '| 活动',
  Activity_Scan_checkin: '扫描二维码签到',
  Activity_Scan_punch_in: '扫描二维码打卡',
  Activity_Registered_participants: '已签到参加者',
  Activity_originators: '发起人',
  Activity_Des: '活动描述',
  Activity_Participants: '参与人',
  Activity_Punch_Log: '打卡记录',
  Activity_Punch_in_BTN: '打卡',
  Activity_Cancel_registration: '取消参与',
  Activity_Form_Cover: '封面/海报',
  Activity_Form_Checklog: '作为重复打卡活动',
  Activity_Form_Name: '活动名',
  Activity_Form_Details: '内容 (选填)',
  Activity_Form_online_address: '线上地址 (选填)',
  Activity_Form_Starttime: '活动时间',
  Activity_Form_Ending: '结束时间',
  Activity_Form_Where: '在哪里举办活动？',
  Activity_Form_participants: '最大参与人数',
  Activity_Form_participants_Min: '最小参与人数',
  Activity_Form_Guest: '嘉宾 (选填)',
  Activity_Form_Duration: '设置活动持续时间',
  Activity_Form_Duration_Cancel: '取消设置活动持续时间',
  Activity_Form_Hoster: '发起人',
  Activity_Form_Label: '标签',
  Activity_Form_Badge: '活动徽章 (选填)',
  Activity_Form_Wechat: '活动微信群',
  Activity_Form_Wechat_Des: '此二维码将会在活动创建完成后展示',
  Activity_Form_Wechat_Account: '此二维码失效，参与者可以通过微信找到发起人',
  Activity_Form_Badge_Des: '活动参与者签到后，活动结束可自动收到徽章',
  Activity_Form_Badge_Select: '选择徽章',
  Activity_Form_wechat_Select: '选择图片',
  Activity_Form_Ending_Time_Error: '结束时间不能早于开始时间',
  Activity_Detail_Btn_Modify: '修改',
  Activity_Detail_Btn_Canceled: '已经取消',
  Activity_Detail_Btn_Cancel: '取消活动',
  Activity_Detail_Btn_unjoin: '取消参加',
  Activity_Detail_site_Occupied: '在所选时段下的该场地已经被占用，请重新选择场地或活动时间。',
  Activity_Detail_Btn_Checkin: '签到',
  Activity_Detail_Btn_Attend: '参加',
  Activity_Detail_Btn_End: '活动已结束',
  Activity_Detail_Btn_has_Cancel: '活动已取消',
  Activity_Detail_Btn_add_Calender: '添加到日历',
  Activity_Detail_Btn_Joined: '已参加',
  Activity_Detail_Btn_AttendOnline: '线上参与',
  Activity_Detail_Badge: '报名参加活动，结束可获得 POAP*1',
  Activity_Detail_Guest: '嘉宾',
  Activity_Detail_Offline_location: '活动现场',
  Activity_Detail_Offline_location_Custom: '选择地点',
  Activity_Detail_Offline_Tg: 'Telegram (选填)',
  Activity_Detail_Offline_Tg_des: 'The group link will be displayed after participants have Applied.',
  Activity_Detail_Online_address: '线上地址',
  Activity_Detail_min_participants_Alert: slotLang('报名人数少于 {1} 人时，活动可能会被取消, 活动开始前30分钟可以签到。'),
  Activity_quantity_Input: '自定义',
  Activity_Calendar_Page_Time: '时间',
  Activity_Calendar_Page_Name: '活动',
  Activity_Detail_Expired: '已结束',
  Activity_Detail_Created: '我发起的',
  Activity_Detail_Wechat: '加入活动微信群',
  Activity_Detail_Account: '或添加发起人微信：',

  Activity_Host_Check_And_Send: '签到或者发放POAP',
  Activity_Host_Send: '发放POAP',

  Activity_Unjoin_Confirm_title: '确定取消这个参加活动吗？',

  New_Year_1: '将你的新年祝福铸造成数字徽章',
  New_Year_2: '颁发理由 :',
  New_Year_3: '送你一枚徽章 扫码领取',
  Save_Card: '保存到相册',

  Card_Event_Success_1: '扫码参加活动',
  Card_Event_Success_2: '',

  Group_invite_title: '邀请新成员',
  Group_invite_badge_name: slotLang('{groupName} 的成员'),
  Group_invite_message: '邀请信息',
  Group_invite_receiver: '接收人',
  Group_invite_Nondesignated: '非指定接收人',
  Group_invite_Designated: '指定接收人',
  Group_invite_default_reason: slotLang('邀请你成为 {n} 的群组成员'),
  Group_invite_detail_benefits: '权益',
  Group_invite_detail_benefits_des: slotLang('你就自动成为 {n} 的一员。'),
  Group_invite_share: '#1 给你颁发了 NFT 徽章：#2。赶快领取把！\n #3 \n 推荐使用MetaMask或者imToken的浏览器打开。',

  Group_regist_confirm: '创建群组',
  Group_regist_owner: '群组拥有者',
  Group_regist_confirm_dialog: '将会以这个域名创建群组: ',
  Group_regist_des: '徽章以群组的名义颁发给成员',
  Group_regist_title: '为你的群组设定一个独一无二的 Social layer 域名身份吧！',

  Group_setting_title: '设置',
  Group_setting_dissolve: '冻结群组',
  Group_freeze_dialog_title: '您是否确定要冻结此群组？',
  Group_freeze_dialog_des: '冻结后，该群组的所有信息将不再显示，且无法恢复。徽章颁发记录仍然可以找回。',
  Group_freeze_Dialog_confirm: '冻结',
  Group_freeze_Dialog_cancel: '取消',

  Group_relation_ship_member: '成员',
  Group_relation_ship_owner: '拥有者',

  Follow_detail_followed: '被关注',
  Follow_detail_following: '关注',
  Follow_detail_groups: '群组',
  Follow_detail_btn_mint: '为群组颁发徽章',

  Group_detail_tabs_member: '成员',
  Group_detail_tabs_Event: '活动',
  Group_detail_tabs_Invite: '邀请',
  Group_detail_Join_Time: '加入时间',

  Relation_Ship_Action_Follow: '关注',
  Relation_Ship_Action_Followed: '已关注',
  Relation_Ship_Action_Following: '被关注',
  Relation_Ship_Action_Join: '加入',
  Relation_Ship_Action_Joined: '已加入',
  Relation_Ship_Action_Leave: '离开群组',
  Relation_Ship_Action_Unfollow: '取消关注 ',

  Empty_Text: '没有数据~',
  Empty_No_Badge: '没有徽章~',
  Empty_No_Present: '没有发送中~',
  Empty_No_Group: '没有群组~',
  Empty_No_Invite: '没有邀请~',

  Search_Tab_Domain: 'Domain',
  Search_Tab_Badge: 'Badge',
  Search_Tab_Event: 'Event',

  Badgebook_Dialog_Choose_Badgebook: '从 Badge book 选择',
  Badgebook_Dialog_Choose_Badge: '从已经颁发的徽章中选择',
  Badgebook_Dialog_Choose_Draft: '从保存的草稿中选择',
  Badgebook_Dialog_Cetate_Badge: '创建新的徽章',
  Badgebook_Dialog_Recognition_Badge: '基础徽章',
  Badgebook_Dialog_Recognition_Des: '基础徽章, 用于对他人的评价',
  Badgebook_Dialog_Points: '点数',
  Badgebook_Dialog_Points_Des: '创建组织积分系统',
  Badgebook_Dialog_Privacy: '私密徽章',
  Badgebook_Dialog_Privacy_Des: '私密徽章，只有接收者自己可见',
  Badgebook_Dialog_NFT_Pass: 'NFT Pass',
  Badgebook_Dialog_NFT_Pass_Des: '由团体给予个人',
  Badgebook_Dialog_Gift: '礼物卡',
  Badgebook_Dialog_Gift_Des: '发送带福利的徽章',

  Dialog_Public_Image_Title: '选择一张徽章图片',
  Dialog_Public_Image_UploadBtn: '上传图片',
  Dialog_Public_Image_UploadBtn_Des: 'JPG 或者 PNG. 最大 800K',
  Dialog_Public_Image_List_Title: '公共图片',

  Cropper_Dialog_Title: '编辑图片',
  Cropper_Dialog_Btn: '应用',

  Presend_Qrcode_Badge: '徽章',
  Presend_Qrcode_Des: slotLang('{1} 给你发送{2}。'),
  Presend_Qrcode_Recommended: '推荐使用',
  Presend_Qrcode_Scan: '扫描二维码',
  Presend_Qrcode_Limit: slotLang('限制 {1} 人'),
  Presend_Qrcode_Time: slotLang('有效期至: {1}'),
  Presend_Qrcode_Time_2: slotLang('生效时间: {1}'),
  Presend_Qrcode_Expired: '这个徽章已经过期了',
  Presend_Qrcode_Regen: '你可以重新生成二维码',

  Home_Page_New_Title: '创建一个徽章',
  Home_Page_New_Des: '现在就加入吧，开始创建徽章，描述你的成就，并将它们颁发给值得拥有的人。',
  Home_Page_New_Btn: '创建你的徽章',

  Badgelet_List_Title: '已收集',
  Badgelet_List_Unit: '徽章',
  Created_List_Title: '已创建',

  Dialog_Copy_Btn: '确定',
  Dialog_Copy_Title: '复制成功',
  Dialog_Copy_Message: '在浏览器中共享并打开链接。',

  Profile_Bio_More: '更多…',
  Profile_Bio_Less: '收起',

  Profile_Edit_Title: '编辑资料',
  Profile_Edit_Avatar: '头像',
  Profile_Edit_Ncikname: '昵称',
  Profile_Edit_Bio: '个人简介',
  Profile_Edit_Bio_Placeholder: '介绍一下自己吧',
  Profile_Edit_Location: '所在地',
  Profile_Edit_Social_Media: '社交媒体',
  Profile_Edit_Social_Media_Edit: '编辑',
  Profile_Edit_Social_Media_Edit_Dialog_Title: '你的 ',
  Profile_Edit_Social_Confirm: '确定',
  Profile_Edit_Save: '保存',
  Profile_Edit_Leave: '离开',
  Profile_Edit_Cancel: '取消',
  Profile_Edit_Leave_Dialog_Title: '是否离开？',
  Profile_Edit_Leave_Dialog_Des: '你的修改将不会被保存。',

  Group_Member_Manage_Dialog_Title: '管理群组成员',
  Group_Member_Manage_Dialog_Confirm_Btn: '移除成员',
  Group_Member_Manage_Dialog_Confirm_Dialog_des: slotLang('你确定要移除 {1} 吗？'),
  Group_Member_Manage_Dialog_Confirm_Dialog_Confirm: '移除',
  Group_Member_Manage_Dialog_Confirm_Dialog_Cancel: '取消',

  Create_Point_Title: '创建点数',
  Create_Point_Symbol: '符号',
  Create_Point_Image: '图片',
  Create_Point_Name: '名称',
  Create_Point_Name_Placeholder: '输入名称，例如：Knowledge Points',
  Create_Point_Symbol_Placeholder: '输入符号，例如：PT',
  Create_Point_Des: '描述(可选)',

  Create_NFT_Title: '创建 NFT Pass',
  Create_NFT_Image: '图片',
  Create_NFT_Name: '名称',
  Create_NFT_Name_Placeholder: '输入名称',
  Create_NFT_Name_Domain: '域名',
  Create_NFT_Name_Des: '描述(可选)',

  Create_Nft_success: '创建成功',
  Create_Nft_success_des: '你的 NFT Pass 已经创建',
  Issue_Nft_Title: '发送 NFT Pass',
  Issue_Nft_Start: '开始时间',
  Issue_Nft_End: '结束时间',

  NFT_Detail_title: 'Nft Pass 详情',
  NFT_Detail_checkin_title: '签到记录',
  NFT_Detail_Des: '描述',
  NFT_Detail_Check: '签到',
  NFT_Detail_use: '使用 NFT Pass',
  NFT_Detail_show_record_btn: '查看记录',
  NFT_Detail_Expiration: '有效期',
  NFT_Detail_Unavailable: '不在有效期内',

  Point_Detail_Title: '点数详情',

  Create_Point_success: '创建成功',
  Create_Point_success_des: '你的点数已经创建',
  Issue_Point_Title: '发送点数',
  Issue_Point_Point: '点数',

  Dialog_Check_In_Title: '签到',

  Create_Privacy_Title: '创建私密徽章',
  Create_Privacy_Tips: '只有你和接受者可以看到这个徽章的详情，其他人只能看到发送者和接收者',

  Create_Gift_Title: '创建礼物卡',
  Create_Gift_Benefits: '福利',

  Selector_issue_type_gift: '发送礼物卡',
  Selector_issue_type_gift_times: '权益次数',
  Create_gift_success: '创建成功',
  Create_gift_success_des: '你的礼物卡已经创建',

  Gift_detail_check_btn: '核销',
  Gift_Detail_use: '使用',
  Gift_Detail_amount: '剩余次数',
  Gift_Detail_check_remain: slotLang('使用成功，还剩下 {1} 次'),

  Gift_Checked_Title: '成功核销',
  Gift_Checked_Des: '你已经成功核销了这张礼物卡',
  Gift_Checked_Btn: slotLang('再次使用 (剩余 {1} 次)'),
  Gift_Checked_show_remain: slotLang('剩余 {1} 次'),
  Gift_Checked_show_receiver: '接收者',
  Gift_Checked_show_last_consume: '上次消费: ',

  Create_Badge_Success_Title: '创建成功',
  Create_Badge_Success_Des: '你的徽章已经创建',

  Selector_issue_type_badge: '发送徽章',
  Selector_issue_type_amount: '徽章数量',

  Meeting_Zoom_Title: 'Zoom会议',
  Meeting_Google_Title: 'Google会议',
  Meeting_Tencent_Title: '腾讯会议',
  Meeting_Others_Title: '线上会议',

  Month_Name: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  Day_Name: ['周日','周一','周二','周三','周四','周五','周六'],
  Days: '天',
  Minute: '分',

  Form_All_Day: '全天',
  Form_Repeat_Not: '非重复事件',
  Form_Repeat_Day: '每天',
  Form_Repeat_Week: '每周',
  Form_Repeat_Month: '每月',
}

export default langCN
