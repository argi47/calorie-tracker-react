import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'
import { ActivityActions, activityReducer, ActivityState, initialState } from '../reducers/activity-reducer'

type ActivityProviderProps = {
  children: ReactNode
}

type ActivityContextProps = {
  state: ActivityState
  dispatch: Dispatch<ActivityActions>
  consumedCalories: number
  burnedCalories: number
  netCalories: number
}

export const ActivityContext = createContext<ActivityContextProps>({} as ActivityContextProps)

export const ActivityProvider = ({ children }: ActivityProviderProps) => {

  const [state, dispatch] = useReducer(activityReducer, initialState)

  // Contadores
  const consumedCalories = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities])
  const burnedCalories = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities])
  const netCalories = useMemo(() => consumedCalories - burnedCalories, [state.activities])

  return (
    <ActivityContext.Provider value={{
      state,
      dispatch,
      consumedCalories,
      burnedCalories,
      netCalories
    }}>
      {children}
    </ActivityContext.Provider>
  )
}