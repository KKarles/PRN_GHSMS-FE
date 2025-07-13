import api from './api'

// Types for health tracking - matching controller DTOs
export interface MenstrualCycleData {
  startDate: string
  endDate?: string
  cycleLength?: number
  notes?: string
}

export interface CreateMenstrualCycleDto {
  startDate: string
  endDate?: string
  cycleLength?: number
  notes?: string
}

export interface MenstrualCycle {
  cycleId: number
  userId: number
  startDate: string
  endDate?: string
  cycleLength: number
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CyclePrediction {
  nextPeriodDate: string
  ovulationDate: string
  fertilityWindowStart: string
  fertilityWindowEnd: string
}

export interface PillReminderSettings {
  isEnabled: boolean
  reminderTime: string
  timezone: string
}

// Health tracking service functions
export const logMenstrualCycle = async (cycleData: MenstrualCycleData): Promise<MenstrualCycle> => {
  try {
    console.log('Creating new menstrual cycle:', cycleData) // Debug log
    
    // Convert to CreateMenstrualCycleDto format
    const createDto: CreateMenstrualCycleDto = {
      startDate: cycleData.startDate,
      endDate: cycleData.endDate,
      cycleLength: cycleData.cycleLength,
      notes: cycleData.notes
    }
    
    const response = await api.post('/api/MenstrualCycle', createDto)
    console.log('Cycle creation response:', response.data) // Debug log
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to log menstrual cycle:', error)
    throw error
  }
}

// Update existing menstrual cycle (mark end date)
export const updateMenstrualCycle = async (cycleId: number, updateData: { endDate?: string, notes?: string }): Promise<MenstrualCycle> => {
  try {
    console.log('Updating menstrual cycle:', cycleId, updateData) // Debug log
    
    const response = await api.put(`/api/MenstrualCycle/${cycleId}`, updateData)
    console.log('Cycle update response:', response.data) // Debug log
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to update menstrual cycle:', error)
    throw error
  }
}

export const getMenstrualCycles = async (): Promise<MenstrualCycle[]> => {
  try {
    const response = await api.get('/api/MenstrualCycle/my-cycles')
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch menstrual cycles:', error)
    throw error
  }
}

export const getCyclePredictions = async (): Promise<CyclePrediction> => {
  try {
    const response = await api.get('/api/MenstrualCycle/predictions')
    return response.data.data || response.data
  } catch (error) {
    console.error('Failed to fetch cycle predictions:', error)
    throw error
  }
}

// Note: Pill reminder settings are managed through user profile
// These functions should use the auth/profile endpoint to update user settings
export const updatePillReminderSettings = async (settings: PillReminderSettings): Promise<void> => {
  try {
    // Update user profile with pill reminder settings
    await api.put('/api/auth/profile', {
      wantsCycleNotifications: settings.isEnabled,
      pillReminderTime: settings.reminderTime
    })
  } catch (error) {
    console.error('Failed to update pill reminder settings:', error)
    throw error
  }
}

export const getPillReminderSettings = async (): Promise<PillReminderSettings> => {
  try {
    const response = await api.get('/api/auth/profile')
    const profile = response.data.data || response.data
    return {
      isEnabled: profile.wantsCycleNotifications || false,
      reminderTime: profile.pillReminderTime || '08:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  } catch (error) {
    console.error('Failed to fetch pill reminder settings:', error)
    throw error
  }
}