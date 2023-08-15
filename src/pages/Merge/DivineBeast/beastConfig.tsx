import {useState, useContext, useEffect} from 'react'
import Beast01 from "./svg/Beast01";

function useBeastConfig() {
    const list = [{
        id: 1,
        category: '基础大佬',
        description: '体大如斗，秉节持重',
        post: Beast01 ,
    }]


    return  {beastInfo: list}
}

export default useBeastConfig
