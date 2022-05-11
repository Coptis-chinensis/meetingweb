import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout/layout' // 菜单
import Setting from '../views/setting/setting' // 设置菜单
import LoginRegister from '../views/loginRegister/loginRegister' // 设备参数
import MainInterface from '../views/mainInterface/mainInterface' // 首页
import MeetingTransfer from '../views/meetingTransfer/meetingTransfer' // 会议转写
import MeetingProjection from '../views/meetingProjection/meetingProjection' // 会议转写
import KeyWord from '../views/setting/keyword/keyword' // 关键词库
import MeetingManagement from '../views/meetingManagement/meetingManagement' // 音频转写
import TaskManagement from '../views/taskManagement/taskManagement' // 任务管理
import CreateTask from '../views/taskManagement/createTask' // 创建任务
import TaskDetails from '../views/taskManagement/taskDetile' // 任务详情
import RoomList from '../views/roomList/roomList' // 任务详情
import TabooWord from '../views/setting/tabooword/tabooword' // 词库过滤
import MicManagement from '../views/setting/micManagement/micManagement' // 采集器管理
import Parameter from '../views/setting/parameter/parameter' // 参数设置
import SysLog from '../views/setting/sysLog/sysLog' // 操作日志
import VoiceprintManagement from '../views/setting/voiceprintManagement/voiceprintManagement' // 声纹管理
import UserManagement from '../views/setting/userManagement/userManagement' // 用户管理
import TitleManagement from '../views/setting/titleManagement/titleManagement' // 篇章管理
import TitleEdit from '../views/setting/titleManagement/titleEdit' // 篇章编辑
import ExportSetting from '../views/setting/exportSetting/exportSetting' // 导出设置
import Diagnosis from '../views/setting/diagnosis/diagnosis' // 诊断
import MeetingEditor from '../views/meetingEditor/meetingEditor' // 会议编辑
import VoiceEditor from '../views/voiceEditor/voiceEditor' // 音频编辑
import Lost from '../views/lost/lost' // 404页面


Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const routes = [
  {
    path: '/',
    redirect: '/login', // 重定向
  },
  {
    path: '/login',
    name: 'loginRegister',
    component: LoginRegister,
  },
  {
    path: '/setting',
    redirect: '/setting/keyword',
  },
  // 会议转写
  {
    path: '/meetingTransfer',
    name: 'meetingTransfer',
    component: MeetingTransfer,
  },
  // 会议投屏
  {
    path: '/meetingProjection',
    name: 'meetingProjection',
    component: MeetingProjection,
  },
  // 404
  {
    path: '/lost',
    name: 'lost',
    component: Lost
  },
  {
    path: '/meeting',
    name: 'layout',
    redirect: 'Layout',
    component: Layout,
    children: [
      // 首页
      {
        path: 'mainInterface',
        name: 'mainInterface',
        component: MainInterface,
        meta: {
          mainMenu: '/meeting/mainInterface',
        },
      },
      // 任务管理
      {
        path: '/task/taskManagement',
        name: 'taskManagement',
        component: TaskManagement,
        meta: {
          mainMenu: '/task/taskManagement',
        },
      },
      // 创建任务
      {
        path: '/task/createTask/:id',
        name: 'createTask',
        component: CreateTask,
        meta: {
          mainMenu: '/task/taskManagement',
        },
      },
      // 任务详情
      {
        path: '/task/taskDetails/:id',
        name: 'taskDetails',
        component: TaskDetails,
        meta: {
          mainMenu: '/task/taskManagement',
        },
      },
      // 音频回听
      {
        path: 'voiceEditor/:id',
        name: 'voiceEditor',
        component: VoiceEditor,
        meta: {
          mainMenu: '/task/taskManagement',
        },
      },
      // 会议管理
      {
        path: 'meetingManagement',
        name: 'meetingManagement',
        component: MeetingManagement,
        meta: {
          mainMenu: '/meeting/meetingManagement',
        },
      },
      // 会议编辑
      {
        path: 'meetingEditor/:id',
        name: 'meetingEditor',
        component: MeetingEditor,
        meta: {
          mainMenu: '/meeting/meetingManagement',
        },
      },
      // 会议室列表
      {
        path: '/roomList',
        name: 'roomList',
        component: RoomList,
      },
      // 设置
      {
        path: '/setting',
        name: 'setting',
        redirect: 'Layout',
        component: Setting,
        meta: {
          mainMenu: '/setting',
        },
        children: [
          // 关键词
          {
            path: 'keyword',
            name: 'keyword',
            component: KeyWord,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/keyword'
            }
          },
          // 过滤词库
          {
            path: 'tabooword',
            name: 'tabooWord',
            component: TabooWord,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/tabooword'
            }
          },
          // 参数设置
          {
            path: 'parameter',
            name: 'parameter',
            component: Parameter,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/parameter'
            }
          },
          // 采集器管理
          {
            path: 'micManagement',
            name: 'micManagement',
            component: MicManagement,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/micManagement'
            }
          },
          // 操作日志
          {
            path: 'sysLog',
            name: 'sysLog',
            component: SysLog,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/sysLog'
            }
          },
          // 声纹管理
          {
            path: 'voiceprintManagement',
            name: 'voiceprintManagement',
            component: VoiceprintManagement,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/voiceprintManagement'
            }
          },
          // 用户管理
          {
            path: 'userManagement',
            name: 'userManagement',
            component: UserManagement,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/userManagement'
            }
          },
          // 篇章管理
          {
            path: 'titleManagement',
            name: 'titleManagement',
            component: TitleManagement,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/titleManagement'
            }
          },
          // 篇章编辑页面
          {
            path: 'titleEdit/:id',
            name: 'titleEdit',
            component: TitleEdit,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/titleManagement'
            }
          },
          // 导出设置
          {
            path: 'exportSetting',
            name: 'exportSetting',
            component: ExportSetting,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/exportSetting'
            }
          },
          // 导出设置
          {
            path: 'diagnosis',
            name: 'diagnosis',
            component: Diagnosis,
            meta: {
              mainMenu: '/setting',
              settingMenu: '/setting/diagnosis'
            }
          },

        ]
      },
    ]
  },
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(window.localStorage.getItem('oUser') != null) {
    window.oUser = JSON.parse(window.localStorage.getItem('oUser'))
  }
  if(window.localStorage.getItem('setUp') != null) {
    window.setUp = JSON.parse(window.localStorage.getItem('setUp'))
  }
  next();
  
  if(to.name == "lost") {
    localStorage.removeItem('token')
    localStorage.removeItem('oUser')
  }
})

export default router

