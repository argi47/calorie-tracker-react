import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'
import { ActivityActions, activityReducer, ActivityState, initialState } from '../reducers/activity-reducer'
import { categories } from '../data/categories'
import { Activity } from '../types'

type ActivityProviderProps = {
  children: ReactNode
}

type ActivityContextProps = {
  state: ActivityState
  dispatch: Dispatch<ActivityActions>
  consumedCalories: number
  burnedCalories: number
  netCalories: number
  categoryName: (category: Activity["category"]) => string[]
  isEmptyActivities: boolean
}

export const ActivityContext = createContext<ActivityContextProps>({} as ActivityContextProps)

export const ActivityProvider = ({ children }: ActivityProviderProps) => {

  const [state, dispatch] = useReducer(activityReducer, initialState)

  // Contadores
  const consumedCalories = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities])
  const burnedCalories = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities])
  const netCalories = useMemo(() => consumedCalories - burnedCalories, [state.activities])

  const categoryName = useMemo(() =>
    (category: Activity['category']) => categories.map(cat => cat.id === category ? cat.name : '')
    , [state.activities])

  const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])

  return (
    <ActivityContext.Provider value={{
      state,
      dispatch,
      consumedCalories,
      burnedCalories,
      netCalories,
      categoryName,
      isEmptyActivities
    }}>
      {children}
    </ActivityContext.Provider>
  )
}