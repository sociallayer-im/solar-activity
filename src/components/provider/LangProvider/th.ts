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

const langTH: LangConfig = {
    Nav_Wallet_Connect: 'เข้าสู้ระบบ',
    Nav_Wallet_Disconnect: 'ออกจากระบบ',
    Nav_Badge_Page: 'Badge',
    Nav_Event_Page: 'Event',

    Wallet_Title_MetaMask: 'Meta Mask',
    Wallet_Intro_MetaMask: 'เชื่อมต่อกับ MetaMask Wallet หรือ injected explorer wallet',

    Wallet_Title_WalletConnect: 'WalletConnect',
    Wallet_Intro_WalletConnect: 'เชื่อมต่อกับ WalletConnect Wallet',

    UserAction_MyProfile: 'โปรไฟล์',
    UserAction_Disconnect: 'ออกจากระบบ',

    Regist_Step_One_Title: 'ตั้งชื่อผู้ใช้',
    Regist_Step_One_Des: 'พิมพ์อักษรภาษาอังกฤษหรือภาษาจีน',
    Regist_Step_One_Placeholder: 'username',

    Regist_Step_Two_Address_Title: 'ผูกที่อยู่กระเป๋าเงิน',
    Regist_Step_Two_Address_Des: 'ป้อนที่อยู่กระเป๋าเงิน',
    Regist_Step_Two_Address_Placeholder: 'ที่อยู่กระเป๋าเงิน',

    Regist_Step_Two_Email_Title: 'เชื่อมต่อ Email',
    Regist_Step_Two_Email_Des: 'ชื่อ Email',
    Regist_Step_Two_Email_Placeholder: 'Email',

    Regist_Step_Next: 'ถัดไป',

    Regist_Title: 'ตั้งค่าตัวตนโดเมน Social Layer ที่ไม่ซ้ำกัน',
    Domain_Rule: 'Domains สามารถมีอักษรภาษาอังกฤษ a-z และตัวเลข 0-9 ขีดกลางสามารถใช้ได้ แต่ไม่สามารถใช้ที่ต้นและท้ายชื่อ Domain  ควรมีความยาวมากกว่า 6 ตัวอักษร',
    Regist_Input_Placeholder: 'Domain',
    Regist_Input_Validate: slotLang('ไม่สามารถเกิน {n} ตัวอักษร'),
    Regist_Input_Validate_2: slotLang('ไม่สามารถน้อยกว่า {n} ตัวอักษร'),
    Regist_Input_Validate_3: 'Domain มีตัวอักษรที่ไม่ถูกต้อง',
    Regist_Input_Validate_4: slotLang('Domain มีอักษรที่ไม่ถูกต้อง: {n}'),
    Regist_Input_Error_Start: 'Domain ไม่สามารถเริ่มต้นด้วย "-"',
    Regist_Input_Error_End: 'โดเมนไม่สามารถลงท้ายด้วย "-"',
    Regist_Input_Empty: 'รายการนี้ไม่สามารถเว้นว่างได้',
    Regist_Confirm: 'ยืนยัน',
    Regist_Dialog_Title: 'โปรไฟล์จะถูกสร้างด้วย Domain: ',
    Regist_Dialog_ModifyIt: 'แก้ไข',
    Regist_Dialog_Create: 'สร้าง',
    Regist_InUse: 'ชื่อโดเมนนี้ถูกใช้งานแล้ว',
    
    Profile_User_NotExist: 'ผู้ใช้ไม่มีอยู่ในระบบ',
    Profile_User_MindBadge: 'ส่งแบดจ์',
    Profile_User_IssueBadge: 'ส่งแบดจ์ให้ผู้ใช้',
    Profile_User_Qrcode_download: 'ดาวน์โหลด',
    Profile_Tab_Received: 'แบดจ์',
    Profile_Tab_Basic: 'ข้อมูลพื้นฐาน',
    Profile_Tab_NFTPASS: 'NFT Pass',
    Profile_Tab_Minted: 'สร้างแล้ว',
    Profile_Tab_Point: 'คะแนน',
    Profile_Tab_Groups: 'กลุ่ม',
    Profile_Tab_Presend: 'กำลังส่ง',
    Profile_Show_Wallet: 'Addresss ของผู้ใช้',
    Profile_Show_Email: 'Email ของผู้ใช้',
    Profile_Show_Close: 'ปิด',
    Profile_Show_Copy: 'คัดลอก',
    
    Avatar_Upload_Button: 'Upload',
    
    BadgeDialog_Btn_Login: 'เข้าสู่ระบบเพื่อรับ',
    BadgeDialog_Btn_Reject: 'ปฏิเสธ',
    BadgeDialog_Btn_Accept: 'ตกลง',
    BadgeDialog_Btn_Face2face: 'QR code',
    BadgeDialog_Btn_share: 'ส่งต่อ',
    BadgeDialog_Btn_Issue: 'ส่งอีกครั้ง',
    BadgeDialog_Btn_None_Left: 'น่าเสียดาย',

    BadgeDialog_Label_Creator: 'ผู้สร้าง',
    BadgeDialog_Label_Token: 'Badge domain',
    BadgeDialog_Label_Issuees: 'ผู้รับ',
    BadgeDialog_Label_action_hide: 'ตั้งเป็นส่วนตัว',
    BadgeDialog_Label_action_public: 'ตั้งเป็นสาธารณะ',
    BadgeDialog_Label_action_top: 'ตั้งเป็นด้านบน',
    BadgeDialog_Label_action_untop: 'ยกเลิกการตั้ง',
    BadgeDialog_Label_hide_tip: 'มองเห็นได้แค่ผู้ใช้',
    BadgeDialog_Label_Creat_Time: 'เวลาที่สร้าง',
    BadgeDialog_Label_Private: 'ประเภทของ Badge',
    BadgeDialog_Label_Private_text: 'ส่วนตัว',
    BadgeDialog_Label_gift_text: 'Gift Card',
    
    BadgeletDialog_title: 'รายละเอียด Badge',
    BadgeletDialog_presend_title: 'รายละเอียดการส่ง',
    BadgeletDialog_invite_title: 'รายละเอียดการเชิญ',
    BadgeletDialog_gift_title: 'รายละเอียด Gift Card',
    BadgeletDialog_Reason: 'เหตุผล',
    
    MintBadge_Title: 'ส่ง Badge',
    MintBadge_Upload: 'ภาพ Badge',
    MintBadge_UploadTip: slotLang('รองรับ JPG, GIF, PNG ขนาดสูงสุด {size}'),
    MintBadge_Name_Label: 'ชื่อ Badge',
    MintBadge_Name_Placeholder: 'ตั้งชื่อBadgeของผู้ใช้',
    MintBadge_Domain_Label: 'Domain ของ Badge',
    MintBadge_Domain_Placeholder: 'โดเมน',
    MintBadge_Submit: 'ส่งให้เพื่อน',
    MintBadge_Next: 'ถัดไป',
    MintBadge_Submit_To: slotLang('ส่งให้ {1}'),
    MintBadge_Submiting: 'กำลังส่ง',
    MintBadge_Domain_Rule: 'Domainเป็นตัวระบุที่ไม่ซ้ำกันสำหรับBadgeของผู้ใช้ <br /> โดเมนสามารถมีอักษรภาษาอังกฤษ a-z และตัวเลข 0-9 สามารถใช้ขีดกลางได้ แต่ไม่สามารถใช้เป็นตัวแรกหรือตัวสุดท้าย ควรมีความยาวมากกว่า 4 ตัวอักษร',
    
    MintFinish_Title: 'ส่งเสร็จสิ้น!',
    MintFinish_Button_Later: 'ส่งภายหลัง',
    MintFinish_Button_Issue: 'ไปที่การส่ง',
    
    IssueBadge_Title: 'ส่ง Badge',
    IssueBadge_Domain: 'Domain ของ Badge',
    IssueBadge_Reason: 'เหตุผล (ถ้ามี)',    
    IssueBadge_Create_time: 'สร้างแล้ว',
    IssueBadge_ReasonPlaceholder: 'เหตุผลในการออก',
    IssueBadge_Issuees: 'ผู้รับ',
    IssueBadge_Support: 'รองรับ <br />1. ที่อยู่กระเป๋าเงิน; <br/>2. Domain ลงท้ายด้วย \'.dot/.eth\'; <br /> 3. ชื่อผู้ใช้หรือโดเมนของ Social Layer',
    IssueBadge_IssueesPlaceholder: 'ใส่ Domain \ Wallet Addrees ของผู้รับ',
    IssueBadge_GoToIssue: 'ไปการส่ง',
    IssueBadge_Issuesing: 'กำลังส่ง',
    IssueBadge_Mint: 'ส่ง',
    IssueBadge_Mint_later: 'ส่งภายหลัง',
    IssueBadge_Sendwithlink: 'ผ่านลิงก์',
    IssueBadge_By_QRcode: 'ผ่าน QR Code',
    IssueBadge_Sendwithdomain: 'ชื่อ',
    IssueBadge_linkbtn: 'ลิงก์',
    IssueBadge_Eventbtn: 'Event',
    IssueBadge_Address_List_Title: 'เลือกผู้รับ',
    IssueBadge_Input_Error: 'Domain, wallet address หรือชื่อผู้ใช้ไม่ถูกต้อง',
    IssueBadge_Input_Des: 'Domain/wallet address/Email Addrees ของBadge ที่ผู้รับสามารถรับได้',
    
    IssueFinish_Title: 'แชร์',
    IssueFinish_Share_By_Qrcode: 'แชร์ด้วย QRcode',
    IssueFinish_Share_By_Link: 'แชร์ด้วยลิงก์',
    IssueFinish_CopyLink: 'คัดลอกลิงก์',
    IssueFinish_Screenshot: 'ส่งหลักฐาน screenshot จากการแชร์',
    IssueFinish_Screenshot_Or: 'หรือ',
    IssueFinish_share: '#1 ได้ส่ง NFT Badge  ให้คุณ: #2 ไปรับมัน! \n แนะนำให้ใช้เบราเซอร์ metamask หรือ imToken เพื่อเข้าถึงเว็บไซต์ \n #3',
    IssueFinish_Share_Card_text_1: 'ส่ง Badge ให้คุณ',
    IssueFinish_Share_Card_text_2: 'ส่งโดย @Social Layer',
    
    Search_Cancel: 'ยกเลิก',
    Search_Label_Domain: slotLang('Domain สำหรับ "{keyword}":'),
    Search_Label_Badge: slotLang('Badge สำหรับ "{keyword}":'),
    
    Home_SubTitle: 'The social honor of your life your',
    Home_Content: 'แต่ละ POAP เป็นของขวัญจากผู้ออกให้แก่ผู้เก็บรวบรวม, เพื่อฉลองความทรงจำพิเศษที่แชร์กัน <br> โดยการสร้างความทรงจำเหล่านี้ไปยัง Blockchain, ผู้เก็บรวบรวมสร้างภาพรวมที่มีค่าของประสบการณ์ที่ถูกโทเคนไนซ์ซึ่งเปิดโลกของความเป็นไปได้',
    Home_SearchPlaceholder: 'ค้นหา Wallet/Domain',
    Home_ButtonLabel: 'collection',
    Home_ButtonTip: 'เชื่อมต่อ Wallet',
    
    Copied: 'คัดลอกแล้ว',
    
    Landing_Title: 'ยินดีต้อนรับสู่ <span>Social Layer 🎉</span>',
    Landing_Sub_Tittle_1: 'Social Layer คืออะไร?',
    Landing_Sub_Tittle_2: 'สามารถทำอะไรได้บ้าง?',
    Landing_Sub_Tittle_3: 'วิธีการส่ง Badge คืออะไร?',
    Landing_Des_1: 'dApp ที่ทุกคนสามารถส่ง Badge ให้กับทุกคน, สร้างตัวตนดิจิทัลของบุคคลตามค่าที่เป็นศูนย์, ไม่ได้ประเมินค่า การออก Badge ไม่ต้องผ่านการตรวจสอบหรือการอนุมัติจากบุคคลที่สาม, และ Badge ',
    Landing_DeLanding_Des_2: 'แสดงความรู้สึกของคุณต่อผู้อื่นโดยการมอบ Badge และค้นพบผู้ที่มีใจความคิดเห็นเดียวกันผ่านBadge',
    Landing_Des_3: 'คลิก \'เริ่มต้น\' เพื่อสร้างตัวตนของคุณบน Blockchain ไปที่หน้าโปรไฟล์และมอบ Badge สำหรับผู้ใช้แรก ๆ, Social Layer จะจ่ายค่า Gas Fee ',
    Landing_Des_4: 'สำหรับข้อมูลเพิ่มเติม: ',
    Landing_White_Paper: 'Social Layer whitepaper',
    Landing_Button: 'เริ่มต้น',
    Landing_Badge_Receive: 'เข้าสู่ระบบเพื่อรับ Badge ',
    
    WhatsApp_Share: slotLang('{domain} ส่ง Badge NFT ให้คุณ: {badge} ไปรับมัน! {url}'),
    
    Login_Title: 'เข้าสู่ระบบด้วยอีเมล',
    Login_alert: 'Badge ที่ส่ง/รับ จะไม่ถูกสร้าง',
    Login_solar: 'เข้าสู่ระบบด้วย Social Layer',
    Login_continue: 'ดำเนินการต่อ',
    Login_Placeholder: 'อีเมลของคุณ',
    Login_option: 'ตัวเลือกอื่น ๆ',
    Login_input_Code_title: 'ตรวจสอบ Inbox ',
    Login_input_Code_des: slotLang('ป้อนรหัสที่เราส่งไปยัง {email} เพื่อดำเนินการตั้งค่าบัญชี'),
    
    Page_Back: 'ย้อนกลับ',
    Page_Back_Done: 'เสร็จสิ้น',
    
    Picture_Recommend_Title: 'ตัวอย่าง',
    Picture_Recommend_Create_By_Canva: 'สร้างโดย Canva',
    Picture_Recommend_Download_A_Template: 'ดาวน์โหลด Template',
    
    Quantity_input_label: 'จำนวน',
    Quantity_Unlimited: 'ไม่จำกัด',
    
    Presend_step: 'กรอกปริมาณของ Badge <br /> Badge จะถูกส่งไปยังผู้รับเป็นลิงก์',
    
    presend_share_link: '#1 ได้ส่ง NFT Badge ให้คุณ: #2 ไปรับมัน! \n #3 \n แนะนำให้ใช้เบราว์เซอร์ metamask หรือ imToken เพื่อเข้าถึงเว็บไซต์',
    
    Activity_Calendar: 'ปฏิทินกิจกรรม',
    Activity_Page_type: 'กิจกรรม',
    Activity_State_Registered: 'กำลังเข้าร่วม',
    Activity_State_Created: 'เจ้าภาพ',
    Activity_Online_Event: 'กิจกรรมออนไลน์',
    Activity_Max_Participations: 'ผู้เข้าร่วมได้ถีง #1',
    Activity_login_title: 'ยังไม่มีการลงทะเบียนเข้าร่วมกิจกรรม!',
    Activity_login_des: 'เข้าสู่ระบบเพื่อเข้าร่วมกิจกรรมสนุก ๆ',
    Activity_login_btn: 'เข้าสู่ระบบ / ลงทะเบียน',
    Activity_search_placeholder: 'ค้นหากิจกรรม...',
    Activity_no_activity: 'ยังไม่มีกิจกรรม～',
    Activity_latest: 'ล่าสุด',
    Activity_Commended: 'แนะนำ',    
    Activity_Popular: 'ยอดนิยม',
    Activity_Past: 'งานที่ผ่านมา',
    Activity_Coming: 'กำลังจะม',
    Activity_Greeting_Morning: 'สวัสดีตอนเช้า',
    Activity_Greeting_Afternoon: 'สวัสดีตอนบ่าย',
    Activity_Greeting_Evening: 'สวัสดีตอนเย็น',
    Activity_My_Register: 'การลงทะเบียน',
    Activity_My_Event: 'กิจกรรมฉัน',
    Activity_All_Activity: 'กิจกรรมทั้งหมด',
    Activity_Btn_Create: 'สร้างกิจกรรม',
    Activity_Btn_Modify: 'แก้ไขกิจกรรม',
    Activity_Create_title: 'สร้างกิจกรรม',
    Activity_Create_Btn: 'สร้างกิจกรรม',
    Activity_Setting_title: 'การตั้งค่ากิจกรรม',
    Activity_Create_Done: 'เสร็จสิ้น',
    Activity_Create_Success: 'สร้างสำเร็จ 🎉',
    Activity_Create_Success_Scan_tips: 'สแกนรหัส <br> และเข้าร่วมกิจกรรม',
    Activity_Create_Success_Scan_tips_2: '| กิจกรรม',
    Activity_Scan_checkin: 'สแกน QR code เพื่อเช็คอิน',
    Activity_Scan_punch_in: 'สแกน QR code เพื่อบันทึกเวลา',
    Activity_Registered_participants: 'ผู้เข้าร่วมที่ลงทะเบียน',
    Activity_originators: 'Host',
    Activity_Des: 'คำอธิบาย',
    Activity_Participants: 'ผู้เข้าร่วม',
    Activity_Punch_Log: 'บันทึกเวลา',
    Activity_Punch_in_BTN: 'บันทึกเวลาเข้า',
    Activity_Cancel_registration: 'ยกเลิกการลงทะเบียน',
    Activity_Form_Cover: 'ปก/โปสเตอร์',
    Activity_Form_Checklog : 'ตั้งเป็นสถานที่บันทึกเวลา',
    Activity_Form_Name: 'ชื่อกิจกรรม',
    Activity_Form_Details: 'คำอธิบายกิจกรรม (ไม่จำเป็น)',
    Activity_Form_online_address: 'ที่อยู่ออนไลน์ (ไม่จำเป็น)',
    Activity_Form_Starttime: 'เวลาเริ่มกิจกรรม?',
    Activity_Form_Ending: 'เวลาสิ้นสุดกิจกรรม?',
    Activity_Form_Where: 'กิจกรรมจัดที่ไหน?',
    Activity_Form_participants: 'จำนวนผู้เข้าร่วมสูงสุด',
    Activity_Form_participants_Min: 'จำนวนผู้เข้าร่วมขั้นต่ำ',
    Activity_Form_Guest: 'เชิญแขกร่วมกิจกรรม (ไม่จำเป็น)',
    Activity_Form_Duration: 'ตั้งระยะเวลา',
    Activity_Form_Duration_Cancel: 'ยกเลิกการตั้งระยะเวลา',
    Activity_Form_Hoster: 'Host',
    Activity_Form_Label: 'แท็ก',
    Activity_Form_Badge: ' Badge กิจกรรม (ไม่จำเป็น)',
    Activity_Form_Wechat: 'กลุ่ม WeChat ของกิจกรรม',
    Activity_Form_Wechat_Des: 'รหัส QR จะแสดงหลังจากผู้เข้าร่วมลงทะเบียนสำเร็จ',
    Activity_Form_Wechat_Account: 'เมื่อรหัส QR ไม่ทำงาน, ผู้เข้าร่วมสามารถค้นหาผ่าน ID WeChat',
    Activity_Form_Badge_Des: 'เมื่อผู้เข้าร่วมกิจกรรมเช็คอิน, พวกเขาจะได้รับ Badge ทันทีที่กิจกรรมสิ้นสุด',
    Activity_Form_Badge_Select: 'เลือก Badge',
    Activity_Form_wechat_Select: 'เลือกรูปภาพ',
    Activity_Form_Ending_Time_Error: 'เวลาสิ้นสุดต้องเสร็จสิ้น หลังจากเวลาเริ่ม',
    Activity_Detail_Btn_Modify: 'แก้ไข',
    Activity_Detail_site_Occupied: 'สถานที่ที่เลือกได้ถูกจองแล้วในช่วงเวลาที่เลือก โปรดเลือกสถานที่อื่นหรือเวลาอื่นสำหรับกิจกรรม',
    Activity_Detail_Btn_Canceled: 'ยกเลิกแล้ว',
    Activity_Detail_Btn_unjoin: 'ยกเลิกการเข้าร่วม',
    Activity_Detail_Btn_Cancel: 'ยกเลิกกิจกรรม',
    Activity_Detail_Btn_Checkin: 'เช็คอิน',    
    Activity_Detail_Btn_Attend: 'สมัครเข้าร่วม',
    Activity_Detail_Btn_Joined: 'สมัครแล้ว',
    Activity_Detail_Btn_End: 'กิจกรรมสิ้นสุดแล้ว',
    Activity_Detail_Btn_has_Cancel: 'กิจกรรมถูกยกเลิก',
    Activity_Detail_Btn_add_Calender: 'เพิ่มไปยังปฏิทิน',
    Activity_Detail_Badge: 'การลงทะเบียนกิจกรรม, เมื่อเสร็จสิ้น, จะได้รับ POAP*1',
    Activity_Detail_Guest: 'แขกรับเชิญ',
    Activity_Detail_Offline_location: 'ตำแหน่งออฟไลน์ที่ตั้งล่วงหน้า (ไม่จำเป็น)',
    Activity_Detail_Offline_location_Custom: 'ตำแหน่งที่กำหนดเอง (ไม่จำเป็น)',
    Activity_Detail_Offline_Tg: 'กลุ่ม Telegram ของกิจกรรม (ไม่จำเป็น)',
    Activity_Detail_Offline_Tg_des: 'ลิงก์กลุ่มจะแสดงหลังจากผู้เข้าร่วมได้สมัครเข้าร่วม.',
    Activity_Detail_Online_address: 'ที่อยู่เข้าร่วมออนไลน์',
    Activity_Detail_Btn_AttendOnline: 'เข้าร่วมออนไลน์',
    Activity_Detail_min_participants_Alert: 'เมื่อจำนวนผู้เข้าร่วมน้อยกว่า {1}, กิจกรรมอาจถูกยกเลิก การเช็คอินเปิดให้บริการครึ่งชั่วโมงก่อนเริ่มกิจกรรม.',
    Activity_quantity_Input: 'กำหนดเอง',
    Activity_Detail_Expired: 'สิ้นสุดแล้ว',
    Activity_Detail_Created: 'Host',
    Activity_Detail_Wechat: 'เข้าร่วมกลุ่ม WeChat',
    Activity_Detail_Account: 'หรือเพิ่มบัญชี WeChat: ',
    
    Activity_Calendar_Page_Time: 'เวลา',
    Activity_Calendar_Page_Name: 'กิจกรรม',
    
    Activity_Host_Check_And_Send: 'เช็คอินและส่ง POAP',
    Activity_Host_Send: 'ส่ง POAP',
    
    Activity_Unjoin_Confirm_title: 'ออกจากกิจกรรมนี้ใช่หรืิอไม่?',
    



    New_Year_1: 'แปลงความปรารถนาในปีใหม่เป็นBadgeดิจิทัล',
    New_Year_2: 'เหตุผลในการออก :',
    New_Year_3: 'ส่ง Badge ให้คุณ, สแกน <br> รหัสเพื่อรับ',
    Save_Card: 'บันทึกลงอัลบัม',
    
    Group_invite_title: 'เชิญ',
    Group_invite_badge_name: slotLang('สมาชิกของ {groupName}'),
    Group_invite_message: 'ข้อความเชิญ',
    Group_invite_receiver: 'ผู้รับ',
    Group_invite_Nondesignated: 'ไม่ระบุ',
    Group_invite_Designated: 'ระบุ',
    Group_invite_default_reason: slotLang('เชิญคุณเป็นสมาชิกของ {n}'),
    Group_invite_detail_benefits: 'ผลประโยชน์',
    Group_invite_detail_benefits_des: slotLang('คุณจะกลายเป็นสมาชิกขององค์กร {n} โดยอัตโนมัติ'),
    Group_invite_share: '#1 ส่ง NFT Badge ให้คุณ: #2. ไปรับมัน! \n #3 \n แนะนำให้ใช้เบราว์เซอร์ metamask หรือ imToken เพื่อเข้าถึงเว็บไซต์',
    
    Group_regist_confirm: 'สร้างกลุ่ม',
    Group_regist_owner: 'เจ้าของกลุ่ม',
    Group_regist_confirm_dialog: 'กลุ่มนี้จะถูกสร้างด้วยโดเมน: ',
    Group_regist_des: ' Domain ส่งถึงสมาชิก \n ในนามขององค์กร',
    Group_regist_title: 'ตั้งโดเมน Social Layer ที่ไม่ซ้ำกันสำหรับกลุ่มของคุณ!',
    
    Group_setting_title: 'การตั้งค่า',
    Group_setting_dissolve: 'หยุดกิจกรรมกลุ่มชั่วคราว',
    Group_freeze_dialog_title: 'หยุดกิจกรรมกลุ่มชั่วคราวใช่หรือไม่？',
    Group_freeze_dialog_des: 'เมื่อหยุดกิจกรรมกลุ่มชั่วคราว, ข้อมูลทั้งหมดในกลุ่มนี้จะไม่แสดงและไม่สามารถกู้คืนได้ สามารถเรียกดูประวัติการรับรางวัล Badge ได้',
    Group_freeze_Dialog_confirm: 'หยุดกิจกรรมกลุ่มชั่วคราว',
    Group_freeze_Dialog_cancel: 'ยกเลิก',
    
    Group_relation_ship_member: 'สมาชิก',
    Group_relation_ship_owner: 'เจ้าของ',
    
    Follow_detail_followed: 'ผู้ติดตาม',
    Follow_detail_following: 'กำลังติดตาม',
    Follow_detail_groups: 'กลุ่ม',
    Follow_detail_btn_mint: 'ส่ง Badge สำหรับกลุ่มของคุณ',
    
    Group_detail_tabs_member: 'สมาชิก',
    Group_detail_tabs_Event: 'กิจกรรม',
    Group_detail_tabs_Invite: 'เชิญ',
    Group_detail_Join_Time: 'เข้าร่วม',
    
    Relation_Ship_Action_Follow: 'ติดตาม',
    Relation_Ship_Action_Followed: 'ถูกติดตาม',
    Relation_Ship_Action_Following: 'กำลังติดตาม',
    Relation_Ship_Action_Join: 'เข้าร่วม',
    Relation_Ship_Action_Joined: 'ได้เข้าร่วม',
    Relation_Ship_Action_Leave: 'ออกจากกลุ่ม',
    Relation_Ship_Action_Unfollow: 'เลิกติดตาม',
    
    Empty_Text: 'ยังไม่มีข้อมูล~',
    Empty_No_Badge: 'ยังไม่มี Badge~',
    Empty_No_Present: 'ยังไม่มีการส่ง~',
    Empty_No_Group: 'ยังไม่มีกลุ่ม~',
    Empty_No_Invite: 'ยังไม่มีการเชิญ~',
    
    Search_Tab_Domain: 'Domain',
    Search_Tab_Badge: 'Badge',
    Search_Tab_Event: 'กิจกรรม',
    
    Badgebook_Dialog_Choose_Badgebook: 'เลือกจาก Badge Book ',
    Badgebook_Dialog_Choose_Badge: 'เลือกจากที่สร้างแล้ว',
    Badgebook_Dialog_Choose_Draft: 'เลือกจากแบบร่าง',
    Badgebook_Dialog_Cetate_Badge: 'สร้างBadgeใหม่',
    Badgebook_Dialog_Recognition_Badge: 'Badge พื้นฐาน',
    Badgebook_Dialog_Recognition_Des: 'Badge พื้นฐาน, การประเมินของผู้อื่น',
    Badgebook_Dialog_Points: 'คะแนน',
    Badgebook_Dialog_Points_Des: 'สร้างระบบคะแนนในกลุ่ม',
    Badgebook_Dialog_Privacy: 'Badge ส่วนตัว',   
    Badgebook_Dialog_Privacy_Des: 'เฉพาะผู้รับเท่านั้นที่สามารถเห็น Badge',
    Badgebook_Dialog_NFT_Pass: 'NFT Pass',
    Badgebook_Dialog_NFT_Pass_Des: 'ที่ได้รับจากกลุ่มสำหรับบุคคล',
    Badgebook_Dialog_Gift: 'Gift card',
    Badgebook_Dialog_Gift_Des: 'ส่ง Badge พร้อมผลประโยชน์',
    
    Dialog_Public_Image_Title: 'เลือกรูปภาพสำหรับBadge',
    Dialog_Public_Image_UploadBtn: 'อัปโหลดรูปภาพ',
    Dialog_Public_Image_UploadBtn_Des: 'JPG หรือ PNG. ขนาดสูงสุด 800K',
    Dialog_Public_Image_List_Title: 'สาธารณะ',
    
    Cropper_Dialog_Title: 'แก้ไขรูปภาพ',
    Cropper_Dialog_Btn: 'ยืนยัน',
    
    Presend_Qrcode_Badge: 'Badge',
    Presend_Qrcode_Des: slotLang('{1} ส่ง {2} ให้คุณ.'),
    Presend_Qrcode_Recommended : 'แนะนำ',
    Presend_Qrcode_Scan: 'สแกน QR Code',
    Presend_Qrcode_Limit: slotLang('จำกัดที่ {1} คน'),
    Presend_Qrcode_Time: slotLang('หมดอายุ: {1}'),
    Presend_Qrcode_Time_2: slotLang('เริ่มเวลา: {1}'),
    Presend_Qrcode_Expired: 'Badgeไม่ใช้งาน',
    Presend_Qrcode_Regen: 'สร้าง QR code ใหม่',
    
    Home_Page_New_Title: 'สร้าง Badge',
    Home_Page_New_Des: 'เข้าร่วมทันทีเพื่อเริ่มการสร้างแบดจ์ อธิบายค achievements และมอบให้กับบุคคลที่คู่ควร',
    Home_Page_New_Btn: 'สร้าง Badge ของคุณ',
    
    Badgelet_List_Title: 'ที่ได้รับ',
    Badgelet_List_Unit: 'Badge',
    Created_List_Title: 'ที่สร้าง',
    
    Dialog_Copy_Btn: 'ตกลง',
    Dialog_Copy_Title: 'คัดลอกเรียบร้อย！',
    Dialog_Copy_Message: 'แชร์และเปิดลิงก์ในเบราเซอร์',
    
    Profile_Bio_More: 'เพิ่มเติม…',
    Profile_Bio_Less: 'เพิ่มน้อยลง',
    
    Profile_Edit_Title: 'แก้ไขโปรไฟล์',
    Profile_Edit_Avatar: '"อวาตารประจำตัว',
    Profile_Edit_Ncikname: 'ชื่อเล่น',
    Profile_Edit_Bio: 'ประวัติ',
    Profile_Edit_Bio_Placeholder: 'ตั้งค่าประวัติ',
    Profile_Edit_Location: 'ที่ตั้ง',
    Profile_Edit_Social_Media: 'โซเชียลมีเดีย',
    Profile_Edit_Social_Media_Edit: 'แก้ไข',
    Profile_Edit_Social_Media_Edit_Dialog_Title: 'ของผู้ใช้',
    Profile_Edit_Social_Confirm: 'ยืนยัน',
    Profile_Edit_Save: 'บันทึก',
    Profile_Edit_Leave: 'ออก',
    Profile_Edit_Cancel: 'ยกเลิก',
    Profile_Edit_Leave_Dialog_Title: 'ออกจากหน้านี้ใช่หหรือไม่?',
    Profile_Edit_Leave_Dialog_Des: 'บันทึกการตั้งค่าถูกยกเลิก',
    
    Group_Member_Manage_Dialog_Title: 'การจัดสมาชิก',
    Group_Member_Manage_Dialog_Confirm_Btn: 'นำออกจากกลุ่ม',
    Group_Member_Manage_Dialog_Confirm_Dialog_des: slotLang('นำ ${1} ออกจากกลุ่ม？'),
    Group_Member_Manage_Dialog_Confirm_Dialog_Confirm: 'นำออก',
    Group_Member_Manage_Dialog_Confirm_Dialog_Cancel: 'ยกเลิก',    

    Create_Point_Title: 'สร้างคะแนน',
    Create_Point_Symbol: 'สัญลักษณ์',
    Create_Point_Image: 'รูปภาพ',
    Create_Point_Name: 'ชื่อ',
    Create_Point_Name_Placeholder: 'ใส่ชื่อ, เช่น คะแนนการมีส่วนร่วม',
    Create_Point_Symbol_Placeholder: 'ใส่สัญลักษณ์, เช่น PT',
    Create_Point_Des: 'คำอธิบาย (ไม่บังคับ)',
    
    Create_NFT_Title: 'สร้าง NFT Pass',
    Create_NFT_Image: 'รูปภาพ',
    Create_NFT_Name: 'ชื่อ',
    Create_NFT_Name_Placeholder: 'ใส่ชื่อ',
    Create_NFT_Name_Domain: 'โดเมน',
    Create_NFT_Name_Des: 'คำอธิบาย (ไม่บังคับ)',
    
    Create_Nft_success: 'สร้างเรียบร้อยแล้ว',
    Create_Nft_success_des: 'NFT Pass ของคุณถูกสร้างแล้ว',
    Issue_Nft_Title: 'ส่ง NFT Pass',
    Issue_Nft_Start: 'วันเริ่มต้น',
    Issue_Nft_End: 'วันหมดอายุ',
    
    NFT_Detail_title: 'รายละเอียด NFT Pass',
    NFT_Detail_checkin_title: 'บันทึกการเช็คอิน',
    NFT_Detail_Des: 'คำอธิบาย',
    NFT_Detail_Check: 'เช็คอิน',
    NFT_Detail_use: 'ใช้ NFT Pass',
    NFT_Detail_show_record_btn: 'ดูบันทึก',
    NFT_Detail_Expiration: 'วันหมดอายุ',
    NFT_Detail_Unavailable: 'ไม่อยู่ในระยะเวลาที่ถูกต้อง',
    
    Point_Detail_Title: 'รายละเอียดคะแนน',
    
    Create_Point_success: 'สร้างเรียบร้อยแล้ว',
    Create_Point_success_des: 'คะแนนของถูกสร้างแล้ว',
    Issue_Point_Title: 'ส่งคะแนน',
    Issue_Point_Point: 'คะแนน',
    
    Dialog_Check_In_Title: 'เช็คอิน',
    
    Create_Privacy_Title: 'สร้าง Badge ส่วนตัว',
    Create_Privacy_Tips: 'เฉพาะผู้ใช้และเจ้าของสามารถดูBadgeได้, คนอื่นๆสามารถเห็นเฉพาะผู้สร้างและเจ้าของBadgeเท่านั้น',
    
    Create_Gift_Title: 'สร้าง Gift Card',
    Create_Gift_Benefits: 'สวัสดิการที่ได้รับ',
    
    Selector_issue_type_gift: 'ส่ง Gift Card',
    Selector_issue_type_gift_times: 'จำนวนสวัสดิการ',
    Create_gift_success: 'สร้างเรียบร้อยแล้ว',
    Create_gift_success_des: 'Gift Card ถูกสร้างแล้ว',
    
    Gift_detail_check_btn: 'ตรวจสอบ',
    Gift_Detail_use: 'ใช้',
    Gift_Detail_amount: 'ครั้งที่เหลือใช้',
    Gift_Detail_check_remain: slotLang('ตรวจสอบ! เหลือ {1} ครั้ง'),
    
    Gift_Checked_Title: 'ตรวจสอบเรียบร้อยแล้ว',
    Gift_Checked_Des: 'สวัสดิการของคุณถูกใช้งานแล้ว',
    Gift_Checked_Btn: slotLang('ใช้อีกครั้ง (เหลือ {1} ครั้ง)'),
    Gift_Checked_show_remain: slotLang('เหลือ {1} ครั้ง'),
    Gift_Checked_show_receiver: 'ผู้รับ',
    Gift_Checked_show_last_consume: 'การใช้ล่าสุด: ',
    
    Create_Badge_Success_Title: 'สร้างเรียบร้อยแล้ว',
    Create_Badge_Success_Des: 'Badge ของคุณถูกสร้างแล้ว',
    
    Selector_issue_type_badge: 'ส่ง Badge',
    Selector_issue_type_amount: 'จำนวน Badge',
}

export default langTH
