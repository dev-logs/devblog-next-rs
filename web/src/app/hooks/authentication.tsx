import { useCallback, useEffect, useMemo, useState } from "react"
import UserLocalStorage from "../storage/user"
import { User } from "@devlog/schema-ts"
import ReactDOM from 'react-dom'
import AuthenticationPopup from "../components/authentication/popup"

export function useAuthentication() {
  const [user, setUser] = useState<User | undefined>()
  const userStorage = useMemo(() => {
    return new UserLocalStorage()
  }, [])

  const { openPopup, popupComponent, result } = useAuthenticationPopup()

  useEffect(() => {
    setUser(userStorage.getUserInfo())
  }, [])

  const useAnnonymous = useCallback(() => {
  }, [])

  const requestUser = useCallback(() => {
    const existingUser = userStorage.getUserInfo()
    if (existingUser) {
      setUser(existingUser)
      return true
    }
    else {
      openPopup()
      return false
    }

  }, [userStorage, result])

  return {popupComponent, useAnnonymous, user, requestUser}
}

export const useAuthenticationPopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [result, setResult] = useState<User | null>(null)

  const openPopup = () => {
    setIsOpen(true)
  }

  const closePopup = () => {
    setIsOpen(false)
  }

  const handleResult = (data: User) => {
    setResult(data)
  }

  const node = (<AuthenticationPopup onClose={closePopup} onResult={handleResult} />)
  const popupComponent = isOpen
    ? ReactDOM.createPortal(
        node,
        document.body
      )
    : null

  return {
    openPopup,
    popupComponent,
    result
  }
}
