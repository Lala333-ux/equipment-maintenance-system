import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>({
    id: 'U001',
    name: '张维修',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    role: '维修工程师',
    department: '生产车间',
    skills: ['CNC维修', '电气维修', '液压系统'],
    phone: '13800138001',
    email: 'zhang.weixiu@example.com'
  })

  const isLoggedIn = computed(() => !!currentUser.value)

  const permissions = computed(() => {
    const role = currentUser.value.role
    return {
      canCreateKnowledge: ['技术专家', '主管', '管理员'].includes(role),
      canEditKnowledge: ['技术专家', '主管', '管理员'].includes(role),
      canDeleteKnowledge: ['主管', '管理员'].includes(role),
      canManageEquipment: ['设备管理员', '主管', '管理员'].includes(role),
      canCreateWorkOrder: true,
      canProcessWorkOrder: ['维修工程师', '技术专家', '主管', '管理员'].includes(role),
      canManageSOP: ['技术专家', '主管', '管理员'].includes(role),
      canManageSparePart: ['设备管理员', '主管', '管理员'].includes(role),
      canViewStatistics: ['主管', '管理员'].includes(role),
      canManageGraph: ['技术专家', '主管', '管理员'].includes(role)
    }
  })

  return {
    currentUser,
    isLoggedIn,
    permissions
  }
})
