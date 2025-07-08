import api from './api'

// Types for health tracking
export interface MenstrualCycleData {
  startDate: string
  endDate?: string
  cycleLength?: number
  notes?: string
}

export interface MenstrualCycle {
  id: number
  userId: number
  startDate: string
  endDate?: string
  cycleLength: number
  notes?: string
  createdAt: string
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
    const response = await api.post('/api/healthtracking/menstrual-cycles', cycleData)
    return response.data
  } catch (error) {
    console.error('Failed to log menstrual cycle:', error)
    throw error
  }
}

export const getMenstrualCycles = async (): Promise<MenstrualCycle[]> => {
  try {
    const response = await api.get('/api/healthtracking/menstrual-cycles')
    return response.data
  } catch (error) {
    console.error('Failed to fetch menstrual cycles:', error)
    throw error
  }
}

export const getCyclePredictions = async (): Promise<CyclePrediction> => {
  try {
    const response = await api.get('/api/healthtracking/cycle-predictions')
    return response.data
  } catch (error) {
    console.error('Failed to fetch cycle predictions:', error)
    throw error
  }
}

export const updatePillReminderSettings = async (settings: PillReminderSettings): Promise<void> => {
  try {
    await api.put('/api/healthtracking/pill-reminder', settings)
  } catch (error) {
    console.error('Failed to update pill reminder settings:', error)
    throw error
  }
}

export const getPillReminderSettings = async (): Promise<PillReminderSettings> => {
  try {
    const response = await api.get('/api/healthtracking/pill-reminder')
    return response.data
  } catch (error) {
    console.error('Failed to fetch pill reminder settings:', error)
    throw error
  }
}