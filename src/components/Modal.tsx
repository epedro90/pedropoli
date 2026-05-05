import { ReactNode, useEffect } from 'react'
import styles from './Modal.module.css'

type ModalType = 'success' | 'error' | 'info' | 'winner' | 'warning'

interface Props {
  open: boolean
  type?: ModalType
  title: string
  message?: string
  children?: ReactNode
  onClose?: () => void
  autoClose?: number
}

const icons: Record<ModalType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  winner: '🏆',
  warning: '⚠️',
}

export default function Modal({ open, type = 'info', title, message, children, onClose, autoClose }: Props) {
  useEffect(() => {
    if (open && autoClose && onClose) {
      const t = setTimeout(onClose, autoClose)
      return () => clearTimeout(t)
    }
  }, [open, autoClose, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={[styles.modal, styles[type]].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.icon}>{icons[type]}</div>
        <h2 className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        {children}
      </div>
    </div>
  )
}
